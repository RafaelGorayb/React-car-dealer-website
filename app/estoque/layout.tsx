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
      <section className="">{children}</section>
      <Footer />
    </div>
  );
}
