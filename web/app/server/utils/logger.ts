import pino from 'pino'

/**
 * Create a logger instance configured for the environment
 * - Development: Pretty-printed, human-readable logs with colors
 * - Production: Structured JSON logs for aggregation/analysis
 *
 * Auto-imported in Nuxt server routes/middleware/plugins
 */
export function createLogger(name?: string) {
  const isDev = process.env.NODE_ENV === 'development'

  return pino({
    name: name || 'cc-leaderboard',
    level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),

    // Development: use pino-pretty for human-readable output
    transport: isDev ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        singleLine: false,
        messageFormat: '{name} [{context}] {msg}',
      }
    } : undefined,

    // Production: structured JSON
    formatters: !isDev ? {
      level: (label) => ({ level: label }),
      bindings: (bindings) => ({
        pid: bindings.pid,
        host: bindings.hostname,
      }),
    } : undefined,
  })
}

// Default logger instance
export const logger = createLogger()

/**
 * Create a child logger with additional context
 */
export function getLogger(context: string, extra?: Record<string, unknown>) {
  return logger.child({ context, ...extra })
}

/**
 * Log HTTP request details
 */
export function logRequest(event: any, extra?: Record<string, unknown>) {
  const log = getLogger('http')
  log.info({
    method: event.method,
    path: event.path,
    url: event.node.req.url,
    ip: event.node.req.headers['x-forwarded-for'] || event.node.req.socket.remoteAddress,
    userAgent: event.node.req.headers['user-agent'],
    ...extra,
  }, 'Incoming request')
}

/**
 * Log HTTP response details
 */
export function logResponse(event: any, statusCode: number, duration?: number, extra?: Record<string, unknown>) {
  const log = getLogger('http')
  const logData = {
    method: event.method,
    path: event.path,
    statusCode,
    duration: duration ? `${duration}ms` : undefined,
    ...extra,
  }

  if (statusCode >= 500) {
    log.error(logData, 'Request failed with server error')
  } else if (statusCode >= 400) {
    log.warn(logData, 'Request failed with client error')
  } else {
    log.info(logData, 'Request completed successfully')
  }
}

/**
 * Log database operations
 */
export function logDatabase(operation: string, details?: Record<string, unknown>) {
  const log = getLogger('database')
  log.debug({ operation, ...details }, `Database ${operation}`)
}

/**
 * Log authentication events
 */
export function logAuth(event: string, details?: Record<string, unknown>) {
  const log = getLogger('auth')
  log.info({ event, ...details }, `Auth: ${event}`)
}

/**
 * Log errors with full stack trace
 */
export function logError(error: Error | unknown, context?: string, extra?: Record<string, unknown>) {
  const log = context ? getLogger(context) : logger

  if (error instanceof Error) {
    log.error({
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      ...extra,
    }, error.message)
  } else {
    log.error({ error, ...extra }, 'Unknown error occurred')
  }
}
