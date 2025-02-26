"use client";
import NewCarForm from "@/components/Dashboard/estoque/CarForm";
import { useSearchParams } from "next/navigation";
import React from "react";

const EstoquePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  return (
    <div className="container mx-auto py-6">
      <div className="">
        <NewCarForm editCardId={id || undefined} />
      </div>
    </div>
  );
};

export default EstoquePage;
