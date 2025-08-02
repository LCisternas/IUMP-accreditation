"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Scan, CheckCircle, XCircle, User } from "lucide-react"
import { mockTickets, mockUsers } from "@/lib/mock-data"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ScannerPage() {
  const [qrCode, setQrCode] = useState("")
  const [scanResult, setScanResult] = useState<any>(null)
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    if (!qrCode.trim()) return

    setScanning(true)
    setScanResult(null)

    // Simular escaneo
    setTimeout(() => {
      const ticket = mockTickets.find((t) => t.qr_code === qrCode.trim())

      if (!ticket) {
        setScanResult({
          success: false,
          message: "Código QR no válido",
        })
      } else if (ticket.is_used) {
        setScanResult({
          success: false,
          message: "Este cupón ya fue utilizado",
          ticket,
          usedAt: ticket.used_at,
        })
      } else {
        // Encontrar usuario asociado
        const user = mockUsers.find((u) => u.id === ticket.user_id)

        setScanResult({
          success: true,
          message: "Cupón válido - Listo para usar",
          ticket,
          user,
        })
      }

      setScanning(false)
    }, 1000)
  }

  const handleUseTicket = () => {
    if (scanResult?.ticket) {
      // Simular uso del ticket
      setScanResult({
        ...scanResult,
        success: true,
        message: "¡Cupón utilizado exitosamente!",
        ticket: {
          ...scanResult.ticket,
          is_used: true,
          used_at: new Date().toISOString(),
        },
      })
      setQrCode("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Escáner de Cupones</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Escanea los códigos QR para validar cupones</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Scanner Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Escanear Código QR
            </CardTitle>
            <CardDescription>Ingresa o escanea el código QR del cupón</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-code">Código QR</Label>
              <Input
                id="qr-code"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="Ej: LUNCH-2024-ABC123"
                className="font-mono"
              />
            </div>

            <Button onClick={handleScan} disabled={!qrCode.trim() || scanning} className="w-full">
              <Scan className="h-4 w-4 mr-2" />
              {scanning ? "Escaneando..." : "Escanear Cupón"}
            </Button>
          </CardContent>
        </Card>

        {/* Scan Result */}
        {scanResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {scanResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Resultado del Escaneo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant={scanResult.success ? "default" : "destructive"}>
                <AlertDescription>{scanResult.message}</AlertDescription>
              </Alert>

              {scanResult.ticket && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Tipo de Cupón</Label>
                      <p className="capitalize">
                        {scanResult.ticket.ticket_type === "lunch" ? "Almuerzo" : scanResult.ticket.ticket_type}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Estado</Label>
                      <div>
                        <Badge variant={scanResult.ticket.is_used ? "destructive" : "default"}>
                          {scanResult.ticket.is_used ? "Utilizado" : "Disponible"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {scanResult.user && (
                    <div className="border-t pt-4">
                      <Label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        Información del Asistente
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p>
                          <strong>Nombre:</strong> {scanResult.user.full_name}
                        </p>
                        <p>
                          <strong>Email:</strong> {scanResult.user.email}
                        </p>
                        <p>
                          <strong>Iglesia:</strong> {scanResult.user.church_name || "No asignada"}
                        </p>
                        <p>
                          <strong>Acreditado:</strong> {scanResult.user.is_accredited ? "Sí" : "No"}
                        </p>
                      </div>
                    </div>
                  )}

                  {scanResult.ticket.is_used && scanResult.ticket.used_at && (
                    <div className="text-sm text-gray-600">
                      <strong>Utilizado el:</strong> {new Date(scanResult.ticket.used_at).toLocaleString()}
                    </div>
                  )}

                  {scanResult.success && !scanResult.ticket.is_used && (
                    <Button onClick={handleUseTicket} className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Utilizado
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Códigos de prueba */}
        <Card>
          <CardHeader>
            <CardTitle>Códigos de Prueba</CardTitle>
            <CardDescription>Usa estos códigos para probar el escáner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <code className="bg-gray-100 px-2 py-1 rounded">LUNCH-2024-ABC123</code>
                <Badge variant="default">Disponible</Badge>
              </div>
              <div className="flex justify-between items-center">
                <code className="bg-gray-100 px-2 py-1 rounded">LUNCH-2024-DEF456</code>
                <Badge variant="destructive">Utilizado</Badge>
              </div>
              <div className="flex justify-between items-center">
                <code className="bg-gray-100 px-2 py-1 rounded">LUNCH-2024-GHI789</code>
                <Badge variant="default">Disponible</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
