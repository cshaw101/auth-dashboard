import { supabase } from "../supabaseClient"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {

    const navigate = useNavigate()
    const [formState, setFormState] = useState({
        email: "",
        password: ""
    })


  return (
    <form onSubmit={ async (e) => {
      e.preventDefault();
      const { data, error } = await supabase.auth.signInWithPassword({
  email: formState.email,
  password: formState.password,
})
if (error) {
  alert(error.message)
  return
}
  console.log("Login successful:", data);
  navigate("/dashboard")
    }}>
      <h1>Login</h1>

    <input value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} type="email" placeholder="Email" />
    <input value={formState.password} onChange={(e) => setFormState({...formState, password: e.target.value})} type="password" placeholder="Password" />
    <button type="submit">Login</button>
    </form>
  )
}

export default Login