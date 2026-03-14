import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    
    const variants = {
      primary: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border border-cyan-400 hover:from-cyan-600 hover:to-blue-600 focus:ring-cyan-500 shadow-lg shadow-cyan-500/25",
      secondary: "glass-panel text-gray-300 border border-gray-600 hover:border-gray-500 hover:bg-white/10 focus:ring-gray-500",
      danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white border border-red-400 hover:from-red-600 hover:to-pink-600 focus:ring-red-500 shadow-lg shadow-red-500/25"
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
