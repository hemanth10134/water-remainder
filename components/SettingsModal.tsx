import React from 'react';
import { ReminderStatus, NotificationPermission } from '../types';
import { BellIcon, BellOffIcon, SparklesIcon, RefreshCwIcon, SunIcon, MoonIcon, SendIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ReminderStatus;
  interval: number;
  intervals: number[];
  onToggle: () => void;
  onIntervalChange: (interval: number) => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
  onTestNotification: () => void;
  onPersonalizeClick: () => void;
  logAmount: number;
  onLogAmountChange: (amount: number) => void;
  goal: number;
  onGoalChange: (goal: number) => void;
  onReset: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const SettingRow: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
  <div className="flex justify-between items-center bg-[var(--input-bg)]/50 p-4 rounded-xl">
    <label className="font-medium text-[var(--text-secondary)]">{label}</label>
    <div>{children}</div>
  </div>
);

const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  const { isOpen, onClose, status, interval, intervals, onToggle, onIntervalChange, notificationPermission, onRequestPermission, onTestNotification, onPersonalizeClick, logAmount, onLogAmountChange, goal, onGoalChange, onReset, theme, onToggleTheme } = props;
  
  const isRunning = status === ReminderStatus.Running;

  const renderNotificationStatus = () => {
    switch (notificationPermission) {
      case NotificationPermission.Granted:
        return (
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-green-500 font-semibold"><BellIcon className="w-5 h-5 mr-1" /> Enabled</div>
            <button onClick={onTestNotification} className="p-2 rounded-full bg-[var(--input-bg)] text-[var(--text-secondary)] hover:bg-[var(--input-bg)]/80" aria-label="Send test notification">
                <SendIcon className="w-4 h-4" />
            </button>
          </div>
        );
      case NotificationPermission.Denied:
        return <div className="flex items-center text-red-500 font-semibold"><BellOffIcon className="w-5 h-5 mr-1" /> Denied</div>;
      default:
        return <button onClick={onRequestPermission} className="font-semibold text-yellow-500 hover:text-yellow-400">Enable</button>;
    }
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-40 flex items-end" onClick={onClose} role="dialog" aria-modal="true">
      <div
        onClick={e => e.stopPropagation()}
        className="settings-modal-content w-full rounded-t-3xl shadow-2xl pt-4 pb-8 px-4 max-h-[90vh] flex flex-col"
      >
        <div className="w-12 h-1.5 bg-[var(--text-secondary)]/50 rounded-full mx-auto mb-4 shrink-0"></div>
        <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-6 shrink-0">Settings</h2>
        
        <div className="flex-grow overflow-y-auto space-y-3 pr-1">
            <SettingRow label="Theme">
              <button onClick={onToggleTheme} className="p-2 rounded-full bg-[var(--input-bg)] text-[var(--text-secondary)]">
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
              </button>
            </SettingRow>

            <SettingRow label="Reminder Interval">
                <div className="flex flex-wrap gap-2 justify-end max-w-[180px]">
                    {intervals.map(val => (
                        <button key={val} onClick={() => onIntervalChange(val)} className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${interval === val ? 'bg-[var(--glow-color)] text-white' : 'bg-[var(--input-bg)] text-[var(--text-secondary)]'}`}>
                            {val}m
                        </button>
                    ))}
                </div>
            </SettingRow>

            <SettingRow label="Default Log (ml)">
                <input
                    type="number"
                    value={logAmount}
                    onChange={(e) => onLogAmountChange(Number(e.target.value))}
                    min="1"
                    className="bg-[var(--input-bg)] text-[var(--text-primary)] w-24 border-none text-right rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--glow-color)]"
                    aria-label="Custom water log amount in milliliters"
                />
            </SettingRow>
            
            <SettingRow label="Daily Goal (ml)">
                 <input
                    type="number"
                    value={goal}
                    onChange={(e) => onGoalChange(Number(e.target.value))}
                    min="1"
                    step="50"
                    className="bg-[var(--input-bg)] text-[var(--text-primary)] w-24 border-none text-right rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--glow-color)]"
                    aria-label="Custom daily water intake goal in milliliters"
                />
            </SettingRow>
            
            <div className="bg-[var(--input-bg)]/50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                    <label className="font-medium text-[var(--text-secondary)]">Notifications</label>
                    <div className="text-sm">{renderNotificationStatus()}</div>
                </div>
                 <p className="text-xs text-[var(--text-secondary)]/80 text-center leading-tight">
                    On iOS, notifications only work if the app is added to your Home Screen.
                </p>
            </div>


            {process.env.API_KEY && (
                <button
                    onClick={onPersonalizeClick}
                    className="w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-[var(--text-primary)] bg-[var(--input-bg)]/80 hover:bg-[var(--input-bg)] transition-colors"
                    aria-label="Personalize hydration goal with AI"
                >
                    <SparklesIcon className="w-5 h-5 mr-2 text-[var(--glow-color)]" />
                    Personalize with AI
                </button>
            )}

            <button
                onClick={onReset}
                className="w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                aria-label="Reset all progress"
            >
                <RefreshCwIcon className="w-5 h-5 mr-2" />
                Reset Progress
            </button>
        </div>

        <button
            onClick={onToggle}
            className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg text-white transition-colors shadow-lg ${
                isRunning ? 'bg-red-500/80 hover:bg-red-500' : 'bg-green-500/80 hover:bg-green-500'
            }`}
        >
            {isRunning ? 'Stop Reminders' : 'Start Reminders'}
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;