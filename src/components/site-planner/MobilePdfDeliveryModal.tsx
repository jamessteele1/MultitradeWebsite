"use client";

import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Generates the PDF on demand and returns a base64 dataURL. */
  generatePdf: () => Promise<string | null>;
  productName?: string;
};

/**
 * Mobile PDF delivery — uses the browser's built-in Web Share API so the
 * user can fire the PDF straight at their email/messages/AirDrop without
 * any third-party email service. Falls back to opening the PDF in a new
 * tab when the device doesn't support file sharing.
 */
export default function MobilePdfDeliveryModal({
  open,
  onClose,
  generatePdf,
  productName = "Site Layout",
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canShareFiles, setCanShareFiles] = useState(false);

  // Probe the Web Share API once on mount — we test with a real File rather
  // than just checking navigator.share because some browsers (desktop Safari,
  // some in-app browsers) expose share() but reject files.
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    if (typeof navigator.canShare !== "function") {
      setCanShareFiles(false);
      return;
    }
    try {
      const probe = new File([new Blob([""], { type: "application/pdf" })], "x.pdf", {
        type: "application/pdf",
      });
      setCanShareFiles(navigator.canShare({ files: [probe] }));
    } catch {
      setCanShareFiles(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setBusy(false);
      setError(null);
    }
  }, [open]);

  const dataUrlToBlob = (dataUrl: string): Blob => {
    const byteString = atob(dataUrl.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: "application/pdf" });
  };

  const handleShare = async () => {
    setError(null);
    setBusy(true);
    try {
      const pdfBase64 = await generatePdf();
      if (!pdfBase64) {
        setError("Couldn't generate the PDF — please try again.");
        return;
      }
      const blob = dataUrlToBlob(pdfBase64);
      const file = new File([blob], "site-layout.pdf", { type: "application/pdf" });
      if (!navigator.canShare?.({ files: [file] })) {
        setError("Sharing isn't supported on this device. Try 'Open in browser' instead.");
        return;
      }
      await navigator.share({
        files: [file],
        title: productName,
        text: `${productName} — Multitrade Building Hire`,
      });
      onClose();
    } catch (err) {
      // AbortError = user cancelled the share sheet, that's fine
      if ((err as Error).name !== "AbortError") {
        console.error(err);
        setError("Something went wrong — try 'Open in browser' instead.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleOpenInTab = async () => {
    setError(null);
    setBusy(true);
    try {
      const pdfBase64 = await generatePdf();
      if (!pdfBase64) {
        setError("Couldn't generate the PDF — please try again.");
        return;
      }
      const blob = dataUrlToBlob(pdfBase64);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Couldn't open the PDF.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div className="relative w-full sm:w-auto sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => !busy && onClose()}
          className="absolute top-3 right-3 p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-2">
          <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h2 className="text-lg font-extrabold text-gray-900">Send your site layout</h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Pick how you&apos;d like to send the PDF — share to email, messaging, or save it to your device.
          </p>
        </div>

        <div className="px-6 pb-6 pt-3 space-y-2.5">
          {canShareFiles && (
            <button
              type="button"
              onClick={handleShare}
              disabled={busy}
              className="w-full px-4 py-3.5 rounded-lg text-sm font-bold text-gray-900 bg-gold hover:brightness-110 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {busy ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
                  Preparing PDF…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Share PDF
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenInTab}
            disabled={busy}
            className={`w-full px-4 py-3.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              canShareFiles
                ? "text-gray-700 border border-gray-200 hover:bg-gray-50"
                : "text-gray-900 bg-gold hover:brightness-110"
            } disabled:opacity-60`}
          >
            {busy && !canShareFiles ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
                Opening…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open PDF in browser
              </>
            )}
          </button>

          {error && <p className="text-xs text-red-600 text-center">{error}</p>}

          <p className="text-[11px] text-gray-400 leading-relaxed text-center pt-1">
            {canShareFiles
              ? "Share opens your phone's share sheet — pick Mail, Messages, AirDrop, or anywhere else."
              : "PDF will open in a new tab where you can save or share it."}
          </p>
        </div>
      </div>
    </div>
  );
}
