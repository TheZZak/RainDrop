import React from 'react';

const AveragesCard: React.FC = () => {
	return (
		<div className="rounded-xl bg-white/5 p-4 border border-white/10">
			<div className="text-sm text-slate-300">Averages vs Normal</div>
			<div className="mt-3 h-16 rounded bg-white/10 grid place-items-center text-slate-400">—</div>
		</div>
	);
};

export default AveragesCard;
