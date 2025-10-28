import { Invoice } from "@/hooks/useInvoiceStore";
import { Company } from "@/hooks/useCompanyStore";

interface InvoicePDFTemplateProps {
  invoice: Invoice | null;
  company: Company | null;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "paid": return "text-green-600";
    case "overdue": return "text-red-600";
    default: return "text-orange-600";
  }
};

export const InvoicePDFTemplate = ({ invoice, company }: InvoicePDFTemplateProps) => {
  if (!invoice || !company) return null;

  return (
    <div className="bg-white text-gray-800 font-sans text-sm p-10" style={{ width: '210mm' }}>
      {/* Header */}
      <header className="flex justify-between items-start mb-5 align-top">
        <div>
          {company.logo_url && <img src={company.logo_url} alt="Company Logo" className="h-10 mb-4" />}
          <h1 className="text-xl font-bold text-gray-900">{company.name || 'Your Company'}</h1>
        </div>
        <div className="text-right ">
          <h2 className="text-2xl font-bold uppercase text-black">Invoice</h2>
          <p className="font-semibold text-gray-700 mt-1">{invoice.invoice_number}</p>
        </div>
      </header>

      {/* From / To Section */}
      <section className="grid grid-cols-2 gap-10 mb-5 pb-10 border-b">
        <div>
          <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider mb-2">From</h3>
          <p className="font-bold">{company.name}</p>
          {company.address && <p className="text-gray-600 whitespace-pre-line">{company.address}</p>}
          {company.email && <p className="text-gray-600">{company.email}</p>}
          {company.phoneNumber && <p className="text-gray-600">{company.phoneNumber}</p>}
          {company.tax_id && <p className="text-gray-600">Tax ID: {company.tax_id}</p>}
        </div>
        <div>
          <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider mb-2">Bill To</h3>
          <p className="font-bold">{invoice.clients.name}</p>
          <p className="text-gray-600">{invoice.clients.email}</p>
           {invoice.clients.phone && <p className="text-gray-600">{invoice.clients.phone}</p>}
          {invoice.clients.billing_address && <p className="text-gray-600 whitespace-pre-line">{invoice.clients.billing_address}</p>}
         
         
          {invoice.clients.tax_id && <p className="text-gray-600">Tax ID: {invoice.clients.tax_id}</p>}
        </div>
      </section>

      {/* Details Grid */}
      <section className="grid grid-cols-4 gap-4 mb-5 pb-10 border-b">
         <div>
            <p className="text-xs text-gray-500 mb-1">Invoice #</p>
            <p className="font-medium">{invoice.invoice_number}</p>
         </div>
         <div>
            <p className="text-xs text-gray-500 mb-1">Issue Date</p>
            <p className="font-medium">{new Date(invoice.issue_date).toLocaleDateString()}</p>
         </div>
         <div>
            <p className="text-xs text-gray-500 mb-1">Due Date</p>
            <p className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</p>
         </div>
         <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className={`font-bold uppercase ${getStatusStyles(invoice.status)}`}>{invoice.status}</p>
         </div>
      </section>

      {/* Items Table */}
      <section className="mb-10">
        <table className="w-full text-left ">
          <thead>
            <tr className="border-b text-xs text-gray-500 uppercase mb-2.5">
              <th className="font-semibold py-2">Description</th>
              <th className="font-semibold py-2 text-right">Qty</th>
              <th className="font-semibold py-2 text-right">Price</th>
              <th className="font-semibold py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => {
              const itemTotal = (item.quantity || 0) * (item.unit_price || 0);
              const discount = itemTotal * ((item.discount_pct || 0) / 100);
              const tax = (itemTotal - discount) * ((item.tax_pct || 0) / 100);
              const finalTotal = itemTotal - discount + tax;

              return (
                <tr key={index} className="border-b">
                  <td className="py-3">
                    <p className="font-medium text-gray-800">{item.description}</p>
                    {(item.discount_pct > 0 || item.tax_pct > 0) && (
                      <p className="text-xs text-gray-500">
                        {item.discount_pct > 0 && `Disc: ${item.discount_pct}%`}
                        {item.discount_pct > 0 && item.tax_pct > 0 && " | "}
                        {item.tax_pct > 0 && `Tax: ${item.tax_pct}%`}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">{invoice.currency} {Number(item.unit_price).toFixed(2)}</td>
                  <td className="py-3 text-right font-semibold">{invoice.currency} {finalTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Totals Section */}
      <section className="flex justify-end mb-10">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">{invoice.currency} {Number(invoice.subtotal).toFixed(2)}</span></div>
          {Number(invoice.discount_total) > 0 && (<div className="flex justify-between"><span className="text-gray-600">Discount</span><span className="font-medium text-green-600">- {invoice.currency} {Number(invoice.discount_total).toFixed(2)}</span></div>)}
          {Number(invoice.tax_total) > 0 && (<div className="flex justify-between"><span className="text-gray-600">Tax</span><span className="font-medium">{invoice.currency} {Number(invoice.tax_total).toFixed(2)}</span></div>)}
{/* This part for Shipping Fee is already correct */}
{Number(invoice.shipping_fee) > 0 && (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">Shipping Fee</span>
    <span className="font-medium">
      {invoice.currency} {Number(invoice.shipping_fee).toFixed(2)}
    </span>
  </div>
)}

{/* --- THIS IS THE CORRECTED CODE FOR CUSTOM FEE --- */}
{invoice.custom_fee_name && Number(invoice.custom_fee_value) > 0 && (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{invoice.custom_fee_name}</span>
    <span className="font-medium">
      {invoice.currency}
      {' '}
      {(
        invoice.custom_fee_type === 'percent'
          ? (invoice.subtotal * invoice.custom_fee_value) / 100
          : invoice.custom_fee_value
      ).toFixed(2)}
    </span>
  </div>
)}
          <div className="pt-2 mt-2 border-t flex justify-between"><span className="font-bold text-lg">Total</span><span className="font-bold text-lg">{invoice.currency} {Number(invoice.total).toFixed(2)}</span></div>
        </div>
      </section>
      
      {/* --- FIX: ADDED PAYMENT INFORMATION SECTION --- */}
      {invoice.payment_method && invoice.payment_method.type !== 'none' && (
        <section className="pt-8 mt-8 border-t">
          <h3 className="font-semibold mb-3">Payment Information</h3>
          {/* --- THIS IS THE NEW BLOCK TO ADD --- */}
          {invoice.payment_method.type === "cash" && (
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Method:</strong> Cash</p>
            </div>
          )}
          {/* --- END OF NEW BLOCK --- */}
          {invoice.payment_method.type === "bank_transfer" && (
            <div className="space-y-2 text-sm text-gray-600">
              {invoice.payment_method.bank_name && <p><strong>Bank:</strong> {invoice.payment_method.bank_name}</p>}
              {invoice.payment_method.account_number && <p><strong>Account:</strong> {invoice.payment_method.account_number}</p>}
              {invoice.payment_method.routing_number && <p><strong>Routing:</strong> {invoice.payment_method.routing_number}</p>}
            </div>
          )}
          {invoice.payment_method.type === "wallet" && (
            <div className="space-y-2 text-sm text-gray-600">
              {invoice.payment_method.wallet_name && <p><strong>Wallet:</strong> {invoice.payment_method.wallet_name}</p>}
              {invoice.payment_method.wallet_phone && <p><strong>Account:</strong> {invoice.payment_method.wallet_phone}</p>}
              {invoice.payment_method.qr_code_url && (
                <div className="mt-3">
                  <p className="mb-2">Scan to pay:</p>
                  <img src={invoice.payment_method.qr_code_url} alt="Payment QR" className="w-32 h-32 border rounded" />
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Footer Notes */}
      <footer className="pt-8 mt-8 border-t">
        {invoice.notes && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Notes</h4>
            <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}



{/* --- BRANDING ADDED HERE --- */}
        <div className="text-center text-xs text-gray-400 mt-12">
          <p>
            Generated by{' '}
            <a 
              href="https://paynvo.com" // <-- IMPORTANT: Change this URL
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue hover:underline font-semibold"
            >
              Paynvo
            </a>
          </p>
        </div>

      </footer>
    </div>
  );
};