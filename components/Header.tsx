import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="relative w-full py-24 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: 'url("/images/background.jpg")' }}
    >
      {/* Gradient overlay — crimson to near-black */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#b9123f]/85 via-[#8e0e32]/80 to-[rgb(40,40,39)]/90" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-wide">
          {title}
        </h1>
        <h2 className="text-xl sm:text-2xl font-medium text-white/80 uppercase mt-3 tracking-widest">
          {subtitle}
        </h2>
        <div className="w-16 h-1 bg-white/40 mx-auto mt-6 rounded-full" />
      </div>
    </header>
  );
}

export default Header;