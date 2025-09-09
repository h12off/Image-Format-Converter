import React from 'react';

interface ContactProps {
  onBack: () => void;
}

const Contact: React.FC<ContactProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-lg p-4 sm:p-8 animate-fade-in">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 mb-6 flex items-center gap-2">
        &larr; Back to Converter
      </button>
      <h2 className="text-3xl font-bold mb-6 text-white">Contact Us</h2>
      <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
        <p>
          We'd love to hear from you! Whether you have a question, feedback, a feature request, or need to report a bug, please feel free to reach out.
        </p>
        <p>
          The best way to get in touch is by sending an email to our support team. We'll do our best to get back to you as soon as possible.
        </p>
        <div className="mt-4">
          <p className="font-semibold text-white">Support Email:</p>
          <a href="mailto:support@imageconverter.example.com" className="text-indigo-400 hover:underline">
            support@imageconverter.example.com
          </a>
        </div>
        <p>
          Your feedback is important to us and helps us improve the Image Format Converter for everyone.
        </p>
      </div>
    </div>
  );
};

export default Contact;