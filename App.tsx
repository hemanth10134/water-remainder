import React, { useState, useEffect, useCallback } from 'react';
import { ReminderStatus, NotificationPermission, Settings } from './types';
import { WATER_LOG_AMOUNT_ML, DEFAULT_GOAL_ML, REMINDER_INTERVALS_MIN } from './constants';
import { requestPermission, sendNotification } from './services/notificationService';
import { getPersonalizedGoal, getMotivationalCompliment } from './services/geminiService';
import { initDB, getTodaysIntake, addWaterLog, clearAllLogs } from './services/dbService';
import { SettingsIcon, WaterDropIcon, PlusCircleIcon, BarChartIcon } from './components/icons';

import WaterProgress from './components/WaterProgress';
import HydrationTip from './components/HydrationTip';
import GoalPersonalization from './components/GoalPersonalization';
import Clock from './components/Clock';
import SettingsModal from './components/SettingsModal';
import CustomLogModal from './components/CustomLogModal';
import IOSInstallPrompt from './components/IOSInstallPrompt';
import ComplimentToast from './components/ComplimentToast';
import WeeklyReportModal from './components/WeeklyReportModal';


type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [status, setStatus] = useState<ReminderStatus>(ReminderStatus.Stopped);
  const [intake, setIntake] = useState<number>(0);
  const [settings, setSettings] = useState<Settings>({
    interval: 60,
    goal: DEFAULT_GOAL_ML,
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(NotificationPermission.Default);
  const [nextReminderTimestamp, setNextReminderTimestamp] = useState<number | null>(null);
  const [timeLeftForDisplay, setTimeLeftForDisplay] = useState<number>(0);

  const [logAmount, setLogAmount] = useState<number>(WATER_LOG_AMOUNT_ML);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomLogOpen, setIsCustomLogOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCalculatingGoal, setIsCalculatingGoal] = useState(false);
  const [goalError, setGoalError] = useState<string | null>(null);
  const [key, setKey] = useState(0); 
  const [theme, setTheme] = useState<Theme>('dark');
  const [showIOSInstallPrompt, setShowIOSInstallPrompt] = useState(false);
  const [compliment, setCompliment] = useState<string>('');


  // PWA, Theme, and Data initialization
  useEffect(() => {
    // Load data from DB
    const loadData = async () => {
      await initDB();
      const todayIntake = await getTodaysIntake();
      setIntake(todayIntake);
    };
    loadData();
    
    // Only show personalization on first load if API key exists
    const hasSeenPersonalization = localStorage.getItem('hasSeenPersonalization');
    if (!hasSeenPersonalization && process.env.API_KEY) {
      setIsGoalModalOpen(true);
      localStorage.setItem('hasSeenPersonalization', 'true');
    }
    
    // Load theme from local storage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
        setTheme(savedTheme);
    }

    // Check for iOS PWA install prompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const hasSeenInstallPrompt = localStorage.getItem('hasSeenIOSInstallPrompt');

    if (isIOS && !isStandalone && !hasSeenInstallPrompt) {
        setShowIOSInstallPrompt(true);
    }

  }, []);

  // Update DOM and local storage when theme changes
  useEffect(() => {
      if(theme === 'dark') {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }

  // Set initial notification permission status
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission as NotificationPermission);
    }
  }, []);
  
  // Robust timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (status === ReminderStatus.Running && nextReminderTimestamp) {
        const handleReminder = () => {
            sendNotification('💧 Time to Hydrate!', `It's time for your water break. A quick glass will keep you going!`);
            // Set the next reminder
            setNextReminderTimestamp(Date.now() + settings.interval * 60 * 1000);
        };

        const remainingTime = nextReminderTimestamp - Date.now();
        if (remainingTime > 0) {
            timer = setTimeout(handleReminder, remainingTime);
        } else {
            // If the time has already passed, trigger immediately and set the next one.
            handleReminder();
        }
    }

    return () => {
        if (timer) clearTimeout(timer);
    };
  }, [status, nextReminderTimestamp, settings.interval]);

  // UI Countdown timer
  useEffect(() => {
    let animationFrameId: number;

    const updateCountdown = () => {
        if (status === ReminderStatus.Running && nextReminderTimestamp) {
            const remaining = Math.max(0, nextReminderTimestamp - Date.now());
            setTimeLeftForDisplay(Math.round(remaining / 1000));
        }
        animationFrameId = requestAnimationFrame(updateCountdown);
    };

    if (status === ReminderStatus.Running) {
        animationFrameId = requestAnimationFrame(updateCountdown);
    } else {
        setTimeLeftForDisplay(settings.interval * 60);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [status, nextReminderTimestamp, settings.interval]);

  const startTimer = () => {
    setStatus(ReminderStatus.Running);
    setNextReminderTimestamp(Date.now() + settings.interval * 60 * 1000);
  };

  const stopTimer = () => {
    setStatus(ReminderStatus.Stopped);
    setNextReminderTimestamp(null);
  };

  const handleStartStop = () => {
    if (status === ReminderStatus.Running) {
      stopTimer();
    } else {
      if(notificationPermission !== NotificationPermission.Granted) {
        alert("Please enable notifications to receive reminders. If you are on iOS, add the app to your Home Screen first.");
        return;
      }
      startTimer();
    }
  };

  const fetchAndSetCompliment = useCallback(async () => {
    if (!process.env.API_KEY) return;
    try {
        const newCompliment = await getMotivationalCompliment();
        setCompliment(newCompliment);
    } catch (error) {
        console.error("Failed to fetch compliment:", error);
        // Fail silently and don't show an error to the user
    }
  }, []);

  const handleLogWater = async (amount: number) => {
    if (amount <= 0) return;
    await addWaterLog(amount);
    setIntake(prev => {
        const newIntake = prev + amount;
        if (newIntake >= settings.goal) {
            stopTimer();
            return settings.goal;
        }
        return newIntake;
    });
    setKey(prev => prev + 1);
    fetchAndSetCompliment();
    if(status === ReminderStatus.Running) {
        // Reset timer on log
        startTimer();
    }
  };

  const handleIntervalChange = (newInterval: number) => {
    setSettings(prev => ({ ...prev, interval: newInterval }));
    if (status === ReminderStatus.Running) {
      // Restart timer with new interval
      setNextReminderTimestamp(Date.now() + newInterval * 60 * 1000);
    }
    setTimeLeftForDisplay(newInterval * 60);
  };

  const handleLogAmountChange = (newAmount: number) => {
    if (!isNaN(newAmount) && newAmount >= 0) {
        setLogAmount(newAmount);
    }
  };

  const handleGoalChange = (newGoal: number) => {
    if (!isNaN(newGoal) && newGoal > 0) {
      setSettings(prev => ({ ...prev, goal: newGoal }));
      if(intake >= newGoal) {
          stopTimer();
      }
    }
  };
  
  const handleRequestPermission = async () => {
    const permission = await requestPermission();
    setNotificationPermission(permission);
     if (permission === NotificationPermission.Granted && status === ReminderStatus.Stopped) {
        // If permission is granted, and timer isn't running, prompt to start.
        // Or just let the user start it manually via the button.
    }
  };
  
  const handlePersonalizeGoal = async ({ weight, age, gender }: { weight: number; age: number; gender: string }) => {
    setIsCalculatingGoal(true);
    setGoalError(null);
    try {
        const newGoal = await getPersonalizedGoal(weight, age, gender);
        handleGoalChange(newGoal);
        setIsGoalModalOpen(false);
    } catch (error: any) {
        setGoalError(error.message || 'An unknown error occurred.');
    } finally {
        setIsCalculatingGoal(false);
    }
  };

  const resetApp = async () => {
      stopTimer();
      await clearAllLogs();
      setIntake(0);
      setSettings(prev => ({...prev, goal: DEFAULT_GOAL_ML, interval: 60 }));
      setLogAmount(WATER_LOG_AMOUNT_ML);
      setTimeLeftForDisplay(60 * 60);
      setIsSettingsOpen(false);
  }
  
  const handleTestNotification = () => {
    if (notificationPermission !== NotificationPermission.Granted) {
        alert("Please grant notification permissions first. On iOS, you must add the app to your Home Screen.");
        return;
    }
    sendNotification("💧 Test Notification", "If you see this, notifications are working correctly!");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-[var(--text-primary)] font-sans antialiased overflow-hidden">
        <ComplimentToast message={compliment} onClear={() => setCompliment('')} />
        <IOSInstallPrompt 
            isOpen={showIOSInstallPrompt}
            onClose={() => {
                setShowIOSInstallPrompt(false);
                localStorage.setItem('hasSeenIOSInstallPrompt', 'true');
            }}
        />

       {process.env.API_KEY && (
        <GoalPersonalization 
            isOpen={isGoalModalOpen}
            isLoading={isCalculatingGoal}
            error={goalError}
            onSubmit={handlePersonalizeGoal}
            onClose={() => setIsGoalModalOpen(false)}
        />
       )}
      
       <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            status={status}
            interval={settings.interval}
            intervals={REMINDER_INTERVALS_MIN}
            onToggle={handleStartStop}
            onIntervalChange={handleIntervalChange}
            notificationPermission={notificationPermission}
            onRequestPermission={handleRequestPermission}
            onTestNotification={handleTestNotification}
            onPersonalizeClick={() => {
                setIsSettingsOpen(false);
                setIsGoalModalOpen(true);
            }}
            logAmount={logAmount}
            onLogAmountChange={handleLogAmountChange}
            goal={settings.goal}
            onGoalChange={handleGoalChange}
            onReset={resetApp}
            theme={theme}
            onToggleTheme={toggleTheme}
        />

        <CustomLogModal 
            isOpen={isCustomLogOpen}
            onClose={() => setIsCustomLogOpen(false)}
            onLog={(amount) => {
                handleLogWater(amount);
                setIsCustomLogOpen(false);
            }}
        />

        <WeeklyReportModal 
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            goal={settings.goal}
        />

        <header className="absolute top-0 left-0 right-0 p-6 z-10">
            <Clock timeLeft={timeLeftForDisplay} status={status} />
        </header>

        <main className="w-full h-full flex items-center justify-center">
            <div className="relative w-[340px] h-[340px] flex items-center justify-center">
                <WaterProgress
                    key={key}
                    intake={intake}
                    goal={settings.goal}
                    onLog={() => handleLogWater(logAmount)}
                    disabled={intake >= settings.goal || logAmount <= 0}
                />
                 {/* Satellite Pods */}
                <div className="satellite-pod top-0 -left-4">
                     <HydrationTip />
                </div>
                <div className="satellite-pod top-0 -right-4">
                    <button onClick={() => setIsSettingsOpen(true)} className="w-full h-full rounded-full floating-pod flex items-center justify-center" aria-label="Settings">
                        <SettingsIcon className="w-8 h-8 text-[var(--text-secondary)]" />
                    </button>
                </div>
                <div className="satellite-pod bottom-0 -left-4">
                    <button onClick={() => setIsCustomLogOpen(true)} className="w-full h-full rounded-full floating-pod flex items-center justify-center" aria-label="Log custom amount">
                        <PlusCircleIcon className="w-8 h-8 text-[var(--text-secondary)]" />
                    </button>
                </div>
                 <div className="satellite-pod bottom-0 -right-4">
                    <button onClick={() => setIsReportOpen(true)} className="w-full h-full rounded-full floating-pod flex items-center justify-center" aria-label="View weekly report">
                        <BarChartIcon className="w-8 h-8 text-[var(--text-secondary)]" />
                    </button>
                </div>
            </div>
        </main>
    </div>
  );
};

export default App;