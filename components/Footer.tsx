import React from 'react';

type Page = 'converter' | 'privacy' | 'contact' | 'about' | 'blog';

interface FooterProps {
    setCurrentPage: (page: Page) => void;
}


const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
    const handleLinkClick = (e: React.MouseEvent<HTMLButtonElement>, page: Page) => {
        e.preventDefault();
        setCurrentPage(page);
        window.scrollTo(0, 0);
    }
  return (
    <footer className="py-6 mt-12 border-t border-slate-800">
      <div className="container mx-auto text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} Image Format Converter. All Rights Reserved.</p>
        <div className="mt-2 space-x-2 sm:space-x-4">
          <button onClick={(e) => handleLinkClick(e, 'privacy')} className="hover:text-slate-300 transition-colors">Privacy Policy</button>
          <span>&middot;</span>
          <button onClick={(e) => handleLinkClick(e, 'contact')} className="hover:text-slate-300 transition-colors">Contact</button>
          <span>&middot;</span>
          <button onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-slate-300 transition-colors">About</button>
          <span>&middot;</span>
          <button onClick={(e) => handleLinkClick(e, 'blog')} className="hover:text-slate-300 transition-colors">Blog</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
