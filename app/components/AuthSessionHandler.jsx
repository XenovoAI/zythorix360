"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'

export default function AuthSessionHandler() {
  const router = useRouter()

  useEffect(() => {
    const processUrl = async () => {
      if (typeof window === 'undefined') return

      const hash = window.location.hash || ''
      const search = window.location.search || ''
      const hasToken = hash.includes('access_token') || search.includes('access_token')
      if (!hasToken) return

      try {
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
        if (error) {
          console.error('getSessionFromUrl error', error)
          toast.error('Failed to complete sign-in')
          return
        }

        if (data?.session) {
          toast.success('Logged in successfully!')
          // Clean up URL to remove tokens
          try {
            history.replaceState({}, '', '/')
          } catch (e) {
            // ignore
          }
          // Navigate to dashboard or current returnUrl
          router.push('/dashboard')
        }
      } catch (err) {
        console.error('OAuth processing error', err)
        toast.error('Error processing OAuth response')
      }
    }

    processUrl()
  }, [router])

  return null
}
