
import React from 'react';
import { ReminderStatus, NotificationPermission } from '../types.ts';

interface ControlsProps {
  status: ReminderStatus;
  interval: number;
  intervals: number[];
  onToggle: () => void;
  onIntervalChange: (interval: number) => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
}

const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);

const BellOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="m18 8-9.34 9.34"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

const Controls: React.FC<ControlsProps> = ({ status, interval, intervals, onToggle, onIntervalChange, notificationPermission, onRequestPermission }) => {
  const isRunning = status === ReminderStatus.Running;

  const renderNotificationStatus = () => {
    switch (notificationPermission) {
      case NotificationPermission.Granted:
        return <div className="flex items-center text-green-400"><BellIcon className="w-4 h-4 mr-2" /> Enabled</div>;
      case NotificationPermission.Denied:
        return <div className="flex items-center text-red-400"><BellOffIcon className="w-4 h-4 mr-2" /> Denied</div>;
      default:
        return <button onClick={onRequestPermission} className="text-yellow-400 hover:text-yellow-300">Enable Notifications</button>;
    }
  };

  return (
    <div className="w-full bg-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex justify-between items-center">
            <label htmlFor="interval-select" className="font-medium text-slate-300">Remind me every</label>
            <select
                id="interval-select"
                value={interval}
                onChange={(e) => onIntervalChange(Number(e.target.value))}
                className="bg-slate-700 text-white border-none rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
                {intervals.map(val => (
                    <option key={val} value={val}>{val} min</option>
                ))}
            </select>
        </div>
        
        <div className="flex justify-between items-center">
            <span className="font-medium text-slate-300">Notifications</span>
            <div className="text-sm">{renderNotificationStatus()}</div>
        </div>

        <button
            onClick={onToggle}
            className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
                isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
        >
            {isRunning ? 'Stop Reminders' : 'Start Reminders'}
        </button>
    </div>
  );
};

export default Controls;
