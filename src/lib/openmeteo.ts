import { z } from 'zod';

// Shared types
export const CurrentSchema = z.object({
	time: z.string(),
	temperature_2m: z.number().nullable().optional(),
	apparent_temperature: z.number().nullable().optional(),
	relative_humidity_2m: z.number().nullable().optional(),
	wind_speed_10m: z.number().nullable().optional(),
	wind_gusts_10m: z.number().nullable().optional(),
	wind_direction_10m: z.number().nullable().optional(),
	precipitation: z.number().nullable().optional(),
	rain: z.number().nullable().optional(),
	snowfall: z.number().nullable().optional(),
	cloud_cover: z.number().nullable().optional(),
	surface_pressure: z.number().nullable().optional(),
	visibility: z.number().nullable().optional(),
	is_day: z.number().nullable().optional(),
	weather_code: z.number().nullable().optional()
});

export const ForecastSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	timezone: z.string(),
	current: CurrentSchema.optional(),
	hourly: z.object({
		time: z.array(z.string()),
		weather_code: z.array(z.number().nullable()).optional(),
		is_day: z.array(z.number().nullable()).optional(),
		temperature_2m: z.array(z.number().nullable()).optional(),
		apparent_temperature: z.array(z.number().nullable()).optional(),
		precipitation: z.array(z.number().nullable()).optional(),
		precipitation_probability: z.array(z.number().nullable()).optional(),
		rain: z.array(z.number().nullable()).optional(),
		snowfall: z.array(z.number().nullable()).optional(),
		cloud_cover: z.array(z.number().nullable()).optional(),
		uv_index: z.array(z.number().nullable()).optional(),
		visibility: z.array(z.number().nullable()).optional(),
		wind_speed_10m: z.array(z.number().nullable()).optional(),
		wind_gusts_10m: z.array(z.number().nullable()).optional(),
		wind_direction_10m: z.array(z.number().nullable()).optional(),
		relative_humidity_2m: z.array(z.number().nullable()).optional(),
		surface_pressure: z.array(z.number().nullable()).optional()
	}).optional(),
	daily: z.object({
		time: z.array(z.string()),
		temperature_2m_max: z.array(z.number().nullable()).optional(),
		temperature_2m_min: z.array(z.number().nullable()).optional(),
		precipitation_sum: z.array(z.number().nullable()).optional(),
		precipitation_probability_max: z.array(z.number().nullable()).optional(),
		sunrise: z.array(z.string().nullable()).optional(),
		sunset: z.array(z.string().nullable()).optional(),
		uv_index_max: z.array(z.number().nullable()).optional(),
		wind_speed_10m_max: z.array(z.number().nullable()).optional(),
		weather_code: z.array(z.number().nullable()).optional()
	}).optional()
});

export type ForecastResponse = z.infer<typeof ForecastSchema>;

export async function fetchForecast(params: Record<string, string | number | boolean>): Promise<ForecastResponse> {
	const url = new URL('https://api.open-meteo.com/v1/forecast');
	Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
	const res = await fetch(url.toString());
	if (!res.ok) throw new Error(`forecast ${res.status}`);
	const json = await res.json();
	return ForecastSchema.parse(json);
}

export const AirQualitySchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	hourly: z.object({
		time: z.array(z.string()),
		us_aqi: z.array(z.number().nullable()).optional(),
		pm2_5: z.array(z.number().nullable()).optional(),
		pm10: z.array(z.number().nullable()).optional(),
		o3: z.array(z.number().nullable()).optional(),
		no2: z.array(z.number().nullable()).optional(),
		so2: z.array(z.number().nullable()).optional()
	}).optional()
});

export type AirQualityResponse = z.infer<typeof AirQualitySchema>;

export async function fetchAirQuality(params: Record<string, string | number | boolean>): Promise<AirQualityResponse> {
	const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
	Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
	const res = await fetch(url.toString());
	if (!res.ok) throw new Error(`air ${res.status}`);
	return AirQualitySchema.parse(await res.json());
}

export const AstronomySchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	daily: z.object({
		time: z.array(z.string()),
		sunrise: z.array(z.string().nullable()).optional(),
		sunset: z.array(z.string().nullable()).optional(),
		moonrise: z.array(z.string().nullable()).optional(),
		moonset: z.array(z.string().nullable()).optional(),
		moon_phase: z.array(z.string().nullable()).optional()
	}).optional()
});

export type AstronomyResponse = z.infer<typeof AstronomySchema>;

export async function fetchAstronomy(params: Record<string, string | number | boolean>): Promise<AstronomyResponse> {
	const url = new URL('https://astronomy-api.open-meteo.com/v1/astronomy');
	Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
	const res = await fetch(url.toString());
	if (!res.ok) throw new Error(`astro ${res.status}`);
	return AstronomySchema.parse(await res.json());
}
