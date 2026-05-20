import { QRGenerator } from "@/components/qr-generator"
import { ThemeToggle } from "@/components/theme-toggle"
import { QrCode } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <QrCode className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">QR Studio</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Generate QR Codes
            <span className="block text-muted-foreground">Instantly</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto text-pretty">
            Create beautiful, high-quality QR codes for your links, text, and more. Free and easy to use.
          </p>
        </div>

        {/* QR Generator */}
        <QRGenerator />
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-auto">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <p>Built by Mhdali</p>
        </div>
      </footer>
    </main>
  )
}
