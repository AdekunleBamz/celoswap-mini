'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-lg mx-auto mt-8">
          <div className="glass rounded-3xl p-6 text-center">
            <h2 className="text-2xl font-display font-bold mb-4 text-red-400">Oops! Something went wrong</h2>
            <p className="text-gray-400 mb-4">
              We encountered an unexpected error. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-2 bg-celo-green text-black rounded-lg font-display font-semibold hover:bg-celo-green/80 transition-colors"
            >
              Try Again
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
