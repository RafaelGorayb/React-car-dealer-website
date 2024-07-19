"use client";
import '../styles/globals.css';
import SectionTitle from '@/components/HomePage/sectionTitle';
import LandingPage from '@/components/HomePage/landingPage';
import RecemChegados from '@/components/HomePage/recem-chegados';
import { Button } from '@nextui-org/react';

export default function Home() {
return (
<>
  <section className="flex items-center">
    <LandingPage />
  </section>

  <section className="pt-10 sm:pt-20">
   <div className='p-4'>
   <SectionTitle title="Recém Chegados" />
   </div>
    <div className='flex justify-center'>
      <RecemChegados />
    </div>
    <Button color='danger' variant="shadow" className='w-full mt-4'>Explorar veículos</Button>

  </section>
</>
);
}