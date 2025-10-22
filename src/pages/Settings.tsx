// import { useEffect, useState } from "react";
// import { Layout } from "@/components/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { SEO } from "@/components/SEO";
// import { Upload } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function Settings() {
//   const [company, setCompany] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const { toast } = useToast();

//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     tax_id: "",
//     default_currency: "USD",
//     invoice_prefix: "INV",
//     invoice_next_number: 1,
//   });

//   useEffect(() => {
//     loadCompany();
//   }, []);

//   const loadCompany = async () => {
//     try {
//       const { data: companies } = await supabase
//         .from("companies")
//         .select("*")
//         .limit(1);

//       if (companies && companies.length > 0) {
//         const comp = companies[0];
//         setCompany(comp);
//         setFormData({
//           name: comp.name || "",
//           address: comp.address || "",
//           tax_id: comp.tax_id || "",
//           default_currency: comp.default_currency || "USD",
//           invoice_prefix: comp.invoice_prefix || "INV",
//          invoice_next_number: comp.invoice_next_number || 1,
//         });
//       } else {
//         // Create default company
//         const { data: newCompany } = await supabase
//           .from("companies")
//           .insert([{ name: "My Company" }])
//           .select()
//           .single();
//         if (newCompany) {
//           setCompany(newCompany);
//           setFormData({
//             name: newCompany.name || "",
//             address: newCompany.address || "",
//             tax_id: newCompany.tax_id || "",
//             default_currency: newCompany.default_currency || "USD",
//             invoice_prefix: newCompany.invoice_prefix || "INV",
//             invoice_next_number: newCompany.invoice_next_number || 1,
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error loading company:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!company) return;

//     setSaving(true);
//     try {
//       const { error } = await supabase
//         .from("companies")
//         .update(formData)
//         .eq("id", company.id);

//       if (error) throw error;

//       toast({ title: "Settings saved successfully" });
//       loadCompany();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !company) return;

//     try {
//       // Store in browser storage
//       const { browserStorage } = await import("@/lib/storage");
//       const fileId = await browserStorage.uploadFile(file, `logos/${company.id}`);
//       const publicUrl = await browserStorage.getPublicUrl(fileId);

//       if (!publicUrl) throw new Error("Failed to generate file URL");

//       const { error: updateError } = await supabase
//         .from("companies")
//         .update({ logo_url: publicUrl })
//         .eq("id", company.id);

//       if (updateError) throw updateError;

//       toast({ title: "Logo uploaded successfully (expires in 1 hour)" });
//       loadCompany();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center h-full">
//           <div className="text-muted-foreground">Loading...</div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <SEO 
//         title="Company Settings - InvoiceFlow"
//         description="Configure your company information, logo, and invoice preferences. Customize your invoicing experience."
//         keywords="invoice settings, company settings, invoice configuration, business settings"
//       />
//       <div className="p-8 max-w-4xl">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Settings</h1>
//           <p className="text-muted-foreground">
//             Manage your company information and invoice settings
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Company Logo */}
//           <Card className="p-6 shadow-soft">
//             <h2 className="text-xl font-semibold mb-4">Company Logo</h2>
//             <div className="flex items-center gap-6">
//               {company?.logo_url && (
//                 <img
//                   src={company.logo_url}
//                   alt="Company logo"
//                   className="w-24 h-24 object-contain rounded border border-border"
//                 />
//               )}
//               <div className="flex-1">
//                 <Label htmlFor="logo" className="cursor-pointer">
//                   <div className="flex items-center gap-2 text-primary hover:text-primary-hover">
//                     <Upload className="h-4 w-4" />
//                     <span>Upload Logo</span>
//                   </div>
//                   <Input
//                     id="logo"
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleLogoUpload}
//                   />
//                 </Label>
//                 <p className="text-sm text-muted-foreground mt-2">
//                   Recommended: 200x200px, PNG or JPG
//                 </p>
//               </div>
//             </div>
//           </Card>

//           {/* Company Information */}
//           <Card className="p-6 shadow-soft">
//             <h2 className="text-xl font-semibold mb-4">Company Information</h2>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Company Name *</Label>
//                 <Input
//                   id="name"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="address">Address</Label>
//                 <Textarea
//                   id="address"
//                   value={formData.address}
//                   onChange={(e) =>
//                     setFormData({ ...formData, address: e.target.value })
//                   }
//                   rows={3}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
//                 <Input
//                   id="tax_id"
//                   value={formData.tax_id}
//                   onChange={(e) =>
//                     setFormData({ ...formData, tax_id: e.target.value })
//                   }
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Invoice Settings */}
//           <Card className="p-6 shadow-soft">
//             <h2 className="text-xl font-semibold mb-4">Invoice Settings</h2>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="currency">Default Currency</Label>
//                 <Select
//                   value={formData.default_currency}
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, default_currency: value })
//                   }
//                 >
//                   <SelectTrigger id="currency">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="USD">USD - US Dollar</SelectItem>
//                     <SelectItem value="EUR">EUR - Euro</SelectItem>
//                     <SelectItem value="GBP">GBP - British Pound</SelectItem>
//                     <SelectItem value="NPR">NPR - Nepalese Rupee</SelectItem>
//                     <SelectItem value="INR">INR - Indian Rupee</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="prefix">Invoice Prefix</Label>
//                   <Input
//                     id="prefix"
//                     value={formData.invoice_prefix}
//                     onChange={(e) =>
//                       setFormData({ ...formData, invoice_prefix: e.target.value })
//                     }
//                     placeholder="INV"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="next_number">Next Invoice Number</Label>
//                   <Input
//                     id="next_number"
//                     type="number"
//                     value={formData.invoice_next_number}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         invoice_next_number: parseInt(e.target.value) || 1,
//                       })
//                     }
//                     min={1}
//                   />
//                 </div>
//               </div>

//               <p className="text-sm text-muted-foreground">
//                 Next invoice will be numbered: {formData.invoice_prefix}-
//                 {new Date().getFullYear()}-
//                 {String(formData.invoice_next_number).padStart(4, "0")}
//               </p>
//             </div>
//           </Card>

//           {/* Payment Integration (Placeholder) */}
//           <Card className="p-6 shadow-soft">
//             <h2 className="text-xl font-semibold mb-4">Payment Integration</h2>
//             <p className="text-sm text-muted-foreground mb-4">
//               Connect Stripe to enable online payments for your invoices
//             </p>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="stripe_key">Stripe Secret Key</Label>
//                 <Input
//                   id="stripe_key"
//                   type="password"
//                   placeholder="sk_test_..."
//                   disabled
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   Contact support to enable Stripe integration
//                 </p>
//               </div>
//             </div>
//           </Card>

//           <div className="flex justify-end">
//             <Button type="submit" size="lg" disabled={saving}>
//               {saving ? "Saving..." : "Save Settings"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </Layout>
//   );
// }






import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import our custom hook for local company settings
import { useCompanyStore, Company } from "@/hooks/useCompanyStore";

export default function Settings() {
  // Use the hook to manage company data in localStorage
  const { company, loading, updateCompany } = useCompanyStore();
  
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Local state for the form, to be synced with the hook's state
  const [formData, setFormData] = useState<Omit<Company, 'id'>>({
    name: "",
    address: "",
    tax_id: "",
    default_currency: "USD",
    invoice_prefix: "INV",
    invoice_next_number: 1,
    logo_url: "",
  });

  // Effect to populate the form when the company data is loaded from the hook
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        address: company.address || "",
        tax_id: company.tax_id || "",
        default_currency: company.default_currency || "USD",
        invoice_prefix: company.invoice_prefix || "INV",
        invoice_next_number: company.invoice_next_number || 1,
        logo_url: company.logo_url || "",
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setSaving(true);
    try {
      // Create the updated company object by merging the existing and form data
      const updatedCompanyData: Company = {
        ...company,
        ...formData,
      };
      
      await updateCompany(updatedCompanyData);
      toast({ title: "Settings saved successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  
  // Helper to convert an image file to a base64 string
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company) return;

    try {
      // Convert image to base64 to store it in localStorage
      const base64Logo = await fileToDataUrl(file);
      
      const updatedCompanyData: Company = {
        ...company,
        ...formData, // Ensure current form changes are included
        logo_url: base64Logo,
      };
      
      await updateCompany(updatedCompanyData);
      toast({ title: "Logo updated successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to upload logo.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full"><p className="text-muted-foreground">Loading settings...</p></div>
      </Layout>
    );
  }

  return (
    <Layout>
    <SEO 
  title="Settings | Paynvo"
  description="Configure your company information, upload your logo, and customize invoice preferences. Manage your data with our secure backup and restore feature."
  keywords="invoice settings, company settings, configure paynvo, backup data, export data, invoice preferences"
/>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your company and invoice settings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Company Logo</h2>
            <div className="flex items-center gap-6">
              {formData.logo_url && (
                <img src={formData.logo_url} alt="Company logo" className="w-24 h-24 object-contain rounded border border-border"/>
              )}
              <div className="flex-1">
                <Label htmlFor="logo" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-primary hover:text-primary-hover"><Upload className="h-4 w-4"/><span>{formData.logo_url ? "Change Logo" : "Upload Logo"}</span></div>
                  <Input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
                </Label>
                <p className="text-sm text-muted-foreground mt-2">Recommended: PNG or JPG</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <div className="space-y-4">
              <div className="space-y-2"><Label htmlFor="name">Company Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required/></div>
              <div className="space-y-2"><Label htmlFor="address">Address</Label><Textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3}/></div>
              <div className="space-y-2"><Label htmlFor="tax_id">Tax ID / VAT Number</Label><Input id="tax_id" value={formData.tax_id} onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}/></div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Invoice Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select value={formData.default_currency} onValueChange={(value) => setFormData({ ...formData, default_currency: value })}>
                  <SelectTrigger id="currency"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="NPR">NPR - Nepalese Rupee</SelectItem>
                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="prefix">Invoice Prefix</Label><Input id="prefix" value={formData.invoice_prefix} onChange={(e) => setFormData({ ...formData, invoice_prefix: e.target.value })} placeholder="INV"/></div>
                <div className="space-y-2"><Label htmlFor="next_number">Next Invoice Number</Label><Input id="next_number" type="number" value={formData.invoice_next_number} onChange={(e) => setFormData({ ...formData, invoice_next_number: parseInt(e.target.value) || 1 })} min={1}/></div>
              </div>
              <p className="text-sm text-muted-foreground">Next invoice will be numbered: {formData.invoice_prefix}-{new Date().getFullYear()}-{String(formData.invoice_next_number).padStart(4, "0")}</p>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}