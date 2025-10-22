import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { ShieldCheck, Database, AlertTriangle } from "lucide-react";

export default function Privacy() {
  return (
    <Layout>
     <SEO 
  title="Privacy Policy | Paynvo"
  description="Understand how Paynvo is built for privacy. We collect no personal information. Learn how your data is stored securely and only on your device."
  keywords="privacy policy, paynvo privacy, data protection, no tracking, zero collection"
/>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mt-2">
            Last updated: October 16, 2025
          </p>
        </div>

        <Card className="p-6 md:p-8 space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Our Core Privacy Principle
            </h2>
            <p className="text-muted-foreground">
              Your privacy isn't just a policy for Paynvo; it's built into our architecture. Our approach is simple: <strong>we collect, store, and see absolutely none of your personal or business data.</strong>
            </p>
            <p className="text-muted-foreground">
              Paynvo is an "offline-first" application that runs entirely within your web browser.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Information We Do Not Collect</h2>
            <p className="text-muted-foreground">
              Because of our privacy-by-design approach, we do not have the technical means to collect, view, or access any information you enter into the application. This includes, but is not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Your name, email, or any account information (as there are no accounts).</li>
              <li>Your company's name, address, logo, or tax ID.</li>
              <li>Any of your clients' information (names, emails, addresses).</li>
              <li>Any invoice data (line items, prices, totals, notes).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              2. Where Your Data Is Stored
            </h2>
            <p className="text-muted-foreground">
              All the data you create and save in Paynvo is stored exclusively in your web browser's secure local storage (`IndexedDB` and `localStorage`).
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>The data lives <strong>on your device only</strong>. It is never sent to our servers or any third party.</li>
              <li>This allows the application to be incredibly fast and work perfectly even without an internet connection.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              3. Your Responsibility for Your Data
            </h2>
            <p className="text-muted-foreground">
              This storage model gives you complete control and privacy, but it also comes with an important responsibility:
            </p>
            <p className="text-lg font-semibold text-destructive/90 ml-4">
              Clearing your browser's cache or site data will permanently delete all your invoices, clients, and settings. This action cannot be undone.
            </p>
            <p className="text-muted-foreground ml-4">
              To safeguard against data loss, we strongly recommend you use the <strong>Backup & Restore</strong> feature on the <strong>Settings</strong> page to regularly export your data to a file on your computer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Data Sharing</h2>
            <p className="text-muted-foreground">
              We cannot share your data because we do not have it. Simple as that.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. Cookies and Analytics</h2>
            <p className="text-muted-foreground">
              Paynvo <strong>does not use any tracking cookies or third-party analytics services</strong> (like Google Analytics). We do not track your behavior, clicks, or usage patterns. The application may use essential browser storage to remember simple UI preferences, but never for tracking purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time to reflect changes in our service or for other operational reasons. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">7. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy, please contact us at:
            </p>
            <p className="text-muted-foreground ml-4">
              Email: contact@paynvo.com
            </p>
          </section>
        </Card>
      </div>
    </Layout>
  );
}