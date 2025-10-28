export class SchemaService {
  private schemaCache = new Map<string, any>();
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async resolveCtxReference(uri: string): Promise<any> {
    const match = uri.match(/ctx:\/\/([^\/]+)\/(data|metadata)(?:#\/(.+))?/);
    if (!match) throw new Error(`Invalid ctx:// reference: ${uri}`);

    const [, configTypeSlug, schemaType, fragment] = match;
    const cacheKey = `${configTypeSlug}-${schemaType}`;

    if (this.schemaCache.has(cacheKey)) {
      return this.resolveFragment(this.schemaCache.get(cacheKey), fragment);
    }

    const response = await fetch(
      `${this.baseUrl}/api/ConfigurationType?slug=${configTypeSlug}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ConfigurationType: ${configTypeSlug}`);
    }

    const configTypes = await response.json();
    if (configTypes.length === 0) {
      throw new Error(`ConfigurationType not found: ${configTypeSlug}`);
    }

    const schemaString = schemaType === 'data' 
      ? configTypes[0].dataSchema 
      : configTypes[0].metadataSchema;

    // Parse JSON string to object
    const schema = JSON.parse(schemaString);

    this.schemaCache.set(cacheKey, schema);
    return this.resolveFragment(schema, fragment);
  }

  private resolveFragment(schema: any, fragment?: string): any {
    if (!fragment) return schema;
    
    const parts = fragment.split('/').filter(p => p);
    let current = schema;
    
    for (const part of parts) {
      if (!current[part]) {
        throw new Error(`Fragment not found: ${fragment}`);
      }
      current = current[part];
    }
    
    return current;
  }

  async resolveAllReferences(schema: any): Promise<any> {
    const schemaStr = JSON.stringify(schema);
    const ctxRefPattern = /ctx:\/\/([^\/]+)\/(data|metadata)(?:#\/[^"]*)?/g;
    const matches = [...schemaStr.matchAll(ctxRefPattern)];
    
    if (matches.length === 0) {
      return schema; // No references to resolve
    }

    const resolved = JSON.parse(JSON.stringify(schema)); // Deep clone
    
    for (const match of matches) {
      const uri = match[0];
      try {
        const refSchema = await this.resolveCtxReference(uri);
        // Replace the $ref with the resolved schema inline
        this.replaceReferenceInSchema(resolved, uri, refSchema);
      } catch (error) {
        console.error(`Failed to resolve ${uri}:`, error);
        throw error;
      }
    }
    
    return resolved;
  }

  private replaceReferenceInSchema(schema: any, uri: string, resolvedSchema: any): void {
    // Recursively find and replace $ref properties
    const replaceRefs = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(replaceRefs);
      }

      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key === '$ref' && value === uri) {
          // Replace the $ref with the resolved schema
          return resolvedSchema;
        } else {
          result[key] = replaceRefs(value);
        }
      }
      return result;
    };

    // Apply the replacement recursively
    const updatedSchema = replaceRefs(schema);
    
    // Update the original schema object
    Object.keys(schema).forEach(key => delete schema[key]);
    Object.assign(schema, updatedSchema);
  }

  clearCache(): void {
    this.schemaCache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.schemaCache.size,
      keys: Array.from(this.schemaCache.keys())
    };
  }
}
