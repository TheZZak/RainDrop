import React from 'react';
import { useLocation } from '@/store/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';
import { aqiUSDescriptor } from '@/lib/formatters';

const AirQualityCard: React.FC = () => {
	const { lat, lon } = useLocation();
	const { air } = useWeatherData(lat, lon);
	const aqi = air.data?.hourly?.us_aqi?.[0] ?? null;
	const showUnavailable = air.isError || aqi == null;
	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="flex items-center justify-between">
				<div className="text-sm text-slate-300">Air Quality</div>
				{(air.isError) && (
					<button className="text-xs text-sky-300 hover:underline" onClick={() => air.refetch()}>
						Retry
					</button>
				)}
			</div>
			{air.isLoading ? (
				<div className="mt-3 h-8 rounded bg-white/10 animate-pulse" />
			) : (
				<div className="mt-3 flex items-baseline gap-3">
					<div className="text-3xl font-semibold">{aqi ?? '—'}</div>
					<div className="text-slate-300">{showUnavailable ? 'Unavailable' : aqiUSDescriptor(aqi ?? NaN)}</div>
				</div>
			)}
		</div>
	);
};

export default AirQualityCard;
