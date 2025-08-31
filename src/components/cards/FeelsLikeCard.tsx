import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { formatTemp } from '@/lib/formatters';
import { usePreferences } from '@/store/usePreferences';

const FeelsLikeCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast } = useWeatherData(lat, lon);
	const { temperatureUnit } = usePreferences();
	const cur = forecast.data?.current;
	const feels = cur?.apparent_temperature ?? null;
	let reason = '—';
	if (cur) {
		const wind = cur.wind_speed_10m ?? 0;
		const hum = cur.relative_humidity_2m ?? 0;
		reason = wind > 8 ? 'Wind makes it feel cooler' : hum > 70 ? 'Humidity makes it feel warmer' : 'Similar to actual';
	}
	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Feels Like</div>
			{forecast.isLoading ? (
				<div className="mt-3 h-8 rounded bg-white/10 animate-pulse" />
			) : forecast.isError ? (
				<div className="mt-3 text-sm text-red-300">Failed to load</div>
			) : (
				<>
					<div className="mt-3 text-2xl font-medium">{feels != null ? formatTemp(feels, temperatureUnit) : '—'}</div>
					<div className="mt-1 text-xs text-slate-400">{reason}</div>
				</>
			)}
		</div>
	);
};

export default FeelsLikeCard;
