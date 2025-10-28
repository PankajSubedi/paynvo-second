import { Link } from "react-router-dom";
import { LogoMark } from "./LogoMark";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
      <div className="container px-2 py-8">
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
  );
}
