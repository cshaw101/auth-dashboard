import { useState } from "react"
import { supabase } from "../supabaseClient"


function Signup() {

    const [formState, setFormState] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [loading, setLoading] = useState(false)
  return (
    <form onSubmit={async (e) => {
        e.preventDefault();
        if (formState.password !== formState.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setLoading(true)
        setFormState({
            email: "",
            password: "",
            confirmPassword: ""
        })

const { data, error } = await supabase.auth.signUp({
  email: formState.email,
  password: formState.password
})

setLoading(false)

if (error) {
  alert(error.message)
  return
}

console.log("Signup result:", data)
if (data.session === null) {
  alert("Account created! Please check your email to confirm your account.")
}
    }}>
      <h1>Sign Up</h1>

    <input value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} type="email" placeholder="Email" />
    <input value={formState.password} onChange={(e) => setFormState({...formState, password: e.target.value})} type="password" placeholder="Password" />
    <input value={formState.confirmPassword} onChange={(e) => setFormState({...formState, confirmPassword: e.target.value})} type="password" placeholder="Confirm Password" />
    <button type="submit" disabled={loading}>
      {loading ? "Creating Account..." : "Create Account"}
    </button>
   
      
    </form>
  )
}

export default Signup