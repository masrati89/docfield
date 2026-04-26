export interface DebugLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'navigation' | 'click';
  category: string;
  message: string;
  data?: Record<string, unknown>;
}

class DebugLogger {
  private logs: DebugLog[] = [];
  private maxLogs = 100;
  private listeners: ((logs: DebugLog[]) => void)[] = [];

  log(
    level: DebugLog['level'],
    category: string,
    message: string,
    data?: Record<string, unknown>
  ) {
    const newLog: DebugLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString('he-IL'),
      level,
      category,
      message,
      data,
    };

    this.logs.unshift(newLog);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Notify listeners
    this.listeners.forEach((cb) => cb(this.logs));

    // Also log to console
    const style = this.getConsoleStyle(level);
    console.warn(`%c[${category}]`, style, message, data || '');
  }

  private getConsoleStyle(level: DebugLog['level']): string {
    const styles: Record<DebugLog['level'], string> = {
      info: 'color: #1B7A44; font-weight: bold;',
      warn: 'color: #C8952E; font-weight: bold;',
      error: 'color: #d32f2f; font-weight: bold;',
      navigation: 'color: #0288d1; font-weight: bold;',
      click: 'color: #7b1fa2; font-weight: bold;',
    };
    return styles[level];
  }

  subscribe(callback: (logs: DebugLog[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  getLogs(): DebugLog[] {
    return this.logs;
  }

  clear() {
    this.logs = [];
    this.listeners.forEach((cb) => cb(this.logs));
  }
}

export const debugLogger = new DebugLogger();
