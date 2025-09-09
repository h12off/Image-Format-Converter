import React, { useEffect } from 'react';

// Make adsbygoogle available on the window object
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdsenseProps {
  client: string;
  slot: string;
}

const Adsense: React.FC<AdsenseProps> = ({ client, slot }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error:", err);
    }
  }, [slot]); // Re-run if the ad slot changes

  // Show a helpful placeholder if the client ID is the default one.
  // This guides the user to configure their ads correctly.
  if (client === 'ca-pub-XXXXXXXXXXXXXXXX') {
      return (
        <div className="my-4 flex flex-col items-center justify-center rounded-lg bg-slate-800 border border-dashed border-slate-600 p-4 min-h-[100px]" aria-label="Ad placeholder">
            <p className="text-slate-400 font-medium">Ad Placeholder</p>
            <p className="text-xs text-slate-500 mt-1 text-center">
                To enable monetization, replace the placeholder Ad Client ID in <code>App.tsx</code>.
            </p>
        </div>
      )
  }

  return (
    <div className="my-4 text-center" style={{minHeight: '90px'}}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default Adsense;
