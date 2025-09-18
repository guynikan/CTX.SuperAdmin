'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

interface MonacoContextType {
  isMonacoReady: boolean
  monaco: typeof monaco | null
}

const MonacoContext = createContext<MonacoContextType>({
  isMonacoReady: false,
  monaco: null
})

interface MonacoProviderProps {
  children: React.ReactNode
}

export const MonacoProvider: React.FC<MonacoProviderProps> = ({ children }) => {
  const [isMonacoReady, setIsMonacoReady] = useState(false)
  const [monacoInstance, setMonacoInstance] = useState<typeof monaco | null>(null)

  useEffect(() => {
    // Configure Monaco Editor themes and global settings
    loader
      .init()
      .then((monacoInstance) => {
        // Define custom theme for JSON editing
        monacoInstance.editor.defineTheme('ctx-json-theme', {
          base: 'hc-light',
          inherit: true,
          rules: [
            // Template expression highlighting
            { token: 'template-expression', foreground: '#4FC3F7', fontStyle: 'bold' },
            { token: 'template-variable', foreground: '#81C784' },
            { token: 'template-property', foreground: '#FFB74D' },
            // JSON-specific highlighting
            { token: 'string.key.json', foreground: '#CE93D8' },
            { token: 'string.value.json', foreground: '#A5D6A7' },
            { token: 'number.json', foreground: '#90CAF9' }
          ],
          colors: {
            'editor.background': '#FFFFFF',
            'editor.foreground': '#333333',
            'editorLineNumber.foreground': '#858585',
            'editor.selectionBackground': '#ADD6FF',
            'editorBracketMatch.background': '#E6F3FF',
            'editorError.foreground': '#FF0000',
            'editorWarning.foreground': '#FFA500'
          }
        })

        // Configure JSON language settings
        monacoInstance.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          allowComments: false,
          schemaValidation: 'error',
          enableSchemaRequest: true
        })

        // Register completion providers and other language features
        // (These will be registered later by specific components)

        setMonacoInstance(monacoInstance)
        setIsMonacoReady(true)
      })
      .catch((error) => {
        console.error('Failed to initialize Monaco Editor:', error)
      })
  }, [])

  const value: MonacoContextType = {
    isMonacoReady,
    monaco: monacoInstance
  }

  return (
    <MonacoContext.Provider value={value}>
      {children}
    </MonacoContext.Provider>
  )
}

export const useMonaco = (): MonacoContextType => {
  const context = useContext(MonacoContext)
  if (!context) {
    throw new Error('useMonaco must be used within a MonacoProvider')
  }
  return context
}
