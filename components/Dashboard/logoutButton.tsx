"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@nextui-org/react";
import { redirect } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  return (
    <Button
      color="danger"
      onClick={() => {
        supabase.auth.signOut();
        redirect("/");
      }}
    >
      Logout
    </Button>
  );
}
