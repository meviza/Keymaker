"use client"

import { useCallback, useEffect, useState } from 'react'

export function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void, { hydrated: boolean }] {
  const hydrated = typeof window !== 'undefined'

  const resolveInitial = useCallback((): T => {
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
  }, [initialValue])

  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return resolveInitial()
    }

    try {
      const raw = window.localStorage.getItem(key)
      if (raw != null) return JSON.parse(raw) as T
    } catch {
      // ignore
    }

    return resolveInitial()
  })

  useEffect(() => {
    if (!hydrated) return

    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [key, state, hydrated])

  const setPersistedState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => (typeof value === 'function' ? (value as (p: T) => T)(prev) : value))
  }, [])

  return [state, setPersistedState, { hydrated }]
}
