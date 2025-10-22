import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Users, Settings, Sparkles, Menu, X, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoMark } from "./LogoMark";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Home", href: "/", icon: Sparkles },
  { name: "Dashboard", href: "/dashboard", icon: ChartBar },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Premium Header/Navbar */}
      <header className="pt-3 pb-3 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-up">
        <div className="container flex h-12 items-center justify-between">
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
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
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

            {/* Desktop Create Button */}
            <Link
              to="/invoices/new"
              className="hidden md:inline-flex items-center justify-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-medium smooth-transition hover:shadow-strong hover-scale"
            >

            <Button type="submit" size="lg">Create Invoice</Button>
        
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 md:px-6 lg:px-8 py-8 flex-1">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="  start-0 mt-auto border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <LogoMark />
              <p className="text-sm text-muted-foreground">
                Professional invoice generator for modern businesses.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/invoices" className="hover:text-foreground smooth-transition">Invoices</Link></li>
                <li><Link to="/clients" className="hover:text-foreground smooth-transition">Clients</Link></li>
                <li><Link to="/settings" className="hover:text-foreground smooth-transition">Settings</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>PDF Generation</li>
                <li>Client Management</li>
                <li>Custom Templates</li>
                <li>Multi-currency</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/documentation" className="hover:text-foreground smooth-transition">Documentation</Link></li>
                <li><Link to="/contact" className="hover:text-foreground smooth-transition">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground smooth-transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground smooth-transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Paynvo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}