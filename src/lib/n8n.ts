import { z } from 'zod';

export const N8nInsightSchema = z.object({
	narrative: z.string(),
	highlights: z.array(z.string()),
	hazards: z.object({
		rain: z.number(),
		storm: z.number(),
		wind: z.number(),
		heat: z.number(),
		cold: z.number(),
		airQuality: z.number()
	}),
	bestWindows: z.array(z.object({ start: z.string(), end: z.string(), reason: z.string() })),
	activityRatings: z.object({
		running: z.number().int().min(1).max(5).optional(),
		cycling: z.number().int().min(1).max(5).optional(),
		hiking: z.number().int().min(1).max(5).optional(),
		beach: z.number().int().min(1).max(5).optional()
	}).optional(),
	tips: z.array(z.string())
});

export type N8nInsight = z.infer<typeof N8nInsightSchema>;

const ENABLED = import.meta.env.VITE_ENABLE_N8N_INSIGHTS === 'true';
const URL = import.meta.env.VITE_N8N_INSIGHTS_URL as string | undefined;

export async function fetchN8nInsight(input: unknown): Promise<N8nInsight | null> {
	if (!ENABLED || !URL) return null;
	const res = await fetch(URL, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(input ?? {})
	});
	if (!res.ok) throw new Error(`n8n insight failed: ${res.status}`);
	const data = await res.json();
	return N8nInsightSchema.parse(data);
}
