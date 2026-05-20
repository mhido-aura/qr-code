"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import QRCode from "react-qr-code"
import { Download, Copy, Check, QrCode } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function QRGenerator() {
  const [value, setValue] = useState("https://www.instagram.com/mhdaliorabi?igsh=Y3ppYWp3ZmFrZWNi")
  const [size, setSize] = useState(256)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const downloadQRCode = useCallback(() => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      canvas.width = size
      canvas.height = size
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `qrcode-${Date.now()}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  }, [size])

  const copyToClipboard = useCallback(async () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = async () => {
      canvas.width = size
      canvas.height = size
      ctx?.drawImage(img, 0, 0)
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ])
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          } catch (err) {
            console.error("Failed to copy image:", err)
          }
        }
      })
    }

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  }, [size])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl">
            <QrCode className="h-5 w-5 text-primary" />
            Generate QR Code
          </CardTitle>
          <CardDescription>
            Enter a URL or text to generate your QR code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="qr-input">Content</Label>
            <Input
              id="qr-input"
              type="text"
              placeholder="Enter URL or text..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-12 bg-background/50"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Size: {size}px</Label>
            </div>
            <Slider
              value={[size]}
              onValueChange={(values) => setSize(values[0])}
              min={128}
              max={512}
              step={8}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            <div
              ref={qrRef}
              className="p-6 bg-white rounded-xl shadow-sm border border-border/50"
              style={{ width: "fit-content" }}
            >
              {value && mounted ? (
                <QRCode
                  value={value}
                  size={size}
                  level="H"
                  fgColor={resolvedTheme === "dark" ? "#0a0a0a" : "#171717"}
                  bgColor="#ffffff"
                />
              ) : (
                <div
                  className="flex items-center justify-center bg-muted rounded-lg"
                  style={{ width: size, height: size }}
                >
                  <p className="text-muted-foreground text-sm">Enter content to generate</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 w-full max-w-xs">
              <Button
                onClick={downloadQRCode}
                disabled={!value}
                className="flex-1 h-11"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="secondary"
                onClick={copyToClipboard}
                disabled={!value}
                className="flex-1 h-11"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
