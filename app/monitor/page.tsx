"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChurchIcon, Users, UserCheck, LogOut, CheckCircle, Clock, Eye } from "lucide-react"
import { mockAuth, mockChurches, getMembersByChurch, type User } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { MemberDetailsModal } from "@/components/member-details-modal"

export default function MonitorDashboard() {
  const [churchData, setChurchData] = useState<any>(null)
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<User | null>(null)
  const [showMemberDetails, setShowMemberDetails] = useState(false)
  const router = useRouter()

  // useEffect(() => {
  //   // Verificar autenticación
  //   const currentUser = mockAuth.getCurrentUser()
  //   if (!currentUser || currentUser.role !== "monitor") {
  //     router.push("/login")
  //     return
  //   }

  //   loadData(currentUser)
  // }, [router])

  const loadData = (currentUser: any) => {
    // Simular carga de datos
    setTimeout(() => {
      // Obtener datos de la iglesia del monitor
      const church = mockChurches.find((c) => c.id === currentUser.church_id)

      // Obtener miembros de la iglesia
      const churchMembers = getMembersByChurch(currentUser.church_id)

      setChurchData(church)
      setMembers(churchMembers)
      setLoading(false)
    }, 500)
  }

  const handleSignOut = () => {
    mockAuth.signOut()
    router.push("/login")
  }

  const handleViewMember = (member: User) => {
    setSelectedMember(member)
    setShowMemberDetails(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (!churchData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <p>No se encontraron datos de la iglesia</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const accreditedCount = members.filter((m) => m.is_accredited).length
  const availableSlots = churchData.member_limit - members.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Monitor</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{churchData.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Estadísticas de la iglesia */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mi Iglesia</CardTitle>
              <ChurchIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{churchData.name}</div>
              <p className="text-xs text-muted-foreground">Límite: {churchData.member_limit} miembros</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Miembros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-muted-foreground">de {churchData.member_limit}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acreditados</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accreditedCount}</div>
              <p className="text-xs text-muted-foreground">
                {members.length > 0 ? Math.round((accreditedCount / members.length) * 100) : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Espacios Disponibles</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
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
                <CardTitle className="text-gray-900 dark:text-white">Miembros de la Iglesia</CardTitle>
                <CardDescription>Lista de miembros registrados en tu iglesia</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {members.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RUT</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
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
                        <Badge variant={member.is_accredited ? "default" : "secondary"} className="cursor-default">
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
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMember(member)}
                          className="bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No hay miembros registrados en esta iglesia</p>
                <p className="text-sm text-gray-500">
                  Los miembros deben ser agregados por un administrador del sistema.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de detalles del miembro */}
      <MemberDetailsModal
        member={selectedMember}
        isOpen={showMemberDetails}
        onClose={() => {
          setShowMemberDetails(false)
          setSelectedMember(null)
        }}
      />
    </div>
  )
}
