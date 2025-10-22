import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { FileText, Users, Settings, Download, Plus, ShieldCheck, Save, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom"; // Import the Link component

export default function Documentation() {
  return (
    <Layout>
    <SEO 
  title="Documentation | Paynvo"
  description="Learn how to use Paynvo to create invoices, manage clients, and secure your data. Get answers to common questions about our offline-first approach."
  keywords="paynvo documentation, how to use, guides, faq, offline invoicing, browser storage"
/>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Everything you need to know about using InvoiceFlow
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Getting Started
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>InvoiceFlow is a simple, private, and offline-first invoice generator. Create and manage all your business documents without ever needing an account or an internet connection.</p>
              <p>To get started, you'll need to:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Set up your company details in the <Link to="/settings" className="text-primary hover:underline font-medium">Settings</Link> page.</li>
                <li>Add your customers in the <Link to="/clients" className="text-primary hover:underline font-medium">Clients</Link> page.</li>
                <li>Create your first invoice using the <Link to="/invoices/new" className="text-primary hover:underline font-medium">Create Invoice</Link> button.</li>
              </ol>
            </div>
          </section>
        </Card>

        <Card className="p-6 space-y-6 border-amber-500/50 bg-amber-50/20 dark:bg-amber-950/20">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="h-6 w-6" />
              Understanding Your Data & Privacy
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>This is the most important concept to understand about InvoiceFlow. Your privacy is our top priority, which is why the app works differently from most online services.</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>All data is stored on your device only.</strong> Your invoices, clients, and settings are saved securely in your web browser's local storage.</li>
                <li><strong>We do not have a server that stores your data.</strong> We cannot see, access, or share your information.</li>
                <li><strong>WARNING:</strong> Because the data is stored locally, clearing your browser's history or site data <strong>will permanently delete everything</strong>.</li>
              </ul>
            </div>
          </section>
        </Card>

        <Card className="p-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Save className="h-6 w-6 text-primary" />
              Backup & Restore Your Data
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>To prevent data loss, it is highly recommended that you regularly back up your information. You can do this easily from the <Link to="/settings" className="text-primary hover:underline font-medium">Settings</Link> page.</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Navigate to the <strong>Settings</strong> page.</li>
                <li>Click the <strong>"Export Data"</strong> button. A file named `invoiceflow_backup.json` will be downloaded to your computer. Keep this file safe.</li>
                <li>To restore your data on a new computer or after clearing your cache, click the <strong>"Import Data"</strong> button on the Settings page and select your backup file.</li>
              </ol>
            </div>
          </section>
        </Card>

        <Card className="p-6 space-y-6">
          <section>
            <Link to="/settings" className="group">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 group-hover:text-primary transition-colors">
                <Settings className="h-6 w-6 text-primary" />
                Company Settings
                <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
              </h2>
            </Link>
            <div className="space-y-3 text-muted-foreground">
              <p>Configure your company information. This will be used to automatically populate the "From" section of your invoices.</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Company Name & Logo</li>
                <li>Address & Tax ID</li>
                <li>Default Currency & Invoice Prefix</li>
              </ul>
            </div>
          </section>
        </Card>

        <Card className="p-6 space-y-6">
          <section>
            <Link to="/clients" className="group">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 group-hover:text-primary transition-colors">
                <Users className="h-6 w-6 text-primary" />
                Managing Clients
                <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
              </h2>
            </Link>
            <div className="space-y-3 text-muted-foreground">
              <p>Add and manage your clients from the Clients page. Storing clients here allows you to quickly select them from a dropdown when creating a new invoice.</p>
            </div>
          </section>
        </Card>

        <Card className="p-6 space-y-6">
          <section>
            <Link to="/invoices/new" className="group">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 group-hover:text-primary transition-colors">
                <Plus className="h-6 w-6 text-primary" />
                Creating & Editing Invoices
                <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
              </h2>
            </Link>
            <div className="space-y-3 text-muted-foreground">
              <p>Create professional invoices in minutes by selecting a client, adding line items, and setting your terms. You can always edit an invoice after it has been created.</p>
            </div>
          </section>
        </Card>

        {/* Other sections remain the same */}
        <Card className="p-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Invoice Statuses</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Track your invoices with these statuses:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Draft:</strong> An invoice that is still being worked on.</li>
                <li><strong>Unpaid:</strong> An invoice that has been finalized and sent to a client.</li>
                <li><strong>Paid:</strong> An invoice for which payment has been received.</li>
                <li><strong>Overdue:</strong> An unpaid invoice that is past its due date.</li>
              </ul>
            </div>
          </section>
        </Card>

      </div>
    </Layout>
  );
}