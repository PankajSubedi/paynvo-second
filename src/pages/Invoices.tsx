// import { useEffect, useState } from "react";
// import { Layout } from "@/components/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { supabase } from "@/integrations/supabase/client";
// import { Link } from "react-router-dom";
// import { SEO } from "@/components/SEO";
// import { Plus, Search, Filter } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function Invoices() {
//   const [invoices, setInvoices] = useState<any[]>([]);
//   const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadInvoices();
//   }, []);

//   useEffect(() => {
//     filterInvoices();
//   }, [searchQuery, statusFilter, invoices]);

//   const loadInvoices = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("invoices")
//         .select(`
//           *,
//           clients (
//             name,
//             email
//           )
//         `)
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       setInvoices(data || []);
//     } catch (error) {
//       console.error("Error loading invoices:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterInvoices = () => {
//     let filtered = invoices;

//     if (statusFilter !== "all") {
//       filtered = filtered.filter((inv) => inv.status === statusFilter);
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(
//         (inv) =>
//           inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           inv.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredInvoices(filtered);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "paid":
//         return "bg-success/10 text-success";
//       case "overdue":
//         return "bg-destructive/10 text-destructive";
//       case "unpaid":
//         return "bg-warning/10 text-warning";
//       default:
//         return "bg-muted text-muted-foreground";
//     }
//   };

//   return (
//     <Layout>
//       <SEO 
//         title="Manage Invoices - InvoiceFlow"
//         description="View, manage, and track all your invoices. Filter by status, search by client, and download professional PDFs."
//         keywords="invoice management, invoice tracking, invoice list, invoice status, manage invoices"
//       />
//       <div className="p-8 animate-fade-in">
//         <div className="mb-8 flex items-center justify-between animate-slide-up">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Invoices</h1>
//             <p className="text-muted-foreground">
//               Manage and track all your invoices
//             </p>
//           </div>
//           <Link to="/invoices/new">
//             <Button size="lg" className="hover-scale smooth-transition">
//               <Plus className="mr-2 h-5 w-5" />
//               Create Invoice
//             </Button>
//           </Link>
//         </div>

//         {/* Filters */}
//         <Card className="p-6 mb-6 shadow-soft animate-slide-up" style={{ animationDelay: '0.1s' }}>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by invoice number or client..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 smooth-transition"
//               />
//             </div>
//             <div className="w-full sm:w-48">
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="smooth-transition">
//                   <Filter className="mr-2 h-4 w-4" />
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="draft">Draft</SelectItem>
//                   <SelectItem value="unpaid">Unpaid</SelectItem>
//                   <SelectItem value="paid">Paid</SelectItem>
//                   <SelectItem value="overdue">Overdue</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </Card>

//         {/* Invoice List */}
//         {loading ? (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">Loading invoices...</p>
//           </div>
//         ) : filteredInvoices.length === 0 ? (
//           <Card className="p-12 text-center shadow-soft">
//             <p className="text-muted-foreground mb-4">
//               {searchQuery || statusFilter !== "all"
//                 ? "No invoices match your filters"
//                 : "No invoices yet. Create your first invoice to get started."}
//             </p>
//             <Link to="/invoices/new">
//               <Button>Create Your First Invoice</Button>
//             </Link>
//           </Card>
//         ) : (
//           <div className="space-y-4">
//             {filteredInvoices.map((invoice, index) => (
//               <Link key={invoice.id} to={`/invoices/${invoice.id}`}>
//                 <Card 
//                   className="p-6 hover-lift smooth-transition cursor-pointer animate-slide-up" 
//                   style={{ animationDelay: `${0.2 + index * 0.05}s` }}
//                 >
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h3 className="text-lg font-semibold">
//                           {invoice.invoice_number}
//                         </h3>
//                         <span
//                           className={`px-2 py-1 rounded text-xs font-medium smooth-transition ${getStatusColor(
//                             invoice.status
//                           )}`}
//                         >
//                           {invoice.status.toUpperCase()}
//                         </span>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         {invoice.clients?.name || "No client"} •{" "}
//                         {new Date(invoice.issue_date).toLocaleDateString()} •{" "}
//                         {Array.isArray(invoice.items) ? invoice.items.length : 0} item{Array.isArray(invoice.items) && invoice.items.length !== 1 ? 's' : ''}
//                       </p>
//                     </div>
//                     <div className="text-left sm:text-right">
//                       <div className="text-2xl font-bold">
//                         {invoice.currency} {Number(invoice.total).toFixed(2)}
//                       </div>
//                       <div className="text-sm text-muted-foreground">
//                         Due: {new Date(invoice.due_date).toLocaleDateString()}
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }




// src/pages/Invoices.tsx
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Plus, Search, Filter, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoiceStore, Invoice } from "@/hooks/useInvoiceStore"; // IMPORT THE HOOK AND TYPE

// Reusable warning component to inform the user about local storage
const StorageWarning = () => (
  <Card className="p-4 mb-6 flex items-start gap-4 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-900/50">
    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
    <div>
      <h3 className="font-semibold text-amber-800 dark:text-amber-300">Data is Stored on Your Device</h3>
      <p className="text-sm text-amber-700 dark:text-amber-400">
        Your invoices are saved only in this browser. Clearing your browser data will permanently delete them.
      </p>
    </div>
  </Card>
);

export default function Invoices() {
  // Use our custom hook instead of Supabase state
  const { invoices, loading } = useInvoiceStore();
  
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // This effect now filters invoices from the local state managed by our hook
  useEffect(() => {
    let filtered = invoices;

    if (statusFilter !== "all") {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (inv) =>
          inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInvoices(filtered);
  }, [searchQuery, statusFilter, invoices]);


  const getStatusColor = (status: string) => {
    // Using more distinct colors for clarity
    switch (status) {
      case "paid": return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "overdue": return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "unpaid": return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
    <SEO 
  title="All Invoices | Paynvo"
  description="View, manage, and track all your invoices in one place. Filter by status (paid, unpaid, overdue) or search by client to find exactly what you need."
  keywords="manage invoices, invoice tracking, invoice list, invoice dashboard, paynvo, business invoices"
/>
      <div className="p-8 animate-fade-in">
        <div className="mb-8 flex items-center justify-between animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold mb-2">Invoices</h1>
            <p className="text-muted-foreground">
              Manage and track all your invoices
            </p>
          </div>
          <Link to="/invoices/new">
            <Button size="lg" className="hover-scale smooth-transition">
              <Plus className="mr-2 h-5 w-5" />
              Create Invoice
            </Button>
          </Link>
        </div>
        
        {/* The prominent warning message */}
        <StorageWarning />

        {/* Filters section remains the same */}
        <Card className="p-6 mb-6 shadow-soft animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* ... Filter UI is unchanged ... */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 smooth-transition"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="smooth-transition">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Invoice list section remains the same, but now uses local data */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading invoices from your device...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <Card className="p-12 text-center shadow-soft">
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "No invoices match your filters"
                : "No invoices yet. Create your first invoice to get started."}
            </p>
            <Link to="/invoices/new">
              <Button>Create Your First Invoice</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice, index) => (
              <Link key={invoice.id} to={`/invoices/${invoice.id}`}>
                <Card 
                  className=" mt-3 p-6 hover-lift smooth-transition cursor-pointer animate-slide-up" 
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {invoice.invoice_number}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium smooth-transition ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {invoice.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.clients?.name || "No client"} •{" "}
                        {new Date(invoice.issue_date).toLocaleDateString()} •{" "}
                        {Array.isArray(invoice.items) ? invoice.items.length : 0} item{Array.isArray(invoice.items) && invoice.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-2xl font-bold">
                        {invoice.currency} {Number(invoice.total).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(invoice.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}



