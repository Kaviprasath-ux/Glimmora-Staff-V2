import { useState, useRef, useEffect } from 'react';

export default function ProofOfDeliveryModal({ task, onClose, onComplete }) {
  const [signature, setSignature] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [qrVerified, setQrVerified] = useState(task?.qrVerified || false);
  const [photos, setPhotos] = useState([]);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;

      const context = canvas.getContext('2d');
      context.scale(2, 2);
      context.lineCap = 'round';
      context.strokeStyle = '#4E5840';
      context.lineWidth = 2;
      contextRef.current = context;
    }
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    // Save signature as data URL
    const canvas = canvasRef.current;
    setSignature(canvas.toDataURL());
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  // FIX RN-N01: Convert photos to base64 for localStorage persistence
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onComplete(task.id, {
      signature,
      qrVerified,
      photos
    });
    onClose();
  };

  // FIX RN-C01: Require QR verification (mandatory) AND optional signature
  // QR is always required for proper delivery verification
  const canComplete = qrVerified;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#4E5840]">Proof of Delivery</h2>
              <p className="text-sm text-[#6B6F63]">Room {task?.room} - {task?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#6B6F63] hover:text-[#4E5840] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* QR Verification */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[#4E5840]">QR Verification</label>
              {qrVerified && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            {!qrVerified ? (
              <button
                onClick={() => setQrVerified(true)}
                className="w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg text-[#6B6F63] hover:border-[#5C9BA4] hover:text-[#5C9BA4] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Tap to Scan QR Code
              </button>
            ) : (
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">QR Code Verified</p>
                  <p className="text-xs text-green-500">Room {task?.room} confirmed</p>
                </div>
              </div>
            )}
          </div>

          {/* Signature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[#4E5840]">Guest Signature</label>
              {signature && (
                <button
                  onClick={clearSignature}
                  className="text-xs text-[#A57865] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative border-2 border-neutral-200 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  const rect = canvasRef.current.getBoundingClientRect();
                  startDrawing({
                    nativeEvent: {
                      offsetX: touch.clientX - rect.left,
                      offsetY: touch.clientY - rect.top
                    }
                  });
                }}
                onTouchEnd={finishDrawing}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const rect = canvasRef.current.getBoundingClientRect();
                  draw({
                    nativeEvent: {
                      offsetX: touch.clientX - rect.left,
                      offsetY: touch.clientY - rect.top
                    }
                  });
                }}
                className="w-full h-32 bg-neutral-50 cursor-crosshair touch-none"
              />
              {!signature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-sm text-neutral-400">Sign here</p>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="text-sm font-medium text-[#4E5840] mb-2 block">Photos (Optional)</label>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={photo} alt={`Proof ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#A57865] transition-colors">
                <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-neutral-400 mt-1">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className="px-4 py-2 text-sm font-medium text-white bg-[#4E5840] rounded-lg hover:bg-[#3E4830] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Complete Delivery
          </button>
        </div>
      </div>
    </div>
  );
}
