import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";

export default function Terms() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using InvoiceFlow, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">2. Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily use InvoiceFlow for personal or commercial purposes. This license shall automatically terminate if you violate any of these restrictions.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You may not modify or copy the materials</li>
              <li>You may not use the materials for any commercial purpose without proper license</li>
              <li>You may not attempt to reverse engineer any software</li>
              <li>You may not remove any copyright or proprietary notations</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p className="text-muted-foreground">
              When you create an account with us, you must provide accurate and complete information. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your use complies with all applicable laws</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Service Description</h2>
            <p className="text-muted-foreground">
              InvoiceFlow provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Invoice creation and management tools</li>
              <li>Client database management</li>
              <li>PDF generation services</li>
              <li>Payment tracking features</li>
              <li>Cloud storage for your business data</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. User Content</h2>
            <p className="text-muted-foreground">
              You retain all rights to the content you create using InvoiceFlow. By using our service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You grant us the right to store and process your content to provide the service</li>
              <li>You represent that you own or have necessary rights to all content you upload</li>
              <li>You are responsible for backing up your important data</li>
              <li>We may remove content that violates these terms</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Payment Terms</h2>
            <p className="text-muted-foreground">
              If you purchase a paid subscription:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Fees are billed in advance on a recurring basis</li>
              <li>You must provide current and accurate billing information</li>
              <li>Refunds are subject to our refund policy</li>
              <li>We may change fees with 30 days notice</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">7. Prohibited Uses</h2>
            <p className="text-muted-foreground">
              You may not use InvoiceFlow:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>For any unlawful purpose or to solicit illegal activities</li>
              <li>To violate any international, federal, or state regulations</li>
              <li>To infringe upon intellectual property rights</li>
              <li>To transmit malware or malicious code</li>
              <li>To spam, phish, or engage in fraudulent activities</li>
              <li>To interfere with or disrupt the service</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">8. Service Availability</h2>
            <p className="text-muted-foreground">
              We strive to provide reliable service but:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>We may suspend service for maintenance with notice</li>
              <li>We reserve the right to modify or discontinue features</li>
              <li>We are not liable for service interruptions beyond our control</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              InvoiceFlow and its suppliers shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from use or inability to use the service</li>
              <li>Any claim exceeding the amount you paid for the service</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">10. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold InvoiceFlow harmless from any claims, damages, or expenses arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Your use of the service</li>
              <li>Your violation of these terms</li>
              <li>Your infringement of any third-party rights</li>
              <li>Any content you submit or create</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">11. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account immediately, without prior notice, for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Violation of these terms</li>
              <li>Fraudulent, illegal, or abusive activity</li>
              <li>Non-payment of fees</li>
              <li>Any reason at our sole discretion</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              You may terminate your account at any time by contacting support. Upon termination, your right to use the service ceases immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">12. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes shall be resolved in the appropriate courts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">13. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify you of significant changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Posting the new terms on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending email notification for material changes</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Your continued use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">14. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-muted-foreground ml-4">
              Email: legal@invoiceflow.com
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">15. Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>
        </Card>
      </div>
    </Layout>
  );
}
