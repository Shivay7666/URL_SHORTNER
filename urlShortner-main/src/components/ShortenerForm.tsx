"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";

// Add this near the top of your file if you get TS errors about canShare
// interface NavigatorWithShare extends Navigator {
//   canShare?: (data: { files?: File[] }) => boolean;
// }

// Add this function at the top, after your imports
const isBrowser = () => typeof window !== 'undefined';

const ShortenerForm = () => {
  const [url, setUrl] = useState("");
  const [expiry, setExpiry] = useState("86400"); // Default: 1 day
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check browser capabilities after mounting
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  // Define style constants
  const INPUT = "w-full p-3 border border-gray-400 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400";
  const BUTTON = "w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300";
  const CONTAINER = "max-w-lg mx-auto p-8 bg-gray-50 shadow-md rounded-lg";
  const HEADING = "text-3xl font-extrabold mb-6 text-gray-800";
  const LINK = "text-blue-600 underline hover:text-blue-800 transition duration-200";
  const ACTION_BUTTON = "flex-1 py-2 px-4 rounded-lg text-white transition duration-300";

  const handleShorten = async () => {
    if (!url || !url.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/shorten", { originalUrl: url, expiry: Number(expiry) });
      setShortUrl(response.data.shortUrl);
      toast.success("URL Shortened Successfully!");
    } catch (error) {
      toast.error("Failed to shorten URL");
      console.error("Shorten error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // More reliable copy function
  const handleCopy = async () => {
    try {
      // For modern browsers
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        toast.success("URL copied to clipboard!");
      } else {
        // Fallback method
        const textArea = document.createElement("textarea");
        textArea.value = shortUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        toast.success("URL copied to clipboard!");
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy error:", err);
      toast.error("Failed to copy URL");
    }
  };

  const handleShareUrl = async () => {
    try {
      if (isBrowser() && navigator.share) {
        await navigator.share({
          title: 'Shortened URL',
          text: 'Check out this shortened URL!',
          url: shortUrl,
        });
        toast.success("URL shared successfully!");
      } else {
        // Fallback if Web Share API is not supported
        handleCopy();
        toast.info("Share option not available. URL copied instead!");
      }
    } catch (err) {
      console.error("Share error:", err);
      if (err instanceof Error && err.name !== 'AbortError') {
        toast.error("Failed to share URL");
      }
    }
  };

  const handleShareQR = async () => {
    if (!qrCodeRef.current) {
      toast.error("QR code not available");
      return;
    }

    try {
      // Convert canvas to blob - with better type handling
      const canvas = qrCodeRef.current as HTMLCanvasElement;
      const blob = await new Promise<Blob | null>((resolve) => {
        // Type assertion to fix the error
        (canvas as HTMLCanvasElement).toBlob((b) => resolve(b), 'image/png');
      });
      
      if (!blob) {
        toast.error("Could not generate QR code image");
        return;
      }
      
      if (isBrowser() && navigator.share && blob) {
        try {
          const file = new File([blob], 'qr-code.png', { type: 'image/png' });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'QR Code for Shortened URL',
              text: `QR Code for: ${shortUrl}`,
              files: [file],
            });
            toast.success("QR code shared successfully!");
            return;
          }
        } catch (shareErr) {
          console.log("File sharing not supported, falling back to download");
        }
      }
      
      // Fallback: download the QR code
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("QR code downloaded!");
    } catch (err) {
      console.error("QR share error:", err);
      toast.error("Failed to share QR code");
    }
  };

  return (
    <div className={CONTAINER}>
      <h1 className={HEADING}>Shorten Your URL</h1>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className={INPUT}
      />

      <select
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        className={INPUT}
      >
        <option value="86400">1 Day</option>
        <option value="604800">7 Days</option>
        <option value="2592000">30 Days</option>
      </select>

      <button
        onClick={handleShorten}
        className={BUTTON}
      >
        Shorten URL
      </button>

      {shortUrl && (
        <div className="mt-4">
          <p className="text-lg">Shortened URL:</p>
          <div className="flex items-center mt-2 mb-3">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
              {shortUrl}
            </a>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button 
              onClick={handleCopy} 
              className={`${ACTION_BUTTON} ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
            <button 
              onClick={handleShareUrl} 
              className={`${ACTION_BUTTON} bg-purple-600 hover:bg-purple-700`}
            >
              Share URL
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <QRCodeCanvas ref={qrCodeRef} value={shortUrl} size={150} />
            <button 
              onClick={handleShareQR} 
              className={`${ACTION_BUTTON} bg-teal-600 hover:bg-teal-700 mt-3 w-full max-w-xs`}
            >
              Share QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortenerForm;
