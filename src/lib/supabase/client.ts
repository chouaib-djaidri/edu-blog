import type { Database } from "@/types/database";
import { createBrowserClient } from "@supabase/ssr";

export function supabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}
