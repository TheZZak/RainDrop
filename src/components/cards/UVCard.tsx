import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';

function uvColor(v: number) {
	if (v <= 2) return '#22c55e';
	if (v <= 5) return '#eab308';
	if (v <= 7) return '#f97316';
	if (v <= 10) return '#ef4444';
	return '#a21caf';
}

const UVCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast } = useWeatherData(lat, lon);
	const uv = forecast.data?.hourly?.uv_index?.[0] ?? null;
	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">UV Index</div>
			{forecast.isLoading ? (
				<div className="mt-3 h-16 rounded bg-white/10 animate-pulse" />
			) : forecast.isError ? (
				<div className="mt-3 text-sm text-red-300">Failed to load</div>
			) : (
				<>
					<div className="mt-3 text-2xl font-medium leading-none">{uv ?? '—'}</div>
					<div className="mt-2 h-2 w-full max-w-[220px] rounded-full bg-white/10 overflow-hidden">
						<div className="h-2" style={{ width: `${Math.min(100, ((uv ?? 0) / 11) * 100)}%`, background: uv != null ? uvColor(uv) : 'transparent' }} />
					</div>
					<div className="mt-1 text-xs text-slate-400">Remainder of day</div>
				</>
			)}
		</div>
	);
};

export default UVCard;
