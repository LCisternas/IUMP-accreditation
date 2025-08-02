"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CheckCircle, XCircle, X } from "lucide-react"

interface QRScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (qrCode: string) => Promise<{ success: boolean; message: string }>
}

export function QRScannerModal({ isOpen, onClose, onScan }: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null)
  const [hasCamera, setHasCamera] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scannerRef = useRef<any>(null)

  useEffect(() => {
    if (isOpen && !scanResult) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, scanResult])

  const startCamera = async () => {
    try {
      // Importar QrScanner dinámicamente
      const QrScanner = (await import("qr-scanner")).default

      if (!videoRef.current) return

      // Verificar si hay cámaras disponibles
      const hasCamera = await QrScanner.hasCamera()
      if (!hasCamera) {
        setHasCamera(false)
        return
      }

      // Crear el escáner
      const qrScanner = new QrScanner(
        videoRef.current,
        async (result) => {
          if (isProcessing) return

          setIsProcessing(true)
          setIsScanning(false)

          try {
            const scanResult = await onScan(result.data)
            setScanResult(scanResult)
          } catch (error) {
            setScanResult({
              success: false,
              message: "Error al procesar el código QR",
            })
          } finally {
            setIsProcessing(false)
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: "environment", // Usar cámara trasera por defecto
        },
      )

      scannerRef.current = qrScanner
      await qrScanner.start()
      setIsScanning(true)
      setHasCamera(true)
    } catch (error) {
      console.error("Error starting camera:", error)
      setHasCamera(false)
    }
  }

  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current.destroy()
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  const handleClose = () => {
    stopCamera()
    setScanResult(null)
    setIsProcessing(false)
    onClose()
  }

  const handleTryAgain = () => {
    setScanResult(null)
    setIsProcessing(false)
    startCamera()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Escanear Código QR
          </DialogTitle>
          <DialogDescription>
            {scanResult ? "Resultado del escaneo" : "Apunta la cámara hacia el código QR del ticket"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!hasCamera ? (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                No se pudo acceder a la cámara. Verifica los permisos o usa el escáner manual.
              </AlertDescription>
            </Alert>
          ) : scanResult ? (
            // Mostrar resultado del escaneo
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {scanResult.success ? (
                  <CheckCircle className="h-16 w-16 text-green-600" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-600" />
                )}
              </div>

              <Alert variant={scanResult.success ? "default" : "destructive"}>
                <AlertDescription className="text-center">{scanResult.message}</AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Cerrar
                </Button>
                {!scanResult.success && (
                  <Button onClick={handleTryAgain} className="flex-1">
                    Intentar de Nuevo
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // Mostrar cámara y controles
            <div className="space-y-4">
              <div className="relative">
                <video ref={videoRef} className="w-full h-64 bg-black rounded-lg object-cover" playsInline muted />

                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p>Procesando...</p>
                    </div>
                  </div>
                )}
              </div>

              {isScanning && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mantén el código QR dentro del marco de la cámara
                  </p>
                </div>
              )}

              <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
