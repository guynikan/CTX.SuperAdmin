# 📚 Guia de Endpoints: Configuration e Configuration/Associations

Este documento detalha como utilizar os endpoints de **POST** e **PUT** para gerenciar **Configurations** e **Configuration Associations** na API CTX.Backoffice.

## 📋 Índice

1. [Configuration Endpoints](#configuration-endpoints)
   - [POST - Criar Configuration](#post---criar-configuration)
   - [PUT - Atualizar Configuration](#put---atualizar-configuration)
2. [Configuration Associations Endpoints](#configuration-associations-endpoints)
   - [POST - Criar Association](#post---criar-association)
   - [PUT - Atualizar Association](#put---atualizar-association)
3. [Exemplos Práticos](#exemplos-práticos)
4. [Códigos de Resposta](#códigos-de-resposta)

---

## 🔧 Configuration Endpoints

### POST - Criar Configuration

**Endpoint:** `POST /api/configuration`

**Descrição:** Cria uma nova configuração com propriedades e dados opcionais.

#### Request Body: `CreateConfigurationRequest`

```json
{
  "title": "string (obrigatório)",
  "slug": "string (obrigatório, regex: ^[a-z0-9_]+$, max: 255)",
  "description": "string (opcional)",
  "configurationTypeId": "guid (obrigatório)",
  "moduleId": "guid (obrigatório)",
  "baseConfigurationId": "guid (opcional)",
  "isActive": "boolean (default: true)",
  "version": "string (opcional)",
  "metadata": "object (opcional)",
  "data": "object (opcional)"
}
```

#### Validações:
- **title**: Obrigatório
- **slug**: Obrigatório, máximo 255 caracteres, apenas letras minúsculas, números e underscores
- **configurationTypeId**: GUID válido obrigatório
- **moduleId**: GUID válido obrigatório
- **baseConfigurationId**: Se fornecido, a configuração herdará dados da configuração base

#### Exemplo de Request:

```bash
curl -X POST "http://localhost:5148/api/configuration" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Menu Principal - PT-BR",
    "slug": "main_menu_pt_br",
    "description": "Menu principal para usuários brasileiros",
    "configurationTypeId": "123e4567-e89b-12d3-a456-426614174000",
    "moduleId": "987fcdeb-51a2-43d7-8f6e-123456789abc",
    "isActive": true,
    "version": "1.0.0",
    "data": {
      "menu": {
        "header": {
          "home": "Início",
          "products": "Produtos",
          "about": "Sobre"
        }
      }
    },
    "metadata": {
      "locale": "pt-BR",
      "theme": "default"
    }
  }'
```

---

### PUT - Atualizar Configuration

**Endpoint:** `PUT /api/configuration/{id}`

**Descrição:** Atualiza uma configuração existente.

#### Request Body: `ConfigurationUpdateRequest`

```json
{
  "configurationTypeId": "guid (obrigatório)",
  "moduleId": "guid (obrigatório)",
  "title": "string (obrigatório, max: 200)",
  "slug": "string (obrigatório, regex: ^[a-z0-9_]+$, max: 255)",
  "description": "string (max: 500)",
  "baseConfigurationId": "guid (opcional)",
  "isActive": "boolean (default: true)",
  "version": "string (opcional)",
  "metadata": "object (opcional)",
  "data": "object (opcional)"
}
```

#### Validações:
- **configurationTypeId**: GUID válido obrigatório
- **moduleId**: GUID válido obrigatório
- **title**: Obrigatório, máximo 200 caracteres
- **slug**: Obrigatório, máximo 255 caracteres, apenas letras minúsculas, números e underscores
- **description**: Máximo 500 caracteres

#### Exemplo de Request:

```bash
curl -X PUT "http://localhost:5148/api/configuration/123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "configurationTypeId": "123e4567-e89b-12d3-a456-426614174000",
    "moduleId": "987fcdeb-51a2-43d7-8f6e-123456789abc",
    "title": "Menu Principal - PT-BR Atualizado",
    "slug": "main_menu_pt_br_v2",
    "description": "Menu principal atualizado para usuários brasileiros",
    "isActive": true,
    "version": "2.0.0",
    "data": {
      "menu": {
        "header": {
          "home": "Início",
          "products": "Produtos",
          "about": "Sobre Nós",
          "contact": "Contato"
        }
      }
    }
  }'
```

---

## 🔗 Configuration Associations Endpoints

### POST - Criar Association

**Endpoint:** `POST /api/configuration/associations`

**Descrição:** Cria uma nova associação entre duas configurações. Valida que ambas as configurações existem e previne auto-referência.

#### Request Body: `ConfigurationAssociationRequest`

```json
{
  "sourceConfigurationId": "guid (obrigatório)",
  "targetConfigurationId": "guid (obrigatório)",
  "isActive": "boolean (default: true)"
}
```

#### Validações Automáticas:
- ✅ Verifica se as configurações de origem e destino existem
- ✅ Impede auto-referência (source == target)
- ✅ Verifica se a associação já existe (evita duplicatas)

#### Exemplo de Request:

```bash
curl -X POST "http://localhost:5148/api/configuration/associations" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceConfigurationId": "123e4567-e89b-12d3-a456-426614174000",
    "targetConfigurationId": "987fcdeb-51a2-43d7-8f6e-123456789abc",
    "isActive": true
  }'
```

---

### PUT - Atualizar Association

**Endpoint:** `PUT /api/configuration/associations/{id}`

**Descrição:** Atualiza uma associação existente. **Apenas o status `isActive` pode ser modificado.**

#### Request Body: `ConfigurationAssociationRequest`

```json
{
  "sourceConfigurationId": "guid (ignorado na atualização)",
  "targetConfigurationId": "guid (ignorado na atualização)",
  "isActive": "boolean (único campo que será atualizado)"
}
```

#### ⚠️ Importante:
- Apenas o campo `isActive` é considerado na atualização
- Os campos `sourceConfigurationId` e `targetConfigurationId` são ignorados
- Para alterar origem/destino, é necessário deletar e criar uma nova associação

#### Exemplo de Request:

```bash
curl -X PUT "http://localhost:5148/api/configuration/associations/456e7890-e89b-12d3-a456-426614174001" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceConfigurationId": "123e4567-e89b-12d3-a456-426614174000",
    "targetConfigurationId": "987fcdeb-51a2-43d7-8f6e-123456789abc",
    "isActive": false
  }'
```

---

## 🎯 Exemplos Práticos

### Cenário 1: Criando um Menu com Locale Associado

1. **Criar configuração de menu:**
```bash
curl -X POST "http://localhost:5148/api/configuration" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Header Menu",
    "slug": "header_menu_main",
    "configurationTypeId": "menu-type-guid",
    "moduleId": "header-module-guid",
    "data": {
      "menu": {
        "items": ["$locale.home", "$locale.about", "$locale.contact"]
      }
    }
  }'
```

2. **Criar configuração de locale:**
```bash
curl -X POST "http://localhost:5148/api/configuration" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Português Brasil",
    "slug": "locale_pt_br",
    "configurationTypeId": "locale-type-guid",
    "moduleId": "locale-module-guid",
    "data": {
      "home": "Início",
      "about": "Sobre",
      "contact": "Contato"
    }
  }'
```

3. **Associar menu com locale:**
```bash
curl -X POST "http://localhost:5148/api/configuration/associations" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceConfigurationId": "header-menu-guid",
    "targetConfigurationId": "locale-pt-br-guid",
    "isActive": true
  }'
```

### Cenário 2: Desativando uma Associação

```bash
curl -X PUT "http://localhost:5148/api/configuration/associations/association-guid" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceConfigurationId": "any-guid",
    "targetConfigurationId": "any-guid",
    "isActive": false
  }'
```

---

## 📊 Códigos de Resposta

### Configuration Endpoints

| Código | Descrição | Cenário |
|--------|-----------|---------|
| `200 OK` | Sucesso | Atualização bem-sucedida |
| `201 Created` | Criado | Configuração criada com sucesso |
| `400 Bad Request` | Erro de validação | Dados inválidos, slug duplicado |
| `404 Not Found` | Não encontrado | Configuration, Module ou Type inexistente |
| `422 Unprocessable Entity` | Erro de regra de negócio | Slug já existe, validações específicas |

### Association Endpoints

| Código | Descrição | Cenário |
|--------|-----------|---------|
| `200 OK` | Sucesso | Atualização bem-sucedida |
| `201 Created` | Criado | Associação criada com sucesso |
| `400 Bad Request` | Erro de validação | Auto-referência, dados inválidos |
| `404 Not Found` | Não encontrado | Configuration ou Association inexistente |
| `409 Conflict` | Conflito | Associação já existe |

---

## 🔍 Response Examples

### Configuration Created (201)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Menu Principal - PT-BR",
  "slug": "main_menu_pt_br",
  "description": "Menu principal para usuários brasileiros",
  "configurationTypeId": "123e4567-e89b-12d3-a456-426614174000",
  "moduleId": "987fcdeb-51a2-43d7-8f6e-123456789abc",
  "isActive": true,
  "version": "1.0.0",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "data": { /* dados da configuração */ },
  "metadata": { /* metadados */ }
}
```

### Association Created (201)
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "sourceConfigurationId": "123e4567-e89b-12d3-a456-426614174000",
  "targetConfigurationId": "987fcdeb-51a2-43d7-8f6e-123456789abc",
  "isActive": true,
  "createdAt": "2024-01-15T10:35:00Z",
  "updatedAt": "2024-01-15T10:35:00Z",
  "sourceConfiguration": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "slug": "header_menu_main",
    "title": "Header Menu",
    "configurationTypeSlug": "menu",
    "moduleName": "Header"
  },
  "targetConfiguration": {
    "id": "987fcdeb-51a2-43d7-8f6e-123456789abc",
    "slug": "locale_pt_br",
    "title": "Português Brasil",
    "configurationTypeSlug": "locale",
    "moduleName": "Localization"
  }
}
```

---

## ⚡ Dicas e Melhores Práticas

1. **Slugs**: Use sempre minúsculas, números e underscores. Ex: `main_menu_v2`, `locale_pt_br`

2. **Versionamento**: Use o campo `version` para controle de versões. Ex: `"1.0.0"`, `"2.1.3"`

3. **Herança**: Use `baseConfigurationId` para herdar dados de configurações existentes

4. **Associações**: Crie associações após criar as configurações individuais

5. **Testes**: Sempre teste com dados reais do seu ambiente antes de usar em produção

6. **Validação**: A API realiza validações automáticas, mas sempre valide os dados no frontend

---

*Documento atualizado em: Janeiro 2024*
*Versão da API: v1.0*
