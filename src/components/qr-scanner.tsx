"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function QRScanner() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        alert(`Scanned: ${decodedText}`);

        if (decodedText.startsWith("http")) {
          window.open(decodedText, "_blank");
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="reader" />
    </div>
  );
}