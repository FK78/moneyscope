import { createClient } from "@/lib/supabase/server";
import { db } from "@/index";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUserId(): Promise<string> {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Backward compatibility with legacy seed.sql where app data is keyed by users.id (integer).
  if (user.email) {
    try {
      const [legacyUser] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, user.email))
        .limit(1);

      if (legacyUser?.id != null) {
        return String(legacyUser.id);
      }
    } catch {
      // Ignore if legacy users table does not exist in this environment.
    }
  }

  return user.id;
}
