import React from 'react';

interface PrivacyPolicyProps {
    onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-lg p-4 sm:p-8 animate-fade-in">
       <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 mb-6 flex items-center gap-2">
         &larr; Back to Converter
      </button>
      <h2 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h2>
      <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <h3 className="text-xl font-semibold text-white pt-4">Our Commitment to Privacy</h3>
        <p>
            Your privacy is critically important to us. This Image Format Converter application is designed with privacy as a core principle.
        </p>

        <h3 className="text-xl font-semibold text-white pt-4">No Data Collection or Uploads</h3>
        <p>
            We do not collect, store, or transmit any of your personal data or the images you process. All image conversion and processing happens entirely within your web browser on your own computer (client-side). Your files are never uploaded to our servers or any third-party service.
        </p>
        
        <h3 className="text-xl font-semibold text-white pt-4">Local Processing</h3>
        <p>
            Because all operations are performed locally, you maintain complete control and ownership of your files at all times. Once you close the browser tab, the session is over, and no data persists.
        </p>

        <h3 className="text-xl font-semibold text-white pt-4">Third-Party Services (Advertising)</h3>
        <p>
            This website uses Google AdSense to display advertisements, which helps support the cost of running and maintaining this free tool. 
        </p>
        <ul className="list-disc pl-5">
            <li>Google, as a third-party vendor, uses cookies to serve ads on this site.</li>
            <li>Google's use of the DART cookie enables it to serve ads to users based on their visit to this site and other sites on the Internet.</li>
            <li>Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.</li>
        </ul>
        <p>
            We do not share any personal information or image data with our advertising partners.
        </p>

        <h3 className="text-xl font-semibold text-white pt-4">Changes to This Policy</h3>
        <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;