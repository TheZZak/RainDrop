import React, { useMemo } from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { formatTimeShort } from '@/lib/formatters';

// More accurate sunrise/sunset calculation as fallback
function calculateSunTimes(lat: number, lon: number, date: Date = new Date()) {
	const rad = Math.PI / 180;
	const deg = 180 / Math.PI;

	// Julian day calculation
	const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
	const y = date.getFullYear() - a;
	const m = (date.getMonth() + 1) + 12 * a - 3;
	const jd = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

	// Solar declination
	const n = jd - 2451545.0;
	const L = (280.460 + 0.9856474 * n) % 360;
	const g = rad * ((357.528 + 0.9856003 * n) % 360);
	const lambda = rad * (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
	const declination = Math.asin(Math.sin(23.439 * rad) * Math.sin(lambda));

	// Hour angle
	const latRad = lat * rad;
	const cosHourAngle = -Math.tan(latRad) * Math.tan(declination);

	if (cosHourAngle < -1 || cosHourAngle > 1) {
		// Polar day or night
		return { sunrise: null, sunset: null };
	}

	const hourAngle = Math.acos(cosHourAngle) * deg;

	// Calculate sunrise and sunset in UTC
	const solarNoon = 12 - (lon / 15);
	const sunriseUTC = solarNoon - (hourAngle / 15);
	const sunsetUTC = solarNoon + (hourAngle / 15);

	// Convert to local time (approximate using browser timezone)
	const timezoneOffset = date.getTimezoneOffset() / 60;
	const sunrise = sunriseUTC - timezoneOffset;
	const sunset = sunsetUTC - timezoneOffset;

	const formatTime = (hours: number) => {
		let h = Math.floor(hours);
		let m = Math.floor((hours - h) * 60);

		// Handle day overflow
		if (h < 0) h += 24;
		if (h >= 24) h -= 24;
		if (m < 0) m = 0;
		if (m >= 60) m = 59;

		return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
	};

	return {
		sunrise: formatTime(sunrise),
		sunset: formatTime(sunset)
	};
}

const SunCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { astronomy } = useWeatherData(lat, lon);

	// Fallback calculation if API fails
	const fallbackTimes = useMemo(() => {
		if (lat != null && lon != null) {
			return calculateSunTimes(lat, lon);
		}
		return { sunrise: null, sunset: null };
	}, [lat, lon]);

	// Try API data first, then fallback
	const apiSunrise = astronomy.data?.daily?.sunrise?.[0] ?? null;
	const apiSunset = astronomy.data?.daily?.sunset?.[0] ?? null;

	const sunrise = apiSunrise ? formatTimeShort(apiSunrise) : fallbackTimes.sunrise;
	const sunset = apiSunset ? formatTimeShort(apiSunset) : fallbackTimes.sunset;

	const usingFallback = !apiSunrise && !apiSunset && (fallbackTimes.sunrise || fallbackTimes.sunset);

	// Debug logging
	console.log('SunCard Debug:', {
		lat,
		lon,
		isLoading: astronomy.isLoading,
		isError: astronomy.isError,
		error: astronomy.error,
		apiSunrise,
		apiSunset,
		fallbackTimes,
		usingFallback
	});

	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">
				Sunrise / Sunset
				{usingFallback && <span className="text-xs text-slate-400 ml-1">(estimated)</span>}
			</div>
			{astronomy.isLoading ? (
				<div className="mt-3 h-16 rounded bg-white/10 animate-pulse" />
			) : (
				<div className="mt-3 flex justify-between text-sm">
					<div>Sunrise <span className="text-slate-300">{sunrise || '—'}</span></div>
					<div>Sunset <span className="text-slate-300">{sunset || '—'}</span></div>
				</div>
			)}
			{astronomy.isError && !usingFallback && (
				<div className="mt-2 text-xs text-slate-400">
					API unavailable - using calculated times
				</div>
			)}
		</div>
	);
};

export default SunCard;