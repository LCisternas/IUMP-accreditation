import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const churchId = formData.get("churchId") as string

    if (!file || !churchId) {
      return NextResponse.json({ error: "File and church ID are required" }, { status: 400 })
    }

    // Leer el archivo Excel
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    // Validar estructura del archivo
    if (data.length === 0) {
      return NextResponse.json({ error: "El archivo está vacío" }, { status: 400 })
    }

    const members = []
    const errors = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any

      // Validar campos requeridos
      if (!row["Nombre Completo"] || !row["Email"]) {
        errors.push(`Fila ${i + 2}: Nombre Completo y Email son requeridos`)
        continue
      }

      // Generar QR code único para el ticket
      const qrCode = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      members.push({
        full_name: row["Nombre Completo"],
        email: row["Email"],
        phone: row["Teléfono"] || null,
        church_id: churchId,
        role: "attendee",
      })
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Errores en el archivo",
          details: errors,
        },
        { status: 400 },
      )
    }

    // Insertar miembros en la base de datos
    const { data: insertedUsers, error: insertError } = await supabase.from("users").insert(members).select("id")

    if (insertError) {
      console.error("Error inserting users:", insertError)
      return NextResponse.json({ error: "Error al insertar usuarios" }, { status: 500 })
    }

    // Crear tickets para cada usuario
    const tickets = insertedUsers.map((user) => ({
      user_id: user.id,
      ticket_type: "lunch",
      qr_code: `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }))

    const { error: ticketError } = await supabase.from("tickets").insert(tickets)

    if (ticketError) {
      console.error("Error creating tickets:", ticketError)
      return NextResponse.json({ error: "Error al crear tickets" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `${members.length} miembros cargados exitosamente`,
    })
  } catch (error) {
    console.error("Error processing file:", error)
    return NextResponse.json({ error: "Error al procesar el archivo" }, { status: 500 })
  }
}
