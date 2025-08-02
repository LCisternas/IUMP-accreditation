"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QRGenerator } from "@/components/qr-generator"
import {
  User,
  Phone,
  Mail,
  Church,
  MapPin,
  CheckCircle,
  Clock,
  Utensils,
  Coffee,
  CreditCard,
  Calendar,
} from "lucide-react"
import { mockTickets, type User as UserType, type Ticket } from "@/lib/mock-data"

interface MemberDetailsModalProps {
  member: UserType | null
  isOpen: boolean
  onClose: () => void
}

export function MemberDetailsModal({ member, isOpen, onClose }: MemberDetailsModalProps) {
  const [memberTickets, setMemberTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (member && isOpen) {
      loadMemberTickets()
    }
  }, [member, isOpen])

  const loadMemberTickets = () => {
    if (!member) return

    setLoading(true)
    // Simular carga de tickets
    setTimeout(() => {
      const tickets = mockTickets.filter((t) => t.user_id === member.id)
      setMemberTickets(tickets)
      setLoading(false)
    }, 300)
  }

  const getTicketIcon = (type: string) => {
    switch (type) {
      case "lunch":
        return <Utensils className="h-5 w-5" />
      case "once":
        return <Coffee className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getTicketLabel = (type: string) => {
    switch (type) {
      case "lunch":
        return "Almuerzo"
      case "once":
        return "Once"
      default:
        return type
    }
  }

  if (!member) return null

  const lunchTicket = memberTickets.find((t) => t.ticket_type === "lunch")
  const onceTicket = memberTickets.find((t) => t.ticket_type === "once")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Miembro
          </DialogTitle>
          <DialogDescription>Detalles completos del miembro y estado de sus tickets</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">RUT:</span>
                  </div>
                  <p className="text-lg font-mono">{member.rut}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Nombre Completo:</span>
                  </div>
                  <p className="text-lg">{member.full_name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                  </div>
                  <p className="text-lg">{member.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                  </div>
                  <p className="text-lg">{member.phone || "No registrado"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Church className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Iglesia:</span>
                  </div>
                  <p className="text-lg">{member.church_name || "No asignada"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Zona:</span>
                  </div>
                  <p className="text-lg">{member.zone_name || "No asignada"}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Estado de Acreditación:</span>
                  <Badge variant={member.is_accredited ? "default" : "secondary"}>
                    {member.is_accredited ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Acreditado
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                      </>
                    )}
                  </Badge>
                </div>
                {member.is_accredited && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Fecha de registro: {new Date(member.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tickets del Miembro */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Tickets del Miembro
            </h3>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Cargando tickets...</p>
              </div>
            ) : memberTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memberTickets.map((ticket) => (
                  <Card key={ticket.id} className={ticket.is_used ? "opacity-75" : ""}>
                    <CardHeader>
                      <CardTitle className="capitalize flex items-center gap-2">
                        {getTicketIcon(ticket.ticket_type)}
                        Ticket de {getTicketLabel(ticket.ticket_type)}
                      </CardTitle>
                      <CardDescription>
                        {ticket.is_used ? (
                          <span className="text-red-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Canjeado el {new Date(ticket.used_at!).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-green-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Disponible para canjear
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Información del ticket */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Código QR:</span>
                          <p className="font-mono text-xs mt-1">{ticket.qr_code}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Estado:</span>
                          <div className="mt-1">
                            <Badge variant={ticket.is_used ? "destructive" : "default"}>
                              {ticket.is_used ? "Canjeado" : "Disponible"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="text-center">
                        <QRGenerator value={ticket.qr_code} size={150} className={ticket.is_used ? "grayscale" : ""} />
                      </div>

                      {/* Información adicional si está usado */}
                      {ticket.is_used && ticket.used_at && (
                        <div className="pt-3 border-t text-sm text-gray-600">
                          <div className="space-y-1">
                            <p>
                              <strong>Fecha de canje:</strong> {new Date(ticket.used_at).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Hora de canje:</strong> {new Date(ticket.used_at).toLocaleTimeString()}
                            </p>
                            {ticket.used_by && (
                              <p>
                                <strong>Canjeado por:</strong> Personal de cocina
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Fecha de creación */}
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Ticket creado: {new Date(ticket.created_at).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center p-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay tickets asignados a este miembro</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumen de tickets */}
          {memberTickets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{memberTickets.length}</p>
                    <p className="text-sm text-gray-600">Total Tickets</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {memberTickets.filter((t) => !t.is_used).length}
                    </p>
                    <p className="text-sm text-gray-600">Disponibles</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{memberTickets.filter((t) => t.is_used).length}</p>
                    <p className="text-sm text-gray-600">Canjeados</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round((memberTickets.filter((t) => t.is_used).length / memberTickets.length) * 100)}%
                    </p>
                    <p className="text-sm text-gray-600">Uso</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
