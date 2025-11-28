// Admin authentication helper
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())

export function isAdminEmail(email) {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export async function checkAdminAccess(supabase, router) {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error

    if (!session) {
      return { authorized: false, user: null, reason: 'not_logged_in' }
    }

    const userEmail = session.user.email
    
    // Check if email is in admin list
    if (!isAdminEmail(userEmail)) {
      return { authorized: false, user: session.user, reason: 'not_admin' }
    }

    return { authorized: true, user: session.user }
  } catch (error) {
    console.error('Admin auth check error:', error)
    return { authorized: false, user: null, reason: 'error' }
  }
}
