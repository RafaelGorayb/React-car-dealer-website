"use client";
import { createClient } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  return (
    <button
      color="danger"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/login");
      }}
    >
      <LogOut size={15} />
    </button>
  );
}
