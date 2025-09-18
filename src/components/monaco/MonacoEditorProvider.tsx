'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { editor, languages, IDisposable } from 'monaco-editor'
import { fetchAutocompleteTypes } from '@/services/autocompleteTypesService'
import { fetchAutocompleteSuggestions, AutocompleteSuggestion } from '@/services/autocompleteSuggestionsService'
import { AutocompleteTypeInfo } from '@/types/autocomplete'
import { useMonaco } from './MonacoProvider'

export interface MonacoEditorConfig {
  // Schema & Validation
  schema?: object
  allowComments?: boolean
  schemaValidation?: 'error' | 'warning' | 'ignore'
  
  // Autocomplete
  autocomplete?: {
    configId: string
    enabled: boolean
    cacheTypes?: boolean
  }
  
  // Theme & Appearance  
  theme?: 'light' | 'vs-dark' | 'high-contrast' | 'ctx-json-theme'
  
  // Editor Options
  readOnly?: boolean
  wordWrap?: boolean
  minimap?: boolean
  
  // Performance
  lazyLoad?: boolean
  preloadTypes?: boolean
}

export interface MonacoEditorState {
  // Monaco instance (inherited from MonacoProvider)
  isReady: boolean
  
  // Autocomplete
  autocompleteTypes: AutocompleteTypeInfo[]
  autocompleteLoading: boolean
  autocompleteError?: string
  
  // Schema
  currentSchema?: object
  validationErrors: editor.IMarker[]
  
  // Providers
  registeredProviders: IDisposable[]
}

interface MonacoEditorContextType {
  state: MonacoEditorState
  config: MonacoEditorConfig
  actions: {
    loadAutocompleteTypes: (configId: string) => Promise<void>
    updateSchema: (schema: object) => void
    getAutocompleteSuggestions: (type: string, prefix?: string) => Promise<AutocompleteSuggestion[]>
    registerCustomProvider: (provider: languages.CompletionItemProvider) => IDisposable
    updateValidationErrors: (errors: editor.IMarker[]) => void
  }
}

const MonacoEditorContext = createContext<MonacoEditorContextType | null>(null)

export const MonacoEditorProvider: React.FC<{
  config: MonacoEditorConfig
  children: ReactNode
}> = ({ config, children }) => {
  const { monaco, isMonacoReady } = useMonaco()
  
  const [state, setState] = useState<MonacoEditorState>({
    isReady: false,
    autocompleteTypes: [],
    autocompleteLoading: false,
    validationErrors: [],
    registeredProviders: []
  })

  // Update ready state when Monaco is ready
  useEffect(() => {
    setState(prev => ({ ...prev, isReady: isMonacoReady }))
  }, [isMonacoReady])

  // Autocomplete management
  const loadAutocompleteTypes = useCallback(async (configId: string) => {
    if (!config.autocomplete?.enabled) {
      console.log('🔇 Autocomplete disabled for this context')
      return
    }
    
    // Check if already loaded for this configId and caching is enabled
    if (config.autocomplete?.cacheTypes && 
        state.autocompleteTypes.length > 0) {
      console.log('📋 Using cached autocomplete types for configId:', configId)
      return
    }
    
    setState(prev => ({ ...prev, autocompleteLoading: true, autocompleteError: undefined }))
    
    try {
      console.log('📡 [MonacoEditorProvider] Loading autocomplete types for configId:', configId)
      const types = await fetchAutocompleteTypes(configId)
      
      setState(prev => ({ 
        ...prev, 
        autocompleteTypes: types || [],
        autocompleteLoading: false 
      }))
      
      console.log('✅ [MonacoEditorProvider] Loaded autocomplete types:', types?.length || 0, types?.map(t => t.prefix))
    } catch (error) {
      console.error('❌ [MonacoEditorProvider] Failed to load autocomplete types:', error)
      setState(prev => ({
        ...prev,
        autocompleteError: error instanceof Error ? error.message : 'Unknown error',
        autocompleteLoading: false,
        autocompleteTypes: []
      }))
    }
  }, [config.autocomplete, state.autocompleteTypes.length])
  
  // Schema management  
  const updateSchema = useCallback((schema: object) => {
    console.log('📄 [MonacoEditorProvider] Updating schema for context')
    setState(prev => ({ ...prev, currentSchema: schema }))
  }, [])
  
  // Autocomplete suggestions
  const getAutocompleteSuggestions = useCallback(async (type: string, prefix = ''): Promise<AutocompleteSuggestion[]> => {
    if (!config.autocomplete?.configId) {
      console.warn('⚠️ [MonacoEditorProvider] No configId available for suggestions')
      return []
    }
    
    try {
      return await fetchAutocompleteSuggestions(config.autocomplete.configId, type, prefix)
    } catch (error) {
      console.error('❌ [MonacoEditorProvider] Failed to fetch suggestions:', error)
      return []
    }
  }, [config.autocomplete?.configId])
  
  // Provider registration management
  const registerCustomProvider = useCallback((provider: languages.CompletionItemProvider): IDisposable => {
    if (!monaco) {
      console.warn('⚠️ [MonacoEditorProvider] Monaco not ready for provider registration')
      return { dispose: () => {} }
    }
    
    console.log('🔌 [MonacoEditorProvider] Registering custom completion provider')
    const disposable = monaco.languages.registerCompletionItemProvider('json', provider)
    
    setState(prev => ({
      ...prev,
      registeredProviders: [...prev.registeredProviders, disposable]
    }))
    
    return disposable
  }, [monaco])
  
  // Validation errors management
  const updateValidationErrors = useCallback((errors: editor.IMarker[]) => {
    setState(prev => ({ ...prev, validationErrors: errors }))
  }, [])
  
  // Auto-load autocomplete types when config changes
  useEffect(() => {
    if (state.isReady && config.autocomplete?.configId && config.autocomplete?.enabled) {
      loadAutocompleteTypes(config.autocomplete.configId)
    }
  }, [state.isReady, config.autocomplete?.configId, config.autocomplete?.enabled, loadAutocompleteTypes])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 [MonacoEditorProvider] Cleaning up providers:', state.registeredProviders.length)
      state.registeredProviders.forEach(disposable => disposable.dispose())
    }
  }, [state.registeredProviders])
  
  // Context value
  const contextValue = useMemo(() => ({
    state,
    config,
    actions: {
      loadAutocompleteTypes,
      updateSchema,
      getAutocompleteSuggestions,
      registerCustomProvider,
      updateValidationErrors
    }
  }), [state, config, loadAutocompleteTypes, updateSchema, getAutocompleteSuggestions, registerCustomProvider, updateValidationErrors])
  
  return (
    <MonacoEditorContext.Provider value={contextValue}>
      {children}
    </MonacoEditorContext.Provider>
  )
}

export const useMonacoEditor = (): MonacoEditorContextType => {
  const context = useContext(MonacoEditorContext)
  if (!context) {
    throw new Error('useMonacoEditor must be used within MonacoEditorProvider')
  }
  return context
}

// Type export for external usage
export type { MonacoEditorContextType }
