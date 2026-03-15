import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Physio Assessment",
  description: "Physiotherapy Assessment Software",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PhysioTrack",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b sticky top-0 bg-background z-50">
          <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-primary flex-shrink-0 bg-[#5a4a3a]">
                <img
                  src="/logo.jpg"
                  alt="Prasad Physio Therapy"
                  className="w-full h-full object-cover scale-125"
                />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-primary">
                PhysioTrack
              </span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">Dashboard</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/new">New</Link>
              </Button>
            </nav>
          </div>
        </header>
        <main className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  );
}
