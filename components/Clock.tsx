import React, { useState, useEffect } from 'react';
import { ReminderStatus } from '../types';

interface ClockProps {
    timeLeft: number;
    status: ReminderStatus;
}

const Clock: React.FC<ClockProps> = ({ timeLeft, status }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).replace(' AM', 'am').replace(' PM', 'pm');
    };
    
    const getReminderText = () => {
        if (status === ReminderStatus.Running) {
            const minutes = Math.ceil(timeLeft / 60);
            return `Next reminder in ${minutes} min`;
        }
        return 'Reminders are paused';
    }

    return (
        <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-[var(--text-primary)] drop-shadow-lg">{formatTime(time)}</h1>
            <p className="text-[var(--text-secondary)] mt-1 text-base">
                {getReminderText()}
            </p>
        </div>
    );
};

export default Clock;