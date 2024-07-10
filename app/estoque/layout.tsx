export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="gap-4 py-8 md:py-10">{children}</section>;
}
