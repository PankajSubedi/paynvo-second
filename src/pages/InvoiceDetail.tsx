






import { useEffect, useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Download, ArrowLeft, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import local storage hooks and the new professional PDF template
import { useInvoiceStore, Invoice } from "@/hooks/useInvoiceStore";
import { useCompanyStore } from "@/hooks/useCompanyStore";
import { InvoicePDFTemplate } from "@/components/InvoicePDFTemplate";
import { SEO } from "@/components/SEO";

// PDF Format configurations - Kept from your original file
const PDF_FORMATS = {
  a4: { name: "A4 (Standard)", width: 210, height: 297, orientation: "portrait" as const },
  letter: { name: "Letter (US)", width: 215.9, height: 279.4, orientation: "portrait" as const },
  legal: { name: "Legal (US)", width: 215.9, height: 355.6, orientation: "portrait" as const },
  a5: { name: "A5 (Half Letter)", width: 148, height: 210, orientation: "portrait" as const },
  receipt_80mm: { name: "Receipt 80mm", width: 80, height: 297, orientation: "portrait" as const },
  receipt_58mm: { name: "Receipt 58mm", width: 58, height: 297, orientation: "portrait" as const },
  a4_landscape: { name: "A4 Landscape", width: 297, height: 210, orientation: "landscape" as const },
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get data and loading states from both hooks to prevent flickering
  const { getInvoiceById, updateInvoice, deleteInvoice, loading: invoiceLoading } = useInvoiceStore();
  const { company, loading: companyLoading } = useCompanyStore();
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [pdfFormat, setPdfFormat] = useState<keyof typeof PDF_FORMATS>("a4");
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadInvoiceData = async () => {
      if (!id) return;
      try {
        const invoiceId = parseInt(id, 10);
        const invoiceData = await getInvoiceById(invoiceId);
        if (invoiceData) {
          setInvoice(invoiceData);
        } else {
          throw new Error("Invoice not found in your local storage.");
        }
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        navigate("/invoices");
      }
    };
    loadInvoiceData();
  }, [id, getInvoiceById, navigate, toast]);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || !invoice) return;
    setDownloading(true);
    try {
      const format = PDF_FORMATS[pdfFormat];
      const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: format.orientation, unit: 'mm', format: [format.width, format.height] });

      const pageWidth = format.width;
      const pageHeight = format.height;
      const isReceipt = pdfFormat.includes('receipt');
      const leftMargin = isReceipt ? 2 : 10;
      const rightMargin = isReceipt ? 2 : 10;
      const topMargin = isReceipt ? 5 : 10;
      const bottomMargin = isReceipt ? 5 : 10;
      
      const contentWidth = pageWidth - leftMargin - rightMargin;
      const contentHeight = pageHeight - topMargin - bottomMargin;
      const scaledImgHeight = (canvas.height * contentWidth) / canvas.width;
      
      let heightLeft = scaledImgHeight;
      let position = topMargin;

      pdf.addImage(imgData, 'PNG', leftMargin, position, contentWidth, scaledImgHeight);
      heightLeft -= contentHeight;

      while (heightLeft > 0) {
        position = -scaledImgHeight + heightLeft + topMargin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', leftMargin, position, contentWidth, scaledImgHeight);
        heightLeft -= contentHeight;
      }
      
      pdf.save(`${invoice.invoice_number}_${pdfFormat}.pdf`);
      toast({ title: `PDF downloaded successfully (${format.name})!` });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!invoice) return;
    try {
      const updated = { ...invoice, status: "paid" as const };
      await updateInvoice(updated);
      setInvoice(updated); // Update UI instantly
      toast({ title: "Invoice marked as paid" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = () => navigate(`/invoices/edit/${id}`);

  const handleDelete = async () => {
    if (!invoice?.id) return;
    try {
      await deleteInvoice(invoice.id);
      toast({ title: "Invoice deleted successfully" });
      navigate("/invoices");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "overdue": return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "unpaid": return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // The combined loading check that fixes the flicker
  if (invoiceLoading || companyLoading) {
    return <Layout><div className="flex items-center justify-center h-full p-8"><p className="text-muted-foreground">Loading invoice...</p></div></Layout>;
  }

  if (!invoice) return null;

  return (
    <Layout>


<SEO 
  title="View Invoice | Paynvo"
  description="Review the details of your invoice, download it as a professional PDF, or mark it as paid. Your complete invoice summary in a clean, easy-to-read format."
  keywords="view invoice, invoice details, download pdf invoice, invoice summary, paynvo"
/>


      <div className="fixed left-[-9999px] top-0 opacity-0 pointer-events-none">
        <div ref={pdfRef}>
          <InvoicePDFTemplate invoice={invoice} company={company} />
        </div>
      </div>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/invoices")} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" />Back to Invoices</Button>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold">{invoice.invoice_number}</h1>
              <Badge className={getStatusColor(invoice.status)} >{invoice.status.toUpperCase()}</Badge>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap gap-2">
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Select value={pdfFormat} onValueChange={(value: any) => setPdfFormat(value)}>
                  <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(PDF_FORMATS).map(([key, format]) => (<SelectItem key={key} value={key}>{format.name}</SelectItem>))}</SelectContent>
                </Select>
                <Button onClick={handleDownloadPDF} disabled={downloading} variant="outline" className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4" />{downloading ? "Generating..." : "Download PDF"}</Button>
              </div>
              <Button onClick={handleEdit} variant="outline"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the invoice.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {invoice.status !== "paid" && (<Button onClick={handleMarkAsPaid}><CheckCircle2 className="mr-2 h-4 w-4" />Mark as Paid</Button>)}
            </div>
          </div>
        </div>
        <Card className="p-6 md:p-8 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
            <div>
              <h3 className="font-semibold mb-2">From</h3>
              {company?.logo_url && <img src={company.logo_url} alt="Company logo" className="h-12 mb-3" />}
              <div className="text-sm space-y-1"><p className="font-medium">{company?.name}</p>{company?.address && <p className="text-muted-foreground whitespace-pre-line">{company.address}</p>}
              {company?.email && <p className="text-muted-foreground">{company.email}</p>}
              {company?.phoneNumber && <p className="text-muted-foreground">{company.phoneNumber}</p>}
              {company?.tax_id && <p className="text-muted-foreground">Tax ID: {company.tax_id}</p>}
              
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bill To</h3>
              <div className="text-sm space-y-1"><p className="font-medium">{invoice.clients?.name || "No client"}</p>
              {invoice.clients?.email && <p className="text-muted-foreground">{invoice.clients?.email}</p>}
   {/* --- THIS IS THE FIX FOR THE PHONE NUMBER --- */}
                {invoice.clients?.phone && <p className="text-muted-foreground">{invoice.clients.phone}</p>}
                
              {invoice.clients?.billing_address && <p className="text-muted-foreground whitespace-pre-line">{invoice.clients.billing_address}</p>}
              {invoice.clients?.tax_id && <p className="text-muted-foreground">Tax ID: {invoice.clients.tax_id}</p>}</div>
            </div>
          </div>
          <div className={`grid gap-4 mb-8 pb-8 border-b border-border ${pdfFormat.includes('receipt') ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
            <div><p className="text-sm text-muted-foreground mb-1">Issue Date</p><p className="font-medium text-sm md:text-base">{new Date(invoice.issue_date).toLocaleDateString()}</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">Due Date</p><p className="font-medium text-sm md:text-base">{new Date(invoice.due_date).toLocaleDateString()}</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">Invoice #</p><p className="font-medium text-sm md:text-base">{invoice.invoice_number}</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">Currency</p><p className="font-medium text-sm md:text-base">{invoice.currency}</p></div>
          </div>
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-border"><th className="text-left py-2 text-xs md:text-sm font-medium">Description</th><th className="text-right py-2 text-xs md:text-sm font-medium">Qty</th><th className="text-right py-2 text-xs md:text-sm font-medium">Price</th><th className="text-right py-2 text-xs md:text-sm font-medium">Total</th></tr></thead><tbody>{invoice.items.map((item: any, index: number) => { const itemTotal = (item.quantity || 0) * (item.unit_price || 0); const discount = itemTotal * ((item.discount_pct || 0) / 100); const tax = (itemTotal - discount) * ((item.tax_pct || 0) / 100); const total = itemTotal - discount + tax; return (<tr key={index} className="border-b border-border/50"><td className="py-3 text-xs md:text-sm"><div><p className="font-medium break-words">{item.description}</p>{(item.discount_pct > 0 || item.tax_pct > 0) && (<p className="text-xs text-muted-foreground">{item.discount_pct > 0 && `Disc: ${item.discount_pct}%`}{item.discount_pct > 0 && item.tax_pct > 0 && " | "}{item.tax_pct > 0 && `Tax: ${item.tax_pct}%`}</p>)}</div></td><td className="text-right py-3 text-xs md:text-sm">{item.quantity}</td><td className="text-right py-3 text-xs md:text-sm">{invoice.currency} {Number(item.unit_price).toFixed(2)}</td><td className="text-right py-3 text-xs md:text-sm font-medium">{invoice.currency} {total.toFixed(2)}</td></tr>); })}</tbody></table></div>
          </div>
          <div className="flex justify-end mb-8">
            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{invoice.currency} {Number(invoice.subtotal).toFixed(2)}</span></div>
              {Number(invoice.discount_total) > 0 && (<div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span className="font-medium text-green-600">- {invoice.currency} {Number(invoice.discount_total).toFixed(2)}</span></div>)}
              {Number(invoice.tax_total) > 0 && (<div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span className="font-medium">{invoice.currency} {Number(invoice.tax_total).toFixed(2)}</span></div>)}
              {/* {invoice.shipping_fee && Number(invoice.shipping_fee) > 0 && (<div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping Fee</span><span className="font-medium">{invoice.currency} {Number(invoice.shipping_fee).toFixed(2)}</span></div>)}
             
              */}

              {Number(invoice.shipping_fee) > 0 && (<div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping Fee</span><span className="font-medium">{invoice.currency} {Number(invoice.shipping_fee).toFixed(2)}</span></div>)}
             {invoice.custom_fee_name && Number(invoice.custom_fee_value) > 0 && (<div className="flex justify-between text-sm"><span className="text-muted-foreground">{invoice.custom_fee_name}</span><span className="font-medium">{invoice.currency} {(invoice.custom_fee_type === 'percent' ? (invoice.subtotal * invoice.custom_fee_value) / 100 : invoice.custom_fee_value).toFixed(2)}</span></div>)}
             
              {/* --- FIX: ADDED SERVICE CHARGE DISPLAY --- */}
              {/* {invoice.custom_fee_value && Number(invoice.custom_fee_value) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{invoice.custom_fee_name}</span>
                  <span className="font-medium">(
                    {invoice.currency} {Number(invoice.custom_fee_value).toFixed(2)})
                  </span>
                </div>
              )} */}
            
              <div className="pt-2 border-t border-border flex justify-between"><span className="font-bold">Total</span><span className="font-bold text-primary text-lg">{invoice.currency} {Number(invoice.total).toFixed(2)}</span></div>
            </div>
          </div>
          {invoice.payment_method && invoice.payment_method.type !== 'none' && (<div className="pt-6 border-t border-border"><h3 className="font-semibold mb-3">Payment Information</h3>
        {/* --- THIS IS THE NEW BLOCK TO ADD --- */}
          {invoice.payment_method.type === "cash" && (
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Method:</strong> Cash</p>
            </div>
          )}
       
          {/* --- END OF NEW BLOCK --- */}
          {invoice.payment_method.type === "bank_transfer" && (<div className="space-y-2 text-sm">{invoice.payment_method.bank_name && <p><span className="text-muted-foreground">Bank:</span> <strong>{invoice.payment_method.bank_name}</strong></p>}
          {invoice.payment_method.account_number && <p><span className="text-muted-foreground">Account:</span> <strong>{invoice.payment_method.account_number}</strong></p>}{invoice.payment_method.routing_number && <p><span className="text-muted-foreground">Routing:</span> <strong>{invoice.payment_method.routing_number}</strong></p>}</div>)}{invoice.payment_method.type === "wallet" && (<div className="space-y-2 text-sm">{invoice.payment_method.wallet_name && <p><span className="text-muted-foreground">Wallet:</span> <strong>{invoice.payment_method.wallet_name}</strong></p>}{invoice.payment_method.wallet_phone && <p><span className="text-muted-foreground">Account:</span> <strong>{invoice.payment_method.wallet_phone}</strong></p>}{invoice.payment_method.qr_code_url && (<div className="mt-3"><p className="text-muted-foreground mb-2">Scan to pay:</p><img src={invoice.payment_method.qr_code_url} alt="Payment QR" className="w-40 h-40 border rounded" /></div>)}</div>)}</div>)}
         
         
         
          {invoice.notes && (<div className="pt-50 border-t border-border"><h3 className="font-semibold mb-2">Notes</h3><p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.notes}</p></div>)}
        </Card>






        
      </div>





      
    </Layout>
  );
}