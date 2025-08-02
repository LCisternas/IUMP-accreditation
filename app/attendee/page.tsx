"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QRGenerator } from "@/components/qr-generator"
import { mockAuth, mockTickets } from "@/lib/mock-data"
import { User, Church, Ticket, CheckCircle, Clock, LogOut, CreditCard, Coffee, Utensils } from "lucide-react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AttendeePage() {
  const [userData, setUserData] = useState<any>(null)
  const [userTickets, setUserTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticación
    const currentUser = mockAuth.getCurrentUser()
    if (!currentUser || currentUser.role !== "attendee") {
      router.push("/login")
      return
    }

    loadUserData(currentUser)
  }, [router])

  const loadUserData = (currentUser: any) => {
    // Simular carga de datos
    setTimeout(() => {
      // Obtener tickets del usuario (incluyendo almuerzo y once)
      const tickets = mockTickets.filter((t) => t.user_id === currentUser.id)

      setUserData(currentUser)
      setUserTickets(tickets)
      setLoading(false)
    }, 500)
  }

  const handleSignOut = () => {
    mockAuth.signOut()
    router.push("/login")
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <p>No se pudo cargar la información del usuario</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Acreditación</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Información personal y cupones del evento</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">RUT</label>
                <p className="text-lg font-mono">{userData.rut}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                <p className="text-lg">{userData.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg">{userData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <p className="text-lg">{userData.phone || "No registrado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Iglesia</label>
                <p className="text-lg flex items-center gap-2">
                  <Church className="h-4 w-4" />
                  {userData.church_name || "No asignada"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Zona</label>
                <p className="text-lg">{userData.zone_name || "No asignada"}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Estado de Acreditación:</span>
                <Badge variant={userData.is_accredited ? "default" : "secondary"}>
                  {userData.is_accredited ? (
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
            </div>
          </CardContent>
        </Card>

        {/* Cupones/Tickets */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <Ticket className="h-5 w-5" />
            Mis Cupones
          </h2>

          {userTickets && userTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userTickets.map((ticket) => (
                <Card key={ticket.id} className={ticket.is_used ? "opacity-60" : ""}>
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center gap-2">
                      {getTicketIcon(ticket.ticket_type)}
                      Cupón de {getTicketLabel(ticket.ticket_type)}
                    </CardTitle>
                    <CardDescription>
                      {ticket.is_used ? (
                        <span className="text-red-600">Canjeado el {new Date(ticket.used_at!).toLocaleString()}</span>
                      ) : (
                        <span className="text-green-600">Disponible para canjear</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="flex justify-center">
                      <QRGenerator value={ticket.qr_code} size={200} className={ticket.is_used ? "grayscale" : ""} />
                    </div>
                    <p className="text-xs text-gray-500 font-mono">{ticket.qr_code}</p>
                    <Badge variant={ticket.is_used ? "destructive" : "default"}>
                      {ticket.is_used ? "Canjeado" : "Disponible"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tienes cupones asignados aún</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
