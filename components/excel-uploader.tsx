"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ExcelUploaderProps {
  churchId: string
  churchName: string
  onUploadComplete: () => void
}

export function ExcelUploader({ churchId, churchName, onUploadComplete }: ExcelUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type.includes("sheet") ||
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls")
      ) {
        setFile(selectedFile)
        setError(null)
        setSuccess(null)
      } else {
        setError("Por favor selecciona un archivo Excel válido (.xlsx o .xls)")
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(null)

    // Simular carga de archivo
    setTimeout(() => {
      const randomMembers = Math.floor(Math.random() * 20) + 5
      setSuccess(`${randomMembers} miembros cargados exitosamente para ${churchName}`)
      setUploading(false)
      setFile(null)

      // Reset input
      const input = document.getElementById(`excel-file-${churchId}`) as HTMLInputElement
      if (input) input.value = ""

      onUploadComplete()
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Carga Masiva - {churchName}
        </CardTitle>
        <CardDescription>
          Sube un archivo Excel con los datos de los miembros. El archivo debe contener las columnas: Nombre Completo,
          Email, Teléfono.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`excel-file-${churchId}`}>Archivo Excel</Label>
          <Input id={`excel-file-${churchId}`} type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="dark:border-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="dark:text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Cargando..." : "Cargar Miembros"}
        </Button>
      </CardContent>
    </Card>
  )
}
