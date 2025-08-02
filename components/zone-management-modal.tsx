"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus, CheckCircle, AlertCircle, Users } from "lucide-react"
import { mockZones, addNewZone, getChurchesByZone } from "@/lib/mock-data"

interface ZoneManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onZoneAdded: () => void
}

export function ZoneManagementModal({ isOpen, onClose, onZoneAdded }: ZoneManagementModalProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError("El nombre de la zona es requerido")
      return
    }

    setLoading(true)
    setError(null)

    // Simular creación de zona
    setTimeout(() => {
      try {
        addNewZone({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
        })

        setSuccess(true)
        setLoading(false)

        // Cerrar formulario después de 1.5 segundos
        setTimeout(() => {
          setSuccess(false)
          setShowAddForm(false)
          setFormData({
            name: "",
            description: "",
          })
          onZoneAdded()
        }, 1500)
      } catch (err) {
        setError("Error al crear la zona")
        setLoading(false)
      }
    }, 1000)
  }

  const handleClose = () => {
    if (!loading) {
      setShowAddForm(false)
      setFormData({
        name: "",
        description: "",
      })
      setError(null)
      setSuccess(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Gestión de Zonas
          </DialogTitle>
          <DialogDescription>Administra las zonas geográficas para agrupar las iglesias</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lista de zonas existentes */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Zonas Existentes</h3>
              <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Zona
              </Button>
            </div>

            <div className="grid gap-4">
              {mockZones.map((zone) => {
                const churches = getChurchesByZone(zone.id)
                const totalMembers = churches.reduce((sum, church) => sum + church.member_count, 0)

                return (
                  <Card key={zone.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{zone.name}</CardTitle>
                          {zone.description && <CardDescription className="mt-1">{zone.description}</CardDescription>}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            {churches.length} iglesias
                          </Badge>
                          <Badge variant="secondary">{totalMembers} miembros</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    {churches.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1">
                          {churches.map((church) => (
                            <Badge key={church.id} variant="outline" className="text-xs">
                              {church.name}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Formulario para nueva zona */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agregar Nueva Zona</CardTitle>
                <CardDescription>Crea una nueva zona geográfica para agrupar iglesias</CardDescription>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-600 mb-2">¡Zona creada exitosamente!</h3>
                    <p className="text-gray-600">La zona ha sido registrada en el sistema.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre de la Zona *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej: Región del Maule"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Descripción opcional de la zona"
                        disabled={loading}
                        rows={3}
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
                        onClick={() => setShowAddForm(false)}
                        disabled={loading}
                        className="flex-1 bg-transparent"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? "Creando..." : "Crear Zona"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
