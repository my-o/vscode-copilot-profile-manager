import * as vscode from 'vscode';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const LOG_LEVEL_PRIORITY = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

export class Logger {
  private channel: vscode.OutputChannel;
  private currentLogLevel: LogLevel;

  constructor(channel: vscode.OutputChannel) {
    this.channel = channel;
    this.currentLogLevel = Logger.getConfigLogLevel();

    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('copilot-profile-manager.logLevel')) {
        this.currentLogLevel = Logger.getConfigLogLevel();
        this.info(`Log level changed to ${this.currentLogLevel}`);
      }
    });
  }

  debug(message: string, category?: string): void {
    this.log(LogLevel.DEBUG, message, category);
  }

  info(message: string, category?: string): void {
    this.log(LogLevel.INFO, message, category);
  }

  warn(message: string, category?: string): void {
    this.log(LogLevel.WARN, message, category);
  }

  error(message: string, error?: unknown, category?: string): void {
    let fullMessage = message;

    if (error) {
      if (error instanceof Error) {
        fullMessage += `: ${error.message}`;
        if (error.stack) {
          fullMessage += `\n${error.stack}`;
        }
      } else {
        fullMessage += `: ${String(error)}`;
      }
    }

    this.log(LogLevel.ERROR, fullMessage, category);
  }

  private static getConfigLogLevel(): LogLevel {
    const config = vscode.workspace.getConfiguration('copilot-profile-manager');
    const configLevel = config.get<string>('logLevel', 'info');

    switch (configLevel.toLowerCase()) {
      case 'debug':
        return LogLevel.DEBUG;
      case 'warn':
        return LogLevel.WARN;
      case 'error':
        return LogLevel.ERROR;
      case 'info':
      default:
        return LogLevel.INFO;
    }
  }

  private log(level: LogLevel, message: string, category?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = this.getTimestamp();
    const categoryTag = category ? ` [${category}]` : '';
    const formattedMessage = `${timestamp} [${level}]${categoryTag} ${message}`;
    this.channel.appendLine(formattedMessage);

    if (level === LogLevel.ERROR) {
      console.error(formattedMessage);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.currentLogLevel];
  }

  private getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
}
