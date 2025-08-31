import React from 'react';

interface HeaderProps {
	city: string;
	temp: string;
	desc?: string;
}

const Header: React.FC<HeaderProps> = ({ city, temp, desc }) => {
	return (
		<header className="flex flex-col items-center text-center gap-1">
			<div className="text-4xl font-semibold tracking-tight">{city}</div>
			<div className="text-7xl font-light leading-none">{temp}</div>
			{desc && <div className="text-slate-300 mt-1">{desc}</div>}
		</header>
	);
};

export default Header;
