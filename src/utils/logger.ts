// Debug logger utility

import { DEBUG_MODE } from './constants';

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  SUCCESS = 'success',
  TELEGRAM = 'telegram',
  API = 'api',
  USER = 'user',
  INIT = 'init',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class DebugLogger {
  private enabled: boolean;
  private history: LogEntry[] = [];
  private maxHistorySize = 1000;

  constructor() {
    this.enabled = DEBUG_MODE;
  }

  private getIcon(level: LogLevel): string {
    const icons: Record<LogLevel, string> = {
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌',
      [LogLevel.SUCCESS]: '✅',
      [LogLevel.TELEGRAM]: '✈️',
      [LogLevel.API]: '🌐',
      [LogLevel.USER]: '👤',
      [LogLevel.INIT]: '🚀',
    };
    return icons[level] || 'ℹ️';
  }

  private getStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      [LogLevel.INFO]: 'color: #2196F3',
      [LogLevel.WARN]: 'color: #FF9800',
      [LogLevel.ERROR]: 'color: #F44336',
      [LogLevel.SUCCESS]: 'color: #4CAF50',
      [LogLevel.TELEGRAM]: 'color: #0088cc',
      [LogLevel.API]: 'color: #9C27B0',
      [LogLevel.USER]: 'color: #00BCD4',
      [LogLevel.INIT]: 'color: #FFC107',
    };
    return styles[level] || '';
  }

  log(message: string, level: LogLevel = LogLevel.INFO, data?: any): void {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const prefix = `[JD Auction ${timestamp}]`;
    const icon = this.getIcon(level);
    const style = this.getStyle(level);

    console.log(`%c${prefix} ${icon} ${message}`, style, data || '');

    // Store in history
    const entry: LogEntry = { timestamp, level, message, data };
    this.history.push(entry);

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }
  }

  info(message: string, data?: any): void {
    this.log(message, LogLevel.INFO, data);
  }

  warn(message: string, data?: any): void {
    this.log(message, LogLevel.WARN, data);
  }

  error(message: string, data?: any): void {
    this.log(message, LogLevel.ERROR, data);
  }

  success(message: string, data?: any): void {
    this.log(message, LogLevel.SUCCESS, data);
  }

  telegram(message: string, data?: any): void {
    this.log(message, LogLevel.TELEGRAM, data);
  }

  api(message: string, data?: any): void {
    this.log(message, LogLevel.API, data);
  }

  user(message: string, data?: any): void {
    this.log(message, LogLevel.USER, data);
  }

  init(message: string, data?: any): void {
    this.log(message, LogLevel.INIT, data);
  }

  getHistory(): LogEntry[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  exportHistory(): string {
    const logs = this.history.map(log =>
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message} ${
        log.data ? JSON.stringify(log.data) : ''
      }`
    ).join('\n');

    return logs;
  }

  downloadHistory(): void {
    const logs = this.exportHistory();
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jd-auction-debug-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.success('Debug logs exported');
  }

  table(data: any[]): void {
    if (!this.enabled || !data || !Array.isArray(data)) return;
    console.table(data);
  }

  group(label: string): void {
    if (!this.enabled) return;
    console.group(label);
  }

  groupEnd(): void {
    if (!this.enabled) return;
    console.groupEnd();
  }

  time(label: string): void {
    if (!this.enabled) return;
    console.time(label);
  }

  timeEnd(label: string): void {
    if (!this.enabled) return;
    console.timeEnd(label);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const logger = new DebugLogger();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugLogger = logger;
}
