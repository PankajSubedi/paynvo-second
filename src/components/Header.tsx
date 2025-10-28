import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Users, Settings, Sparkles, Menu, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoMark } from "./LogoMark";

const navigation = [
  { name: "Home", href: "/", icon: Sparkles },
  { name: "Dashboard", href: "/dashboard", icon: ChartBar },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className=" pt-3 pb-3 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-up">
      <div className="container px-2 flex h-12 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover-scale smooth-transition">
          <LogoMark />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium smooth-transition hover-scale",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <LogoMark />
                  </Link>
                </div>
                
                <nav className="flex flex-col gap-1 p-4">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all",
                          isActive
                            ? "bg-accent text-accent-foreground shadow-soft"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto p-4 border-t border-border">
                  <Link to="/invoices/new" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" type="submit" size="lg">Create Invoice</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            to="/invoices/new"
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-medium smooth-transition hover:shadow-strong hover-scale"
          >
            <Button type="submit" size="lg">Create Invoice</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
