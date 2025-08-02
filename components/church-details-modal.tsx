"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Users, Mail, Phone, UserPlus, MapPin } from "lucide-react"
import { getMembersByChurch, updateUserAccreditation, mockAuth, type Church, type User } from "@/lib/mock-data"
import { AddMemberModal } from "./add-member-modal"

interface ChurchDetailsModalProps {
  church: Church | null
  isOpen: boolean
  onClose: () => void
  onMembersUpdate?: () => void
}

export function ChurchDetailsModal({ church, isOpen, onClose, onMembersUpdate }: ChurchDetailsModalProps) {
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    if (church && isOpen) {
      loadMembers()
      setCurrentUser(mockAuth.getCurrentUser())
    }
  }, [church, isOpen])

  const loadMembers = () => {
    if (!church) return

    setLoading(true)
    // Simular carga de datos
    setTimeout(() => {
      const churchMembers = getMembersByChurch(church.id)
      setMembers(churchMembers)
      setLoading(false)
    }, 500)
  }

  const handleToggleAccreditation = (userId: string, currentStatus: boolean) => {
    // Solo admin puede acreditar
    if (currentUser?.role !== "admin") return

    // Actualizar estado local inmediatamente
    setMembers((prev) =>
      prev.map((member) => (member.id === userId ? { ...member, is_accredited: !currentStatus } : member)),
    )

    // Actualizar en los datos mock
    updateUserAccreditation(userId, !currentStatus)

    // Notificar al componente padre para actualizar estadísticas
    if (onMembersUpdate) {
      onMembersUpdate()
    }
  }

  const handleMemberAdded = () => {
    loadMembers()
    if (onMembersUpdate) {
      onMembersUpdate()
    }
  }

  if (!church) return null

  const accreditedCount = members.filter((m) => m.is_accredited).length
  const availableSlots = church.member_limit - members.length
  const canAddMembers = currentUser?.role === "admin" || currentUser?.role === "monitor"
  const canAccredit = currentUser?.role === "admin"

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {church.name}
            </DialogTitle>
            <DialogDescription>Información detallada de la iglesia y gestión de miembros</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Información de la iglesia */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Zona:</span>
                  </div>
                  <p>{church.zone_name || "Sin zona asignada"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Persona de Contacto:</span>
                  </div>
                  <p>{church.contact_person || "No especificado"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Email:</span>
                  </div>
                  <p>{church.contact_email || "No especificado"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Teléfono:</span>
                  </div>
                  <p>{church.contact_phone || "No especificado"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Límite de Miembros:</span>
                  </div>
                  <p>{church.member_limit}</p>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Miembros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{members.length}</div>
                  <p className="text-xs text-muted-foreground">de {church.member_limit}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Acreditados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{accreditedCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {members.length > 0 ? Math.round((accreditedCount / members.length) * 100) : 0}% del total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{members.length - accreditedCount}</div>
                  <p className="text-xs text-muted-foreground">Por acreditar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Espacios Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{availableSlots}</div>
                  <p className="text-xs text-muted-foreground">Cupos libres</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de miembros */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Miembros de la Iglesia</CardTitle>
                    <CardDescription>
                      {canAccredit
                        ? "Gestiona el estado de acreditación de los miembros"
                        : "Lista de miembros de la iglesia"}
                    </CardDescription>
                  </div>
                  {canAddMembers && (
                    <Button onClick={() => setShowAddMember(true)} disabled={availableSlots <= 0}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Miembro
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Cargando miembros...</p>
                  </div>
                ) : members.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>RUT</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Estado</TableHead>
                        {canAccredit && <TableHead>Acciones</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-mono text-sm">{member.rut}</TableCell>
                          <TableCell className="font-medium">{member.full_name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.phone || "No registrado"}</TableCell>
                          <TableCell>
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
                          </TableCell>
                          {canAccredit && (
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleAccreditation(member.id, member.is_accredited)}
                              >
                                {member.is_accredited ? "Desacreditar" : "Acreditar"}
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No hay miembros registrados en esta iglesia</p>
                    {canAddMembers && (
                      <Button onClick={() => setShowAddMember(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Agregar Primer Miembro
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        onMemberAdded={handleMemberAdded}
        church={church}
        availableSlots={availableSlots}
      />
    </>
  )
}
