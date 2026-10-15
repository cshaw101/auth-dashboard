import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"


function Dashboard() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")

  useEffect(() => {
    async function fetchUserEmail() {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Error fetching user:", error.message)
        return
      }
      setEmail(data.user.email)
    }

    fetchUserEmail()
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error.message)
    } else {
      navigate("/login")
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Email: {email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard