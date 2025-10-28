


// src/pages/Clients.tsx
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { Plus, Pencil, Trash2, Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useClientStore, Client } from "@/hooks/useClientStore";

export default function Clients() {
  const { clients, loading, addClient, updateClient, deleteClient } = useClientStore();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    billing_address: "",
    tax_id: "",
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", billing_address: "", tax_id: "" });
    setEditingClient(null);
  };
  
  // --- CORRECTED handleSubmit FUNCTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if we are editing an existing client with a valid ID
      if (editingClient && typeof editingClient.id === 'number') {
        const updatedClient: Client = {
          ...editingClient, // This carries over the original id and created_at
          ...formData,     // This applies the changes from the form
        };
        await updateClient(updatedClient);
        toast({ title: "Client updated successfully" });
      } else {
        // Otherwise, we are adding a new client
        await addClient(formData);
        toast({ title: "Client created successfully" });
      }

      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      // Improved error logging to help debug future issues
      console.error("Failed to save client:", error);
      toast({
        title: "Error Saving Client",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (clientId: number) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClient(clientId);
        toast({ title: "Client deleted successfully" });
      } catch (error: any) {
        toast({ title: "Error deleting client", description: error.message, variant: "destructive" });
      }
    }
  };
  
  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      billing_address: client.billing_address || "",
      tax_id: client.tax_id || "",
    });
    setDialogOpen(true);
  };

  // The rest of the component's JSX remains the same
  return (
    <Layout>
     <SEO 
  title="Manage Clients | Paynvo"
  description="Keep all your customer information organized. Add, edit, and manage client details to streamline your invoicing process and save time."
  keywords="client management, customer management, client database, business contacts, paynvo"
/>
      <div className="py-8 px-2">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Clients</h1>
            <p className="text-muted-foreground">Manage your client information</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button size="lg"><Plus className="mr-2 h-5 w-5" /> Add Client</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="name">Client Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email </Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="tax_id">Tax ID</Label><Input id="tax_id" value={formData.tax_id} onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="address">Billing Address</Label><Textarea id="address" value={formData.billing_address} onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })} rows={3} /></div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingClient ? "Update Client" : "Add Client"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12"><p className="text-muted-foreground">Loading clients...</p></div>
        ) : clients.length === 0 ? (
          <Card className="p-12 text-center shadow-soft"><p className="text-muted-foreground mb-4">No clients yet. Add your first client to get started.</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="p-6 shadow-soft hover:shadow-medium transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">{client.name}</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(client)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(client.id!)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {client.email && (<div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /><span>{client.email}</span></div>)}
                  {client.phone && (<div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /><span>{client.phone}</span></div>)}
                  {client.billing_address && (<p className="text-muted-foreground mt-2">{client.billing_address}</p>)}
                  {client.tax_id && (<p className="text-muted-foreground text-xs">Tax ID: {client.tax_id}</p>)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
