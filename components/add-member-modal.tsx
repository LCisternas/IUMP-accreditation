"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react"
import { addNewMember, formatRUT, type Church } from "@/lib/mock-data"

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onMemberAdded: () => void
  church: Church
  availableSlots: number
}

export function AddMemberModal({ isOpen, onClose, onMemberAdded, church, availableSlots }: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    rut: "",
    full_name: "",
    email: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "rut") {
      // Formatear RUT mientras se escribe
      const cleanValue = value.replace(/[.-]/g, "")
      if (cleanValue.length <= 9) {
        setFormData((prev) => ({
          ...prev,
          [name]: cleanValue,
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.rut.trim()) {
      setError("El RUT es requerido")
      return
    }

    if (!formData.full_name.trim()) {
      setError("El nombre completo es requerido")
      return
    }

    if (!formData.email.trim()) {
      setError("El email es requerido")
      return
    }

    if (availableSlots <= 0) {
      setError("La iglesia ha alcanzado su límite de miembros")
      return
    }

    setLoading(true)
    setError(null)

    // Simular creación de miembro
    setTimeout(() => {
      const result = addNewMember({
        rut: formData.rut,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        church_id: church.id,
      })

      if (!result.success) {
        setError(result.error || "Error al crear el miembro")
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)

      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        setSuccess(false)
        setFormData({
          rut: "",
          full_name: "",
          email: "",
          phone: "",
        })
        onMemberAdded()
        onClose()
      }, 1500)
    }, 1000)
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        rut: "",
        full_name: "",
        email: "",
        phone: "",
      })
      setError(null)
      setSuccess(false)
      onClose()
    }
  }

  const displayRUT = formData.rut ? formatRUT(formData.rut) : ""

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Agregar Miembro
          </DialogTitle>
          <DialogDescription>
            Agregar nuevo miembro a {church.name}
            <br />
            <span className="text-sm text-muted-foreground">
              Espacios disponibles: {availableSlots} de {church.member_limit}
            </span>
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">¡Miembro agregado exitosamente!</h3>
            <p className="text-gray-600">El miembro ha sido registrado y se le ha asignado un cupón de almuerzo.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rut">RUT *</Label>
              <Input
                id="rut"
                name="rut"
                value={displayRUT}
                onChange={handleInputChange}
                placeholder="12345678-9"
                required
                disabled={loading}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre Completo *</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Juan Carlos Mendoza"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="juan@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+56912345678"
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {availableSlots <= 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  La iglesia ha alcanzado su límite máximo de {church.member_limit} miembros
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 bg-transparent"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || availableSlots <= 0} className="flex-1">
                {loading ? "Agregando..." : "Agregar Miembro"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
