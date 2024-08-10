"use client";
import "../styles/globals.css";
import SectionTitle from "@/components/HomePage/sectionTitle";
import LandingPage from "@/components/HomePage/landingPage";
import RecemChegados from "@/components/HomePage/recem-chegados";
import SobreNos from "@/components/HomePage/sobre-nos";
import OndeEstamos from "@/components/HomePage/onde-estamos";
import InstagramPage from "@/components/HomePage/instagramPage";
import { Button, Link } from "@nextui-org/react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { InstagramLogoIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-7xl pt-16">
        <section className="flex">
          <LandingPage />
        </section>
        <section className="pt-10 sm:pt-20">
          <div className="flex p-4">
            <SectionTitle title="Recém Chegados" />
          </div>
          <div className="flex justify-center">
            <RecemChegados />
          </div>
          <div className="flex justify-center pb-10">
            <Button
              color="danger"
              variant="shadow"
              as={Link}
              href="/estoque"
              className="w-80 mt-8"
            >
              Ver estoque completo
            </Button>
          </div>
        </section>
        <section className="pt-10 sm:pt-20">
          <InstagramPage />
          </section>
        <section className="pt-10 w-full bg-gray-100 dark:bg-stone-900 xl:rounded-lg">
          <div className="p-4">
            <SectionTitle title="Sobre Nós" />
          </div>
          <div>
            <SobreNos />
          </div>
        </section>
        <section className="pt-10 w-full">
          <div className="p-4">
            <SectionTitle title="Onde Estamos" />
          </div>
          <div>
            <OndeEstamos />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
