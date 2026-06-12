import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen pt-16 md:pt-20">{children}</main>
      <Footer />
    </>
  );
}
