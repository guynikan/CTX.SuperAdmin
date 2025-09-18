// Types for autocomplete functionality

/**
 * Enum for expression prefix types, matching backend ExpressionPrefixTypeEnum
 */
export enum ExpressionPrefixType {
  /** Segment expressions like $segment.role, $segment.plan */
  Segment = 0,
  
  /** Associated configuration expressions like $locale, $routes */
  AssociatedConfig = 1
}

export interface AutocompleteTypeInfo {
  prefix: string;                    // "$segment", "$locale"
  expressionPrefixType: number;      // 0, 1 (real API field name)
  description: string;               // "Dynamic segment types"
  properties: string[];              // ["tenant", "role", "status"]
}

export interface AutocompleteTypesResponse {
  configurationId: string;
  availableTypes: AutocompleteTypeInfo[];
}

export interface AutocompleteContext {
  type: string;
  prefix: string;
  startColumn: number;
}

export interface TemplateError {
  line: number;
  message: string;
  context: string;
}

export type TemplateErrorCallback = (errors: TemplateError[]) => void
