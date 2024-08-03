import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function CarroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <section>{children}</section>
      <Footer />
    </div>
  );
}
