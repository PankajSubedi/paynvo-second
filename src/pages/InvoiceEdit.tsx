import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Calendar, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoiceStore, Invoice } from "@/hooks/useInvoiceStore";
import { useClientStore } from "@/hooks/useClientStore";
import { SEO } from "@/components/SEO";

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

// --- The Component ---
export default function InvoiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { getInvoiceById, updateInvoice } = useInvoiceStore();
  const { clients, loading: clientsLoading } = useClientStore();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- THE FIX: Logic is now split into two separate, stable effects ---

  // Effect 1: Loads the main invoice data. This runs ONLY ONCE when the page ID changes.
  useEffect(() => {
    const loadInvoiceData = async () => {
      if (!id) { navigate("/invoices"); return; }
      setPageLoading(true);
      try {
        const invoiceId = parseInt(id, 10);
        const fetchedInvoice = await getInvoiceById(invoiceId);
        if (fetchedInvoice) {
          setInvoice(fetchedInvoice);
        } else {
          toast({ title: "Error", description: "Invoice not found.", variant: "destructive" });
          navigate("/invoices");
        }
      } catch (error: any) {
        toast({ title: "Error", description: `Failed to load invoice: ${error.message}`, variant: "destructive" });
        navigate("/invoices");
      }
    };
    loadInvoiceData();
  }, [id]); // This dependency array is stable and correct.

  // Effect 2: Sets the client dropdown. This runs ONLY ONCE after BOTH invoice and clients are loaded.
  useEffect(() => {
    if (invoice && !clientsLoading) {
      const initialClient = clients.find(c => c.name === invoice.clients.name && c.email === invoice.clients.email);
      if (initialClient?.id) {
        setSelectedClientId(initialClient.id.toString());
      }
      setPageLoading(false); // Stop the main page loader only when everything is truly ready.
    }
  }, [invoice, clients, clientsLoading]);

  const totals = useMemo(() => {
    if (!invoice) return { subtotal: 0, discount: 0, tax: 0, customFee: 0, total: 0 };
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0), 0);
    const discount = invoice.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0) * ((item.discount_pct || 0) / 100), 0);
    const tax = invoice.items.reduce((sum, item) => {
      const afterDiscount = (item.quantity || 0) * (item.unit_price || 0) * (1 - (item.discount_pct || 0) / 100);
      return sum + afterDiscount * ((item.tax_pct || 0) / 100);
    }, 0);
    let customFee = 0;
    if (invoice.custom_fee_name && (invoice.custom_fee_value || 0) > 0) {
      customFee = invoice.custom_fee_type === "percent" ? subtotal * ((invoice.custom_fee_value || 0) / 100) : (invoice.custom_fee_value || 0);
    }
    const total = subtotal - discount + tax + (invoice.shipping_fee || 0) + customFee;
    return { subtotal, discount, tax, customFee, total };
  }, [invoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    if (!selectedClientId) {
      toast({ title: "Error", description: "Please select a client.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const selectedClient = clients.find(c => c.id?.toString() === selectedClientId);
      const updatedInvoiceData: Invoice = {
        ...invoice,
        clients: selectedClient ? { name: selectedClient.name, email: selectedClient.email, phone:selectedClient.phone, billing_address: selectedClient.billing_address, tax_id: selectedClient.tax_id } : invoice.clients,
        subtotal: totals.subtotal,
        discount_total: totals.discount,
        tax_total: totals.tax,
        total: totals.total,
      };
      await updateInvoice(updatedInvoiceData);
      toast({ title: "Success", description: "Invoice updated successfully" });
      navigate(`/invoices/${invoice.id}`);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleInvoiceChange = (field: keyof Invoice, value: any) => { setInvoice(prev => prev ? { ...prev, [field]: value } : null); };
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => { setInvoice(prev => { if (!prev) return null; const newItems = [...prev.items]; newItems[index] = { ...newItems[index], [field]: value }; return { ...prev, items: newItems }; }); };
  const removeItem = (index: number) => { setInvoice(prev => prev ? { ...prev, items: prev.items.filter((_, i) => i !== index) } : null); };
  const addItem = () => { const newItem = { description: "", quantity: 1, unit_price: 0, discount_pct: 0, tax_pct: 0 }; setInvoice(prev => prev ? { ...prev, items: [...prev.items, newItem] } : null); };
  
  if (pageLoading || !invoice) {
    return <Layout><div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }

  return (
    <Layout>

<SEO 
  title="Edit Invoice | Paynvo"
  description="Modify and update your existing invoice details. Change line items, adjust fees, update client information, and re-save your work securely on your device."
  keywords="edit invoice, update invoice, modify invoice, paynvo, invoice correction"
/>



      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
        <div><h1 className="text-3xl font-bold">Edit Invoice</h1><p className="text-muted-foreground mt-2">Update details for invoice: {invoice.invoice_number}</p></div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label>Client *</Label><Select value={selectedClientId} onValueChange={setSelectedClientId}><SelectTrigger><SelectValue placeholder="Select a client"/></SelectTrigger><SelectContent>{clients.map((c) => (<SelectItem key={c.id} value={c.id!.toString()}>{c.name}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Currency</Label><Select value={invoice.currency} onValueChange={(v) => handleInvoiceChange('currency', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem><SelectItem value="INR">INR</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Issue Date *</Label><div className="relative"><Input id="issue_date" type="date" value={invoice.issue_date} onChange={(e) => handleInvoiceChange('issue_date', e.target.value)} required/><Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/></div></div>
              <div className="space-y-2"><Label>Due Date *</Label><div className="relative"><Input id="due_date" type="date" value={invoice.due_date} onChange={(e) => handleInvoiceChange('due_date', e.target.value)} required/><Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/></div></div>
              <div className="space-y-2"><Label>Status</Label><Select value={invoice.status} onValueChange={(v: Invoice['status']) => handleInvoiceChange('status', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="unpaid">Unpaid</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="overdue">Overdue</SelectItem></SelectContent></Select></div>
            </div>
          </Card>
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Items</h2><Button type="button" onClick={addItem} variant="outline" size="sm"><Plus className="h-4 w-4 mr-2"/>Add Item</Button></div>
            <div className="space-y-4">{invoice.items.map((item, i) => (<Card key={i} className="p-4 space-y-4 bg-muted/30"><div className="flex items-center justify-between"><span>Item {i + 1}</span><Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4 text-destructive"/></Button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"><div className="lg:col-span-2 space-y-2"><Label>Description *</Label><Input value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} required/></div><div className="space-y-2"><Label>Quantity *</Label><Input type="text" inputMode="decimal" value={item.quantity} onChange={(e) => updateItem(i, "quantity", parseFloat(e.target.value) || 0)} required className="no-spinner"/></div><div className="space-y-2"><Label>Unit Price *</Label><Input type="text" inputMode="decimal" value={item.unit_price} onChange={(e) => updateItem(i, "unit_price", parseFloat(e.target.value) || 0)} required className="no-spinner"/></div><div className="space-y-2"><Label>Tax %</Label><Input type="text" inputMode="decimal" value={item.tax_pct} onChange={(e) => updateItem(i, "tax_pct", parseFloat(e.target.value) || 0)} className="no-spinner"/></div><div className="space-y-2"><Label>Discount %</Label><Input type="text" inputMode="decimal" value={item.discount_pct} onChange={(e) => updateItem(i, "discount_pct", parseFloat(e.target.value) || 0)} className="no-spinner"/></div></div></Card>))}</div>
          </Card>
          <Card className="p-6 space-y-6"><h2 className="text-xl font-semibold">Additional Fees</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><Label>Shipping Fee</Label><Input type="text" inputMode="decimal" value={invoice.shipping_fee || ''} onChange={(e) => handleInvoiceChange('shipping_fee', parseFloat(e.target.value) || 0)} className="no-spinner"/></div><div className="space-y-2"><Label>Custom Fee Name</Label><Input value={invoice.custom_fee_name || ''} onChange={(e) => handleInvoiceChange('custom_fee_name', e.target.value)} placeholder="e.g., Processing Fee"/></div><div className="space-y-2"><Label>Custom Fee Value</Label><Input type="text" inputMode="decimal" value={invoice.custom_fee_value || ''} onChange={(e) => handleInvoiceChange('custom_fee_value', parseFloat(e.target.value) || 0)} className="no-spinner"/></div><div className="space-y-2"><Label>Custom Fee Type</Label><Select value={invoice.custom_fee_type || 'fixed'} onValueChange={(v: 'fixed' | 'percent') => handleInvoiceChange('custom_fee_type', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="fixed">Fixed Amount</SelectItem><SelectItem value="percent">Percentage</SelectItem></SelectContent></Select></div></div></Card>
          <Card className="p-6 space-y-4"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={invoice.notes || ''} onChange={(e) => handleInvoiceChange('notes', e.target.value)} placeholder="Additional notes or payment terms..." rows={4}/></Card>
          <Card className="p-6"><div className="space-y-3"><div className="flex justify-between text-sm"><span>Subtotal:</span><span className="font-medium">{invoice.currency} {totals.subtotal.toFixed(2)}</span></div>{totals.discount > 0 && (<div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount:</span><span className="font-medium text-destructive">-{invoice.currency} {totals.discount.toFixed(2)}</span></div>)}<div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax:</span><span className="font-medium">{invoice.currency} {totals.tax.toFixed(2)}</span></div>{invoice.shipping_fee && invoice.shipping_fee > 0 && (<div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping:</span><span className="font-medium">{invoice.currency} {invoice.shipping_fee.toFixed(2)}</span></div>)}{totals.customFee > 0 && (<div className="flex justify-between text-sm"><span className="text-muted-foreground">{invoice.custom_fee_name}:</span><span className="font-medium">{invoice.currency} {totals.customFee.toFixed(2)}</span></div>)}<div className="h-px bg-border my-2"/><div className="flex justify-between text-lg font-bold"><span>Total:</span><span className="text-primary">{invoice.currency} {totals.total.toFixed(2)}</span></div></div></Card>
          <div className="flex gap-4"><Button type="button" variant="outline" onClick={() => navigate(`/invoices/${invoice.id}`)} className="flex-1">Cancel</Button><Button type="submit" disabled={saving} className="flex-1">{saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Updating...</> : "Update Invoice"}</Button></div>
        </form>
      </div>
    </Layout>
  );
}