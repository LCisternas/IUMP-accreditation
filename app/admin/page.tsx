"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChurchIcon, Users, UserCheck, Plus, LogOut, MapPin, Settings, User, Shield, Eye, ChefHat } from "lucide-react"
import { ExcelUploader } from "@/components/excel-uploader"
import { mockChurches, mockAuth, getChurchesGroupedByZone, mockUsers } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

// Importar los componentes
import { ChurchDetailsModal } from "@/components/church-details-modal"
import { NewChurchModal } from "@/components/new-church-modal"
import { ZoneManagementModal } from "@/components/zone-management-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboard() {
  const [churches, setChurches] = useState(mockChurches)
  const [churchesGrouped, setChurchesGrouped] = useState<{ zone: any; churches: any[] }[]>([])
  const [stats, setStats] = useState({
    totalChurches: 0,
    totalMembers: 0,
    totalAccredited: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Estados para los modales
  const [selectedChurch, setSelectedChurch] = useState<any>(null)
  const [showChurchDetails, setShowChurchDetails] = useState(false)
  const [showNewChurch, setShowNewChurch] = useState(false)
  const [showZoneManagement, setShowZoneManagement] = useState(false)

  useEffect(() => {
    // Verificar autenticación
    const currentUser = mockAuth.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
      return
    }

    loadData()
  }, [router])

  const loadData = () => {
    // Simular carga de datos
    setTimeout(() => {
      const totalMembers = churches.reduce((sum, church) => sum + church.member_count, 0)
      const totalAccredited = churches.reduce((sum, church) => sum + church.accredited_count, 0)
      const grouped = getChurchesGroupedByZone()

      setStats({
        totalChurches: churches.length,
        totalMembers,
        totalAccredited,
      })
      setChurchesGrouped(grouped)
      setLoading(false)
    }, 500)
  }

  const handleSignOut = () => {
    mockAuth.signOut()
    router.push("/login")
  }

  const handleUploadComplete = () => {
    // Simular actualización de datos después de carga
    const updatedChurches = churches.map((church) => ({
      ...church,
      member_count: church.member_count + Math.floor(Math.random() * 10) + 1,
      accredited_count: church.accredited_count + Math.floor(Math.random() * 5) + 1,
    }))
    setChurches(updatedChurches)
    loadData()
  }

  const handleViewChurch = (church: any) => {
    setSelectedChurch(church)
    setShowChurchDetails(true)
  }

  const handleNewChurch = () => {
    setShowNewChurch(true)
  }

  const handleZoneManagement = () => {
    setShowZoneManagement(true)
  }

  const handleChurchAdded = () => {
    loadData()
  }

  const handleZoneAdded = () => {
    loadData()
  }

  const handleMembersUpdate = () => {
    loadData()
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Gestiona iglesias, miembros y acreditaciones</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Iglesias</CardTitle>
              <ChurchIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChurches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Miembros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acreditados</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAccredited}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalMembers > 0 ? Math.round((stats.totalAccredited / stats.totalMembers) * 100) : 0}% del total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="churches" className="space-y-6">
          <TabsList>
            <TabsTrigger value="churches">Iglesias por Zona</TabsTrigger>
            <TabsTrigger value="users">Usuarios por Rol</TabsTrigger>
            <TabsTrigger value="upload">Carga Masiva</TabsTrigger>
          </TabsList>

          <TabsContent value="churches" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Iglesias por Zona</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleZoneManagement}>
                  <Settings className="h-4 w-4 mr-2" />
                  Gestionar Zonas
                </Button>
                <Button onClick={handleNewChurch}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Iglesia
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              {churchesGrouped.map((group, index) => (
                <div key={group.zone?.id || "no-zone"} className="space-y-4">
                  {/* Encabezado de zona */}
                  <div className="flex items-center gap-3 pb-2 border-b">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {group.zone?.name || "Sin Zona Asignada"}
                      </h3>
                      {group.zone?.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{group.zone.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {group.churches.length} iglesias
                    </Badge>
                  </div>

                  {/* Iglesias de la zona */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.churches.map((church) => (
                      <Card key={church.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{church.name}</CardTitle>
                          <CardDescription>
                            {church.contact_person && `Contacto: ${church.contact_person}`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Miembros:</span>
                            <Badge variant={church.member_count >= church.member_limit ? "destructive" : "secondary"}>
                              {church.member_count}/{church.member_limit}
                            </Badge>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Acreditados:</span>
                            <Badge variant="outline">
                              {church.accredited_count}/{church.member_count}
                            </Badge>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${church.member_count > 0 ? (church.accredited_count / church.member_count) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>

                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => handleViewChurch(church)}
                          >
                            Ver Detalles
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {churchesGrouped.length === 0 && (
                <div className="text-center py-12">
                  <ChurchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No hay iglesias registradas</p>
                  <Button onClick={handleNewChurch}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Iglesia
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Usuarios por Rol</h2>
            </div>

            <div className="space-y-8">
              {/* Administradores */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <Shield className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Administradores</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Usuarios con acceso completo al sistema</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {mockUsers.filter((u) => u.role === "admin").length} usuarios
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUsers
                    .filter((u) => u.role === "admin")
                    .map((user) => (
                      <Card key={user.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="h-4 w-4 text-red-600" />
                            {user.full_name}
                          </CardTitle>
                          <CardDescription className="font-mono text-xs">{user.rut}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm">
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">Teléfono: {user.phone || "No registrado"}</p>
                            <p className="text-gray-600">Iglesia: {user.church_name || "No asignada"}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <Badge variant={user.is_accredited ? "default" : "secondary"}>
                              {user.is_accredited ? "Acreditado" : "Pendiente"}
                            </Badge>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Personal de Cocina */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <ChefHat className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal de Cocina</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Usuarios encargados del canje de tickets</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {mockUsers.filter((u) => u.role === "cocina").length} usuarios
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUsers
                    .filter((u) => u.role === "cocina")
                    .map((user) => (
                      <Card key={user.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <ChefHat className="h-4 w-4 text-orange-600" />
                            {user.full_name}
                          </CardTitle>
                          <CardDescription className="font-mono text-xs">{user.rut}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm">
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">Teléfono: {user.phone || "No registrado"}</p>
                            <p className="text-gray-600">Iglesia: {user.church_name || "No asignada"}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <Badge variant={user.is_accredited ? "default" : "secondary"}>
                              {user.is_accredited ? "Acreditado" : "Pendiente"}
                            </Badge>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Monitores */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monitores</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Usuarios encargados de gestionar sus iglesias
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {mockUsers.filter((u) => u.role === "monitor").length} usuarios
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUsers
                    .filter((u) => u.role === "monitor")
                    .map((user) => (
                      <Card key={user.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            {user.full_name}
                          </CardTitle>
                          <CardDescription className="font-mono text-xs">{user.rut}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm">
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">Teléfono: {user.phone || "No registrado"}</p>
                            <p className="text-gray-600">Iglesia: {user.church_name || "No asignada"}</p>
                            <p className="text-gray-600">Zona: {user.zone_name || "No asignada"}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <Badge variant={user.is_accredited ? "default" : "secondary"}>
                              {user.is_accredited ? "Acreditado" : "Pendiente"}
                            </Badge>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Asistentes */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Asistentes</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Miembros de las iglesias registrados para el evento
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {mockUsers.filter((u) => u.role === "attendee").length} usuarios
                  </Badge>
                </div>

                {mockUsers.filter((u) => u.role === "attendee").length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>RUT</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Iglesia</TableHead>
                            <TableHead>Zona</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockUsers
                            .filter((u) => u.role === "attendee")
                            .map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-mono text-sm">{user.rut}</TableCell>
                                <TableCell className="font-medium">{user.full_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone || "No registrado"}</TableCell>
                                <TableCell>{user.church_name || "No asignada"}</TableCell>
                                <TableCell>{user.zone_name || "No asignada"}</TableCell>
                                <TableCell>
                                  <Badge variant={user.is_accredited ? "default" : "secondary"}>
                                    {user.is_accredited ? "Acreditado" : "Pendiente"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" className="bg-transparent">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ver
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No hay asistentes registrados</p>
                    <p className="text-sm text-gray-500">Los asistentes se registran a través de las iglesias</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {churches.map((church) => (
                <ExcelUploader
                  key={church.id}
                  churchId={church.id}
                  churchName={church.name}
                  onUploadComplete={handleUploadComplete}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales */}
      <ChurchDetailsModal
        church={selectedChurch}
        isOpen={showChurchDetails}
        onClose={() => setShowChurchDetails(false)}
        onMembersUpdate={handleMembersUpdate}
      />

      <NewChurchModal
        isOpen={showNewChurch}
        onClose={() => setShowNewChurch(false)}
        onChurchAdded={handleChurchAdded}
      />

      <ZoneManagementModal
        isOpen={showZoneManagement}
        onClose={() => setShowZoneManagement(false)}
        onZoneAdded={handleZoneAdded}
      />
    </div>
  )
}
