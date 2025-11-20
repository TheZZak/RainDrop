import { useQuery } from '@tanstack/react-query';
import { fetchForecast, fetchAirQuality, fetchAstronomy } from '@/lib/openmeteo';
import { fetchRainviewer } from '@/lib/rainviewer';
import { fetchAirNowData } from '@/lib/airnow';
import { fetchClimateNormals } from '@/lib/climate';

export function useWeatherData(lat: number | null, lon: number | null) {
	const enabled = lat != null && lon != null;

	const forecast = useQuery({
		queryKey: ['forecast', lat, lon],
		enabled,
		queryFn: async () => {
			const hourly = [
				'weather_code','is_day',
				'temperature_2m','apparent_temperature','precipitation','precipitation_probability','rain','snowfall','cloud_cover','uv_index','visibility','wind_speed_10m','wind_gusts_10m','wind_direction_10m','relative_humidity_2m','surface_pressure'
			].join(',');
			const daily = [
				'temperature_2m_max','temperature_2m_min','precipitation_sum','precipitation_probability_max','sunrise','sunset','uv_index_max','wind_speed_10m_max','weather_code' // ← Add weather_code
			].join(',');
			const current = [
				'temperature_2m','apparent_temperature','relative_humidity_2m','wind_speed_10m','wind_gusts_10m','wind_direction_10m','precipitation','rain','snowfall','cloud_cover','surface_pressure','visibility','is_day','weather_code'
			].join(',');
			const params: Record<string, string | number | boolean> = {
				latitude: lat!,
				longitude: lon!,
				hourly,
				daily,
				current,
				forecast_days: 10,
				timezone: 'auto',
				models: 'best_match',
				// Remove these lines - always fetch in metric
				// temperature_unit: temperatur`eUnit === 'f' ? 'fahrenheit' : 'celsius',
				// windspeed_unit: windUnit,
				// precipitation_unit: precipUnit === 'in' ? 'inch' : 'mm'
			};
			return fetchForecast(params);
		}
	});

	const air = useQuery({
		queryKey: ['air', lat, lon],
		enabled,
		queryFn: () => fetchAirQuality({ latitude: lat!, longitude: lon!, hourly: 'us_aqi,pm2_5,pm10,o3,no2,so2', timezone: 'auto' })
	});

	const astronomy = useQuery({
		queryKey: ['astronomy', lat, lon],
		enabled,
		queryFn: () => fetchAstronomy({ latitude: lat!, longitude: lon!, daily: 'sunrise,sunset,moonrise,moonset,moon_phase', timezone: 'auto' })
	});

	const airNow = useQuery({
		queryKey: ['airnow', lat, lon],
		enabled,
		queryFn: () => fetchAirNowData(lat!, lon!),
		staleTime: 300_000, // 5 minutes - AirNow data updates hourly
		retry: 2
	});

	const rain = useQuery({
		queryKey: ['rainviewer'],
		staleTime: 60_000,
		queryFn: fetchRainviewer
	});

	const climate = useQuery({
		queryKey: ['climate', lat, lon],
		enabled,
		queryFn: () => fetchClimateNormals(lat!, lon!),
		staleTime: 86400_000, // 24 hours - climate normals don't change often
		retry: 2
	});

	return { forecast, air, astronomy, rain, airNow, climate };
}