'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Editor, OnChange, OnMount } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { Box, CircularProgress, Alert } from '@mui/material'
import { useMonaco } from './MonacoProvider'
import { registerTemplateExpressionProvider } from './providers/templateExpressionProvider'
import { useSchemaService } from '@/hooks/useSchemaService'

interface TemplateError {
  line: number
  message: string
  context: string
}

interface MonacoJsonEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  schema?: object
  height?: string | number
  readOnly?: boolean
  placeholder?: string
  configId?: string
  onValidationChange?: (isValid: boolean, errors: editor.IMarker[]) => void
}

export const MonacoJsonEditor: React.FC<MonacoJsonEditorProps> = ({
  value,
  onChange,
  schema,
  height = 400,
  readOnly = false,
  placeholder,
  configId,
  onValidationChange
}) => {
  const { isMonacoReady, monaco } = useMonaco()
  const schemaService = useSchemaService()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [validationErrors, setValidationErrors] = useState<editor.IMarker[]>([])
  const [templateErrors, setTemplateErrors] = useState<TemplateError[]>([])
  const [resolvedSchema, setResolvedSchema] = useState<object | null>(null)
  const [schemaError, setSchemaError] = useState<string | null>(null)

  // Resolver schemas ctx:// quando o schema mudar
  useEffect(() => {
    if (!schema) {
      setResolvedSchema(null)
      setSchemaError(null)
      return
    }

    const resolveSchema = async () => {
      try {
        setSchemaError(null)
        const resolved = await schemaService.resolveAllReferences(schema)
        setResolvedSchema(resolved)
      } catch (error) {
        console.error('Failed to resolve schema references:', error)
        setSchemaError(error instanceof Error ? error.message : 'Unknown error')
        // Fallback: usar schema original sem resolver referências
        setResolvedSchema(schema)
      }
    }

    resolveSchema()
  }, [schema, schemaService])

  // Register basic autocomplete provider when Monaco is ready
  useEffect(() => {
    if (!monaco || !isMonacoReady) return

    const disposable = registerTemplateExpressionProvider(monaco, configId, setTemplateErrors)
    
    return () => {
      disposable.dispose()
    }
  }, [monaco, isMonacoReady, configId])

  // Configure JSON schema when available
  useEffect(() => {
    if (monaco && resolvedSchema && editorRef.current) {
      const model = editorRef.current.getModel()
      if (model) {
        // Configure schema for JSON validation and autocomplete using Monaco's built-in JSON language service
        const jsonDefaults = monaco.languages.json.jsonDefaults
        
        // Configure schema for validation and completion
        jsonDefaults.setDiagnosticsOptions({
          validate: true,
          allowComments: false,
          schemas: [{
            uri: 'http://json-schema.org/draft-07/schema#',
            fileMatch: [model.uri.toString()],
            schema: resolvedSchema
          }]
        })
        
        // Enable all JSON language features including autocomplete
        jsonDefaults.setModeConfiguration({
          documentFormattingEdits: true,
          documentRangeFormattingEdits: true,
          completionItems: true,
          hovers: true,
          documentSymbols: true,
          tokens: true,
          colors: true,
          foldingRanges: true,
          diagnostics: true
        })
      }
    }
  }, [monaco, resolvedSchema])

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Configure editor options for JSON editing
    editor.updateOptions({
      minimap: { enabled: false },
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      // Disable word-based suggestions to avoid conflicts with custom providers
      wordBasedSuggestions: 'off',
      quickSuggestions: {
        other: 'off',
        comments: 'off', 
        strings: 'on'
      },
      suggest: {
        filterGraceful: false,
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
    })

    // Listen for validation changes
    const validationModel = editor.getModel()
    if (validationModel) {
      const updateValidation = () => {
        const markers = monaco.editor.getModelMarkers({ resource: validationModel.uri })
        setValidationErrors(markers)
        const isValid = markers.length === 0 && templateErrors.length === 0
        onValidationChange?.(isValid, markers)
      }

      // Initial validation
      updateValidation()

      // Listen for marker changes
      const disposable = monaco.editor.onDidChangeMarkers((uris) => {
        if (uris.some(uri => uri.toString() === validationModel.uri.toString())) {
          updateValidation()
        }
      })

      return () => {
        disposable.dispose()
      }
    }
  }

  // Update validation when template errors change
  useEffect(() => {
    if (editorRef.current && monaco) {
      const model = editorRef.current.getModel()
      if (model) {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri })
        const isValid = markers.length === 0 && templateErrors.length === 0
        onValidationChange?.(isValid, markers)
      }
    }
  }, [templateErrors, monaco, onValidationChange])

  // Handle value changes
  const handleEditorChange: OnChange = (value) => {
    onChange(value)
  }

  // Loading state
  if (!isMonacoReady) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={height}
        bgcolor="background.paper"
        border="1px solid"
        borderColor="divider"
        borderRadius={1}
      >
        <CircularProgress size={24} />
      </Box>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          border: '1px solid',
          borderColor: validationErrors.length > 0 ? 'error.main' : 'divider',
          borderRadius: 1,
          overflow: 'hidden'
        }}
      >
        <Editor
          height={height}
          defaultLanguage="json"
          language="json"
          theme="vs-dark"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            placeholder: placeholder || 'Enter JSON...',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12
            }
          }}
        />
      </Box>

      {/* Validation and template errors display */}
      {(validationErrors.length > 0 || templateErrors.length > 0 || schemaError) && (
        <Box mt={1}>
          {/* Schema resolution errors */}
          {schemaError && (
            <Alert
              severity="warning"
              variant="outlined"
              sx={{ mb: 1, fontSize: '0.875rem' }}
            >
              Schema resolution warning: {schemaError}
            </Alert>
          )}
          
          {/* Schema validation errors */}
          {validationErrors.slice(0, 3).map((error, index) => (
            <Alert
              key={`schema-${index}`}
              severity="error"
              variant="outlined"
              sx={{ mt: (schemaError || index > 0) ? 1 : 0, fontSize: '0.875rem' }}
            >
              Line {error.startLineNumber}: {error.message}
            </Alert>
          ))}
          
          {/* Template expression errors */}
          {templateErrors.slice(0, 3).map((error, index) => (
            <Alert
              key={`template-${index}`}
              severity="warning"
              variant="outlined"
              sx={{ mt: (schemaError || validationErrors.length > 0 || index > 0) ? 1 : 0, fontSize: '0.875rem' }}
            >
              Line {error.line}: {error.message} ({error.context})
            </Alert>
          ))}
          
          {/* Show count if there are more errors */}
          {(validationErrors.length + templateErrors.length) > 3 && (
            <Alert severity="info" variant="outlined" sx={{ mt: 1, fontSize: '0.875rem' }}>
              +{(validationErrors.length + templateErrors.length) - 3} more errors...
            </Alert>
          )}
        </Box>
      )}
    </Box>
  )
}
