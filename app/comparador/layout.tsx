import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function ComparadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </section>
  );
}
