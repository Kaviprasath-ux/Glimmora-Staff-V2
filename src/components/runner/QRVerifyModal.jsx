import { useState, useEffect } from 'react';

export default function QRVerifyModal({ task, onClose, onVerify }) {
  const [scanning, setScanning] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  // Simulate QR scanning
  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        // Simulate successful scan after 2 seconds
        setScanning(false);
        setVerified(true);
        onVerify(task.id);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [scanning, task.id, onVerify]);

  const handleRetry = () => {
    setError(null);
    setScanning(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#4E5840]">QR Verification</h2>
          <button
            onClick={onClose}
            className="text-[#6B6F63] hover:text-[#4E5840] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {scanning && (
            <div className="text-center">
              {/* Scanning Animation */}
              <div className="relative w-48 h-48 mx-auto mb-4">
                {/* QR Frame */}
                <div className="absolute inset-0 border-2 border-[#5C9BA4] rounded-lg">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#5C9BA4] rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#5C9BA4] rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#5C9BA4] rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#5C9BA4] rounded-br-lg" />
                </div>
                {/* Scanning line animation */}
                <div className="absolute inset-4 overflow-hidden">
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-[#5C9BA4] to-transparent animate-scan" />
                </div>
                {/* QR placeholder */}
                <div className="absolute inset-8 flex items-center justify-center">
                  <svg className="w-16 h-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-[#6B6F63]">Scanning QR code...</p>
              <p className="text-xs text-[#6B6F63] mt-1">Point camera at room QR code</p>
            </div>
          )}

          {verified && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#4E5840] mb-2">Verified!</h3>
              <p className="text-sm text-[#6B6F63]">Room {task?.room} confirmed</p>
              <p className="text-xs text-[#6B6F63] mt-1">{task?.guestName}</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">Scan Failed</h3>
              <p className="text-sm text-[#6B6F63] mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            {verified ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>

      {/* Add scanning animation styles */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(140px); }
          100% { transform: translateY(0); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
