import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <section className="min-h-screen">{children}</section>
      <Footer />
    </div>
  );
}
