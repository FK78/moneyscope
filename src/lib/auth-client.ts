import { createClient } from "@/lib/supabase/client";

export async function getCurrentUserIdClient(): Promise<string> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  return user.id;
}
