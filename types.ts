
export enum ReminderStatus {
  Stopped = 'Stopped',
  Running = 'Running',
}

export enum NotificationPermission {
  Default = 'default',
  Granted = 'granted',
  Denied = 'denied',
}

export interface Settings {
  interval: number; // in minutes
  goal: number; // in ml
}

export interface StoredState {
  intake: number;
  settings: Settings;
}
