'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Editor, OnChange, OnMount } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { Box, CircularProgress } from '@mui/material'
import { useMonaco } from './MonacoProvider'
import { useMonacoEditor } from './MonacoEditorProvider'
import { createTemplateExpressionProvider } from './providers/templateExpressionProviderFactory'
import { configureEditorOptions, configureSchemaForContext, setupValidationListeners } from './utils/editorUtils'
import { ValidationErrorsDisplay } from './ValidationErrorsDisplay'

interface MonacoJsonEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  height?: string | number
  placeholder?: string
  onValidationChange?: (isValid: boolean, errors: editor.IMarker[]) => void
}

export const MonacoJsonEditor: React.FC<MonacoJsonEditorProps> = ({
  value,
  onChange,
  height = 400,
  placeholder,
  onValidationChange
}) => {
  const { isMonacoReady, monaco } = useMonaco()
  const context = useMonacoEditor()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [templateErrors, setTemplateErrors] = useState<{ line: number; message: string; context: string }[]>([])
  const [validationListenerCleanup, setValidationListenerCleanup] = useState<(() => void) | null>(null)

  // Register template expression provider when context is ready
  useEffect(() => {
    if (!context.state.isReady || !context.config.autocomplete?.enabled) {
      return
    }

    console.log('🔌 [MonacoJsonEditor] Registering template expression provider')
    const provider = createTemplateExpressionProvider(
      context.state.autocompleteTypes,
      context.actions.getAutocompleteSuggestions,
      setTemplateErrors
    )
    
    const disposable = context.actions.registerCustomProvider(provider)
    
    return () => {
      console.log('🧹 [MonacoJsonEditor] Disposing template expression provider')
      disposable.dispose()
    }
  }, [context.state.isReady, context.state.autocompleteTypes, context.config.autocomplete?.enabled])

  // Configure JSON schema when available from context
  useEffect(() => {
    if (monaco && context.config.schema && editorRef.current) {
      const model = editorRef.current.getModel()
      if (model) {
        console.log('📄 [MonacoJsonEditor] Configuring schema from context')
        configureSchemaForContext(monaco, context.config.schema, model.uri.toString())
        context.actions.updateSchema(context.config.schema)
      }
    }
  }, [monaco, context.config.schema])

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    console.log('🎯 [MonacoJsonEditor] Editor mounted, configuring...')

    // Configure editor options using context config
    configureEditorOptions(editor, context.config)

    // Setup validation listeners
    const cleanup = setupValidationListeners(
      editor, 
      monaco, 
      onValidationChange,
      context.actions.updateValidationErrors
    )
    
    setValidationListenerCleanup(() => cleanup)

    // Configure schema if available
    if (context.config.schema) {
      const model = editor.getModel()
      if (model) {
        configureSchemaForContext(monaco, context.config.schema, model.uri.toString())
        context.actions.updateSchema(context.config.schema)
      }
    }

    console.log('✅ [MonacoJsonEditor] Editor configuration complete')
  }

  // Update validation when template errors change
  useEffect(() => {
    if (onValidationChange) {
      const isValid = context.state.validationErrors.length === 0 && templateErrors.length === 0
      onValidationChange(isValid, context.state.validationErrors)
    }
  }, [templateErrors, context.state.validationErrors, onValidationChange])

  // Cleanup validation listeners on unmount
  useEffect(() => {
    return () => {
      if (validationListenerCleanup) {
        validationListenerCleanup()
      }
    }
  }, [validationListenerCleanup])

  // Handle value changes
  const handleEditorChange: OnChange = (value) => {
    onChange(value)
  }

  // Loading state
  if (!context.state.isReady) {
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
          borderColor: context.state.validationErrors.length > 0 ? 'error.main' : 'divider',
          borderRadius: 1,
          overflow: 'hidden'
        }}
      >
        <Editor
          height={height}
          defaultLanguage="json"
          language="json"
          theme={context.config.theme || 'ctx-json-theme'}
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly: context.config.readOnly,
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
      <ValidationErrorsDisplay
        validationErrors={context.state.validationErrors}
        templateErrors={templateErrors}
        autocompleteError={context.state.autocompleteError}
        maxVisibleErrors={3}
        collapsible={false}
      />
    </Box>
  )
}
