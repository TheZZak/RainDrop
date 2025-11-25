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
<<<<<<< Updated upstream
// try to reduce layout shift by reserving space for the main
	return (
		<div className="min-h-screen text-white">
			<div className="relative z-10 mx-auto max-w-[1440px] px-8 py-8">
				<div className="flex justify-between items-center gap-6">
					<div className="w-80"><SearchBox /></div>
					<UnitToggle />
=======

	const App = () => {
		const { lat, lon, name, geoStatus, setLocation, setGeoStatus, _hasHydrated } = useLocation();
		const { temperatureUnit } = usePreferences();

		useEffect(() => {
			// Wait for hydration to complete
			if (!_hasHydrated) return;

			// If we already have valid coordinates, don't do anything
			if (lat != null && lon != null) {
				console.log('App: Using existing location:', { lat, lon, name });
				return;
			}

			// Set fallback location immediately
			console.log('App: Setting fallback location');
			setLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name);

		}, [_hasHydrated, lat, lon, name, setLocation]);

		const { forecast } = useWeatherData(lat, lon);
		console.log('App: Weather data state:', { lat, lon, isLoading: forecast.isLoading, isError: forecast.isError, hasData: !!forecast.data });

		const current = forecast.data?.current;
		const cityLabel = name ?? 'Search a city';
		const temp = current?.temperature_2m != null ? formatTemp(current.temperature_2m!, temperatureUnit) : '—';
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
			const dailyCode = daily?.weather_code?.[i];
			if (dailyCode != null) {
				return iconForWeatherCode(dailyCode, true) as any;
			}

			const hourlyCodes = forecast.data?.hourly?.weather_code;
			const hourlyDay = forecast.data?.hourly?.is_day;
			if (!hourlyCodes || !hourlyDay) return IconToday as any;
			const idx = i * 24 + 12;
			const code = hourlyCodes[idx] ?? current?.weather_code ?? 1;
			const isDay = (hourlyDay[idx] ?? 1) === 1;
			return iconForWeatherCode(code ?? 1, isDay) as any;
		};

		// Show loading state only briefly while getting initial location
		// This should resolve quickly now due to fallback
		if (lat == null || lon == null) {
			return (
				<div className="min-h-screen text-white flex items-center justify-center bg-black">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
						<div className="text-xl mb-2">Loading weather data...</div>
						<div className="text-sm text-slate-400">Detecting your location</div>
					</div>
>>>>>>> Stashed changes
				</div>

<<<<<<< Updated upstream
				<div className="mt-6 grid grid-cols-[320px_minmax(0,1fr)_420px] gap-8">
					<aside className="rounded-2xl bg-white/5 border border-white/10 p-3">
						<div className="text-xs uppercase tracking-wide text-slate-400 mb-2">10-Day Forecast</div>
						{(daily?.time && daily.time.length) ? (
							<div className="divide-y divide-white/10">
								{daily.time.slice(0,10).map((t, i) => (
									<ForecastRow key={i} dayLabel={formatDayLabel(t, i)} Icon={dailyIconAt(i)} min={daily.temperature_2m_min?.[i] ?? 0} max={daily.temperature_2m_max?.[i] ?? 0} minAll={minAll} maxAll={maxAll} precipPct={daily.precipitation_probability_max?.[i] ?? undefined} />
								))}
=======
		return (
			<div className="min-h-screen text-white">
				<div className="relative z-10 mx-auto max-w-[1990px] px-4 sm:px-6 lg:px-4 py-4 sm:py-6 lg:py-4">
					{/* Header with search and unit toggle */}
					<div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-6 mb-6">
						<div className="w-full sm:w-80"><SearchBox/></div>
						<UnitToggle/>
					</div>

					{/* Responsive grid: stacks on mobile, 3 columns on desktop */}
					<div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_400px] gap-1 lg:gap-4 items-start">
						{/* Middle section - shows FIRST on mobile for better UX */}
						<main className="flex flex-col items-center gap-2 lg:col-start-2 lg:row-start-1 order-1 lg:order-none w-full">
							<Header city={cityLabel} temp={temp} desc={desc}/>
							<CurrentSummary code={current?.weather_code ?? null} isDay={(current?.is_day ?? 1) === 1}
											min={daily?.temperature_2m_min?.[0] ?? null}
											max={daily?.temperature_2m_max?.[0] ?? null}
											current={current?.temperature_2m ?? null}/>
							<div className="w-full">
								<RadarMap/>
>>>>>>> Stashed changes
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
