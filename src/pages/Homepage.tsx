import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, FileText, Download, ArrowRight, Check, Database, Globe, Star, Minus, Users } from "lucide-react";
import { SEO } from "@/components/SEO";
import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// --- Helper Components (Defined at the top level) ---

// Reusable Animated Section Wrapper
const AnimatedSection = ({ children, className = "", id }: { children: ReactNode; className?: string; id?: string; }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.17, 0.55, 0.55, 1] }}
    >
      {children}
    </motion.section>
  );
};

// Animated Counter for Stats
const Counter = ({ from = 0, to }: { from?: number; to: number; }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(from, to, {
        duration: 1.5,
        onUpdate(value) {
          node.textContent = Math.round(value).toLocaleString();
        },
      });
      return () => controls.stop();
    }
  }, [isInView, from, to]);

  return <span ref={ref}>{from}</span>;
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: ReactNode; title: string; description: string }) => (
  <Card className="p-6 text-left bg-card/50 hover-lift transition-all duration-300 border-border/50">
    <div className="mb-4 bg-primary/10 text-primary p-3 rounded-lg w-fit">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Card>
);

// Reusable Testimonial Card Component
const TestimonialCard = ({ quote, name, title }: { quote: string; name: string; title: string }) => (
    <Card className="p-6 bg-muted/30 border-none">
        <div className="flex mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}</div>
        <blockquote className="italic text-muted-foreground">"{quote}"</blockquote>
        <p className="font-semibold mt-4">{name}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
    </Card>
);


// --- The Main Homepage Component ---
export default function HomePage() {
  return (
    <Layout>
    <SEO 
  title="Paynvo | Simple, Private & Offline Invoicing"
  description="Create, manage, and track professional invoices directly in your browser. No sign-up, no cloud, and 100% free. Your data is always yours."
  keywords="invoice generator, free invoice tool, offline invoicing, private invoicing, paynvo, client billing, small business tools"
/>
      
      <div className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                Professional Invoicing,
                <span className="block bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mt-2">Uniquely Private.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0 mb-10">Create, manage, and download unlimited invoices without ever sending your data to a server. Fast, secure, and completely free.</p>
              <div className="flex justify-center md:justify-start gap-4">
                <Button asChild size="lg" className="shadow-lg shadow-primary/20"><Link to="/invoices/new">Create a Free Invoice <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
                <Button asChild size="lg" variant="ghost"><a href="#features">Learn More</a></Button>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden md:block">
              <Card className="p-2 bg-slate-100 dark:bg-slate-800/50 shadow-2xl rotate-3">
                <Card className="p-4">
                  <div className="flex justify-between items-center mb-4"><p className="font-bold text-sm">INV-2025-0001</p><div className="text-xs font-bold text-green-500 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">PAID</div></div>
                  <motion.div initial={{ width: '25%' }} animate={{ width: '100%' }} transition={{ duration: 1, delay: 0.5 }} className="h-4 bg-muted rounded"></motion.div>
                  <motion.div initial={{ width: '40%' }} animate={{ width: '75%' }} transition={{ duration: 1, delay: 0.7 }} className="h-4 bg-muted rounded mt-3"></motion.div>
                  <div className="flex justify-end mt-6"><div className="w-1/2"><div className="flex justify-between text-sm"><span>Subtotal</span><span>$500.00</span></div><div className="flex justify-between text-sm mt-1"><span>Tax (9%)</span><span>$45.00</span></div><div className="border-t my-2"></div><div className="flex justify-between font-bold"><span className="text-primary">Total</span><span>$545.00</span></div></div></div>
                </Card>
              </Card>
            </motion.div>
          </div>
        </section>

        <AnimatedSection className="py-20 bg-muted/30">
            <div className="container max-w-5xl mx-auto">
                <div className="text-center mb-16"><h2 className="text-3xl font-bold">Get Started in 30 Seconds</h2><p className="text-muted-foreground mt-2 max-w-xl mx-auto">No sign-up forms. No credit cards. Just invoicing.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center"><div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div><h3 className="font-semibold text-lg mb-2">Configure Details</h3><p className="text-sm text-muted-foreground">Go to Settings to add your company info and logo. This is a one-time setup.</p></div>
                    <div className="flex flex-col items-center"><div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div><h3 className="font-semibold text-lg mb-2">Create Invoice</h3><p className="text-sm text-muted-foreground">Fill in your client and line items. Totals are calculated automatically.</p></div>
                    <div className="flex flex-col items-center"><div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">3</div><h3 className="font-semibold text-lg mb-2">Download & Send</h3><p className="text-sm text-muted-foreground">Download a professional PDF to send directly to your client. It's never sent to a server.</p></div>
                </div>
            </div>
        </AnimatedSection>



{/* the offline advantage */}

{/* Dark Contrast "Why Offline?" Section */}
        <AnimatedSection className="py-24 bg-slate-900 text-white">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">The Offline Advantage</h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">See how InvoiceFlow compares to traditional cloud-based invoicing tools.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <Card className="p-8 bg-slate-800/50 border-slate-700">
                <h3 className="text-2xl font-bold mb-4 text-white">InvoiceFlow <span className="text-cyan-400">(Offline-First)</span></h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-6 w-6 text-green-400 mt-1 shrink-0"/>
                    <p className="text-slate-300"><span className="font-semibold text-white">Maximum Privacy:</span> Data never leaves your device.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-yellow-400 mt-1 shrink-0"/>
                    <p className="text-slate-300"><span className="font-semibold text-white">Blazing Speed:</span> No network latency, instant loading.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-400 mt-1 shrink-0"/>
                    <p className="text-slate-300"><span className="font-semibold text-white">Truly Free:</span> No subscriptions, no hidden costs. Forever.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Globe className="h-6 w-6 text-blue-400 mt-1 shrink-0"/>
                    <p className="text-slate-300"><span className="font-semibold text-white">Works Anywhere:</span> Fully functional without an internet connection.</p>
                  </li>
                </ul>
              </Card>
              <Card className="p-8 bg-slate-800 border-slate-700 opacity-60">
                <h3 className="text-2xl font-bold mb-4 text-white">Cloud Invoicing</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-6 w-6 text-red-400 mt-1 shrink-0"/>
                    <p className="text-slate-300"><span className="font-semibold text-white">Data Risk:</span> Your data is stored on third-party servers.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-red-400 mt-1 shrink-0"/>
                    <p className="text-slate-300"><span className="font-semibold text-white">Slower:</span> Dependent on your internet connection speed.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Minus className="h-6 w-6 text-red-400 mt-1 shrink-0"/>
                    <p className="text-slate-300"><span className="font-semibold text-white">Subscription Costs:</span> Monthly or yearly fees add up.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Globe className="h-6 w-6 text-red-400 mt-1 shrink-0"/>
                    <p className="text-slate-300"><span className="font-semibold text-white">Requires Internet:</span> Useless without a stable connection.</p>
                  </li>
                </ul>
              </Card>
            </div>
            <div className="text-center mt-12">
              <p className="text-4xl font-extrabold text-white"><Counter to={3000} />+</p>
              <p className="text-slate-400">invoices already created securely on-device.</p>
            </div>
          </div>
        </AnimatedSection>



        
        <AnimatedSection id="features" className="py-20">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-16"><h2 className="text-3xl font-bold">A Feature Set Focused on What Matters</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard icon={<Users className="h-6 w-6" />} title="Client Management" description="Save client details in your browser for quick and easy selection on future invoices." />
              <FeatureCard icon={<FileText className="h-6 w-6" />} title="Customizable Invoices" description="Add line items, taxes, discounts, shipping fees, and custom notes to fit your needs." />
              <FeatureCard icon={<Download className="h-6 w-6" />} title="Professional PDFs" description="Generate and download clean, print-ready PDF invoices in various formats with one click." />
              <FeatureCard icon={<Database className="h-6 w-6" />} title="No Database Setup" description="Leverages modern browser storage, eliminating the need for complex backend configurations." />
              <FeatureCard icon={<ShieldCheck className="h-6 w-6" />} title="Absolute Privacy" description="Your business data is yours alone. Stored on-device, it never touches a third-party server." />
              <FeatureCard icon={<Zap className="h-6 w-6" />} title="Instant & Offline" description="Works flawlessly without an internet connection. No lag, no spinners, just pure speed." />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-20 bg-muted/30">
          <div className="container max-w-3xl mx-auto">
            <div className="text-center mb-12"><h2 className="text-3xl font-bold">Frequently Asked Questions</h2></div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1"><AccordionTrigger>Is this invoicing tool really free?</AccordionTrigger><AccordionContent>Yes, completely free. There are no subscriptions, hidden fees, or feature tiers. It's a tool built to be used.</AccordionContent></AccordionItem>
              <AccordionItem value="item-2"><AccordionTrigger>Where is my data stored?</AccordionTrigger><AccordionContent>All your data—invoices, clients, and company settings—is stored exclusively in your own web browser's secure storage (IndexedDB and localStorage). We have no access to it.</AccordionContent></AccordionItem>
              <AccordionItem value="item-3"><AccordionTrigger>What happens if I clear my browser cache?</AccordionTrigger><AccordionContent>Clearing your site data will permanently delete all your stored invoices and clients. The app will warn you about this. We recommend making backups by downloading your invoices as PDFs.</AccordionContent></AccordionItem>
              <AccordionItem value="item-4"><AccordionTrigger>Can I use this on multiple devices?</AccordionTrigger><AccordionContent>No. Because the data is stored locally on a single device, your invoices will not sync between your laptop and your desktop, for example. It's designed for a single-device workflow.</AccordionContent></AccordionItem>
            </Accordion>
          </div>
        </AnimatedSection>

        <section className="py-24 bg-slate-900">
          <div className="container max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Own Your Invoicing?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">Experience the speed and security of an offline-first workflow. Create your first invoice in under 60 seconds.</p>
            <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 shadow-lg shadow-cyan-500/20"><Link to="/invoices/new">Start for Free, Instantly <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}