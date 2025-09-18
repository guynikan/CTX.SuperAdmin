# 🏗️ Análise Arquitetural Completa: Monaco Editor

## 🚨 **PROBLEMAS ARQUITETURAIS CRÍTICOS**

### 1. **Configurações Globais Conflitantes**

#### **MonacoProvider (Global Singleton)**
**Arquivo:** `src/components/monaco/MonacoProvider.tsx`

```typescript
// ❌ PROBLEMA: Configurações globais únicas
monacoInstance.editor.defineTheme('ctx-json-theme', { /* tema fixo */ })

monacoInstance.languages.json.jsonDefaults.setDiagnosticsOptions({
  validate: true,
  allowComments: false,     // ← Fixo para toda aplicação
  schemaValidation: 'error', // ← Não flexível
  enableSchemaRequest: true
})
```

#### **MonacoJsonEditor (Configuração por Instância)**
**Arquivo:** `src/components/monaco/MonacoJsonEditor.tsx`

```typescript
// ❌ PROBLEMA: Sobrescreve configurações globais
jsonDefaults.setDiagnosticsOptions({
  validate: true,
  allowComments: false,
  schemas: [{    // ← Cada editor sobrescreve schemas anteriores
    uri: 'http://json-schema.org/draft-07/schema#',
    fileMatch: [model.uri.toString()],
    schema: schema
  }]
})

// ❌ INCONSISTÊNCIA: Theme diferente do Provider
theme="vs-dark"  // vs ctx-json-theme no Provider
```

**Consequência:** Última instância do editor "ganha", causando:
- Schemas de editores anteriores sendo perdidos
- Configurações inconsistentes entre editores
- Validação quebrada em editores concorrentes

---

### 2. **Estado Global do Autocomplete Provider**

**Arquivo:** `src/components/monaco/providers/templateExpressionProvider.ts`

```typescript
// ❌ PROBLEMA: Estado global compartilhado
let templateErrorCallback: TemplateErrorCallback | null = null
let lastValidationText = ''
let availableTypes: AutocompleteTypeInfo[] = []
let isLoadingTypes = false
let currentConfigId: string | null = null // ← CRÍTICO!
```

**Consequência:** Race conditions e estado inconsistente entre editores

---

### 3. **Memory Leaks e Resource Management**

#### **Provider Registration Leaks**
```typescript
// MonacoJsonEditor.tsx - Potencial leak
useEffect(() => {
  const disposable = registerTemplateExpressionProvider(monaco, configId, setTemplateErrors)
  return () => {
    disposable.dispose() // ✅ OK: Disposed
  }
}, [monaco, isMonacoReady, configId]) // ❌ Re-cria quando configId muda
```

#### **Event Listener Leaks**
```typescript
// Validation listeners não são sempre limpos corretamente
const disposable = monaco.editor.onDidChangeMarkers((uris) => {
  // Listener pode ficar "pendurado" se component unmount inesperado
})
```

---

### 4. **Performance e Caching Issues**

#### **Re-carregamento Desnecessário**
- Autocomplete types carregados múltiplas vezes
- Providers re-registrados a cada configId change
- Sem cache compartilhado entre editores do mesmo contexto

#### **Bundle Size Impact**
- Monaco carregado globalmente mesmo se não usado
- Themes e providers sempre carregados

---

### 5. **Developer Experience e Debugging**

#### **Estado Distribuído e Complexidade**
```typescript
// Estado espalhado em 3 lugares diferentes:
// 1. MonacoProvider (global)
// 2. MonacoJsonEditor (instância) 
// 3. templateExpressionProvider (global)
```

#### **Falta de Observabilidade**
- Não há logs de debug para provider registration
- Difícil identificar qual editor está causando problemas
- Estado interno não é inspecionável

#### **Configurações "Mágicas"**
- Editor options hardcoded em múltiplos lugares
- Theme inconsistente entre Provider e Editor
- Configurações JSON defaults modificadas silenciosamente

---

## 🔍 **ANÁLISE DETALHADA DOS COMPONENTES**

### **1. MonacoProvider.tsx (Singleton Global)**

```typescript
// PROBLEMAS IDENTIFICADOS:
✅ Inicialização única do Monaco ✅
❌ Theme global fixo (ctx-json-theme)
❌ JSON defaults configurados globalmente
❌ Não suporta diferentes configurações por contexto
❌ Configurações imutáveis após inicialização
```

**Responsabilidades Atuais:**
- ✅ Carregamento e inicialização do Monaco
- ❌ **OVER-RESPONSIBILITY:** Definição de theme específico
- ❌ **OVER-RESPONSIBILITY:** Configuração de JSON defaults

---

### **2. MonacoJsonEditor.tsx (Component Instance)**

```typescript
// PROBLEMAS IDENTIFICADOS:
✅ Props interface bem definida ✅
✅ Validation error handling ✅
❌ Schema configuration sobrescreve instâncias anteriores
❌ Theme hardcoded diferente do Provider
❌ Provider registration a cada configId change
❌ Configurações de editor misturadas com logic de provider
❌ State local para templateErrors sem context
```

**Responsabilidades Atuais:**
- ✅ **GOOD:** Rendering do editor e handling de mudanças
- ✅ **GOOD:** Schema validation por instância
- ❌ **BAD:** Registration de providers (deveria ser external)
- ❌ **BAD:** Configuração global de JSON diagnostics
- ❌ **BAD:** Theme management inconsistente

---

### **3. templateExpressionProvider.ts (Global State)**

```typescript
// PROBLEMAS IDENTIFICADOS:
❌ Estado global compartilhado entre todas as instâncias
❌ ConfigId único para toda aplicação
❌ Cache sem namespacing
❌ Providers registrados múltiplas vezes
❌ Não há cleanup de estado entre configurações
```

**Responsabilidades Atuais:**
- ✅ **GOOD:** Parsing de template expressions
- ✅ **GOOD:** Autocomplete logic
- ❌ **BAD:** Estado global compartilhado
- ❌ **BAD:** Provider registration inline

---

## 🏗️ **ARQUITETURA PROPOSTA (COMPLETA)**

### **Princípios da Nova Arquitetura:**

1. **🎯 Single Responsibility:** Cada componente tem uma responsabilidade clara
2. **🔒 Isolation:** Estado isolado por contexto/instância
3. **♻️ Reusability:** Configurações reutilizáveis e composáveis  
4. **📊 Observability:** Estado inspecionável e debuggável
5. **⚡ Performance:** Cache inteligente e lazy loading
6. **🧪 Testability:** Componentes facilmente mockáveis

---

### **Solução: Monaco Editor Context System**

#### **1. MonacoEditorProvider (Context-based)**
```typescript
// src/components/monaco/MonacoEditorProvider.tsx

interface MonacoEditorConfig {
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
  theme?: 'light' | 'dark' | 'high-contrast' | string
  
  // Editor Options
  readOnly?: boolean
  wordWrap?: boolean
  minimap?: boolean
  
  // Performance
  lazyLoad?: boolean
  preloadTypes?: boolean
}

interface MonacoEditorState {
  // Monaco instance
  monaco: typeof monaco | null
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

const MonacoEditorContext = createContext<{
  state: MonacoEditorState
  config: MonacoEditorConfig
  actions: {
    loadAutocompleteTypes: (configId: string) => Promise<void>
    updateSchema: (schema: object) => void
    getAutocompleteSuggestions: (type: string, prefix?: string) => Promise<AutocompleteSuggestion[]>
    registerCustomProvider: (provider: languages.CompletionItemProvider) => IDisposable
  }
} | null>(null)

export const MonacoEditorProvider: FC<{
  config: MonacoEditorConfig
  children: ReactNode
}> = ({ config, children }) => {
  const [state, setState] = useState<MonacoEditorState>({
    monaco: null,
    isReady: false,
    autocompleteTypes: [],
    autocompleteLoading: false,
    validationErrors: [],
    registeredProviders: []
  })
  
  // Initialize Monaco with isolated configuration
  useEffect(() => {
    initializeMonaco(config).then(monacoInstance => {
      setState(prev => ({
        ...prev,
        monaco: monacoInstance,
        isReady: true
      }))
    })
  }, [])
  
  // Autocomplete management
  const loadAutocompleteTypes = useCallback(async (configId: string) => {
    if (!config.autocomplete?.enabled) return
    
    setState(prev => ({ ...prev, autocompleteLoading: true }))
    
    try {
      const types = await fetchAutocompleteTypes(configId)
      setState(prev => ({ 
        ...prev, 
        autocompleteTypes: types,
        autocompleteLoading: false 
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        autocompleteError: error.message,
        autocompleteLoading: false
      }))
    }
  }, [config.autocomplete])
  
  // Schema management  
  const updateSchema = useCallback((schema: object) => {
    if (state.monaco) {
      // Configure schema for THIS context only
      const modelUri = `inmemory://model/${Date.now()}`
      configureSchemaForContext(state.monaco, schema, modelUri)
      
      setState(prev => ({ ...prev, currentSchema: schema }))
    }
  }, [state.monaco])
  
  // Provider registration management
  const registerCustomProvider = useCallback((provider: languages.CompletionItemProvider) => {
    if (state.monaco) {
      const disposable = state.monaco.languages.registerCompletionItemProvider('json', provider)
      
      setState(prev => ({
        ...prev,
        registeredProviders: [...prev.registeredProviders, disposable]
      }))
      
      return disposable
    }
    return { dispose: () => {} }
  }, [state.monaco])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      state.registeredProviders.forEach(disposable => disposable.dispose())
    }
  }, [])
  
  return (
    <MonacoEditorContext.Provider value={{
      state,
      config,
      actions: {
        loadAutocompleteTypes,
        updateSchema,
        getAutocompleteSuggestions: /* implementation */,
        registerCustomProvider
      }
    }}>
      {children}
    </MonacoEditorContext.Provider>
  )
}
```

#### **2. MonacoJsonEditor Simplificado**
```typescript
// src/components/monaco/MonacoJsonEditor.tsx

export const MonacoJsonEditor: FC<{
  value: string
  onChange: (value: string) => void
  height?: number
  placeholder?: string
  onValidationChange?: (isValid: boolean, errors: editor.IMarker[]) => void
}> = ({ value, onChange, height = 400, placeholder, onValidationChange }) => {
  
  const context = useMonacoEditor()
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  
  if (!context) {
    throw new Error('MonacoJsonEditor must be used within MonacoEditorProvider')
  }
  
  const { state, config, actions } = context
  
  // Auto-load autocomplete when ready
  useEffect(() => {
    if (state.isReady && config.autocomplete?.configId) {
      actions.loadAutocompleteTypes(config.autocomplete.configId)
    }
  }, [state.isReady, config.autocomplete?.configId])
  
  // Register template expression provider using context
  useEffect(() => {
    if (state.isReady && config.autocomplete?.enabled) {
      const provider = createTemplateExpressionProvider(
        state.autocompleteTypes,
        actions.getAutocompleteSuggestions
      )
      
      const disposable = actions.registerCustomProvider(provider)
      return () => disposable.dispose()
    }
  }, [state.isReady, state.autocompleteTypes, config.autocomplete?.enabled])
  
  // Handle editor mount with context-based configuration  
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Configure editor with context config
    configureEditorOptions(editor, config)
    
    // Setup validation listeners
    setupValidationListeners(editor, monaco, onValidationChange)
  }
  
  return (
    <Box>
      {state.isReady ? (
        <Editor
          height={height}
          language="json"
          theme={config.theme || 'vs-dark'}
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly: config.readOnly,
            placeholder: placeholder || 'Enter JSON...',
            wordWrap: config.wordWrap ? 'on' : 'off',
            minimap: { enabled: config.minimap || false }
          }}
        />
      ) : (
        <LoadingSpinner />
      )}
      
      <ValidationErrorsDisplay 
        errors={state.validationErrors}
        autocompleteError={state.autocompleteError}
      />
    </Box>
  )
}
```

#### **3. Uso nos Componentes**

**ConfigurationViewer.tsx:**
```typescript
<MonacoEditorProvider
  config={{
    schema: getDataSchema(),
    autocomplete: {
      configId: configuration.id,
      enabled: true,
      cacheTypes: true
    },
    theme: 'dark',
    readOnly: isViewMode
  }}
>
  <MonacoJsonEditor 
    value={JSON.stringify(data, null, 2)}
    onChange={handleDataChange}
    onValidationChange={handleValidation}
  />
</MonacoEditorProvider>
```

**CreateAssociationForm.tsx:**
```typescript
<MonacoEditorProvider
  config={{
    schema: getFormSchema(),
    autocomplete: {
      configId: sourceConfigId, // ✅ Contexto do pai
      enabled: true
    },
    theme: 'light'
  }}
>
  <MonacoJsonEditor 
    value={formData.data}
    onChange={(value) => handleFieldChange('data', value)}
  />
</MonacoEditorProvider>
```

**AssociatedConfigurationEditor.tsx:**
```typescript
<MonacoEditorProvider
  config={{
    schema: configuration.configurationType.dataSchema,
    autocomplete: {
      configId: configuration.id, // ✅ Contexto próprio
      enabled: true
    },
    theme: 'dark',
    readOnly: mode === 'view'
  }}
>
  <MonacoJsonEditor 
    value={JSON.stringify(editedData, null, 2)}
    onChange={handleDataChange}
  />
</MonacoEditorProvider>
```

---

## 🎯 **VANTAGENS DA NOVA ARQUITETURA**

### **🔒 Isolation & Context Management**
✅ Cada editor tem seu próprio contexto isolado  
✅ Configurações não vazam entre instâncias  
✅ Estado gerenciado por contexto React  
✅ Providers registrados por contexto  

### **⚡ Performance & Caching**  
✅ Cache inteligente por configId  
✅ Lazy loading de autocomplete types  
✅ Providers registrados apenas quando necessário  
✅ Cleanup automático de resources  

### **🧪 Developer Experience**
✅ Configuração declarativa e tipada  
✅ Estado inspecionável via React DevTools  
✅ Error boundaries e error handling  
✅ Debug logs contextualizados  

### **🔧 Maintainability**  
✅ Single responsibility per component  
✅ Testable isolated units  
✅ Clear data flow  
✅ Extensible configuration system  

---

### 2. **Uso Inconsistente e Incorreto do ConfigId**

#### **ConfigId Válido vs. Inválido:**

```typescript
// ✅ CORRETO (ConfigurationViewer.tsx)
configId={configuration.id} // "bba8bf0a-4281-4a7e-a51a-1e6456aba891"

// ❌ INCORRETO (CreateAssociationForm.tsx)
configId={`new-${formData.configurationTypeId}`} // "new-uuid-do-tipo"
configId={`new-meta-${formData.configurationTypeId}`} // "new-meta-uuid-do-tipo"

// ❌ PROBLEMÁTICO (AssociatedConfigurationEditor.tsx)  
configId={configuration.id} // ID da config associada, não da original
```

#### **Por que está errado:**
1. **ConfigId** deve ser o ID de uma **configuração existente** para buscar autocomplete
2. **ConfigurationTypeId** é o ID do **tipo** de configuração, não da configuração em si
3. Prefixos `"new-"` e `"new-meta-"` são **IDs inexistentes** na API

---

### 3. **Arquitetura do Provider Não Escala**

#### **Problema Atual:**
```
[Monaco Editor 1] ──┐
                    ├── [Provider Global] ── [Estado Global] ── [API]
[Monaco Editor 2] ──┘    ↑ Conflito aqui!
```

#### **Consequências:**
- **Race conditions:** Último editor a montar "ganha"
- **Estado inconsistente:** Cache e configId ficam "pingando" 
- **Debugging difícil:** Não se sabe qual editor está causando problema
- **Não isolado:** Mudanças em um editor afetam todos os outros

---

## 🎯 **ANÁLISE DETALHADA DOS COMPONENTES**

### **ConfigurationViewer.tsx**
```typescript
// ✅ USO CORRETO
<MonacoJsonEditor 
  configId={configuration.id} // ID válido da configuração atual
  // ... outras props
/>
```
**Status:** ✅ Correto - usa o ID da configuração que está sendo visualizada

---

### **CreateAssociationForm.tsx**  
```typescript
// ❌ USO INCORRETO
configId={`new-${formData.configurationTypeId}`}      // Para dados
configId={`new-meta-${formData.configurationTypeId}`} // Para metadata
```

**Problemas:**
1. **ConfigurationTypeId ≠ ConfigurationId**
2. **IDs fictícios** não existem na API 
3. **Template strings** sem justificativa técnica
4. **Autocomplete inválido** para novos formulários

**Deveria ser:**
```typescript
// ✅ CORREÇÃO PROPOSTA
configId={sourceConfigId} // ID da configuração pai (contexto válido)
```

---

### **AssociatedConfigurationEditor.tsx**
```typescript
// ✅ CORRETO
configId={configuration.id} // ID da configuração associada
```

**Status:** ✅ Correto - ao editar uma configuração associada, o contexto de autocomplete deve ser **dela própria**, não da configuração pai. Cada configuração tem seu próprio contexto de autocomplete.

---

## 🔧 **ARQUITETURA PROPOSTA**


### **Solução: Context Provider React**

#### **Implementação Detalhada:**

**1. Criar AutocompleteContext:**
```typescript
// src/components/monaco/AutocompleteContext.tsx
interface AutocompleteState {
  availableTypes: AutocompleteTypeInfo[]
  isLoading: boolean
  configId: string
  error?: string
}

interface AutocompleteContextType {
  state: AutocompleteState
  loadTypes: (configId: string) => Promise<void>
  getSuggestions: (type: string, prefix?: string) => Promise<AutocompleteSuggestion[]>
}

const AutocompleteContext = createContext<AutocompleteContextType | null>(null)

export const AutocompleteProvider: React.FC<{ configId: string; children: ReactNode }> = ({ 
  configId, 
  children 
}) => {
  const [state, setState] = useState<AutocompleteState>({
    availableTypes: [],
    isLoading: false,
    configId
  })
  
  const loadTypes = useCallback(async (newConfigId: string) => {
    if (newConfigId === state.configId && state.availableTypes.length > 0) {
      return // Já carregado para este configId
    }
    
    setState(prev => ({ ...prev, isLoading: true, configId: newConfigId }))
    
    try {
      const types = await fetchAutocompleteTypes(newConfigId)
      setState(prev => ({ ...prev, availableTypes: types, isLoading: false }))
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isLoading: false,
        availableTypes: [] 
      }))
    }
  }, [state.configId, state.availableTypes.length])
  
  const getSuggestions = useCallback(async (type: string, prefix = '') => {
    return await fetchAutocompleteSuggestions(state.configId, type, prefix)
  }, [state.configId])
  
  // Auto-load when configId changes
  useEffect(() => {
    if (configId) {
      loadTypes(configId)
    }
  }, [configId, loadTypes])
  
  const contextValue = useMemo(() => ({
    state,
    loadTypes,
    getSuggestions
  }), [state, loadTypes, getSuggestions])
  
  return (
    <AutocompleteContext.Provider value={contextValue}>
      {children}
    </AutocompleteContext.Provider>
  )
}

export const useAutocomplete = () => {
  const context = useContext(AutocompleteContext)
  if (!context) {
    throw new Error('useAutocomplete must be used within AutocompleteProvider')
  }
  return context
}
```

**2. Modificar templateExpressionProvider para usar Context:**
```typescript
// src/components/monaco/providers/templateExpressionProvider.ts
// Remover variáveis globais:
// ❌ let availableTypes: AutocompleteTypeInfo[] = []
// ❌ let currentConfigId: string | null = null

// Modificar para receber estado via parâmetro:
const createTemplateExpressionProvider = (
  autocompleteState: AutocompleteState,
  getSuggestions: (type: string, prefix?: string) => Promise<AutocompleteSuggestion[]>
) => {
  const getTemplateExpressionSuggestions = async (
    textBeforeCursor: string, 
    range: IRange
  ): Promise<languages.CompletionItem[]> => {
    const { context, path, endsWithDot, partial } = parseTemplateContext(textBeforeCursor)
    
    // Usar estado recebido via parâmetro em vez de variável global
    if (autocompleteState.availableTypes.length === 0) {
      return []
    }
    
    // ... resto da lógica usando autocompleteState.availableTypes
    // e getSuggestions() em vez de currentConfigId
  }
  
  const provideCompletionItems = async (
    model: editor.ITextModel,
    position: Position
  ): Promise<languages.CompletionList | null> => {
    // ... implementação usando estado local
  }
  
  return {
    triggerCharacters: ['.', '"', '{', ':', ' ', '$'],
    provideCompletionItems,
    resolveCompletionItem: (item) => item
  }
}

export const registerTemplateExpressionProvider = (
  monaco: typeof import('monaco-editor'),
  autocompleteState: AutocompleteState,
  getSuggestions: (type: string, prefix?: string) => Promise<AutocompleteSuggestion[]>
): IDisposable => {
  const provider = createTemplateExpressionProvider(autocompleteState, getSuggestions)
  return monaco.languages.registerCompletionItemProvider('json', provider)
}
```

**3. Modificar MonacoJsonEditor para usar Context:**
```typescript
// src/components/monaco/MonacoJsonEditor.tsx
export const MonacoJsonEditor: React.FC<MonacoJsonEditorProps> = ({
  value,
  onChange,
  // ... outras props
  // ❌ Remover: configId prop (será obtido via context)
}) => {
  const { isMonacoReady, monaco } = useMonaco()
  const { state: autocompleteState, getSuggestions } = useAutocomplete()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  
  // Registrar provider usando context em vez de configId prop
  useEffect(() => {
    if (!monaco || !isMonacoReady || autocompleteState.isLoading) return

    const disposable = registerTemplateExpressionProvider(
      monaco, 
      autocompleteState, 
      getSuggestions
    )
    
    return () => {
      disposable.dispose()
    }
  }, [monaco, isMonacoReady, autocompleteState, getSuggestions])
  
  // ... resto da implementação
}
```

#### **Uso nos Componentes:**

**ConfigurationViewer.tsx:**
```typescript
// Wrapper com provider
<AutocompleteProvider configId={configuration.id}>
  <MonacoJsonEditor 
    value={JSON.stringify(data, null, 2)}
    onChange={handleChange}
    // ❌ Não precisa mais: configId={configuration.id}
  />
</AutocompleteProvider>
```

**CreateAssociationForm.tsx:**
```typescript
// Usar configId do contexto pai (sourceConfigId)
<AutocompleteProvider configId={sourceConfigId}>
  <MonacoJsonEditor 
    value={formData.data}
    onChange={(value) => handleFieldChange('data', value)}
    // ❌ Não precisa mais: configId={sourceConfigId}
  />
</AutocompleteProvider>
```

**AssociatedConfigurationEditor.tsx:**
```typescript
// Usar configId da própria configuração associada
<AutocompleteProvider configId={configuration.id}>
  <MonacoJsonEditor 
    value={JSON.stringify(editedData, null, 2)}
    onChange={handleDataChange}
    // ❌ Não precisa mais: configId={configuration.id}
  />
</AutocompleteProvider>
```

#### **Vantagens desta Abordagem:**

✅ **Simples e Reactivo**: Usa padrões React familiares  
✅ **Estado Isolado**: Cada Provider tem seu próprio estado  
✅ **Auto-gerenciamento**: Context carrega tipos automaticamente  
✅ **Cache Inteligente**: Re-usa dados para mesmo configId  
✅ **Fácil Debug**: Estado visível via React DevTools  
✅ **Flexível**: Pode ter múltiplos contextos aninhados  
✅ **Testável**: Fácil de mockar em testes  

#### **Migração Gradual:**

1. **Criar AutocompleteContext** 
2. **Modificar MonacoJsonEditor** para usar context opcional
3. **Migrar componente por componente** 
4. **Remover variáveis globais** do templateExpressionProvider
5. **Cleanup** da prop configId

---

## 🚀 **PLANO DE MIGRAÇÃO COMPLETA**

### **Fase 1: Correção Imediata - Hotfix (1-2h)**

**Objetivo:** Resolver problema crítico do autocomplete sem quebrar funcionalidade existente

1. **✅ Correção de ConfigId:**
   ```typescript
   // CreateAssociationForm.tsx
   // ANTES: configId={`new-${formData.configurationTypeId}`}
   // DEPOIS: configId={sourceConfigId}
   ```

2. **✅ Debug Logging:**
   ```typescript
   // templateExpressionProvider.ts - linha 364
   console.log('🚀 Registering template provider for configId:', configId)
   console.log('📡 Available types loaded:', availableTypes.length)
   ```

3. **✅ Theme Consistency Fix:**
   ```typescript
   // MonacoJsonEditor.tsx - linha 201
   // ANTES: theme="vs-dark" 
   // DEPOIS: theme={config?.theme || 'ctx-json-theme'}
   ```

---

### **Fase 2: Arquitetura Base - Core Refactor (6-8h)**

**Objetivo:** Implementar nova arquitetura de contexto isolado

#### **2.1 MonacoEditorProvider (2h)**
- [ ] Criar `src/components/monaco/MonacoEditorProvider.tsx`
- [ ] Implementar `MonacoEditorConfig` interface
- [ ] Implementar `MonacoEditorState` management
- [ ] Criar actions para autocomplete, schema, providers

#### **2.2 MonacoJsonEditor Refactor (2h)**  
- [ ] Simplificar component para usar context
- [ ] Remover provider registration inline
- [ ] Remover schema configuration global
- [ ] Implementar error boundaries

#### **2.3 Template Provider Refactor (2h)**
- [ ] Criar `createTemplateExpressionProvider` factory
- [ ] Remover variáveis globais
- [ ] Implementar context-based provider
- [ ] Adicionar proper cleanup

#### **2.4 Utilities & Helpers (1h)**
- [ ] Criar `configureSchemaForContext` utility
- [ ] Criar `configureEditorOptions` utility  
- [ ] Implementar `setupValidationListeners` utility
- [ ] Criar `ValidationErrorsDisplay` component

---

### **Fase 3: Migração Gradual - Component Updates (4-5h)**

**Objetivo:** Migrar todos os componentes para nova arquitetura

#### **3.1 ConfigurationViewer (1.5h)**
```typescript
// ANTES
<MonacoJsonEditor configId={configuration.id} schema={schema} />

// DEPOIS  
<MonacoEditorProvider config={{ autocomplete: { configId: configuration.id }, schema }}>
  <MonacoJsonEditor />
</MonacoEditorProvider>
```

#### **3.2 CreateAssociationForm (1.5h)**
- [ ] Wrapper com `MonacoEditorProvider`
- [ ] Usar `sourceConfigId` correto
- [ ] Configurar schema dinâmico baseado no type

#### **3.3 AssociatedConfigurationEditor (1h)**
- [ ] Configurar contexto próprio da configuração
- [ ] Implementar schema baseado no configuration type
- [ ] Manter funcionalidade de auto-save

#### **3.4 AssociatedConfigurationsModal (1h)**
- [ ] Atualizar para passar contexts corretos
- [ ] Testar múltiplos editores simultaneamente

---

### **Fase 4: Cleanup & Polish (3-4h)**

#### **4.1 Global State Cleanup (1h)**
- [ ] Remover MonacoProvider global configurations
- [ ] Manter apenas inicialização básica do Monaco
- [ ] Cleanup templateExpressionProvider global state

#### **4.2 Performance Optimizations (1h)**
- [ ] Implementar cache inteligente por configId
- [ ] Lazy load autocomplete types
- [ ] Preload common types

#### **4.3 Developer Experience (1h)**  
- [ ] Adicionar debug panel (dev mode)
- [ ] Melhorar error messages
- [ ] Implementar performance metrics

#### **4.4 Testing & Validation (1h)**
- [ ] Testes unitários para contexts
- [ ] E2E tests para múltiplos editores
- [ ] Performance benchmarks

---

### **Fase 5: Advanced Features - Nice to Have (2-3h)**

#### **5.1 Advanced Caching (1h)**
- [ ] Implementar cache compartilhado entre contexts similares
- [ ] Cache persistence (localStorage)
- [ ] Cache invalidation strategies

#### **5.2 Theme System (1h)**
- [ ] Implementar theme switching per context
- [ ] Dark/light mode sync com sistema
- [ ] Custom theme configurations

#### **5.3 Analytics & Monitoring (1h)**
- [ ] Usage metrics para autocomplete
- [ ] Error tracking per context
- [ ] Performance monitoring

---

## ⏱️ **TIMELINE TOTAL: 16-22h**

| Fase | Tempo | Impacto | Risco |
|------|-------|---------|-------|
| **Fase 1** | 1-2h | 🔥 CRÍTICO - Fix autocomplete | 🟢 BAIXO |
| **Fase 2** | 6-8h | 🏗️ FOUNDATION - Nova arquitetura | 🟡 MÉDIO |
| **Fase 3** | 4-5h | 🔄 MIGRATION - Aplicar everywhere | 🟡 MÉDIO |
| **Fase 4** | 3-4h | ✨ POLISH - DX e performance | 🟢 BAIXO |
| **Fase 5** | 2-3h | 🚀 ADVANCED - Features extras | 🟢 BAIXO |

---

## 🎯 **SUCCESS METRICS**

### **Technical**
- [ ] ✅ Autocomplete funciona em todos os editores simultaneamente
- [ ] ✅ Zero memory leaks (validado via profiler)  
- [ ] ✅ Schema validation isolada por editor
- [ ] ✅ Providers registrados/disposed corretamente
- [ ] ✅ Performance igual ou melhor (load time < 500ms)

### **Developer Experience**
- [ ] ✅ Configuração declarativa clara
- [ ] ✅ Estado inspecionável (React DevTools)
- [ ] ✅ Debugging messages úteis
- [ ] ✅ TypeScript errors informativos
- [ ] ✅ Hot reload funciona perfeitamente

### **User Experience**
- [ ] ✅ Autocomplete responsivo (< 100ms)
- [ ] ✅ Validation em tempo real
- [ ] ✅ Sem flickering ou bugs visuais
- [ ] ✅ Themes consistentes
- [ ] ✅ Error messages úteis

---

## 🚨 **RISKS & MITIGATION**

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Breaking changes** | MÉDIO | ALTO | Migração gradual com backward compatibility |
| **Performance regression** | BAIXO | ALTO | Benchmarks antes/depois, profiling |
| **Complex refactor** | ALTO | MÉDIO | Fases pequenas, review rigoroso |
| **Memory leaks** | MÉDIO | ALTO | Testing extensivo, profiler validation |

---

**💡 Próximo Passo:** Validar plano e começar com **Fase 1 (Hotfix)** para resolver problema imediato do autocomplete.

---

## 🎯 **REGRAS DE NEGÓCIO PARA ConfigId**

### **✅ QUANDO USAR CADA ConfigId:**

| Cenário | ConfigId Correto | Justificativa |
|---------|------------------|---------------|
| **Visualizar configuração existente** | `configuration.id` | Contexto próprio |
| **Editar configuração existente** | `configuration.id` | Contexto próprio |
| **Criar nova configuração** | `sourceConfigId` ou `parentConfigId` | Herdar contexto pai |
| **Editar configuração associada** | `configuration.id` | Contexto da própria configuração associada |

### **❌ NUNCA USAR:**
- ❌ `configurationTypeId` como `configId`  
- ❌ IDs fictícios como `"new-xxx"`
- ❌ Template strings sem propósito técnico
- ❌ IDs que não existem na API

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Validar esta análise** com a equipe
2. **Escolher abordagem** (Opção 1 recomendada)  
3. **Implementar correção imediata** (Fase 1)
4. **Planejar refatoração** (Fase 2)
5. **Definir testes de validação**

---

## 🔗 **REFERÊNCIAS**

- [Monaco Editor Multiple Instances Best Practices](https://microsoft.github.io/monaco-editor/docs.html)
- [React Context for Provider State Management](https://reactjs.org/docs/context.html)
- [Template Expression Provider Current Implementation](./src/components/monaco/providers/templateExpressionProvider.ts)

---

**⚡ Prioridade:** CRÍTICA - Autocomplete é funcionalidade core  
**🎯 Impacto:** ALTO - Afeta UX de edição de configurações  
**⏱️ Estimativa:** 8-12h para correção completa
