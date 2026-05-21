import QRScanner from "@/components/qr-scanner";

export default function ScanPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <QRScanner />
    </main>
  );
}