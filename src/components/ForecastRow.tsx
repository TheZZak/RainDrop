import React from 'react';
import { IconType } from 'react-icons';

interface ForecastRowProps {
	dayLabel: string;
	Icon: IconType;
	min: number;
	max: number;
	minAll: number;
	maxAll: number;
	precipPct?: number;
}

function tempToHue(temp: number, minAll: number, maxAll: number): number {
	const span = Math.max(1, maxAll - minAll);
	const t = (temp - minAll) / span; // 0..1
	// 210 (cool blue) -> 35 (warm orange)
	return 210 - (210 - 35) * Math.min(1, Math.max(0, t));
}

const ForecastRow: React.FC<ForecastRowProps> = ({ dayLabel, Icon, min, max, minAll, maxAll, precipPct }) => {
	const span = maxAll - minAll || 1;
	const left = ((min - minAll) / span) * 100;
	const right = 100 - ((max - minAll) / span) * 100;
	const hasPrecip = typeof precipPct === 'number' && !Number.isNaN(precipPct);
	const isZeroPrecip = hasPrecip && (precipPct as number) <= 0;
	const hueMin = tempToHue(min, minAll, maxAll);
	const hueMax = tempToHue(max, minAll, maxAll);
	const gradient = `linear-gradient(to right, hsl(${hueMin} 90% 60%), hsl(${hueMax} 90% 55%))`;
	const ariaPrecip = hasPrecip ? `, ${Math.round(precipPct as number)}% chance of precipitation` : '';
	return (
		<div className="grid grid-cols-[1fr_auto_auto_minmax(0,1fr)_auto] items-center gap-3 py-2 text-[13px]" aria-label={`${dayLabel}: low ${Math.round(min)}°, high ${Math.round(max)}°${ariaPrecip}`}>
			<div className="text-slate-200 font-medium">{dayLabel}</div>
			<div className="flex flex-col items-center -my-0.5" title={hasPrecip ? `${Math.round(precipPct as number)}% chance of precipitation` : 'Precipitation probability unavailable'}>
				<Icon className="text-2xl" />
				{hasPrecip && (
					<div className={`text-[11px] leading-3 ${isZeroPrecip ? 'text-slate-400' : 'text-sky-300 font-semibold'}`}>
						{Math.round(precipPct as number)}%
					</div>
				)}
			</div>
			<div className="text-slate-300 tabular-nums">{Math.round(min)}°</div>
			<div className="h-2 rounded-full bg-white/10 relative" title={`Low ${Math.round(min)}° — High ${Math.round(max)}°`}>
				<div
					className="absolute top-0 bottom-0 rounded-full"
					style={{ left: `${left}%`, right: `${right}%`, background: gradient }}
				/>
			</div>
			<div className="text-slate-300 tabular-nums">{Math.round(max)}°</div>
		</div>
	);
};

export default ForecastRow;
