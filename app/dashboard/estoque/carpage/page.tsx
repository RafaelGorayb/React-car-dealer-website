"use client";
import NewCarForm from "@/components/Dashboard/estoque/CarForm";
import { useSearchParams } from "next/navigation";
import React from "react";

const EstoquePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (id) {
    return (
      <div className="">
        <NewCarForm editCardId={id} />
        
      </div>
    );
  }

  return (
    <div className="">
      <NewCarForm />
    </div>
  );
};

export default EstoquePage;
