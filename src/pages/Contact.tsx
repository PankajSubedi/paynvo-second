import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, ShieldCheck, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // The recipient email address
    const recipientEmail = "pankajsubedi136@gmail.com";

    // Prepare the subject and body for the mailto link
    const subject = encodeURIComponent(`Paynvo Contact: ${formData.subject}`);
    const body = encodeURIComponent(
      `You have a new message from ${formData.name} (${formData.email}):\n\n${formData.message}`
    );

    // Construct the mailto link
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    // Open the user's default email client
    window.location.href = mailtoLink;

    toast({
      title: "Opening Email Client",
      description: "Please send the pre-filled email from your mail application.",
    });

    // Clear the form after attempting to open the email client
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <SEO 
        title="Contact Us | Paynvo"
        description="Have a question or feedback about Paynvo? Get in touch with our team. We'd love to hear from you."
        keywords="contact paynvo, support, feedback, help, invoicing app"
      />
      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
            Whether you have a question, a feature request, or just want to say hello, we're here to listen.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Your Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="What can we help you with?" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us more about your inquiry..." rows={6} required />
            </div>
            <Button type="submit" className="w-full" size="lg">
              <Send className="mr-2 h-4 w-4" />
              Open Email & Send
            </Button>
          </form>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 text-center md:text-left">
          <Card className="p-6 bg-muted/30 flex flex-col items-center md:flex-row gap-4">
            <HelpCircle className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">Need Help?</h3>
              <p className="text-sm text-muted-foreground">Check out our <Link to="/documentation" className="text-primary hover:underline">Documentation</Link> for guides and answers.</p>
            </div>
          </Card>
          <Card className="p-6 bg-muted/30 flex flex-col items-center md:flex-row gap-4">
            <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">Privacy Concerns?</h3>
              <p className="text-sm text-muted-foreground">Your privacy is our priority. Read our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}