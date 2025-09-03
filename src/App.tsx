import React, { useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import CurrentSummary from '@/components/CurrentSummary';
import SearchBox from '@/components/SearchBox';
import UnitToggle from '@/components/UnitToggle';
import ForecastRow from '@/components/ForecastRow';
import RadarMap from '@/components/RadarMap';
import { iconForWeatherCode } from '@/lib/icons';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { weatherCodeToText } from '@/lib/weatherCodes';
import { formatDayLabel } from '@/lib/formatters';
import {
	AirQualityCard,
	WindCard,
	PrecipitationCard,
	UVCard,
	SunCard,
	FeelsLikeCard,
	MoonCard,
	HumidityCard,
	VisibilityCard,
	PressureCard,
	AveragesCard,
	InsightCard
} from '@/components/cards';

const App: React.FC = () => {
	const { lat, lon, name, setLocation, setGeoStatus } = useLocation();

	useEffect(() => {
		if (lat != null && lon != null) return;
		if (!('geolocation' in navigator)) { setGeoStatus('error'); return; }
		setGeoStatus('prompt');
		navigator.geolocation.getCurrentPosition(
			(pos) => { setGeoStatus('granted'); setLocation(pos.coords.latitude, pos.coords.longitude, name ?? 'Current Location'); },
			() => setGeoStatus('denied'),
			{ enableHighAccuracy: true, timeout: 8000 }
		);
	}, [lat, lon, name, setLocation, setGeoStatus]);

	const { forecast } = useWeatherData(lat, lon);
	const current = forecast.data?.current;
	const cityLabel = name ?? 'Search a city';
	const temp = current?.temperature_2m != null ? `${Math.round(current.temperature_2m)}°` : '—';
	const desc = current?.weather_code != null ? weatherCodeToText(current.weather_code, (current.is_day ?? 1) === 1) : 'Loading…';
	const IconToday = iconForWeatherCode(current?.weather_code ?? 1, (current?.is_day ?? 1) === 1);

	const daily = forecast.data?.daily;
	const minAll = useMemo(() => {
		const arr = (daily?.temperature_2m_min ?? []).filter((v): v is number => v != null);
		return arr.length ? Math.min(...arr) : 0;
	}, [daily?.temperature_2m_min]);
	const maxAll = useMemo(() => {
		const arr = (daily?.temperature_2m_max ?? []).filter((v): v is number => v != null);
		return arr.length ? Math.max(...arr) : 1;
	}, [daily?.temperature_2m_max]);

	const dailyIconAt = (i: number) => {
		const hourlyCodes = forecast.data?.hourly?.weather_code;
		const hourlyDay = forecast.data?.hourly?.is_day;
		if (!hourlyCodes || !hourlyDay) return IconToday as any;
		const idx = i * 24 + 12;
		const code = hourlyCodes[idx] ?? current?.weather_code ?? 1;
		const isDay = (hourlyDay[idx] ?? 1) === 1;
		return iconForWeatherCode(code ?? 1, isDay) as any;
	};
// try to reduce layout shift by reserving space for the main content
	return (
		<div className="min-h-screen text-white">
			<div className="relative z-10 mx-auto max-w-[1440px] px-8 py-8">
				<div className="flex justify-between items-center gap-6">
					<div className="w-80"><SearchBox /></div>
					<UnitToggle />
				</div>

				<div className="mt-6 grid grid-cols-[320px_minmax(0,1fr)_420px] gap-8">
					<aside className="rounded-2xl bg-white/5 border border-white/10 p-3">
						<div className="text-xs uppercase tracking-wide text-slate-400 mb-2">10-Day Forecast</div>
						{(daily?.time && daily.time.length) ? (
							<div className="divide-y divide-white/10">
								{daily.time.slice(0,10).map((t, i) => (
									<ForecastRow key={i} dayLabel={formatDayLabel(t, i)} Icon={dailyIconAt(i)} min={daily.temperature_2m_min?.[i] ?? 0} max={daily.temperature_2m_max?.[i] ?? 0} minAll={minAll} maxAll={maxAll} precipPct={daily.precipitation_probability_max?.[i] ?? undefined} />
								))}
							</div>
						) : forecast.isError ? (
							<div className="text-sm text-red-300">Failed to load</div>
						) : (
							<div className="space-y-2">
								{Array.from({ length: 10 }).map((_, i) => (
									<div key={i} className="h-6 rounded bg-white/10 animate-pulse" />
								))}
							</div>
						)}
					</aside>

					<main className="flex flex-col items-center gap-5">
						<Header city={cityLabel} temp={temp} desc={desc} />
						<CurrentSummary code={current?.weather_code ?? null} isDay={(current?.is_day ?? 1) === 1} min={daily?.temperature_2m_min?.[0] ?? null} max={daily?.temperature_2m_max?.[0] ?? null} current={current?.temperature_2m ?? null} />
						<RadarMap />
					</main>

					<section className="grid grid-cols-2 gap-4 content-start">
						<AirQualityCard />
						<WindCard />
						<PrecipitationCard />
						<UVCard />
						<SunCard />
						<FeelsLikeCard />
						<MoonCard />
						<HumidityCard />
						<VisibilityCard />
						<PressureCard />
						<AveragesCard />
						<InsightCard />
					</section>
				</div>
			</div>
		</div>
	);
};

export default App;
