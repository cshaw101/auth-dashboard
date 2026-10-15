import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"


function Dashboard() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [customers, setCustomers] = useState([]) 
  const [loading, setLoading] = useState(true)   
  const [error, setError] = useState(null)









  


  async function fetchCustomers() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from("customers").select("*")
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setCustomers(data)
    setLoading(false)
  }

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
    fetchCustomers()
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
      {loading && <p>Loading customers...</p>}
      {error && <p>Error: {error}</p>}
      <h2>Customers</h2>
      {customers.map((customer) => (
        <div key={customer.id}>
          <p>Name: {customer.name}</p>
          <p>Email: {customer.email}</p>
        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard