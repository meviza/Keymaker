"use client"

import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext<{
    theme: 'dark' | 'light'
    toggleTheme: () => void
} | null>(null)

export function Providers({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        // Basic theme listener 
        const isDark = document.documentElement.classList.contains('dark')
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(isDark ? 'dark' : 'light')
    }, [])

    const toggleTheme = () => {
        if (theme === 'dark') {
            document.documentElement.classList.remove('dark')
            setTheme('light')
        } else {
            document.documentElement.classList.add('dark')
            setTheme('dark')
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
