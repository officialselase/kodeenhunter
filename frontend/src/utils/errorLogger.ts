/**
 * Error logging and monitoring utilities
 * Supports integration with Sentry or custom error tracking
 */

interface ErrorLog {
  message: string
  stack?: string
  timestamp: string
  url: string
  userAgent: string
  additionalInfo?: Record<string, any>
}

/**
 * Initialize error logging (Sentry integration)
 * Uncomment and configure when ready to use Sentry
 */
export const initErrorLogging = (dsn?: string) => {
  if (!dsn) {
    console.warn('Error logging DSN not provided. Using console logging only.')
    return
  }

  // Sentry initialization (install @sentry/react first)
  /*
  import * as Sentry from '@sentry/react'
  
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
  */
}

/**
 * Log error to console and external service
 */
export const logError = (
  error: Error,
  additionalInfo?: Record<string, any>
) => {
  const errorLog: ErrorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    additionalInfo,
  }

  // Console logging
  console.error('Error logged:', errorLog)

  // Send to external service (Sentry, LogRocket, etc.)
  // Sentry.captureException(error, { extra: additionalInfo })

  // Store in localStorage for debugging (limit to last 10 errors)
  try {
    const storedErrors = JSON.parse(
      localStorage.getItem('error_logs') || '[]'
    )
    storedErrors.push(errorLog)
    if (storedErrors.length > 10) storedErrors.shift()
    localStorage.setItem('error_logs', JSON.stringify(storedErrors))
  } catch (e) {
    console.warn('Failed to store error log:', e)
  }
}

/**
 * Log API errors
 */
export const logAPIError = (
  endpoint: string,
  status: number,
  message: string
) => {
  const error = new Error(`API Error: ${endpoint} - ${status} - ${message}`)
  logError(error, {
    type: 'api_error',
    endpoint,
    status,
  })
}

/**
 * Log network errors
 */
export const logNetworkError = (url: string, error: Error) => {
  logError(error, {
    type: 'network_error',
    url,
  })
}

/**
 * Get stored error logs (for debugging)
 */
export const getErrorLogs = (): ErrorLog[] => {
  try {
    return JSON.parse(localStorage.getItem('error_logs') || '[]')
  } catch {
    return []
  }
}

/**
 * Clear error logs
 */
export const clearErrorLogs = () => {
  localStorage.removeItem('error_logs')
}

/**
 * Global error handler
 */
export const setupGlobalErrorHandlers = () => {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(event.reason), {
      type: 'unhandled_rejection',
    })
  })

  // Catch global errors
  window.addEventListener('error', (event) => {
    logError(event.error || new Error(event.message), {
      type: 'global_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })
}
