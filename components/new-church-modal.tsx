"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Church, CheckCircle, AlertCircle } from "lucide-react"
import { addNewChurch, mockZones } from "@/lib/mock-data"

interface NewChurchModalProps {
  isOpen: boolean
  onClose: () => void
  onChurchAdded: () => void
}

export function NewChurchModal({ isOpen, onClose, onChurchAdded }: NewChurchModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    member_limit: "50",
    zone_id: "defaultZoneId", // Updated default value to be a non-empty string
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleZoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      zone_id: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError("El nombre de la iglesia es requerido")
      return
    }

    if (Number.parseInt(formData.member_limit) < 1) {
      setError("El límite de miembros debe ser mayor a 0")
      return
    }

    setLoading(true)
    setError(null)

    // Simular creación de iglesia
    setTimeout(() => {
      try {
        addNewChurch({
          name: formData.name.trim(),
          contact_person: formData.contact_person.trim() || null,
          contact_email: formData.contact_email.trim() || null,
          contact_phone: formData.contact_phone.trim() || null,
          member_limit: Number.parseInt(formData.member_limit),
          zone_id: formData.zone_id || null,
        })

        setSuccess(true)
        setLoading(false)

        // Cerrar modal después de 1.5 segundos
        setTimeout(() => {
          setSuccess(false)
          setFormData({
            name: "",
            contact_person: "",
            contact_email: "",
            contact_phone: "",
            member_limit: "50",
            zone_id: "defaultZoneId", // Updated default value to be a non-empty string
          })
          onChurchAdded()
          onClose()
        }, 1500)
      } catch (err) {
        setError("Error al crear la iglesia")
        setLoading(false)
      }
    }, 1000)
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        contact_person: "",
        contact_email: "",
        contact_phone: "",
        member_limit: "50",
        zone_id: "defaultZoneId", // Updated default value to be a non-empty string
      })
      setError(null)
      setSuccess(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Church className="h-5 w-5" />
            Nueva Iglesia
          </DialogTitle>
          <DialogDescription>Registra una nueva iglesia en el sistema</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">¡Iglesia creada exitosamente!</h3>
            <p className="text-gray-600">La iglesia ha sido registrada en el sistema.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Iglesia *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: IUMP Iglesia Central"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zone_id">Zona</Label>
              <Select value={formData.zone_id} onValueChange={handleZoneChange} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una zona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defaultZoneId">Sin zona asignada</SelectItem>{" "}
                  {/* Updated value prop to be a non-empty string */}
                  {mockZones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_person">Persona de Contacto</Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleInputChange}
                placeholder="Ej: Pastor Juan Pérez"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Email de Contacto</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="pastor@iglesia.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={handleInputChange}
                placeholder="+1234567890"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member_limit">Límite de Miembros *</Label>
              <Input
                id="member_limit"
                name="member_limit"
                type="number"
                min="1"
                value={formData.member_limit}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
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
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creando..." : "Crear Iglesia"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
