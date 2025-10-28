// src/pages/HomePage.tsx

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, FileText, Download, ArrowRight, Check, Database, Globe, Star, Minus, Users, Banknote, CreditCard, TrendingUp, DollarSign } from "lucide-react"; // Added new icons
import { SEO } from "@/components/SEO";
import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress"; // Assuming you have a Progress component
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

// --- Dummy data for the mini trend chart ---
const trendData = [
  { value: 10 },
  { value: 30 },
  { value: 20 },
  { value: 45 },
  { value: 35 },
  { value: 60 },
];

// --- Helper Components (Remain the same, added FaqItem) ---
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

const FeatureCard = ({ icon, title, description }: { icon: ReactNode; title: string; description: string }) => (
  <Card className="p-6 text-left bg-card/50 hover-lift transition-all duration-300 border-border/50">
    <div className="mb-4 bg-primary/10 text-primary p-3 rounded-lg w-fit">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Card>
);

const TestimonialCard = ({ quote, name, title }: { quote: string; name: string; title: string }) => (
    <Card className="p-6 bg-muted/30 border-none">
        <div className="flex mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}</div>
        <blockquote className="italic text-muted-foreground">"{quote}"</blockquote>
        <p className="font-semibold mt-4">{name}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
    </Card>
);

const FaqItem = ({ value, question, answer }: { value: string; question: string; answer: string }) => (
    <AccordionItem value={value}>
        <AccordionTrigger className="text-left font-semibold">{question}</AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground">{answer}</AccordionContent>
    </AccordionItem>
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
       {/* --- HERO SECTION (Clean Background & Paynvo Headline) --- */}
   {/* --- HERO SECTION (Full-Width Background, Centered Content) --- */}
        <section className="relative  py-16 md:py-24 overflow-hidden"> {/* Section takes full width, has background */}
           {/* Subtle background shapes remain */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl opacity-50 -translate-x-1/2"></div>
           <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl opacity-50 translate-x-1/2"></div>

          {/* --- Inner Container for Main Content --- */}
          {/* This div now centers the content and adds padding */}
          <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 items-center gap-8 md:gap-16">
              {/* Text Content */}
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-center md:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                  Professional Invoicing,
                  <span className="block bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mt-1 md:mt-2">
                    Uniquely Private.
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0 mb-8">
                  Create, manage, and download unlimited invoices directly in your browser. No cloud, no sign-up, no fees. Your data stays on your device, always.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-10">
                  <Button asChild size="lg" className="shadow-lg shadow-primary/20"><Link to="/invoices/new">Get Started</Link></Button>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-background" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Alice" alt="User avatar" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-background" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Bob" alt="User avatar" />
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-background" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Carol" alt="User avatar" />
                    </div>
                    <p className="text-sm text-muted-foreground">1k+ Happy users <br/> managing invoices offline!</p>
                  </div>
                </div>
                <div className="h-16 w-full max-w-sm mx-auto md:mx-0 relative">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                        <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} isAnimationActive={true}/>
                      </LineChart>
                    </ResponsiveContainer>
                   <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
                </div>
              </motion.div>
              
              {/* Visuals / Graphics Section (Remains the same structurally) */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative flex justify-center items-center h-[400px] md:h-[500px] w-full mt-12 md:mt-0">
                  <div className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-xl"></div>
                   <div className="absolute w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] rounded-full bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-900 dark:to-blue-950 flex items-center justify-center z-20 shadow-xl border-4 border-background overflow-hidden">
                     <img
                  src="/paynvo-logo.png" // <-- Use the root path
                      alt="Paynvo Logo"
                      className="h-16 w-16 object-contain" // Use object-contain to fit logo inside
                    />
                   </div>
                  <Card className="absolute bg-yellow-400 text-yellow-900 p-3 md:p-4 rounded-lg shadow-lg z-30 flex flex-col items-center justify-center text-sm font-semibold whitespace-nowrap transform rotate-[15deg]" style={{ top: '10%', right: '10%' }}>
                      <div className="font-bold text-lg md:text-xl">$<Counter to={7519} />k</div><div className="text-xs md:text-sm">Total Revenue</div><div className="w-8 h-8 rounded-full border-2 border-yellow-800/50 mt-1 overflow-hidden relative"><div className="absolute top-0 left-0 w-1/2 h-full bg-yellow-600/50"></div><div className="absolute top-0 right-0 w-1/2 h-full bg-yellow-700/50"></div></div>
                  </Card>
                  <Card className="absolute bg-card p-3 md:p-4 rounded-lg shadow-lg z-30 space-y-1 text-sm border" style={{ bottom: '10%', right: '5%' }}>
                      <p className="text-muted-foreground text-xs">Outstanding</p><p className="font-bold text-lg">$<Counter to={1824} /></p><div className="flex items-center text-orange-500 text-xs"><TrendingUp className="h-4 w-4 mr-1"/><span><Counter to={5} /> Unpaid</span></div>
                  </Card>
                  <Card className="absolute bg-card p-3 md:p-4 rounded-lg shadow-lg z-30 flex items-center gap-3 border" style={{ bottom: '25%', left: '0%' }}>
                      <FileText className="h-6 w-6 text-primary"/><div className="space-y-1"><p className="text-primary font-semibold text-sm">Invoice INV-002</p><p className="text-muted-foreground text-xs">Status: Overdue</p></div><Check className="h-5 w-5 text-green-500 ml-auto opacity-0"/>
                  </Card>
                  <div className="absolute bottom-5 right-20 w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xs text-blue-600 dark:text-blue-300 font-bold text-center z-10 transform -rotate-[20deg]"><span className="leading-tight">SIMPLE & PRIVATE</span></div>
              </motion.div>
            </div>
          </div>

          {/* --- Inner Container for Bottom Stats Section --- */}
          {/* This div now centers the stats and adds padding */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-16 md:mt-24">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-12 justify-items-center text-center">
                {/* ... motion.divs for stats remain the same ... */}
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className="space-y-2"><p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">3x</p><p className="text-muted-foreground text-sm">Faster than Cloud</p></motion.div>
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }} className="space-y-2"><p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">100%</p><p className="text-muted-foreground text-sm">Free Forever</p></motion.div>
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.2 }} className="space-y-2"><p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"><Counter to={1000} />+</p><p className="text-muted-foreground text-sm">Active Users</p></motion.div>
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.4 }} className="space-y-2 col-span-2 sm:col-span-1 flex flex-col items-center"><ShieldCheck className="h-10 w-10 text-primary/70 mb-2" /><p className="text-muted-foreground text-sm text-center">On-device storage ensures your business data stays completely private.</p></motion.div>
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS SECTION --- */}
        <AnimatedSection className="py-20 bg-muted/30">
            <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8"> {/* Added padding here */}
                <div className="text-center mb-16"><h2 className="text-3xl font-bold">Get Started in 30 Seconds</h2><p className="text-muted-foreground mt-2 max-w-xl mx-auto">No sign-up forms. No credit cards. Just invoicing.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center"><div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div><h3 className="font-semibold text-lg mb-2">Configure Details</h3><p className="text-sm text-muted-foreground">Go to Settings to add your company info and logo. This is a one-time setup.</p></div>
                    <div className="flex flex-col items-center"><div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div><h3 className="font-semibold text-lg mb-2">Create Invoice</h3><p className="text-sm text-muted-foreground">Fill in your client and line items. Totals are calculated automatically.</p></div>
                    <div className="flex flex-col items-center"><div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">3</div><h3 className="font-semibold text-lg mb-2">Download & Send</h3><p className="text-sm text-muted-foreground">Download a professional PDF to send directly to your client. It's never sent to a server.</p></div>
                </div>
            </div>
        </AnimatedSection>

        {/* --- OFFLINE ADVANTAGE SECTION --- */}
        <AnimatedSection className="py-24 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8"> {/* Added padding here */}
            <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold">The Offline Advantage</h2><p className="text-slate-400 mt-4 max-w-2xl mx-auto">See how Paynvo compares to traditional cloud-based invoicing tools.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <Card className="p-8 bg-slate-800/50 border-slate-700">
                <h3 className="text-2xl font-bold mb-4 text-white">Paynvo <span className="text-cyan-400">(Offline-First)</span></h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3"><ShieldCheck className="h-6 w-6 text-green-400 mt-1 shrink-0"/><p className="text-slate-300"><span className="font-semibold text-white">Maximum Privacy:</span> Data never leaves your device.</p></li>
                  <li className="flex items-start gap-3"><Zap className="h-6 w-6 text-yellow-400 mt-1 shrink-0"/><p className="text-slate-300"><span className="font-semibold text-white">Blazing Speed:</span> No network latency, instant loading.</p></li>
                  <li className="flex items-start gap-3"><Check className="h-6 w-6 text-green-400 mt-1 shrink-0"/><p className="text-slate-300"><span className="font-semibold text-white">Truly Free:</span> No subscriptions, no hidden costs. Forever.</p></li>
                  <li className="flex items-start gap-3"><Globe className="h-6 w-6 text-blue-400 mt-1 shrink-0"/><p className="text-slate-300"><span className="font-semibold text-white">Works Anywhere:</span> Fully functional without an internet connection.</p></li>
                </ul>
              </Card>
              <Card className="p-8 bg-slate-800 border-slate-700 opacity-60">
                <h3 className="text-2xl font-bold mb-4 text-white">Cloud Invoicing</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3"><ShieldCheck className="h-6 w-6 text-red-400 mt-1 shrink-0"/><p className="text-slate-300"><span className="font-semibold text-white">Data Risk:</span> Your data is stored on third-party servers.</p></li>
                  <li className="flex items-start gap-3"><Zap className="h-6 w-6 text-red-400 mt-1 shrink-0"/><p className="text-slate-300"><span className="font-semibold text-white">Slower:</span> Dependent on your internet connection speed.</p></li>
                  <li className="flex items-start gap-3"><Minus className="h-6 w-6 text-red-400 mt-1 shrink-0"/><p className="text-slate-300"><span className="font-semibold text-white">Subscription Costs:</span> Monthly or yearly fees add up.</p></li>
                  <li className="flex items-start gap-3"><Globe className="h-6 w-6 text-red-400 mt-1 shrink-0"/><p className="text-slate-300"><span className="font-semibold text-white">Requires Internet:</span> Useless without a stable connection.</p></li>
                </ul>
              </Card>
            </div>
            <div className="text-center mt-12"><p className="text-4xl font-extrabold text-white"><Counter to={3000} />+</p><p className="text-slate-400">invoices already created securely on-device.</p></div>
          </div>
        </AnimatedSection>

        {/* --- FEATURES SECTION --- */}
        <AnimatedSection id="features" className="py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8"> {/* Added padding here */}
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

        {/* --- FAQ SECTION --- */}
        <AnimatedSection className="py-20 bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8"> {/* Added padding here */}
            <div className="text-center mb-12"><h2 className="text-3xl font-bold">Frequently Asked Questions</h2></div>
            <Accordion type="single" collapsible className="w-full">
              <FaqItem value="item-1" question="Is this invoicing tool really free?" answer="Yes, completely free. There are no subscriptions, hidden fees, or feature tiers. It's a tool built to be used."/>
              <FaqItem value="item-2" question="Where is my data stored?" answer="All your data—invoices, clients, and company settings—is stored exclusively in your own web browser's secure storage (IndexedDB and localStorage). We have no access to it."/>
              <FaqItem value="item-3" question="What happens if I clear my browser cache?" answer="Clearing your site data will permanently delete all your stored invoices and clients. The app will warn you about this. We recommend making backups by downloading your invoices as PDFs."/>
              <FaqItem value="item-4" question="Can I use this on multiple devices?" answer="No. Because the data is stored locally on a single device, your invoices will not sync between your laptop and your desktop, for example. It's designed for a single-device workflow."/>
            </Accordion>
          </div>
        </AnimatedSection>

        {/* --- FINAL CTA SECTION --- */}
        <section className="py-24 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center text-white px-4 md:px-6 lg:px-8"> {/* Added padding here */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Own Your Invoicing?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">Experience the speed and security of an offline-first workflow. Create your first invoice in under 60 seconds.</p>
            <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 shadow-lg shadow-cyan-500/20"><Link to="/invoices/new">Start for Free, Instantly <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}