import type { Database } from "@/types/database";
import { createClient } from "@supabase/supabase-js";

export default function supabaseAdmin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABAE_ADMIN as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
