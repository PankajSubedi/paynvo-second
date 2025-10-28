// import { Layout } from "@/components/Layout";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Send, ShieldCheck, HelpCircle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useState } from "react";
// import { SEO } from "@/components/SEO";
// import { Link } from "react-router-dom";

// export default function Contact() {
//   const { toast } = useToast();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // The recipient email address
//     const recipientEmail = "pankajsubedi136@gmail.com";

//     // Prepare the subject and body for the mailto link
//     const subject = encodeURIComponent(`Paynvo Contact: ${formData.subject}`);
//     const body = encodeURIComponent(
//       `You have a new message from ${formData.name} (${formData.email}):\n\n${formData.message}`
//     );

//     // Construct the mailto link
//     const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

//     // Open the user's default email client
//     window.location.href = mailtoLink;

//     toast({
//       title: "Opening Email Client",
//       description: "Please send the pre-filled email from your mail application.",
//     });

//     // Clear the form after attempting to open the email client
//     setFormData({ name: "", email: "", subject: "", message: "" });
//   };

//   return (
//     <Layout>
//       <SEO 
//         title="Contact Us | Paynvo"
//         description="Have a question or feedback about Paynvo? Get in touch with our team. We'd love to hear from you."
//         keywords="contact paynvo, support, feedback, help, invoicing app"
//       />
//       <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-12">
//         <div className="text-center">
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
//             Get in Touch
//           </h1>
//           <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
//             Whether you have a question, a feature request, or just want to say hello, we're here to listen.
//           </p>
//         </div>

//         <Card className="p-6 md:p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name *</Label>
//                 <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" required />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Your Email *</Label>
//                 <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" required />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="subject">Subject *</Label>
//               <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="What can we help you with?" required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="message">Message *</Label>
//               <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us more about your inquiry..." rows={6} required />
//             </div>
//             <Button type="submit" className="w-full" size="lg">
//               <Send className="mr-2 h-4 w-4" />
//               Open Email & Send
//             </Button>
//           </form>
//         </Card>

//         <div className="grid md:grid-cols-2 gap-6 text-center md:text-left">
//           <Card className="p-6 bg-muted/30 flex flex-col items-center md:flex-row gap-4">
//             <HelpCircle className="h-8 w-8 text-primary shrink-0" />
//             <div>
//               <h3 className="font-semibold">Need Help?</h3>
//               <p className="text-sm text-muted-foreground">Check out our <Link to="/documentation" className="text-primary hover:underline">Documentation</Link> for guides and answers.</p>
//             </div>
//           </Card>
//           <Card className="p-6 bg-muted/30 flex flex-col items-center md:flex-row gap-4">
//             <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
//             <div>
//               <h3 className="font-semibold">Privacy Concerns?</h3>
//               <p className="text-sm text-muted-foreground">Your privacy is our priority. Read our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </Layout>
//   );
// }






// src/pages/Contact.tsx

import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, ShieldCheck, HelpCircle } from "lucide-react";
import { toast } from "sonner"; // Use Sonner for notifications
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // --- THIS IS YOUR UNIQUE FORM ENDPOINT FROM FORMPSREE ---
  const FORM_ENDPOINT = "https://formspree.io/f/xldpyjvd"; // <-- PASTE YOUR URL HERE

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json', // Formspree prefers this header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message Sent!", {
          description: "Thank you for reaching out. We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form
      } else {
        // Try to get error message from Formspree's response
        let errorMsg = "Failed to send message. Please try again later.";
        try {
          const errorData = await response.json();
          // Formspree often puts errors in an 'errors' array
          if (errorData.errors && errorData.errors.length > 0) {
            errorMsg = errorData.errors.map((err: any) => err.message).join(", ");
          } else if (errorData.message) {
            errorMsg = errorData.message;
          }
        } catch (jsonError) {
           errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      toast.error("Submission Error", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Contact Us | Paynvo"
        description="Have a question or feedback about Paynvo? Get in touch with our team."
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
              <div className="space-y-2"><Label htmlFor="name">Full Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" required /></div>
              <div className="space-y-2"><Label htmlFor="email">Email Address *</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="subject">Subject *</Label><Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="What can we help you with?" required /></div>
            <div className="space-y-2"><Label htmlFor="message">Message *</Label><Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us more..." rows={6} required /></div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>) : (<><Send className="mr-2 h-4 w-4" />Send Message</>)}
            </Button>
          </form>
        </Card>
        <div className="grid md:grid-cols-2 gap-6 text-center md:text-left">
          <Card className="p-6 bg-muted/30 flex flex-col items-center md:flex-row gap-4"><HelpCircle className="h-8 w-8 text-primary shrink-0" /><p className="text-sm text-muted-foreground">Need help? Check our <Link to="/documentation" className="text-primary hover:underline">Documentation</Link>.</p></Card>
          <Card className="p-6 bg-muted/30 flex flex-col items-center md:flex-row gap-4"><ShieldCheck className="h-8 w-8 text-primary shrink-0" /><p className="text-sm text-muted-foreground">Privacy concerns? Read our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p></Card>
        </div>
      </div>
    </Layout>
  );
}
