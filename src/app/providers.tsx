"use client"

import React, { createContext, useState } from 'react'

export const ThemeContext = createContext<{
    theme: 'dark' | 'light'
    toggleTheme: () => void
} | null>(null)

export function Providers({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        if (typeof document === 'undefined') return 'dark'
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    })

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
