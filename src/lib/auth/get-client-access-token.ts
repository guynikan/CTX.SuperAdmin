'use client';

import { useSession } from 'next-auth/react';

export function useClientAccessToken() {
  const { data: session } = useSession();
  return session?.accessToken ?? null;
}

export async function getClientAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      return null;
    }
    const session = await response.json();
    return session?.accessToken ?? null;
  } catch (error) {
    console.error('Error getting client access token:', error);
    return null;
  }
}

