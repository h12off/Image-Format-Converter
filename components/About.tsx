import React from 'react';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-lg p-4 sm:p-8 animate-fade-in">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 mb-6 flex items-center gap-2">
        &larr; Back to Converter
      </button>
      <h2 className="text-3xl font-bold mb-6 text-white">About This Tool</h2>
      <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
        <p>
          The Image Format Converter is a free, powerful, and privacy-focused tool designed to make image conversion simple and accessible for everyone. All processing happens directly within your web browser, which means your files are never uploaded to a server. This ensures your data remains completely private and secure.
        </p>
        <h3 className="text-xl font-semibold text-white pt-4">Core Features</h3>
        <ul className="list-disc pl-5">
          <li><strong>Multiple Formats:</strong> Seamlessly convert images between popular formats like PNG, JPG, WebP, and GIF.</li>
          <li><strong>In-Browser Processing:</strong> Your files stay on your computer. We respect your privacy by not uploading anything to our servers.</li>
          <li><strong>Batch Conversion:</strong> Upload and convert multiple images at once to save time.</li>
          <li><strong>Resizing & Compression:</strong> Easily resize image dimensions and adjust quality settings to optimize file sizes.</li>
          <li><strong>Drag & Drop:</strong> A user-friendly interface that allows you to simply drag your files to start.</li>
          <li><strong>Download All:</strong> Conveniently download all your converted images in a single ZIP file.</li>
        </ul>
        <p>
          This tool was built using modern web technologies to provide a fast, reliable, and smooth user experience. We believe in providing high-quality utilities without compromising on user privacy.
        </p>
      </div>
    </div>
  );
};

export default About;