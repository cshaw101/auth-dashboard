
import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error checking session:", error.message)
      }

      setSession(data?.session ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } =
  supabase.auth.onAuthStateChange((event, session) => {
    setSession(session)
    setLoading(false)
  })
return () => {
  subscription.unsubscribe()
}

  }, [])

  if (loading) {
    return <p>Checking authentication...</p>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
