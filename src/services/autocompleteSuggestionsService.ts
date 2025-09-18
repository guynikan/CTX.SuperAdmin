import { httpService } from '@/services/http'

export interface AutocompleteSuggestion {
  key: string
  fullPath: string
  value: any
  type: string
  description?: string
  score: number
  configSlug: string
  configTitle?: string
}

export interface AutocompleteSuggestionsResponse {
  prefix: string
  totalSuggestions: number
  suggestions: AutocompleteSuggestion[]
}

// Cache configuration
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes (shorter for dynamic data)

interface CachedSuggestions {
  data: AutocompleteSuggestion[]
  timestamp: number
  configId: string
  type: string
  prefix: string
}

// In-memory cache for suggestions
const suggestionCache = new Map<string, CachedSuggestions>()

/**
 * Generate cache key for suggestions
 */
const getCacheKey = (configId: string, type: string, prefix: string = ''): string => {
  return `${configId}_${type}_${prefix}`
}

/**
 * Check if cached suggestions are still valid
 */
const isSuggestionCacheValid = (cacheKey: string): boolean => {
  const cached = suggestionCache.get(cacheKey)
  if (!cached) return false
  
  const now = Date.now()
  return (now - cached.timestamp) < CACHE_TTL
}

/**
 * Fetch autocomplete suggestions from API
 */
export const fetchAutocompleteSuggestions = async (
  configId: string,
  type: string,
  prefix: string = '',
  limit: number = 100
): Promise<AutocompleteSuggestion[]> => {
  const cacheKey = getCacheKey(configId, type, prefix)
  
  // Return cached data if valid
  if (isSuggestionCacheValid(cacheKey)) {
    return suggestionCache.get(cacheKey)!.data
  }

  try {
    const params = new URLSearchParams({
      type,
      limit: limit.toString()
    })
    
    if (prefix) {
      params.append('prefix', prefix)
    }

    const data = await httpService<AutocompleteSuggestionsResponse>({
      path: `/api/configuration/${configId}/autocomplete-suggestions?${params.toString()}`,
      options: { method: 'GET' }
    })
    
    const suggestions = data?.suggestions || []
    
    // Update cache
    suggestionCache.set(cacheKey, {
      data: suggestions,
      timestamp: Date.now(),
      configId,
      type,
      prefix
    })

    return suggestions

  } catch (error) {
    console.error('Failed to fetch autocomplete suggestions:', error)
    
    // Return empty array on error
    return []
  }
}

/**
 * Clear suggestions cache (useful for testing or forced refresh)
 */
export const clearSuggestionsCache = (): void => {
  suggestionCache.clear()
}
