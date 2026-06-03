/**
 * Production-grade logging utility
 */
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (level === 'error') {
      console.error(formattedMessage, data || '');
      // Integrate with Sentry or similar here in the future
    } else if (level === 'warn') {
      console.warn(formattedMessage, data || '');
    } else if (!IS_PRODUCTION || level === 'info') {
      console.log(formattedMessage, data || '');
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
}

export const logger = new Logger();
