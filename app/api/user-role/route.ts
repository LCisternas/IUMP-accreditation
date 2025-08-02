import { type NextRequest, NextResponse } from "next/server"
import { getUserRole } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const roleData = await getUserRole(email)

    if (!roleData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(roleData)
  } catch (error) {
    console.error("Error getting user role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
