

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Plus, Trash2, Calendar, PlusCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { useInvoiceStore } from "@/hooks/useInvoiceStore";
import { useClientStore } from "@/hooks/useClientStore";
import { useCompanyStore } from "@/hooks/useCompanyStore";

// --- TypeScript Interfaces ---
interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  discount_pct: number;
  tax_pct: number;
}

interface PaymentMethod {
  type: "bank_transfer" | "payment_link" | "wallet" | "none";
  bank_name?: string;
  account_number?: string;
  routing_number?: string;
  qr_code_url?: string;
  payment_link?: string;
  wallet_name?: string;
  wallet_phone?: string;
}

// --- Helper Components ---
const CompanySetupAlert = () => (
  <Alert variant="destructive" className="mb-6">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Company Setup Required</AlertTitle>
    <AlertDescription>
      <p className="mb-4">You need to set up your company details before creating an invoice. Please add your company name and address in settings.</p>
      <Button asChild><Link to="/settings">Go to Settings</Link></Button>
    </AlertDescription>
  </Alert>
);

// --- The Main Component ---
export default function InvoiceNew() {
  const { addInvoice } = useInvoiceStore();
  const { clients } = useClientStore();
  const { company, updateCompany, loading: companyLoading } = useCompanyStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showCompanyConfirmDialog, setShowCompanyConfirmDialog] = useState(false);
  const [isCompanyConfirmed, setIsCompanyConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    client_id: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    currency: "USD",
    notes: "",
    shipping_fee: 0,
    custom_fee_name: "",
    custom_fee_value: 0,
    custom_fee_type: "fixed" as "fixed" | "percent",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({ type: "none" });
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, unit_price: 0, discount_pct: 0, tax_pct: 0 }]);
  
  const isCompanyConfigured = company && company.name !== 'My Company' && company.address;
  
  useEffect(() => {
    if (!companyLoading && isCompanyConfigured && !isCompanyConfirmed) {
      setShowCompanyConfirmDialog(true);
    }
  }, [companyLoading, isCompanyConfigured, isCompanyConfirmed]);

  useEffect(() => { if (company) { setFormData((prev) => ({ ...prev, currency: company.default_currency || "USD" })); } }, [company]);
  
  const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result as string); reader.onerror = reject; reader.readAsDataURL(file); });
  
  const addItem = () => setItems([...items, { description: "", quantity: 1, unit_price: 0, discount_pct: 0, tax_pct: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => { const newItems = [...items]; newItems[index] = { ...newItems[index], [field]: value }; setItems(newItems); };
  
  const calculateLineTotal = (item: InvoiceItem) => { const s = item.quantity * item.unit_price, d = (s * item.discount_pct) / 100, a = s - d, t = (a * item.tax_pct) / 100; return a + t; };
  
  const calculateTotals = () => { let sub=0, dis=0, tax=0; items.forEach((i) => { const s=i.quantity*i.unit_price, d=(s*i.discount_pct)/100, a=s-d, t=(a*i.tax_pct)/100; sub+=s; dis+=d; tax+=t; }); let total=sub-dis+tax+formData.shipping_fee; if(formData.custom_fee_name && formData.custom_fee_value>0){total+=formData.custom_fee_type==="percent"?(sub*formData.custom_fee_value)/100:formData.custom_fee_value;} return {subtotal:sub, discount_total:dis, tax_total:tax, total}; };
  const totals = calculateTotals();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    if (!formData.client_id) { toast({ title: "Error", description: "Please select a client.", variant: "destructive" }); return; }
    setIsSubmitting(true);
    try {
      const invNum = `${company.invoice_prefix}-${new Date().getFullYear()}-${String(company.invoice_next_number).padStart(4,"0")}`;
      const selClient = clients.find(c => c.id?.toString() === formData.client_id);
      const invData = { invoice_number: invNum, clients: selClient ? { name: selClient.name, email: selClient.email, billing_address: selClient.billing_address, tax_id: selClient.tax_id } : { name: 'N/A', email: 'N/A' }, issue_date: formData.issue_date, due_date: formData.due_date, currency: formData.currency, items, total: totals.total, status: "unpaid" as const, notes: formData.notes, created_at: new Date().toISOString(), ...totals, shipping_fee: formData.shipping_fee, custom_fee_name: formData.custom_fee_name, custom_fee_value: formData.custom_fee_value, custom_fee_type: formData.custom_fee_type, payment_method: paymentMethod.type !== 'none' ? paymentMethod : undefined, };
      await addInvoice(invData);
      await updateCompany({ ...company, invoice_next_number: company.invoice_next_number + 1 });
      toast({ title: "Invoice created successfully!" });
      navigate(`/invoices`);
    } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
    finally { setIsSubmitting(false); }
  };

  return (
    <Layout>
      <SEO 
  title="Create New Invoice | Paynvo"
  description="Generate a professional invoice in minutes. Add clients, line items, taxes, discounts, and payment details to create a print-ready PDF for your business."
  keywords="create invoice, new invoice, invoice generator, make an invoice, paynvo, billing"
/>
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="mb-6"><h1 className="text-2xl md:text-3xl font-bold mb-2">Create Invoice</h1><p className="text-muted-foreground">Fill in the details to generate a professional invoice</p></div>
        {!companyLoading && !isCompanyConfigured && <CompanySetupAlert />}
        {isCompanyConfigured && isCompanyConfirmed && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-4 md:p-6 shadow-soft">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Invoice Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="client">Client *</Label><Select value={formData.client_id} onValueChange={(value) => { if (value === "add_new_client") { navigate("/clients"); } else { setFormData({ ...formData, client_id: value }); } }} required><SelectTrigger id="client"><SelectValue placeholder="Select a client" /></SelectTrigger><SelectContent>{clients.map((client) => (<SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>))}<SelectSeparator /><SelectItem value="add_new_client" className="text-primary font-semibold focus:bg-primary/10 focus:text-primary"><div className="flex items-center gap-2"><PlusCircle className="h-4 w-4" /><span>Add New Client</span></div></SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="currency">Currency</Label><Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}><SelectTrigger id="currency"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem><SelectItem value="NPR">NPR</SelectItem><SelectItem value="INR">INR</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="issue_date">Issue Date *</Label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="issue_date" type="date" value={formData.issue_date} onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })} className="pl-10" required /></div></div>
                <div className="space-y-2"><Label htmlFor="due_date">Due Date *</Label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="due_date" type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} className="pl-10" required /></div></div>
              </div>
            </Card>
           <Card className="p-4 md:p-6 shadow-soft">
  <h2 className="text-lg md:text-xl font-semibold mb-4">Line Items</h2>
  <div className="space-y-4">
    {items.map((item, index) => (
      <div key={index} className="p-4 border border-border rounded-lg space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium">Item {index + 1}</span>
          {items.length > 1 && (
            <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <Label>Description *</Label>
          <Input
            value={item.description}
            onChange={(e) => updateItem(index, "description", e.target.value)}
            placeholder="Item description"
            required
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="space-y-2">
            <Label>Qty *</Label>
            <Input
              type="text"
              inputMode="decimal"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
              required
              className="no-spinner"
            />
          </div>
          <div className="space-y-2">
            <Label>Price *</Label>
            <Input
              type="text"
              inputMode="decimal"
              value={item.unit_price}
              onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value) || 0)}
              required
              className="no-spinner"
            />
          </div>
          <div className="space-y-2">
            <Label>Disc %</Label>
            <Input
              type="text"
              inputMode="decimal"
              value={item.discount_pct}
              onChange={(e) => updateItem(index, "discount_pct", parseFloat(e.target.value) || 0)}
              className="no-spinner"
            />
          </div>
          <div className="space-y-2">
            <Label>Tax %</Label>
            <Input
              type="text"
              inputMode="decimal"
              value={item.tax_pct}
              onChange={(e) => updateItem(index, "tax_pct", parseFloat(e.target.value) || 0)}
              className="no-spinner"
            />
          </div>
          <div className="space-y-2">
            <Label>Total</Label>
            <div className="h-10 px-3 rounded-md border border-border bg-muted flex items-center text-sm font-medium">
              {formData.currency} {calculateLineTotal(item).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    ))}
    <Button type="button" variant="outline" onClick={addItem} className="w-full md:w-auto">
      <Plus className="mr-2 h-4 w-4" /> Add Item
    </Button>
  </div>
</Card>

<Card className="p-4 md:p-6 shadow-soft">
  <h2 className="text-lg md:text-xl font-semibold mb-4">Additional Fees</h2>
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="shipping_fee">Shipping Fee</Label>
      <Input
        id="shipping_fee"
        type="text"
        inputMode="decimal"
        value={formData.shipping_fee}
        onChange={(e) => setFormData({ ...formData, shipping_fee: parseFloat(e.target.value) || 0 })}
        placeholder="0.00"
        className="no-spinner"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="custom_fee_name">Custom Fee Name (Optional)</Label>
      <Input
        id="custom_fee_name"
        value={formData.custom_fee_name}
        onChange={(e) => setFormData({ ...formData, custom_fee_name: e.target.value })}
        placeholder="e.g., Service Fee"
      />
    </div>
    {formData.custom_fee_name && (
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="custom_fee_type">Fee Type</Label>
          <Select
            value={formData.custom_fee_type}
            onValueChange={(value: "fixed" | "percent") => setFormData({ ...formData, custom_fee_type: value })}
          >
            <SelectTrigger id="custom_fee_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
              <SelectItem value="percent">Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="custom_fee_value">
            {formData.custom_fee_type === "percent" ? "Percentage %" : "Amount"}
          </Label>
          <Input
            id="custom_fee_value"
            type="text"
            inputMode="decimal"
            value={formData.custom_fee_value}
            onChange={(e) => setFormData({ ...formData, custom_fee_value: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            className="no-spinner"
          />
        </div>
      </div>
    )}
  </div>
</Card>
            <Card className="p-4 md:p-6 shadow-soft">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Payment Method (Optional)</h2>
              <div className="space-y-4">
                <div className="space-y-2"><Label htmlFor="payment_type">Payment Type</Label><Select value={paymentMethod.type} onValueChange={(value: any) => setPaymentMethod({ type: value })}><SelectTrigger id="payment_type"><SelectValue placeholder="Select payment method" /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="bank_transfer">Bank Transfer</SelectItem><SelectItem value="payment_link">Payment Link</SelectItem><SelectItem value="wallet">Mobile Wallet</SelectItem></SelectContent></Select></div>
                {paymentMethod.type === "bank_transfer" && (<><div className="space-y-2"><Label htmlFor="bank_name">Bank Name</Label><Input id="bank_name" value={paymentMethod.bank_name || ""} onChange={(e) => setPaymentMethod({ ...paymentMethod, bank_name: e.target.value })} placeholder="Bank of America" /></div><div className="space-y-2"><Label htmlFor="account_number">Account Number</Label><Input id="account_number" value={paymentMethod.account_number || ""} onChange={(e) => setPaymentMethod({ ...paymentMethod, account_number: e.target.value })} placeholder="1234567890" /></div><div className="space-y-2"><Label htmlFor="routing_number">Routing Number</Label><Input id="routing_number" value={paymentMethod.routing_number || ""} onChange={(e) => setPaymentMethod({ ...paymentMethod, routing_number: e.target.value })} placeholder="021000021" /></div></>)}
                {paymentMethod.type === "payment_link" && (<div className="space-y-2"><Label htmlFor="payment_link">Payment Link</Label><Input id="payment_link" value={paymentMethod.payment_link || ""} onChange={(e) => setPaymentMethod({ ...paymentMethod, payment_link: e.target.value })} placeholder="https://pay.example.com/invoice" /></div>)}
                {paymentMethod.type === "wallet" && (<><div className="space-y-2"><Label htmlFor="wallet_name">Wallet Name</Label><Input id="wallet_name" value={paymentMethod.wallet_name || ""} onChange={(e) => setPaymentMethod({ ...paymentMethod, wallet_name: e.target.value })} placeholder="PayPal, Venmo, etc." /></div><div className="space-y-2"><Label htmlFor="wallet_phone">Phone / Account ID</Label><Input id="wallet_phone" value={paymentMethod.wallet_phone || ""} onChange={(e) => setPaymentMethod({ ...paymentMethod, wallet_phone: e.target.value })} placeholder="+1234567890" /></div><div className="space-y-2"><Label htmlFor="wallet_qr">QR Code Image (Optional)</Label><Input id="wallet_qr" type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const dataUrl = await fileToDataUrl(file); setPaymentMethod({ ...paymentMethod, qr_code_url: dataUrl }); } }} />{paymentMethod.qr_code_url && (<div className="mt-2"><p className="text-sm text-muted-foreground">Preview:</p><img src={paymentMethod.qr_code_url} alt="QR Code" className="w-24 h-24 rounded border p-1"/></div>)}</div></>)}
              </div>
            </Card>
            <Card className="p-4 md:p-6 shadow-soft"><h2 className="text-lg md:text-xl font-semibold mb-4">Additional Notes</h2><Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Payment terms, thank you message, etc." rows={4} /></Card>
            <Card className="p-4 md:p-6 shadow-soft"><h2 className="text-lg md:text-xl font-semibold mb-4">Invoice Summary</h2><div className="space-y-2"><div className="flex justify-between text-sm"><span>Subtotal</span><span>{formData.currency} {totals.subtotal.toFixed(2)}</span></div>{totals.discount_total > 0 && (<div className="flex justify-between text-sm"><span>Discount</span><span className="text-green-600">- {formData.currency} {totals.discount_total.toFixed(2)}</span></div>)}{totals.tax_total > 0 && (<div className="flex justify-between text-sm"><span>Tax</span><span>{formData.currency} {totals.tax_total.toFixed(2)}</span></div>)}{formData.shipping_fee > 0 && (<div className="flex justify-between text-sm"><span>Shipping</span><span>{formData.currency} {formData.shipping_fee.toFixed(2)}</span></div>)}{formData.custom_fee_name && formData.custom_fee_value > 0 && (<div className="flex justify-between text-sm"><span>{formData.custom_fee_name}</span><span>{formData.custom_fee_type === "percent" ? `${formData.currency} ${((totals.subtotal * formData.custom_fee_value) / 100).toFixed(2)}` : `${formData.currency} ${formData.custom_fee_value.toFixed(2)}`}</span></div>)}<div className="pt-2 border-t border-border flex justify-between"><span className="text-lg font-bold">Total</span><span className="text-lg font-bold text-primary">{formData.currency} {totals.total.toFixed(2)}</span></div></div></Card>
            <div className="flex flex-col sm:flex-row gap-3 justify-end"><Button type="button" variant="outline" onClick={() => navigate("/invoices")}>Cancel</Button><Button type="submit" size="lg" disabled={isSubmitting || companyLoading}>{isSubmitting ? "Creating..." : "Create Invoice"}</Button></div>
          </form>
        )}
        <AlertDialog open={showCompanyConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Company Details</AlertDialogTitle>
              <AlertDialogDescription>
                <p className="mb-4">You are about to create an invoice from the following company. Is this correct?</p>
                <div className="p-4 bg-muted rounded-md text-sm">
                  <p className="font-semibold text-foreground">{company?.name}</p>
                  <p className="text-muted-foreground whitespace-pre-line">{company?.address}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => navigate('/settings')}>Change Company</AlertDialogCancel>
              <AlertDialogAction onClick={() => { setIsCompanyConfirmed(true); setShowCompanyConfirmDialog(false); }}>Yes, Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}