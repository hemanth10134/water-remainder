import React, { useState, useEffect } from 'react';
import { DailyReportData } from '../types';
import { getWeeklyReportData } from '../services/dbService';
import { LoaderIcon } from './icons';

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: number;
}

const Chart: React.FC<{ data: DailyReportData[] }> = ({ data }) => {
    const chartHeight = 200;
    const chartWidth = 320;
    const barWidth = 30;
    const barMargin = 16;
    const maxIntake = Math.max(...data.map(d => d.intake), data[0]?.goal || 3000) * 1.1;

    if (!data.length) {
        return <div className="h-[250px] flex items-center justify-center text-[var(--text-secondary)]">No data for the past week.</div>;
    }

    return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" aria-labelledby="chart-title" role="graphics-document">
            <title id="chart-title">Weekly Water Intake Report</title>
            {/* Goal Line */}
            <g>
                <line
                    x1="0"
                    y1={chartHeight - (data[0].goal / maxIntake * chartHeight)}
                    x2={chartWidth}
                    y2={chartHeight - (data[0].goal / maxIntake * chartHeight)}
                    stroke="var(--glow-color)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.6"
                />
                <text 
                    x={chartWidth - 5} 
                    y={chartHeight - (data[0].goal / maxIntake * chartHeight) - 5} 
                    textAnchor="end" 
                    fontSize="10" 
                    fill="var(--text-secondary)"
                    fontWeight="500"
                >
                    Goal
                </text>
            </g>
            
            {data.map((item, index) => {
                const barHeight = item.intake > 0 ? (item.intake / maxIntake) * chartHeight : 0;
                const x = index * (barWidth + barMargin) + (barMargin / 2);
                const y = chartHeight - barHeight;

                return (
                    <g key={item.day} role="listitem" aria-label={`${item.day}: ${item.intake}ml out of ${item.goal}ml goal`}>
                        <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            fill="var(--glow-color)"
                            rx="4"
                            ry="4"
                        >
                             <animate attributeName="height" from="0" to={barHeight} dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                             <animate attributeName="y" from={chartHeight} to={y} dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                        </rect>
                        <text x={x + barWidth / 2} y={chartHeight - 5} textAnchor="middle" fontSize="12" fill="var(--text-secondary)" fontWeight="600">{item.day}</text>
                    </g>
                );
            })}
        </svg>
    );
};

const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({ isOpen, onClose, goal }) => {
  const [reportData, setReportData] = useState<DailyReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getWeeklyReportData(goal)
        .then(data => {
          setReportData(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to load weekly report:", err);
          setIsLoading(false);
        });
    }
  }, [isOpen, goal]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="report-title">
      <div className="glass-modal rounded-3xl shadow-2xl p-6 w-full max-w-md text-center transform transition-all" onClick={e => e.stopPropagation()}>
        <h3 id="report-title" className="text-2xl font-bold text-[var(--text-primary)] mb-2">Weekly Report</h3>
        <p className="text-[var(--text-secondary)] mb-6">Your hydration consistency for the last 7 days.</p>
        
        <div className="min-h-[250px] flex items-center justify-center">
            {isLoading ? <LoaderIcon className="w-8 h-8 text-[var(--glow-color)]" /> : <Chart data={reportData} />}
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 bg-[var(--glow-color)] text-white font-bold py-3 px-10 rounded-full hover:opacity-90 transition-opacity"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WeeklyReportModal;