import { editor, languages, Position, IRange } from 'monaco-editor'
import { AutocompleteTypeInfo, TemplateError, ExpressionPrefixType } from '@/types/autocomplete'
import { AutocompleteSuggestion } from '@/services/autocompleteSuggestionsService'

/**
 * Check if cursor is inside a template expression {{ }}
 */
const isInsideTemplateExpression = (textBeforeCursor: string): boolean => {
  const openTemplates = (textBeforeCursor.match(/\{\{/g) || []).length
  const closeTemplates = (textBeforeCursor.match(/\}\}/g) || []).length
  return openTemplates > closeTemplates
}

/**
 * Get the range to replace for autocomplete insertion
 */
const getInsertRange = (position: Position, partial: string = ''): IRange => ({
  startLineNumber: position.lineNumber,
  endLineNumber: position.lineNumber,
  startColumn: position.column - partial.length,
  endColumn: position.column,
})

/**
 * Parse template context from text before cursor
 */
const parseTemplateContext = (textBeforeCursor: string): { 
  context: string; 
  path: string[]; 
  endsWithDot: boolean; 
  partial: string 
} => {
  const dotMatch = textBeforeCursor.match(/\{\{\s*\$(\w+)((?:\.(\w+))*)(\.)\s*$/)
  if (dotMatch) {
    const [, context, pathString] = dotMatch
    const path = pathString ? pathString.replace(/^\./, '').split('.').filter(p => p.length > 0) : []
    return { context: `$${context}`, path, endsWithDot: true, partial: '' }
  }
  
  const contextPartialMatch = textBeforeCursor.match(/\{\{\s*(\$\w+)\s*$/)
  if (contextPartialMatch) {
    const [, partialContext] = contextPartialMatch
    return { context: '', path: [], endsWithDot: false, partial: partialContext }
  }
  
  const pathPartialMatch = textBeforeCursor.match(/\{\{\s*\$(\w+)((?:\.(\w+))*)\.([\w]*)\s*$/)
  if (pathPartialMatch) {
    const [, context, pathString, , partialWord] = pathPartialMatch
    const path = pathString ? pathString.replace(/^\./, '').split('.').filter(p => p.length > 0) : []
    return { context: `$${context}`, path, endsWithDot: false, partial: partialWord }
  }
  
  // Detect $ alone ({{ $)
  const dollarOnlyMatch = textBeforeCursor.match(/\{\{\s*\$\s*$/)
  if (dollarOnlyMatch) {
    return { context: '', path: [], endsWithDot: false, partial: '$' }
  }
  
  return { context: '', path: [], endsWithDot: false, partial: '' }
}

/**
 * Convert prefix to API type string - simply remove the $
 */
const getApiTypeString = (prefix: string): string => {
  return prefix.replace('$', '') // "$locale" → "locale", "$segment" → "segment"
}

/**
 * Create template expression suggestions using context data
 */
const createTemplateExpressionSuggestions = async (
  textBeforeCursor: string, 
  range: IRange,
  availableTypes: AutocompleteTypeInfo[],
  getSuggestions: (type: string, prefix?: string) => Promise<AutocompleteSuggestion[]>
): Promise<languages.CompletionItem[]> => {
  const { context, path, endsWithDot, partial } = parseTemplateContext(textBeforeCursor)
  
  // If no types available from context, no autocomplete
  if (availableTypes.length === 0) {
    return []
  }
  
  if (!context && partial) {
    // If partial is '$' alone, show all prefixes
    if (partial === '$') {
      return availableTypes.map(type => ({
        label: type.prefix,
        kind: languages.CompletionItemKind.Variable,
        insertText: type.prefix,
        range,
        detail: type.description,
        documentation: `Acessa configurações de ${type.prefix.replace('$', '')}`
      }))
    }
    
    // If partial already includes $ (ex: '$segment'), filter directly
    if (partial.startsWith('$')) {
      const filteredTypes = availableTypes
        .filter(type => type.prefix.toLowerCase().startsWith(partial.toLowerCase()))
      
      return filteredTypes.map(type => ({
        label: type.prefix,
        kind: languages.CompletionItemKind.Variable,
        insertText: type.prefix,
        range,
        detail: type.description,
        documentation: `Acessa configurações de ${type.prefix.replace('$', '')}`
      }))
    }
    
    // Legacy: partial without $ (ex: 'segment') - add $ for filtering
    const filteredTypes = availableTypes
      .filter(type => type.prefix.toLowerCase().startsWith(`$${partial.toLowerCase()}`))
    
    return filteredTypes.map(type => ({
      label: type.prefix,
      kind: languages.CompletionItemKind.Variable,
      insertText: type.prefix,
      range,
      detail: type.description,
      documentation: `Acessa configurações de ${type.prefix.replace('$', '')}`
    }))
  }
  
  if (!context && !partial) {
    // Show all available types from context
    return availableTypes.map(type => ({
      label: type.prefix,
      kind: languages.CompletionItemKind.Variable,
      insertText: type.prefix,
      range,
      detail: type.description,
      documentation: `Acessa configurações de ${type.prefix.replace('$', '')}`
    }))
  }
  
  // Check if context is valid according to available types
  const contextType = availableTypes.find(type => type.prefix === context)
  if (context && !contextType) {
    return []
  }
  
  // Handle partial matching after context ($locale.m → filter API results by 'm')
  if (contextType && !endsWithDot && partial) {
    if (contextType.expressionPrefixType === ExpressionPrefixType.AssociatedConfig) {
      // Call API to get suggestions, then filter by partial
      const prefix = path.join('.')
      const apiTypeString = getApiTypeString(contextType.prefix)
      
      try {
        const suggestions = await getSuggestions(apiTypeString, prefix)
        
        // Filter suggestions by partial
        const filteredSuggestions = suggestions.filter(suggestion => 
          suggestion.key.toLowerCase().startsWith(partial.toLowerCase())
        )
        
        return filteredSuggestions.map(suggestion => ({
          label: suggestion.key,
          kind: languages.CompletionItemKind.Property,
          insertText: suggestion.key,
          range,
          detail: suggestion.value || suggestion.description || `Propriedade de ${context}`,
          documentation: suggestion.value ? `${suggestion.key}: "${suggestion.value}"` : `${suggestion.key} (${contextType.description})`
        }))
        
      } catch (error) {
        console.error(`Failed to fetch suggestions for ${contextType.prefix}:`, error)
        return []
      }
    }
    
    // For Segment type, filter static properties by partial
    if (contextType.expressionPrefixType === ExpressionPrefixType.Segment) {
      const filteredKeys = contextType.properties.filter(key => 
        key.toLowerCase().startsWith(partial.toLowerCase())
      )
      
      return filteredKeys.map(key => ({
        label: key,
        kind: languages.CompletionItemKind.Property,
        insertText: key,
        range,
        detail: `Propriedade de ${context}`,
        documentation: `Acessa ${key} em ${context} (${contextType.description})`
      }))
    }
  }
  
  if (context && !endsWithDot && !partial) {
    return []
  }
  
  // Handle suggestions after dot ($context. or $context.path.)
  if (contextType && endsWithDot) {
    // Decide strategy based on expression prefix type
    if (contextType.expressionPrefixType === ExpressionPrefixType.Segment) {
      // $segment. → use static properties from API (only first level)
      if (path.length === 0) {
        let availableKeys = contextType.properties || []
        
        if (partial) {
          availableKeys = availableKeys.filter(key => 
            key.toLowerCase().startsWith(partial.toLowerCase())
          )
        }
        
        return availableKeys.map(key => ({
          label: key,
          kind: languages.CompletionItemKind.Property,
          insertText: key,
          range,
          detail: `Propriedade de ${context}`,
          documentation: `Acessa ${key} em ${context} (${contextType.description})`
        }))
      } else {
        // $segment.nested. → no hierarchical data for segment yet
        return []
      }
    } else if (contextType.expressionPrefixType === ExpressionPrefixType.AssociatedConfig) {
      // AssociatedConfig types ($locale, $route, etc.) → use dynamic suggestions from API
      const prefix = path.join('.')
      const apiTypeString = getApiTypeString(contextType.prefix)
      
      try {
        const suggestions = await getSuggestions(apiTypeString, prefix)
        
        let filteredSuggestions = suggestions
        if (partial) {
          filteredSuggestions = suggestions.filter(suggestion => 
            suggestion.key.toLowerCase().startsWith(partial.toLowerCase())
          )
        }
        
        return filteredSuggestions.map(suggestion => ({
          label: suggestion.key,
          kind: languages.CompletionItemKind.Property,
          insertText: suggestion.key,
          range,
          detail: suggestion.value || suggestion.description || `Propriedade de ${context}`,
          documentation: suggestion.value ? `${suggestion.key}: "${suggestion.value}"` : `${suggestion.key} (${contextType.description})`
        }))
        
      } catch (error) {
        console.error(`Failed to fetch suggestions for ${contextType.prefix} (${apiTypeString}):`, error)
        return []
      }
    } else {
      // Unknown expression prefix type - fallback to empty
      console.warn(`Unknown expression prefix type for context ${context}:`, contextType.expressionPrefixType)
      return []
    }
  }
  
  return []
}

/**
 * Validate template expressions in the model
 */
const validateTemplateExpressions = (
  model: editor.ITextModel,
  availableTypes: AutocompleteTypeInfo[]
): TemplateError[] => {
  const errors: TemplateError[] = []
  const lineCount = model.getLineCount()
  
  for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
    const lineContent = model.getLineContent(lineNumber)
    const templateRegex = /\{\{\s*(\$\w+(?:\.[\w\.]*)?)[^}]*/g
    let match
    
    while ((match = templateRegex.exec(lineContent)) !== null) {
      const fullExpression = match[1]
      const parts = fullExpression.split('.')
      const context = parts[0]
      
      // Check against available types from context
      const contextType = availableTypes.find(type => type.prefix === context)
      if (!contextType) {
        errors.push({
          line: lineNumber,
          message: `Invalid template context: ${context}`,
          context: match[0]
        })
        continue
      }
    }
  }
  
  return errors
}

/**
 * Factory function to create a template expression provider using context data
 */
export const createTemplateExpressionProvider = (
  availableTypes: AutocompleteTypeInfo[],
  getSuggestions: (type: string, prefix?: string) => Promise<AutocompleteSuggestion[]>,
  onTemplateErrors?: (errors: TemplateError[]) => void
): languages.CompletionItemProvider => {
  
  let lastValidationText = ''
  
  const provideCompletionItems = async (
    model: editor.ITextModel,
    position: Position
  ): Promise<languages.CompletionList | null> => {
    
    // Validate template expressions if callback provided
    if (onTemplateErrors) {
      const currentText = model.getValue()
      if (currentText !== lastValidationText) {
        lastValidationText = currentText
        const templateErrors = validateTemplateExpressions(model, availableTypes)
        onTemplateErrors(templateErrors)
      }
    }
    
    const currentLine = model.getLineContent(position.lineNumber)
    const textBeforeCursor = currentLine.substring(0, position.column - 1)
    
    if (isInsideTemplateExpression(textBeforeCursor)) {
      const { partial } = parseTemplateContext(textBeforeCursor)
      const range = getInsertRange(position, partial)
      const suggestions = await createTemplateExpressionSuggestions(
        textBeforeCursor, 
        range, 
        availableTypes,
        getSuggestions
      )
      
      return {
        suggestions,
        incomplete: false
      }
    }
    
    return null
  }

  return {
    triggerCharacters: ['.', '"', '{', ':', ' ', '$'],
    provideCompletionItems,
    resolveCompletionItem: (item) => item
  }
}
