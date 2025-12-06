import { Component, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="text-6xl font-display font-bold mb-4">Oops!</h1>
            <p className="text-xl text-kodeen-gray-500 mb-8">
              Something went wrong. We're working on fixing it.
            </p>
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-block px-8 py-3 bg-kodeen-black text-white rounded-full hover:bg-kodeen-gray-800 transition-colors"
                onClick={() => this.setState({ hasError: false })}
              >
                Go Home
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="block w-full px-8 py-3 border border-kodeen-gray-300 rounded-full hover:bg-kodeen-gray-50 transition-colors"
              >
                Reload Page
              </button>
            </div>
            {this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-kodeen-gray-400 hover:text-kodeen-gray-600">
                  Technical Details
                </summary>
                <pre className="mt-4 p-4 bg-kodeen-gray-50 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
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

export default ErrorBoundary
