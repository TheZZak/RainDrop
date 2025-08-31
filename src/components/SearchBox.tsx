import React, { useEffect, useMemo, useRef, useState } from 'react';
import { geocodeCity } from '@/lib/geocoding';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocation } from '@/store/useLocation';

interface SearchBoxProps {
	onChange?: (q: string) => void;
	placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onChange, placeholder }) => {
	const [val, setVal] = useState('');
	const debounced = useDebounce(val, 300);
	const [suggestions, setSuggestions] = useState<{ id: number; name: string; latitude: number; longitude: number; admin1?: string; country?: string }[]>([]);
	const [open, setOpen] = useState(false);
	const abortRef = useRef<AbortController | null>(null);
	const { setLocation } = useLocation();

	useEffect(() => {
		if (!debounced) { setSuggestions([]); setOpen(false); return; }
		abortRef.current?.abort();
		const ctrl = new AbortController();
		abortRef.current = ctrl;
		geocodeCity(debounced, ctrl.signal)
			.then((res) => setSuggestions(res.results ?? []))
			.catch(() => setSuggestions([]));
		setOpen(true);
	}, [debounced]);

	return (
		<div className="relative">
			<input
				value={val}
				onChange={(e) => { setVal(e.target.value); onChange?.(e.target.value); }}
				placeholder={placeholder ?? 'Search city'}
				className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
				aria-label="Search city"
				onFocus={() => suggestions.length && setOpen(true)}
			/>
			{open && suggestions.length > 0 && (
				<div className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur p-1 max-h-64 overflow-auto">
					{suggestions.map(s => (
						<button
							key={s.id}
							onClick={() => { setLocation(s.latitude, s.longitude, s.name); setVal(`${s.name}${s.admin1 ? ', ' + s.admin1 : ''}${s.country ? ', ' + s.country : ''}`); setOpen(false); }}
							className="w-full text-left px-2 py-1 rounded hover:bg-white/10 text-sm"
						>
							{s.name}{s.admin1 ? `, ${s.admin1}` : ''}{s.country ? `, ${s.country}` : ''}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default SearchBox;
