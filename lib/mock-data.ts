export interface Zone {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Church {
  id: string
  name: string
  contact_person: string | null
  contact_email: string | null
  contact_phone: string | null
  member_limit: number
  member_count: number
  accredited_count: number
  zone_id: string | null
  zone_name?: string
}

export interface User {
  id: string
  rut: string
  email: string
  full_name: string
  phone: string | null
  role: "admin" | "monitor" | "attendee" | "cocina"
  church_id: string | null
  church_name?: string
  zone_name?: string
  is_accredited: boolean
  created_at: string
}

export interface Ticket {
  id: string
  user_id: string
  ticket_type: "lunch" | "once" | "snack"
  qr_code: string
  is_used: boolean
  used_at: string | null
  used_by: string | null
  created_at: string
}

// Datos mock de zonas
export const mockZones: Zone[] = [
  {
    id: "1",
    name: "Región del Maule",
    description: "Iglesias ubicadas en la Región del Maule",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Región de Ñuble",
    description: "Iglesias ubicadas en la Región de Ñuble",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Región Metropolitana",
    description: "Iglesias ubicadas en la Región Metropolitana",
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Datos mock de iglesias con zonas asignadas
export const mockChurches: Church[] = [
  {
    id: "1",
    name: "IUMP Talca",
    contact_person: "Pastor Juan Pérez",
    contact_email: "pastor@bautistatalca.cl",
    contact_phone: "+56971234567",
    member_limit: 50,
    member_count: 3,
    accredited_count: 2,
    zone_id: "1",
    zone_name: "Región del Maule",
  },
  {
    id: "2",
    name: "IUMP Chillán",
    contact_person: "Pastora María González",
    contact_email: "maria@metodistachillan.cl",
    contact_phone: "+56971234568",
    member_limit: 30,
    member_count: 1,
    accredited_count: 0,
    zone_id: "2",
    zone_name: "Región de Ñuble",
  },
  {
    id: "3",
    name: "IUMP Curicó",
    contact_person: "Pastor Carlos Rodríguez",
    contact_email: "carlos@pentecostalcurico.cl",
    contact_phone: "+56971234569",
    member_limit: 40,
    member_count: 0,
    accredited_count: 0,
    zone_id: "1",
    zone_name: "Región del Maule",
  },
  {
    id: "4",
    name: "IUMP Linares",
    contact_person: "Pastor Ana Martínez",
    contact_email: "ana@presbiterianalinares.cl",
    contact_phone: "+56971234570",
    member_limit: 25,
    member_count: 0,
    accredited_count: 0,
    zone_id: "1",
    zone_name: "Región del Maule",
  },
  {
    id: "5",
    name: "IUMP San Carlos",
    contact_person: "Pastor Roberto Silva",
    contact_email: "roberto@evangelicasancarlos.cl",
    contact_phone: "+56971234571",
    member_limit: 35,
    member_count: 0,
    accredited_count: 0,
    zone_id: "2",
    zone_name: "Región de Ñuble",
  },
  {
    id: "6",
    name: "IUMP Cauquenes",
    contact_person: "Pastora Carmen López",
    contact_email: "carmen@adventistacauquenes.cl",
    contact_phone: "+56971234572",
    member_limit: 20,
    member_count: 0,
    accredited_count: 0,
    zone_id: "1",
    zone_name: "Región del Maule",
  },
]

// Datos mock de usuarios con RUTs válidos (incluyendo rol cocina)
export const mockUsers: User[] = [
  {
    id: "admin-1",
    rut: "99.798.351-9",
    email: "admin@evento.com",
    full_name: "Administrador del Sistema",
    phone: "+56971234567",
    role: "admin",
    church_id: null,
    is_accredited: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cocina-1",
    rut: "88.888.888-8",
    email: "cocina@evento.com",
    full_name: "Personal de Cocina",
    phone: "+56971234599",
    role: "cocina",
    church_id: null,
    is_accredited: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "monitor-1",
    rut: "20.100.723-2",
    email: "monitor@bautistatalca.cl",
    full_name: "Monitor IUMP Talca",
    phone: "+56971234568",
    role: "monitor",
    church_id: "1",
    church_name: "IUMP Talca",
    zone_name: "Región del Maule",
    is_accredited: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "attendee-1",
    rut: "11.111.111-1",
    email: "juan@email.com",
    full_name: "Juan Carlos Mendoza",
    phone: "+56971234569",
    role: "attendee",
    church_id: "1",
    church_name: "IUMP Talca",
    zone_name: "Región del Maule",
    is_accredited: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "attendee-2",
    rut: "22.222.222-2",
    email: "maria@email.com",
    full_name: "María Elena Vásquez",
    phone: "+56971234570",
    role: "attendee",
    church_id: "2",
    church_name: "IUMP Chillán",
    zone_name: "Región de Ñuble",
    is_accredited: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "attendee-3",
    rut: "33.333.333-3",
    email: "pedro@email.com",
    full_name: "Pedro Antonio López",
    phone: "+56971234571",
    role: "attendee",
    church_id: "1",
    church_name: "IUMP Talca",
    zone_name: "Región del Maule",
    is_accredited: false,
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Datos mock de tickets (incluyendo almuerzo y once)
export const mockTickets: Ticket[] = [
  // Tickets de almuerzo
  {
    id: "ticket-1",
    user_id: "attendee-1",
    ticket_type: "lunch",
    qr_code: "LUNCH-2024-ABC123",
    is_used: false,
    used_at: null,
    used_by: null,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "ticket-2",
    user_id: "attendee-2",
    ticket_type: "lunch",
    qr_code: "LUNCH-2024-DEF456",
    is_used: true,
    used_at: "2024-01-15T12:30:00Z",
    used_by: "cocina-1",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "ticket-3",
    user_id: "attendee-3",
    ticket_type: "lunch",
    qr_code: "LUNCH-2024-GHI789",
    is_used: false,
    used_at: null,
    used_by: null,
    created_at: "2024-01-01T00:00:00Z",
  },
  // Tickets de once
  {
    id: "ticket-4",
    user_id: "attendee-1",
    ticket_type: "once",
    qr_code: "ONCE-2024-ABC123",
    is_used: true,
    used_at: "2024-01-15T16:30:00Z",
    used_by: "cocina-1",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "ticket-5",
    user_id: "attendee-2",
    ticket_type: "once",
    qr_code: "ONCE-2024-DEF456",
    is_used: false,
    used_at: null,
    used_by: null,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "ticket-6",
    user_id: "attendee-3",
    ticket_type: "once",
    qr_code: "ONCE-2024-GHI789",
    is_used: false,
    used_at: null,
    used_by: null,
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Función para validar RUT chileno (deshabilitada - siempre retorna true)
export function validateRUT(rut: string): boolean {
  return true // Validación deshabilitada
}

// Función para formatear RUT
export function formatRUT(rut: string): string {
  const cleanRUT = rut.replace(/[.-]/g, "").toUpperCase()
  if (cleanRUT.length < 8) return rut

  const body = cleanRUT.slice(0, -1)
  const dv = cleanRUT.slice(-1)

  // Formatear con puntos cada 3 dígitos desde la derecha
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  return `${formattedBody}-${dv}`
}

// Función para limpiar RUT (quitar puntos y guión)
export function cleanRUT(rut: string): string {
  return rut.replace(/[.-]/g, "").toUpperCase()
}

// Función para calcular dígito verificador
export function calculateDV(rutBody: string): string {
  let sum = 0
  let multiplier = 2

  for (let i = rutBody.length - 1; i >= 0; i--) {
    sum += Number.parseInt(rutBody[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = sum % 11

  if (remainder < 2) {
    return remainder.toString()
  } else if (remainder === 10) {
    return "K"
  } else {
    return (11 - remainder).toString()
  }
}

// Función para generar RUT válido para pruebas
export function generateValidRUT(): string {
  const body = Math.floor(Math.random() * 999999999)
    .toString()
    .padStart(8, "0")

  const dv = calculateDV(body)
  return formatRUT(body + dv)
}

// Función para generar ID único
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Función para agregar nueva zona
export function addNewZone(zoneData: Omit<Zone, "id" | "created_at">): Zone {
  const newZone: Zone = {
    ...zoneData,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  mockZones.push(newZone)
  return newZone
}

// Función para obtener iglesias por zona
export function getChurchesByZone(zoneId: string): Church[] {
  return mockChurches.filter((church) => church.zone_id === zoneId)
}

// Función para obtener iglesias agrupadas por zona
export function getChurchesGroupedByZone(): { zone: Zone | null; churches: Church[] }[] {
  const grouped: { zone: Zone | null; churches: Church[] }[] = []

  // Agregar iglesias con zona
  mockZones.forEach((zone) => {
    const churches = getChurchesByZone(zone.id)
    if (churches.length > 0) {
      grouped.push({ zone, churches })
    }
  })

  // Agregar iglesias sin zona
  const churchesWithoutZone = mockChurches.filter((church) => !church.zone_id)
  if (churchesWithoutZone.length > 0) {
    grouped.push({ zone: null, churches: churchesWithoutZone })
  }

  return grouped
}

// Agregar función para agregar nueva iglesia (actualizada con zona)
export function addNewChurch(
  churchData: Omit<Church, "id" | "member_count" | "accredited_count" | "zone_name">,
): Church {
  const zone = mockZones.find((z) => z.id === churchData.zone_id)
  const newChurch: Church = {
    ...churchData,
    id: generateId(),
    member_count: 0,
    accredited_count: 0,
    zone_name: zone?.name || null,
  }
  mockChurches.push(newChurch)
  return newChurch
}

// Función para actualizar iglesia con zona
export function updateChurchZone(churchId: string, zoneId: string | null): boolean {
  const churchIndex = mockChurches.findIndex((church) => church.id === churchId)
  if (churchIndex === -1) return false

  const zone = zoneId ? mockZones.find((z) => z.id === zoneId) : null
  mockChurches[churchIndex].zone_id = zoneId
  mockChurches[churchIndex].zone_name = zone?.name || null

  return true
}

// Agregar función para obtener miembros por iglesia
export function getMembersByChurch(churchId: string): User[] {
  return mockUsers.filter((user) => user.church_id === churchId && user.role === "attendee")
}

// Agregar función para actualizar estado de acreditación
export function updateUserAccreditation(userId: string, isAccredited: boolean): void {
  const userIndex = mockUsers.findIndex((user) => user.id === userId)
  if (userIndex !== -1) {
    mockUsers[userIndex].is_accredited = isAccredited

    // Actualizar contadores de iglesia
    const user = mockUsers[userIndex]
    if (user.church_id) {
      const churchIndex = mockChurches.findIndex((church) => church.id === user.church_id)
      if (churchIndex !== -1) {
        const churchMembers = getMembersByChurch(user.church_id)
        const accreditedCount = churchMembers.filter((m) => m.is_accredited).length
        mockChurches[churchIndex].accredited_count = accreditedCount
      }
    }
  }
}

// Función para agregar nuevo miembro (actualizada para crear ambos tickets)
export function addNewMember(memberData: {
  rut: string
  full_name: string
  email: string
  phone?: string
  church_id: string
}): { success: boolean; error?: string; member?: User } {
  // Verificar si el RUT ya existe
  const existingUser = mockUsers.find((user) => cleanRUT(user.rut) === cleanRUT(memberData.rut))
  if (existingUser) {
    return { success: false, error: "Ya existe un usuario con este RUT" }
  }

  // Verificar límite de iglesia
  const church = mockChurches.find((c) => c.id === memberData.church_id)
  if (!church) {
    return { success: false, error: "Iglesia no encontrada" }
  }

  const currentMembers = getMembersByChurch(memberData.church_id)
  if (currentMembers.length >= church.member_limit) {
    return { success: false, error: `La iglesia ha alcanzado su límite de ${church.member_limit} miembros` }
  }

  // Crear nuevo miembro
  const newMember: User = {
    id: generateId(),
    rut: formatRUT(memberData.rut),
    email: memberData.email,
    full_name: memberData.full_name,
    phone: memberData.phone || null,
    role: "attendee",
    church_id: memberData.church_id,
    church_name: church.name,
    zone_name: church.zone_name,
    is_accredited: false,
    created_at: new Date().toISOString(),
  }

  mockUsers.push(newMember)

  // Actualizar contador de iglesia
  const churchIndex = mockChurches.findIndex((c) => c.id === memberData.church_id)
  if (churchIndex !== -1) {
    mockChurches[churchIndex].member_count += 1
  }

  // Crear tickets para el nuevo miembro (almuerzo y once)
  const lunchTicket: Ticket = {
    id: generateId(),
    user_id: newMember.id,
    ticket_type: "lunch",
    qr_code: `LUNCH-2024-${generateId().toUpperCase()}`,
    is_used: false,
    used_at: null,
    used_by: null,
    created_at: new Date().toISOString(),
  }

  const onceTicket: Ticket = {
    id: generateId(),
    user_id: newMember.id,
    ticket_type: "once",
    qr_code: `ONCE-2024-${generateId().toUpperCase()}`,
    is_used: false,
    used_at: null,
    used_by: null,
    created_at: new Date().toISOString(),
  }

  mockTickets.push(lunchTicket, onceTicket)

  return { success: true, member: newMember }
}

// Función para eliminar miembro
export function deleteMember(userId: string, requestingUserRole: string): { success: boolean; error?: string } {
  const userIndex = mockUsers.findIndex((user) => user.id === userId)
  if (userIndex === -1) {
    return { success: false, error: "Usuario no encontrado" }
  }

  const user = mockUsers[userIndex]

  // Verificar si el usuario está acreditado
  if (user.is_accredited) {
    return {
      success: false,
      error:
        "No se puede eliminar un miembro acreditado. Debe dirigirse a la mesa de soporte en el evento para realizar esta acción.",
    }
  }

  // Eliminar usuario
  mockUsers.splice(userIndex, 1)

  // Eliminar tickets asociados
  for (let i = mockTickets.length - 1; i >= 0; i--) {
    if (mockTickets[i].user_id === userId) {
      mockTickets.splice(i, 1)
    }
  }

  // Actualizar contador de iglesia
  if (user.church_id) {
    const churchIndex = mockChurches.findIndex((church) => church.id === user.church_id)
    if (churchIndex !== -1) {
      mockChurches[churchIndex].member_count -= 1
      const churchMembers = getMembersByChurch(user.church_id)
      const accreditedCount = churchMembers.filter((m) => m.is_accredited).length
      mockChurches[churchIndex].accredited_count = accreditedCount
    }
  }

  return { success: true }
}

// Función para usar ticket (nueva)
export function useTicket(qrCode: string, usedBy: string): { success: boolean; error?: string; ticket?: Ticket } {
  const ticketIndex = mockTickets.findIndex((ticket) => ticket.qr_code === qrCode)

  if (ticketIndex === -1) {
    return { success: false, error: "Código QR no válido" }
  }

  const ticket = mockTickets[ticketIndex]

  if (ticket.is_used) {
    return { success: false, error: "Este ticket ya fue utilizado" }
  }

  // Marcar ticket como usado
  mockTickets[ticketIndex].is_used = true
  mockTickets[ticketIndex].used_at = new Date().toISOString()
  mockTickets[ticketIndex].used_by = usedBy

  return { success: true, ticket: mockTickets[ticketIndex] }
}

// Función para obtener estadísticas de tickets
export function getTicketStats(): {
  lunch: { used: number; total: number; remaining: number }
  once: { used: number; total: number; remaining: number }
} {
  const lunchTickets = mockTickets.filter((t) => t.ticket_type === "lunch")
  const onceTickets = mockTickets.filter((t) => t.ticket_type === "once")

  const lunchUsed = lunchTickets.filter((t) => t.is_used).length
  const onceUsed = onceTickets.filter((t) => t.is_used).length

  return {
    lunch: {
      used: lunchUsed,
      total: lunchTickets.length,
      remaining: lunchTickets.length - lunchUsed,
    },
    once: {
      used: onceUsed,
      total: onceTickets.length,
      remaining: onceTickets.length - onceUsed,
    },
  }
}

// Función para obtener todos los usuarios con sus tickets
export function getUsersWithTickets(): Array<{
  user: User
  lunchTicket: Ticket | null
  onceTicket: Ticket | null
}> {
  const attendees = mockUsers.filter((user) => user.role === "attendee")

  return attendees.map((user) => {
    const lunchTicket = mockTickets.find((t) => t.user_id === user.id && t.ticket_type === "lunch") || null
    const onceTicket = mockTickets.find((t) => t.user_id === user.id && t.ticket_type === "once") || null

    return {
      user,
      lunchTicket,
      onceTicket,
    }
  })
}

// Función para simular autenticación (actualizada para incluir rol cocina)
export const mockAuth = {
  currentUser: null as User | null,

  signIn: (rut: string, password: string) => {
    // Limpiar y normalizar el RUT de entrada
    const cleanInputRUT = cleanRUT(rut)

    console.log("Intentando login con RUT limpio:", cleanInputRUT)

    const user = mockUsers.find((u) => {
      const userCleanRUT = cleanRUT(u.rut)
      console.log("Comparando con usuario RUT:", userCleanRUT)
      return userCleanRUT === cleanInputRUT
    })

    console.log("Usuario encontrado:", user)

    if (user && password === "123456") {
      mockAuth.currentUser = user
      return { success: true, user }
    }
    return { success: false, error: "Credenciales inválidas" }
  },

  signOut: () => {
    mockAuth.currentUser = null
    return { success: true }
  },

  getCurrentUser: () => {
    return mockAuth.currentUser
  },
}
