import React from 'react';

interface WaterProgressProps {
  intake: number;
  goal: number;
  onLog: () => void;
  disabled: boolean;
}

const Bubbles: React.FC = () => (
    <>
        {[...Array(8)].map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 80 + 10;
            const delay = Math.random() * 0.8;
            return (
                <div key={i} className="bubble" style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    animationDelay: `${delay}s`,
                }}></div>
            )
        })}
    </>
)

const WaterProgress: React.FC<WaterProgressProps> = ({ intake, goal, onLog, disabled }) => {
  const progress = goal > 0 ? Math.min(intake / goal, 1) : 0;
  const progressPercent = Math.round(progress * 100);

  const glassWidth = 160;
  const glassHeight = 200;
  const topWidth = glassWidth;
  const bottomWidth = glassWidth * 0.75;
  const glassPath = `M 0,0 L ${topWidth},0 L ${topWidth - (topWidth - bottomWidth)/2},${glassHeight} L ${(topWidth - bottomWidth)/2},${glassHeight} Z`;

  const waterHeight = glassHeight * progress;
  const wavePath = `M 0 5 Q 50 15, 100 5 T 200 5 V ${glassHeight} H 0 Z`;
  
  const circumference = 2 * Math.PI * 140; // 2 * pi * radius
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {/* Progress Ring */}
        <svg className="absolute w-full h-full" viewBox="0 0 300 300">
             <circle
                cx="150" cy="150" r="140"
                stroke="var(--pod-bg)"
                strokeWidth="12"
                fill="transparent"
             />
            <circle
                cx="150" cy="150" r="140"
                className="transition-all duration-1000 ease-out"
                stroke="var(--glow-color)"
                strokeWidth="12"
                fill="transparent"
                strokeLinecap="round"
                transform="rotate(-90 150 150)"
                style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset
                }}
            />
        </svg>

        {/* Central Glass */}
        <div className="relative w-[280px] h-[280px] rounded-full floating-pod flex flex-col items-center justify-center animation-float">
            <button 
                onClick={onLog} 
                disabled={disabled} 
                className="relative w-[200px] h-[220px] flex items-center justify-center focus:outline-none group disabled:cursor-not-allowed"
                aria-label={disabled ? "Daily goal reached" : "Log one glass of water"}
            >
                <svg width={glassWidth} height={glassHeight} viewBox={`0 0 ${glassWidth} ${glassHeight}`} className="drop-shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    <defs>
                        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
                        </linearGradient>
                         <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                        <clipPath id="glassClip">
                            <path d={glassPath} />
                        </clipPath>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                    </defs>

                    <g clipPath="url(#glassClip)" className="transition-transform duration-700 ease-out" style={{ transform: `translateY(${glassHeight - waterHeight}px)` }}>
                        <rect x="0" y="0" width={glassWidth} height={glassHeight} fill="url(#waterGradient)" />
                        <g transform={`translate(0, -5)`}>
                            <path d={wavePath} fill="#38bdf8" className="water-wave" style={{width: '200%'}}/>
                            <path d={wavePath} fill="#38bdf8" opacity="0.5" className="water-wave" style={{width: '200%', animationDuration: '3s', animationDirection: 'reverse'}}/>
                        </g>
                    </g>
                    
                    <path d={glassPath} fill="url(#glassGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
                    <path d={`M 20 15 L 30 15 L ${30 + (topWidth - bottomWidth)/2 -10} ${glassHeight-15} L ${20 + (topWidth - bottomWidth)/2 - 10} ${glassHeight-15} Z`} fill="rgba(255,255,255,0.5)" />

                </svg>
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {!disabled && <Bubbles />}
                </div>
            </button>
            <div className="text-center select-none -mt-4">
                <div className="text-[var(--text-primary)] text-3xl font-bold tracking-tight">
                    {progressPercent}<span className="text-2xl font-semibold">%</span>
                </div>
                <div className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider">
                    {intake} / {goal} ml
                </div>
            </div>
        </div>
    </div>
  );
};

export default WaterProgress;