import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { formatTimeShort } from '@/lib/formatters';

const SunCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { astronomy } = useWeatherData(lat, lon);
	const sunrise = astronomy.data?.daily?.sunrise?.[0] ?? null;
	const sunset = astronomy.data?.daily?.sunset?.[0] ?? null;
	const unavailable = astronomy.isError || (!sunrise && !sunset);
	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10" title="Astronomy data may be unavailable for some locations or blocked by extensions">
			<div className="text-sm text-slate-300">Sunrise / Sunset</div>
			{astronomy.isLoading ? (
				<div className="mt-3 h-16 rounded bg-white/10 animate-pulse" />
			) : (
				<div className="mt-3 flex justify-between text-sm">
					<div>Sunrise <span className="text-slate-300">{sunrise ? formatTimeShort(sunrise) : '—'}</span></div>
					<div>Sunset <span className="text-slate-300">{sunset ? formatTimeShort(sunset) : '—'}</span></div>
					{unavailable && <div className="sr-only">Unavailable</div>}
				</div>
			)}
		</div>
	);
};

export default SunCard;
