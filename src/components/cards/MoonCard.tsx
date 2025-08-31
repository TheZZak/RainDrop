import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { formatTimeShort } from '@/lib/formatters';

const MoonCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { astronomy } = useWeatherData(lat, lon);
	const phase = astronomy.data?.daily?.moon_phase?.[0] ?? null;
	const rise = astronomy.data?.daily?.moonrise?.[0] ?? null;
	const set = astronomy.data?.daily?.moonset?.[0] ?? null;
	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10" title="Astronomy data may be unavailable for some locations or blocked by extensions">
			<div className="text-sm text-slate-300">Moon</div>
			{astronomy.isLoading ? (
				<div className="mt-3 h-16 rounded bg-white/10 animate-pulse" />
			) : (
				<div className="mt-3 text-sm">
					<div className="text-slate-200">{phase ?? '—'}</div>
					<div className="text-xs text-slate-400 mt-1">Rise {rise ? formatTimeShort(rise) : '—'} • Set {set ? formatTimeShort(set) : '—'}</div>
				</div>
			)}
		</div>
	);
};

export default MoonCard;
