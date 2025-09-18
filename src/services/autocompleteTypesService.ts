import { AutocompleteTypeInfo, AutocompleteTypesResponse } from '@/types/autocomplete'
import { httpService } from '@/services/http'

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface CachedData {
  data: AutocompleteTypeInfo[]
  timestamp: number
  configId: string
}

// In-memory cache
let cache: CachedData | null = null

/**
 * Check if cached data is still valid
 */
const isCacheValid = (configId: string): boolean => {
  if (!cache) return false
  if (cache.configId !== configId) return false
  
  const now = Date.now()
  return (now - cache.timestamp) < CACHE_TTL
}

const fetchFromApi = async (configId: string): Promise<AutocompleteTypeInfo[]> => {
  const data = await httpService<AutocompleteTypesResponse>({
    path: `/api/configuration/${configId}/autocomplete-types`,
    options: { method: 'GET' }
  })
  
  return data?.availableTypes || []
}

/**
 * Get autocomplete types with caching
 */
export const fetchAutocompleteTypes = async (configId: string): Promise<AutocompleteTypeInfo[]> => {
  // Return cached data if valid
  if (isCacheValid(configId)) {
    return cache!.data
  }

  try {
    const data = await fetchFromApi(configId)
    
    // Update cache
    cache = {
      data,
      timestamp: Date.now(),
      configId
    }

    return data

  } catch (error) {
    console.error('Failed to fetch autocomplete types:', error)
    
    // Return empty array on error
    return []
  }
}

/**
 * Clear cache (useful for testing or forced refresh)
 */
export const clearAutocompleteCache = (): void => {
  cache = null
}

/**
 * Get cache status for debugging
 */
export const getCacheInfo = (): { isValid: boolean; timestamp?: number; configId?: string } => {
  if (!cache) {
    return { isValid: false }
  }
  
  return {
    isValid: isCacheValid(cache.configId),
    timestamp: cache.timestamp,
    configId: cache.configId
  }
}
