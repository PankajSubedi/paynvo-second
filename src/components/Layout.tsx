import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="w-full max-w-7xl mx-auto flex-1 px-0 md:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
