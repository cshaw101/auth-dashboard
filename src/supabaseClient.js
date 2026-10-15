import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  console.log("Supabase URL loaded:", Boolean(supabaseUrl))

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)