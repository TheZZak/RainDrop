import { z } from 'zod';

export const ClimateNormalsSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	daily: z.object({
		time: z.array(z.string()),
		temperature_2m_mean: z.array(z.number().nullable()).optional(),
		temperature_2m_max: z.array(z.number().nullable()).optional(),
		temperature_2m_min: z.array(z.number().nullable()).optional(),
		precipitation_sum: z.array(z.number().nullable()).optional()
	}).optional()
});

export type ClimateNormalsResponse = z.infer<typeof ClimateNormalsSchema>;

export async function fetchClimateNormals(lat: number, lon: number): Promise<ClimateNormalsResponse> {
	// Get current date to fetch normals for this time of year
	const now = new Date();
	const month = now.getMonth() + 1;
	const day = now.getDate();

	// Format dates for a 30-year climate period (1991-2020)
	const startDate = `1991-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	const endDate = `2020-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

	const url = new URL('https://archive-api.open-meteo.com/v1/archive');
	url.searchParams.set('latitude', lat.toString());
	url.searchParams.set('longitude', lon.toString());
	url.searchParams.set('start_date', startDate);
	url.searchParams.set('end_date', endDate);
	url.searchParams.set('daily', 'temperature_2m_mean,temperature_2m_max,temperature_2m_min,precipitation_sum');
	url.searchParams.set('timezone', 'auto');

	const res = await fetch(url.toString());
	if (!res.ok) throw new Error(`climate ${res.status}`);
	return ClimateNormalsSchema.parse(await res.json());
}

export function calculateAverage(values: (number | null)[]): number | null {
	const filtered = values.filter((v): v is number => v != null);
	if (filtered.length === 0) return null;
	return filtered.reduce((sum, v) => sum + v, 0) / filtered.length;
}