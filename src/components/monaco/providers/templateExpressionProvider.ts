import { editor, languages, Position, IRange, IDisposable } from 'monaco-editor'
import { fetchAutocompleteTypes } from '@/services/autocompleteTypesService'
import { fetchAutocompleteSuggestions } from '@/services/autocompleteSuggestionsService'
import { AutocompleteTypeInfo, TemplateError, TemplateErrorCallback, ExpressionPrefixType } from '@/types/autocomplete'

const isInsideTemplateExpression = (textBeforeCursor: string): boolean => {
  const openTemplates = (textBeforeCursor.match(/\{\{/g) || []).length
  const closeTemplates = (textBeforeCursor.match(/\}\}/g) || []).length
  return openTemplates > closeTemplates
}

const getInsertRange = (position: Position, partial: string = ''): IRange => ({
  startLineNumber: position.lineNumber,
  endLineNumber: position.lineNumber,
  startColumn: position.column - partial.length,
  endColumn: position.column,
})

const parseTemplateContext = (textBeforeCursor: string): { context: string; path: string[]; endsWithDot: boolean; partial: string } => {
  const dotMatch = textBeforeCursor.match(/\{\{\s*\$(\w+)((?:\.(\w+))*)(\.)\s*$/)
  if (dotMatch) {
    const [, context, pathString] = dotMatch
    // Remove leading dot and split: ".menu.header" → ["menu", "header"] 
    const path = pathString ? pathString.replace(/^\./, '').split('.').filter(p => p.length > 0) : []
    return { context: `$${context}`, path, endsWithDot: true, partial: '' }
  }
  
  const contextPartialMatch = textBeforeCursor.match(/\{\{\s*(\$\w+)\s*$/)
  if (contextPartialMatch) {
    const [, partialContext] = contextPartialMatch  // Inclui o $ agora
    return { context: '', path: [], endsWithDot: false, partial: partialContext }
  }
  
  const pathPartialMatch = textBeforeCursor.match(/\{\{\s*\$(\w+)((?:\.(\w+))*)\.([\w]*)\s*$/)
  if (pathPartialMatch) {
    const [, context, pathString, , partialWord] = pathPartialMatch
    // Remove leading dot and split: ".menu.header" → ["menu", "header"]
    const path = pathString ? pathString.replace(/^\./, '').split('.').filter(p => p.length > 0) : []
    return { context: `$${context}`, path, endsWithDot: false, partial: partialWord }
  }
  
  // Detectar $ sozinho ({{ $)
  const dollarOnlyMatch = textBeforeCursor.match(/\{\{\s*\$\s*$/)
  if (dollarOnlyMatch) {
    return { context: '', path: [], endsWithDot: false, partial: '$' }
  }
  
  return { context: '', path: [], endsWithDot: false, partial: '' }
}

const getTemplateExpressionSuggestions = async (textBeforeCursor: string, range: IRange): Promise<languages.CompletionItem[]> => {
  const { context, path, endsWithDot, partial } = parseTemplateContext(textBeforeCursor)
  
  // If no types available from API, no autocomplete
  if (availableTypes.length === 0) {
    return []
  }
  
  if (!context && partial) {
    // Se partial é '$' sozinho, mostrar todos os prefixes
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
    
    // Se partial já inclui $ (ex: '$segment'), filtrar diretamente
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
    
    // Legacy: partial sem $ (ex: 'segment') - adicionar $ para filtering
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
    // Show all available types from API
    return availableTypes.map(type => ({
      label: type.prefix,
      kind: languages.CompletionItemKind.Variable,
      insertText: type.prefix,
      range,
      detail: type.description,
      documentation: `Acessa configurações de ${type.prefix.replace('$', '')}`
    }))
  }
  
  // Check if context is valid according to API types
  const contextType = availableTypes.find(type => type.prefix === context)
  if (context && !contextType) {
    return []
  }
  
  // Handle partial matching after context ($locale.m → filter API results by 'm')
  if (contextType && !endsWithDot && partial) {
    if (contextType.expressionPrefixType === ExpressionPrefixType.AssociatedConfig) {
      // Call API to get suggestions, then filter by partial
      if (!currentConfigId) {
        return [] // No configId available
      }
      
      const prefix = path.join('.')
      const apiTypeString = getApiTypeString(contextType.prefix)
      
      try {
        const suggestions = await fetchAutocompleteSuggestions(
          currentConfigId,
          apiTypeString,
          prefix,
          100
        )
        
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
      if (!currentConfigId) {
        return [] // No configId available
      }
      
      // Build prefix from path: [] → "", ["menu"] → "menu", ["menu", "header"] → "menu.header"
      const prefix = path.join('.')
      const apiTypeString = getApiTypeString(contextType.prefix)
      
      try {
        const suggestions = await fetchAutocompleteSuggestions(
          currentConfigId,
          apiTypeString, // Simple conversion: "$locale" → "locale"
          prefix, // "" for first level, "menu" for second level, "menu.header" for third, etc.
          100
        )
        
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

let templateErrorCallback: TemplateErrorCallback | null = null
let lastValidationText = ''
let availableTypes: AutocompleteTypeInfo[] = [] // API data with complete type info
let isLoadingTypes = false
let currentConfigId: string | null = null // Store configId for API calls

/**
 * Convert prefix to API type string - simply remove the $
 */
const getApiTypeString = (prefix: string): string => {
  return prefix.replace('$', '') // "$locale" → "locale", "$segment" → "segment"
}

/**
 * Load available autocomplete types from API
 */
const loadAvailableTypes = async (configId: string): Promise<void> => {
  if (isLoadingTypes) return
  
  isLoadingTypes = true
  currentConfigId = configId // Store configId for later use
  
  try {
    const types = await fetchAutocompleteTypes(configId)
    
    // Use API data directly - if empty, no autocomplete available
    availableTypes = types || []
  } catch (error) {
    console.error('Failed to load autocomplete types from API - template autocomplete disabled:', error)
    // No fallback - if API fails, no autocomplete
    availableTypes = []
  } finally {
    isLoadingTypes = false
  }
}


const validateTemplateExpressions = (model: editor.ITextModel): TemplateError[] => {
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
      
      // Check against available types from API
      const contextType = availableTypes.find(type => type.prefix === context)
      if (!contextType) {
        errors.push({
          line: lineNumber,
          message: `Invalid template context: ${context}`,
          context: match[0]
        })
        continue
      }
      
      // For now, skip detailed path validation since we only have flat properties
      // Future enhancement: could validate against contextType.properties
    }
  }
  
  return errors
}

const provideCompletionItems = async (
  model: editor.ITextModel,
  position: Position
): Promise<languages.CompletionList | null> => {
  
  if (templateErrorCallback) {
    const currentText = model.getValue()
    if (currentText !== lastValidationText) {
      lastValidationText = currentText
      const templateErrors = validateTemplateExpressions(model)
      templateErrorCallback(templateErrors)
    }
  }
  
  const currentLine = model.getLineContent(position.lineNumber)
  const textBeforeCursor = currentLine.substring(0, position.column - 1)
  
  if (isInsideTemplateExpression(textBeforeCursor)) {
    const { partial } = parseTemplateContext(textBeforeCursor)
    const range = getInsertRange(position, partial)
    const suggestions = await getTemplateExpressionSuggestions(textBeforeCursor, range)
    
    return {
      suggestions,
      incomplete: false
    }
  }
  
  return null
}

export const registerTemplateExpressionProvider = (
  monaco: typeof import('monaco-editor'),
  configId?: string,
  errorCallback?: TemplateErrorCallback
): IDisposable => {
  
  templateErrorCallback = errorCallback || null
  
  // Load available types if configId is provided
  if (configId) {
    loadAvailableTypes(configId).catch(error => {
      console.error('Failed to initialize autocomplete types:', error)
    })
  }
  
  const triggerCharacters = ['.', '"', '{', ':', ' ', '$']
  
  const provider: languages.CompletionItemProvider = {
    triggerCharacters,
    provideCompletionItems,
    resolveCompletionItem: (item) => item
  }
  
  return monaco.languages.registerCompletionItemProvider('json', provider)
}
