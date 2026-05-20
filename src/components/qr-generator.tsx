"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import QRCode from "react-qr-code"
import {
  Download,
  Copy,
  Check,
  QrCode,
  Link2,
  FileText,
  Mail,
  MessageSquare,
  MapPin,
  Wifi,
  Bitcoin,
} from "lucide-react"

import { useTheme } from "next-themes"
import jsPDF from "jspdf"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function QRGenerator() {
  const [type, setType] = useState("url")

  const [value, setValue] = useState("https://www.instagram.com/mhdaliorabi?igsh=Y3ppYWp3ZmFrZWNi")

  const [wifiName, setWifiName] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")

  const [location, setLocation] = useState("")

  const [bitcoin, setBitcoin] = useState("")

  const [size, setSize] = useState(256)

  const [copied, setCopied] = useState(false)

  const qrRef = useRef<HTMLDivElement>(null)

  const { resolvedTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // -----------------------
  // GET QR VALUE
  // -----------------------

  const getQRValue = () => {
    switch (type) {
      case "wifi":
        return `WIFI:T:WPA;S:${wifiName};P:${wifiPassword};;`

      case "location":
        return `geo:${location}`

      case "bitcoin":
        return `bitcoin:${bitcoin}`

      default:
        return value
    }
  }

  // -----------------------
  // DOWNLOAD PNG
  // -----------------------

  const downloadPNG = useCallback(() => {
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

      downloadLink.download = `qrcode.png`

      downloadLink.href = pngFile

      downloadLink.click()
    }

    img.src = `data:image/svg+xml;base64,${btoa(
      unescape(encodeURIComponent(svgData))
    )}`
  }, [size])

  // -----------------------
  // DOWNLOAD SVG
  // -----------------------

  const downloadSVG = useCallback(() => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")

    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)

    const blob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")

    link.href = url

    link.download = "qrcode.svg"

    link.click()

    URL.revokeObjectURL(url)
  }, [])

  // -----------------------
  // DOWNLOAD PDF
  // -----------------------

  const downloadPDF = useCallback(() => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")

    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)

    const canvas = document.createElement("canvas")

    const ctx = canvas.getContext("2d")

    const img = new Image()

    img.onload = () => {
      canvas.width = size
      canvas.height = size

      ctx?.drawImage(img, 0, 0)

      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF()

      pdf.text("QR Code", 20, 20)

      pdf.addImage(imgData, "PNG", 20, 30, 100, 100)

      pdf.save("qrcode.pdf")
    }

    img.src = `data:image/svg+xml;base64,${btoa(
      unescape(encodeURIComponent(svgData))
    )}`
  }, [size])

  // -----------------------
  // DOWNLOAD EPS
  // -----------------------

  const downloadEPS = useCallback(() => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")

    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)

    const blob = new Blob([svgData], {
      type: "application/postscript",
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")

    link.href = url

    link.download = "qrcode.eps"

    link.click()

    URL.revokeObjectURL(url)
  }, [])

  // -----------------------
  // COPY
  // -----------------------

  const copyToClipboard = useCallback(async () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")

    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)

    const canvas = document.createElement("canvas")

    const ctx = canvas.getContext("2d")

    const img = new Image()

    img.onload = async () => {
      canvas.width = size
      canvas.height = size

      ctx?.drawImage(img, 0, 0)

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ])

            setCopied(true)

            setTimeout(() => {
              setCopied(false)
            }, 2000)
          } catch (err) {
            console.error(err)
          }
        }
      })
    }

    img.src = `data:image/svg+xml;base64,${btoa(
      unescape(encodeURIComponent(svgData))
    )}`
  }, [size])

  // -----------------------
  // UI
  // -----------------------

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <QrCode className="h-6 w-6 text-primary" />
            Advanced QR Generator
          </CardTitle>

          <CardDescription>
            Generate powerful QR codes with multiple formats.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* TYPES */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={type === "url" ? "default" : "outline"}
              onClick={() => setType("url")}
            >
              <Link2 className="mr-2 h-4 w-4" />
              URL
            </Button>

            <Button
              variant={type === "text" ? "default" : "outline"}
              onClick={() => setType("text")}
            >
              <FileText className="mr-2 h-4 w-4" />
              TEXT
            </Button>

            <Button
              variant={type === "email" ? "default" : "outline"}
              onClick={() => setType("email")}
            >
              <Mail className="mr-2 h-4 w-4" />
              EMAIL
            </Button>

            <Button
              variant={type === "sms" ? "default" : "outline"}
              onClick={() => setType("sms")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              SMS
            </Button>

            <Button
              variant={type === "location" ? "default" : "outline"}
              onClick={() => setType("location")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              LOCATION
            </Button>

            <Button
              variant={type === "wifi" ? "default" : "outline"}
              onClick={() => setType("wifi")}
            >
              <Wifi className="mr-2 h-4 w-4" />
              WIFI
            </Button>

            <Button
              variant={type === "bitcoin" ? "default" : "outline"}
              onClick={() => setType("bitcoin")}
            >
              <Bitcoin className="mr-2 h-4 w-4" />
              BITCOIN
            </Button>
          </div>

          {/* INPUTS */}

          {type === "url" && (
            <div className="space-y-2">
              <Label>Website URL</Label>

              <Input
                placeholder="https://example.com"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-12"
              />
            </div>
          )}

          {type === "text" && (
            <div className="space-y-2">
              <Label>Text</Label>

              <Textarea
                placeholder="Write your text..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          )}

          {type === "email" && (
            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                placeholder="example@gmail.com"
                value={value.replace("mailto:", "")}
                onChange={(e) =>
                  setValue(`mailto:${e.target.value}`)
                }
                className="h-12"
              />
            </div>
          )}

          {type === "sms" && (
            <div className="space-y-2">
              <Label>Phone Number</Label>

              <Input
                placeholder="+212600000000"
                value={value.replace("sms:", "")}
                onChange={(e) =>
                  setValue(`sms:${e.target.value}`)
                }
                className="h-12"
              />
            </div>
          )}

          {type === "location" && (
            <div className="space-y-2">
              <Label>Location</Label>

              <Input
                placeholder="33.5731,-7.5898"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12"
              />
            </div>
          )}

          {type === "wifi" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>WiFi Name</Label>

                <Input
                  placeholder="My WiFi"
                  value={wifiName}
                  onChange={(e) =>
                    setWifiName(e.target.value)
                  }
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>

                <Input
                  placeholder="Password"
                  value={wifiPassword}
                  onChange={(e) =>
                    setWifiPassword(e.target.value)
                  }
                  className="h-12"
                />
              </div>
            </div>
          )}

          {type === "bitcoin" && (
            <div className="space-y-2">
              <Label>Bitcoin Address</Label>

              <Input
                placeholder="bc1..."
                value={bitcoin}
                onChange={(e) =>
                  setBitcoin(e.target.value)
                }
                className="h-12"
              />
            </div>
          )}

          {/* SIZE */}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Size: {size}px</Label>
            </div>

            <Slider
              value={[size]}
              onValueChange={(values) =>
                setSize(values[0])
              }
              min={128}
              max={512}
              step={8}
            />
          </div>
        </CardContent>
      </Card>

      {/* RESULT */}

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            <div
              ref={qrRef}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              {mounted && (
                <QRCode
                  value={getQRValue()}
                  size={size}
                  level="H"
                  fgColor={
                    resolvedTheme === "dark"
                      ? "#0a0a0a"
                      : "#171717"
                  }
                  bgColor="#ffffff"
                />
              )}
            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={downloadPNG}>
                <Download className="mr-2 h-4 w-4" />
                PNG
              </Button>

              <Button
                variant="secondary"
                onClick={downloadSVG}
              >
                SVG
              </Button>

              <Button
                variant="secondary"
                onClick={downloadPDF}
              >
                PDF
              </Button>

              <Button
                variant="secondary"
                onClick={downloadEPS}
              >
                EPS
              </Button>

              <Button
                variant="outline"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
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