import { editor } from 'monaco-editor'
import { MonacoEditorConfig } from '../MonacoEditorProvider'

/**
 * Configure JSON schema for a specific editor context
 */
export const configureSchemaForContext = (
  monaco: typeof import('monaco-editor'),
  schema: object,
  modelUri: string
): void => {
  console.log('📄 [EditorUtils] Configuring schema for model:', modelUri)
  
  const jsonDefaults = monaco.languages.json.jsonDefaults
  
  // Get current schemas to avoid overwriting other contexts
  const currentDiagnostics = jsonDefaults.diagnosticsOptions
  const existingSchemas = currentDiagnostics.schemas || []
  
  // Add or update schema for this specific model
  const updatedSchemas = [
    ...existingSchemas.filter(s => !s.fileMatch?.includes(modelUri)), // Remove existing for this URI
    {
      uri: `http://json-schema.org/draft-07/schema#${Date.now()}`, // Unique URI
      fileMatch: [modelUri],
      schema: schema
    }
  ]
  
  // Update diagnostics options with new schema list
  jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: currentDiagnostics.allowComments ?? false,
    schemaValidation: currentDiagnostics.schemaValidation ?? 'error',
    enableSchemaRequest: currentDiagnostics.enableSchemaRequest ?? true,
    schemas: updatedSchemas
  })
  
  console.log('✅ [EditorUtils] Schema configured. Total schemas:', updatedSchemas.length)
}

/**
 * Configure editor options based on context config
 */
export const configureEditorOptions = (
  editor: editor.IStandaloneCodeEditor,
  config: MonacoEditorConfig
): void => {
  console.log('⚙️ [EditorUtils] Configuring editor options')
  
  editor.updateOptions({
    // Basic options
    readOnly: config.readOnly || false,
    wordWrap: config.wordWrap ? 'on' : 'off',
    minimap: { enabled: config.minimap || false },
    
    // JSON editing optimized
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    
    // Autocomplete configuration
    wordBasedSuggestions: 'off', // Disable to avoid conflicts with custom providers
    quickSuggestions: {
      other: 'on', // ✅ FIXED: Enable for template expressions
      comments: 'off', 
      strings: 'on'
    },
    suggest: {
      filterGraceful: true, // ✅ FIXED: More flexible filtering
      showWords: false,
      showSnippets: false,
      showKeywords: false,
      insertMode: 'replace'
    },
    suggestSelection: 'first',
    parameterHints: {
      enabled: true,
      cycle: false
    },
    
    // Scrollbar configuration
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12
    }
  })
  
  console.log('✅ [EditorUtils] Editor options configured')
}

/**
 * Setup validation listeners for an editor
 */
export const setupValidationListeners = (
  editor: editor.IStandaloneCodeEditor,
  monaco: typeof import('monaco-editor'),
  onValidationChange?: (isValid: boolean, errors: editor.IMarker[]) => void,
  onUpdateValidationErrors?: (errors: editor.IMarker[]) => void
): (() => void) => {
  console.log('🔍 [EditorUtils] Setting up validation listeners')
  
  const model = editor.getModel()
  if (!model) {
    console.warn('⚠️ [EditorUtils] No model available for validation setup')
    return () => {}
  }
  
  const updateValidation = () => {
    const markers = monaco.editor.getModelMarkers({ resource: model.uri })
    
    // Update context with validation errors
    if (onUpdateValidationErrors) {
      onUpdateValidationErrors(markers)
    }
    
    // Call validation change callback
    if (onValidationChange) {
      const isValid = markers.length === 0
      onValidationChange(isValid, markers)
    }
  }

  // Initial validation
  setTimeout(updateValidation, 100) // Small delay to ensure markers are updated

  // Listen for marker changes
  const disposable = monaco.editor.onDidChangeMarkers((uris) => {
    if (uris.some(uri => uri.toString() === model.uri.toString())) {
      updateValidation()
    }
  })

  console.log('✅ [EditorUtils] Validation listeners setup complete')
  
  // Return cleanup function
  return () => {
    console.log('🧹 [EditorUtils] Cleaning up validation listeners')
    disposable.dispose()
  }
}
