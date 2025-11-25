import React from 'react';

interface HeaderProps {
	city: string;
	temp: string;
	desc?: string;
}

const Header: React.FC<HeaderProps> = ({ city, temp, desc }) => {
	return (
<<<<<<< Updated upstream
		<header className="flex flex-col items-center text-center gap-1">
			<div className="text-4xl font-semibold tracking-tight">{city}</div>
			<div className="text-7xl font-light leading-none">{temp}</div>
			{desc && <div className="text-slate-300 mt-1">{desc}</div>}
=======
		<header className="flex flex-col items-center text-center gap-1 w-full lg:-mt-18">
			<div className="text-2xl sm:text-3xl lg:text-3xl font-semibold tracking-tight">{city}</div>
			<div className="text-5xl sm:text-6xl lg:text-5xl font-light leading-none">{temp}</div>
			{/*{desc && <div className="text-slate-300 mt-1 text-sm sm:text-base">{desc}</div>}*/}
>>>>>>> Stashed changes
		</header>
	);
};

export default Header;
