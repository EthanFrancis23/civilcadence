import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface Props {
  url: string;
  onClose: () => void;
}

export function ShareDialog({ url, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, { width: 200, margin: 2, color: { dark: '#1c1917', light: '#f4efe4' } });
    }
  }, [url]);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="card p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-2xl mb-2">Share this plan</h3>
        <p className="font-mono text-[11px] text-[var(--ink-3)] mb-4 leading-relaxed">
          This URL contains your full plan data. Anyone with the link can load it. It is not private.
        </p>
        <canvas ref={canvasRef} className="mx-auto block mb-4 rounded" />
        <div className="flex gap-2 mb-3">
          <input type="text" readOnly value={url} className="flex-1 text-[11px]"
            onClick={e => (e.target as HTMLInputElement).select()} />
          <button className="btn flex-shrink-0" onClick={copy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <button className="btn-ghost w-full text-center font-mono text-[11px] tracked-wide uppercase py-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
