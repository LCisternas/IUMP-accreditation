"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChefHat,
  Coffee,
  Utensils,
  Users,
  CheckCircle,
  Clock,
  LogOut,
  Scan,
  Phone,
  MapPin,
  Church,
  Camera,
} from "lucide-react"
import {
  mockAuth,
  getTicketStats,
  getUsersWithTickets,
  useTicket,
  mockTickets,
  mockUsers,
  type User,
  type Ticket,
} from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { QRScannerModal } from "@/components/qr-scanner-modal"

export default function CocinaDashboard() {
  const [stats, setStats] = useState({
    lunch: { used: 0, total: 0, remaining: 0 },
    once: { used: 0, total: 0, remaining: 0 },
  })
  const [usersWithTickets, setUsersWithTickets] = useState<
    Array<{
      user: User
      lunchTicket: Ticket | null
      onceTicket: Ticket | null
    }>
  >([])
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState("")
  const [scanResult, setScanResult] = useState<any>(null)
  const [scanning, setScanning] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const router = useRouter()
  const currentUser = mockAuth.getCurrentUser()

  const handleSignOut = () => {
    mockAuth.signOut()
    router.push("/login")
  }

  const handleScan = () => {
    if (!qrCode.trim()) return

    setScanning(true)
    setScanResult(null)

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
          message: "Este ticket ya fue utilizado",
          ticket,
          usedAt: ticket.used_at,
        })
      } else {
        const user = mockUsers.find((u) => u.id === ticket.user_id)

        setScanResult({
          success: true,
          message: "Ticket válido - Listo para canjear",
          ticket,
          user,
        })
      }

      setScanning(false)
    }, 1000)
  }

  const handleUseTicket = () => {
    const ticket = scanResult.ticket
    const userId = currentUser.id
    const result = useTicket(ticket.qr_code, userId)

    if (result.success) {
      setScanResult({
        ...scanResult,
        success: true,
        message: "¡Ticket canjeado exitosamente!",
        ticket: {
          ...ticket,
          is_used: true,
          used_at: new Date().toISOString(),
        },
      })
      setQrCode("")
      loadData() // Recargar datos después del canje
    } else {
      setScanResult({
        ...scanResult,
        success: false,
        message: result.error || "Error al canjear ticket",
      })
    }
  }

  const handleQRScan = async (qrCodeValue: string): Promise<{ success: boolean; message: string }> => {
    const ticket = mockTickets.find((t) => t.qr_code === qrCodeValue)

    if (!ticket) {
      return {
        success: false,
        message: "Código QR no válido",
      }
    }

    if (ticket.is_used) {
      return {
        success: false,
        message: "Este ticket ya fue canjeado",
      }
    }

    // Canjear el ticket automáticamente
    const result = useTicket(qrCodeValue, currentUser.id)

    if (result.success) {
      // Recargar datos después del canje
      loadData()

      const user = mockUsers.find((u) => u.id === ticket.user_id)
      const ticketType = ticket.ticket_type === "lunch" ? "almuerzo" : "once"

      return {
        success: true,
        message: `¡Ticket de ${ticketType} canjeado exitosamente!\n${user?.full_name || "Usuario"}`,
      }
    } else {
      return {
        success: false,
        message: result.error || "Error al canjear el ticket",
      }
    }
  }

  const getTicketTypeLabel = (type: string) => {
    switch (type) {
      case "lunch":
        return "Almuerzo"
      case "once":
        return "Once"
      default:
        return type
    }
  }

  const loadData = () => {
    setTimeout(() => {
      const ticketStats = getTicketStats()
      const usersData = getUsersWithTickets()

      setStats(ticketStats)
      setUsersWithTickets(usersData)
      setLoading(false)
    }, 500)
  }

  // useEffect(() => {
  //   if (!currentUser || currentUser.role !== "cocina") {
  //     router.push("/login")
  //     return
  //   }

  //   loadData()
  // }, [router])

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ChefHat className="h-8 w-8" />
              Panel de Cocina
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Gestión de tickets de almuerzo y once</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Almuerzos Canjeados</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lunch.used}</div>
              <p className="text-xs text-muted-foreground">de {stats.lunch.total} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Onces Canjeadas</CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.once.used}</div>
              <p className="text-xs text-muted-foreground">de {stats.once.total} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Almuerzos Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lunch.remaining}</div>
              <p className="text-xs text-muted-foreground">por canjear</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Onces Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.once.remaining}</div>
              <p className="text-xs text-muted-foreground">por canjear</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scanner">Escáner QR</TabsTrigger>
            <TabsTrigger value="users">Lista de Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            {/* Botón principal para escanear con cámara */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Escanear con Cámara
                </CardTitle>
                <CardDescription>Usa la cámara de tu dispositivo para escanear códigos QR</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowQRScanner(true)} className="w-full h-16 text-lg" size="lg">
                  <Camera className="h-6 w-6 mr-3" />
                  Abrir Escáner de Cámara
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    Escaneo Manual
                  </CardTitle>
                  <CardDescription>Ingresa manualmente el código QR del ticket</CardDescription>
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
                    {scanning ? "Escaneando..." : "Escanear Ticket"}
                  </Button>
                </CardContent>
              </Card>

              {scanResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {scanResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-red-600" />
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
                            <Label className="text-sm font-medium text-gray-600">Tipo de Ticket</Label>
                            <p className="capitalize">{getTicketTypeLabel(scanResult.ticket.ticket_type)}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Estado</Label>
                            <div>
                              <Badge variant={scanResult.ticket.is_used ? "destructive" : "default"}>
                                {scanResult.ticket.is_used ? "Canjeado" : "Disponible"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {scanResult.user && (
                          <div className="border-t pt-4">
                            <Label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4" />
                              Información del Asistente
                            </Label>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <p>
                                <strong>Nombre:</strong> {scanResult.user.full_name}
                              </p>
                              <p className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <strong>Teléfono:</strong> {scanResult.user.phone || "No registrado"}
                              </p>
                              <p className="flex items-center gap-1">
                                <Church className="h-3 w-3" />
                                <strong>Iglesia:</strong> {scanResult.user.church_name || "No asignada"}
                              </p>
                              <p className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <strong>Zona:</strong> {scanResult.user.zone_name || "No asignada"}
                              </p>
                            </div>
                          </div>
                        )}

                        {scanResult.ticket.is_used && scanResult.ticket.used_at && (
                          <div className="text-sm text-gray-600">
                            <strong>Canjeado el:</strong> {new Date(scanResult.ticket.used_at).toLocaleString()}
                          </div>
                        )}

                        {scanResult.success && !scanResult.ticket.is_used && (
                          <Button onClick={handleUseTicket} className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Canjear Ticket
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Códigos de Prueba</CardTitle>
                <CardDescription>Usa estos códigos para probar el escáner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Almuerzos:</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">LUNCH-2024-ABC123</code>
                        <Badge variant="default">Disponible</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">LUNCH-2024-DEF456</code>
                        <Badge variant="destructive">Canjeado</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">LUNCH-2024-GHI789</code>
                        <Badge variant="default">Disponible</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Onces:</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">ONCE-2024-ABC123</code>
                        <Badge variant="destructive">Canjeado</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">ONCE-2024-DEF456</code>
                        <Badge variant="default">Disponible</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">ONCE-2024-GHI789</code>
                        <Badge variant="default">Disponible</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Lista de Usuarios y Tickets
                    </CardTitle>
                    <CardDescription>Todos los usuarios registrados con el estado de sus tickets</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={loadData}
                    disabled={loading}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <svg
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {loading ? "Cargando..." : "Recargar"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersWithTickets.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Iglesia</TableHead>
                        <TableHead>Zona</TableHead>
                        <TableHead>Almuerzo</TableHead>
                        <TableHead>Once</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersWithTickets.map(({ user, lunchTicket, onceTicket }) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.phone || "No registrado"}</TableCell>
                          <TableCell>{user.church_name || "No asignada"}</TableCell>
                          <TableCell>{user.zone_name || "No asignada"}</TableCell>
                          <TableCell>
                            {lunchTicket ? (
                              <Badge variant={lunchTicket.is_used ? "default" : "secondary"}>
                                {lunchTicket.is_used ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Canjeado
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pendiente
                                  </>
                                )}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Sin ticket</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {onceTicket ? (
                              <Badge variant={onceTicket.is_used ? "default" : "secondary"}>
                                {onceTicket.is_used ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Canjeado
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pendiente
                                  </>
                                )}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Sin ticket</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay usuarios registrados</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal del escáner QR */}
      <QRScannerModal isOpen={showQRScanner} onClose={() => setShowQRScanner(false)} onScan={handleQRScan} />
    </div>
  )
}
