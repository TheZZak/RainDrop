import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { formatTemp, cToF } from '@/lib/formatters';
import { usePreferences } from '@/store/usePreferences';

const FeelsLikeCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { forecast } = useWeatherData(lat, lon);
	const { temperatureUnit } = usePreferences();
	const cur = forecast.data?.current;

	// Bug fix: apparent_temperature might be returned in Celsius regardless of temperature_unit setting
	let feels = cur?.apparent_temperature ?? null;
	const actual = cur?.temperature_2m ?? null;

	// Check if apparent_temperature is in wrong unit by comparing magnitude
	// If actual temp is ~32°F and feels like is ~23, it's likely 23°C that needs conversion
	if (feels != null && actual != null && temperatureUnit === 'f') {
		// If feels like value seems to be in Celsius (much lower than actual F value)
		if (Math.abs(feels - actual) > 30 && feels < 40) {
			feels = cToF(feels);
		}
	}

	let reason = '—';
	if (cur && feels != null && actual != null) {
		const diff = feels - actual;
		const wind = cur.wind_speed_10m ?? 0;
		const hum = cur.relative_humidity_2m ?? 0;

		if (Math.abs(diff) < 1) {
			reason = 'Similar to actual';
		} else if (diff < 0 && wind > 8) {
			reason = 'Wind makes it feel cooler';
		} else if (diff > 0 && hum > 70) {
			reason = 'Humidity makes it feel warmer';
		} else if (diff < 0) {
			reason = 'Feels cooler';
		} else {
			reason = 'Feels warmer';
		}
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