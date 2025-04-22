
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  try {
    const { keys } = await req.json()
    
    // Get secrets from Supabase
    const secrets: Record<string, string> = {}
    for (const key of keys) {
      secrets[key] = Deno.env.get(key) || ''
    }

    return new Response(
      JSON.stringify({ secrets }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
