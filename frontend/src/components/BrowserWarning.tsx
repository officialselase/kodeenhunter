import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { detectBrowser } from '../utils/browserDetection';

const BrowserWarning = () => {
  const [show, setShow] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const browserInfo = detectBrowser();
    if (!browserInfo.isSupported && browserInfo.warnings.length > 0) {
      setWarnings(browserInfo.warnings);
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black px-4 py-3 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium">
            {warnings[0]}
          </p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="ml-4 p-1 hover:bg-yellow-600 rounded transition-colors"
          aria-label="Close warning"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default BrowserWarning;
