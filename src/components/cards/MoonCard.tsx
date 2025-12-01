import React, { useMemo } from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { formatTimeShort } from '@/lib/formatters';

// Calculate moon phase as fallback
function calculateMoonPhase(date: Date = new Date()) {
	// Days since new moon on January 6, 2000
	const newMoonRef = new Date(2000, 0, 6, 18, 14).getTime();
	const currentTime = date.getTime();
	const daysSinceNewMoon = (currentTime - newMoonRef) / (1000 * 60 * 60 * 24);

	// Moon cycle is approximately 29.53 days
	const moonCycle = 29.530588853;
	const phase = (daysSinceNewMoon % moonCycle) / moonCycle;

	// Convert to phase description
	if (phase < 0.03 || phase > 0.97) return "New Moon";
	if (phase < 0.22) return "Waxing Crescent";
	if (phase < 0.28) return "First Quarter";
	if (phase < 0.47) return "Waxing Gibbous";
	if (phase < 0.53) return "Full Moon";
	if (phase < 0.72) return "Waning Gibbous";
	if (phase < 0.78) return "Last Quarter";
	return "Waning Crescent";
}

// Approximate moonrise/moonset calculation
function calculateMoonTimes(lat: number, lon: number, date: Date = new Date()) {
	// This is a very simplified calculation
	// Real moonrise/moonset calculation is extremely complex
	const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

	// Moon rises approximately 50 minutes later each day
	const baseRise = 6 + (dayOfYear * 0.83) % 24; // Rough approximation
	const baseSet = baseRise + 12; // Approximate 12 hours visible

	// Adjust for longitude (very rough)
	const lonAdjust = lon / 15;
	const timezoneOffset = date.getTimezoneOffset() / 60;

	let moonrise = baseRise - lonAdjust - timezoneOffset;
	let moonset = baseSet - lonAdjust - timezoneOffset;

	// Normalize to 24-hour format
	if (moonrise < 0) moonrise += 24;
	if (moonrise >= 24) moonrise -= 24;
	if (moonset < 0) moonset += 24;
	if (moonset >= 24) moonset -= 24;

	const formatTime = (hours: number) => {
		const h = Math.floor(hours);
		const m = Math.floor((hours - h) * 60);
		return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
	};

	return {
		rise: formatTime(moonrise),
		set: formatTime(moonset)
	};
}

const MoonCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { astronomy } = useWeatherData(lat, lon);

	// Fallback calculations
	const fallbackPhase = useMemo(() => calculateMoonPhase(), []);
	const fallbackTimes = useMemo(() => {
		if (lat != null && lon != null) {
			return calculateMoonTimes(lat, lon);
		}
		return { rise: null, set: null };
	}, [lat, lon]);

	// Try API data first, then fallback
	const apiPhase = astronomy.data?.daily?.moon_phase?.[0] ?? null;
	const apiRise = astronomy.data?.daily?.moonrise?.[0] ?? null;
	const apiSet = astronomy.data?.daily?.moonset?.[0] ?? null;

	const phase = apiPhase || fallbackPhase;
	const rise = apiRise ? formatTimeShort(apiRise) : fallbackTimes.rise;
	const set = apiSet ? formatTimeShort(apiSet) : fallbackTimes.set;

	const usingFallback = !apiPhase || (!apiRise && !apiSet);

	// Debug logging
	console.log('MoonCard Debug:', {
		lat,
		lon,
		isLoading: astronomy.isLoading,
		isError: astronomy.isError,
		error: astronomy.error,
		apiPhase,
		apiRise,
		apiSet,
		fallbackPhase,
		fallbackTimes,
		usingFallback
	});

	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">
				Moon
				{usingFallback && <span className="text-xs text-slate-400 ml-1">(estimated)</span>}
			</div>
			{astronomy.isLoading ? (
				<div className="mt-3 h-16 rounded bg-white/10 animate-pulse" />
			) : (
				<div className="mt-3 text-sm">
					<div className="text-slate-200">{phase}</div>
					<div className="text-xs text-slate-400 mt-1">
						Rise {rise || '—'} • Set {set || '—'}
					</div>
				</div>
			)}
		</div>
	);
};

export default MoonCard;