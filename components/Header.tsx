import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Image Format Converter
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-400">
          Convert, resize, and compress your images right in your browser.
        </p>
      </div>
    </header>
  );
};

export default Header;