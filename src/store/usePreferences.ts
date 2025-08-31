import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TemperatureUnit = 'c' | 'f';
export type WindUnit = 'kmh' | 'ms' | 'mph';
export type PrecipUnit = 'mm' | 'in';
export type PressureUnit = 'hPa' | 'inHg';
export type ThemePreference = 'system' | 'light' | 'dark';

export interface PreferencesState {
	temperatureUnit: TemperatureUnit;
	windUnit: WindUnit;
	precipUnit: PrecipUnit;
	pressureUnit: PressureUnit;
	theme: ThemePreference;
	setTemperatureUnit: (unit: TemperatureUnit) => void;
	setWindUnit: (unit: WindUnit) => void;
	setPrecipUnit: (unit: PrecipUnit) => void;
	setPressureUnit: (unit: PressureUnit) => void;
	setTheme: (theme: ThemePreference) => void;
}

export const usePreferences = create<PreferencesState>()(
	persist(
		(set) => ({
			temperatureUnit: 'c',
			windUnit: 'kmh',
			precipUnit: 'mm',
			pressureUnit: 'hPa',
			theme: 'system',
			setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
			setWindUnit: (unit) => set({ windUnit: unit }),
			setPrecipUnit: (unit) => set({ precipUnit: unit }),
			setPressureUnit: (unit) => set({ pressureUnit: unit }),
			setTheme: (theme) => set({ theme }),
		}),
		{ name: 'prefs' }
	)
);
