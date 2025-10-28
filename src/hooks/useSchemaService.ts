import { useMemo } from 'react';
import { SchemaService } from '@/services/schemaService';

export function useSchemaService() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  const schemaService = useMemo(() => {
    return new SchemaService(baseUrl);
  }, [baseUrl]);

  return schemaService;
}

