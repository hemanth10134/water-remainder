
import React, { useState, useEffect, useCallback } from 'react';
import { ReminderStatus, NotificationPermission, Settings } from './types.ts';
import { WATER_LOG_AMOUNT_ML, DEFAULT_GOAL_ML, REMINDER_INTERVALS_MIN } from './constants.ts';
import { requestPermission, sendNotification } from './services/notificationService.ts';

import Header from './components/Header.tsx';
import WaterProgress from './components/WaterProgress.tsx';
import LogButton from './components/LogButton.tsx';
import Controls from './components/Controls.tsx';
import HydrationTip from './components/HydrationTip.tsx';

const App: React.FC = () => {
  const [status, setStatus] = useState<ReminderStatus>(ReminderStatus.Stopped);
  const [intake, setIntake] = useState<number>(0);
  const [settings, setSettings] = useState<Settings>({
    interval: 60,
    goal: DEFAULT_GOAL_ML,
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(NotificationPermission.Default);
  const [timeLeft, setTimeLeft] = useState<number>(settings.interval * 60);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission as NotificationPermission);
    }
  }, []);

  const handleReminder = useCallback(() => {
    sendNotification('Time to Hydrate!', `It's time for your water break. Stay refreshed!`);
  }, []);

  const startTimer = useCallback(() => {
    if (timerId) clearInterval(timerId);
    setStatus(ReminderStatus.Running);
    setTimeLeft(settings.interval * 60);
    const newTimerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          handleReminder();
          return settings.interval * 60;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimerId(newTimerId);
  }, [settings.interval, handleReminder, timerId]);

  const stopTimer = useCallback(() => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setStatus(ReminderStatus.Stopped);
  }, [timerId]);

  const handleStartStop = () => {
    if (status === ReminderStatus.Running) {
      stopTimer();
    } else {
      if(notificationPermission !== NotificationPermission.Granted) {
        alert("Please enable notifications to receive reminders.");
      }
      startTimer();
    }
  };

  const handleLogWater = () => {
    setIntake(prev => {
        const newIntake = prev + WATER_LOG_AMOUNT_ML;
        return newIntake >= settings.goal ? settings.goal : newIntake;
    });
    // If timer is running, reset it after logging water
    if(status === ReminderStatus.Running) {
        startTimer();
    }
  };

  const handleIntervalChange = (newInterval: number) => {
    setSettings(prev => ({ ...prev, interval: newInterval }));
    if (status === ReminderStatus.Running) {
      stopTimer();
      // We will let user restart manually after changing interval to avoid confusion.
    } else {
      setTimeLeft(newInterval * 60);
    }
  };
  
  const handleRequestPermission = async () => {
    const permission = await requestPermission();
    setNotificationPermission(permission);
    if(permission === NotificationPermission.Granted && status === ReminderStatus.Stopped) {
        // If permission granted, and timer is not running, we can start it.
        // Or just let user click start
    }
  };
  
  const resetApp = () => {
      stopTimer();
      setIntake(0);
      setTimeLeft(settings.interval * 60);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 text-white font-sans antialiased">
      <div className="w-full max-w-sm mx-auto flex flex-col h-full">
        <Header onReset={resetApp} />
        
        <main className="flex-grow flex flex-col items-center justify-center space-y-8 my-8">
          <WaterProgress intake={intake} goal={settings.goal} timeLeft={timeLeft} status={status} />
          <LogButton onLog={handleLogWater} disabled={intake >= settings.goal} />
        </main>
        
        <footer className="space-y-6">
          <Controls 
            status={status}
            interval={settings.interval}
            intervals={REMINDER_INTERVALS_MIN}
            onToggle={handleStartStop}
            onIntervalChange={handleIntervalChange}
            notificationPermission={notificationPermission}
            onRequestPermission={handleRequestPermission}
          />
          <HydrationTip />
        </footer>
      </div>
    </div>
  );
};

export default App;
