import { supabase } from "./supabase"

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Obtener información adicional del usuario desde nuestra tabla
  const { data: userData, error } = await supabase
    .from("users")
    .select(`
      *,
      churches (
        id,
        name,
        member_limit
      )
    `)
    .eq("email", user.email)
    .single()

  if (error) return null

  return userData
}

export async function getUserRole(email: string) {
  const { data, error } = await supabase.from("users").select("role, church_id").eq("email", email).single()

  if (error) return null
  return data
}
