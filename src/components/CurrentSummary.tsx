import React from 'react';
import { weatherCodeToText } from '@/lib/weatherCodes';

interface CurrentSummaryProps {
	code?: number | null;
	isDay?: boolean | null;
	min?: number | null;
	max?: number | null;
	current?: number | null;
}

const CurrentSummary: React.FC<CurrentSummaryProps> = ({ code, isDay, min, max, current }) => {
	const label = code != null ? weatherCodeToText(code, (isDay ?? 1) === 1) : '—';
	const pct = min != null && max != null && current != null && max > min ? ((current - min) / (max - min)) * 100 : 50;
	return (
		<div className="flex flex-col items-center">
			<div className="text-slate-300 text-sm">{label}</div>
			<div className="mt-1 h-2 w-64 bg-white/10 rounded-full relative">
				<div className="absolute h-2 rounded-full bg-white/60" style={{ left: `${Math.max(0, Math.min(100, pct))}%`, width: 2 }} />
			</div>
			<div className="text-xs text-slate-400 mt-1">{min != null && max != null ? `${Math.round(min)}° — ${Math.round(max)}°` : '—'}</div>
		</div>
	);
};

export default CurrentSummary;
