import { useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useInvoiceStore } from "@/hooks/useInvoiceStore";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { FileText, DollarSign, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// --- Helper Components with Enhanced Styling ---

const StatCard = ({ title, value, icon, currency, description }: { title: string; value: string; icon: React.ReactNode; currency: string; description?: string; }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Card className="hover-lift transition-transform">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currency}{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const currency = payload[0].payload?.currency || '$';
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-1">
          <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
          <span className="font-bold text-foreground">{`${currency}${payload[0].value.toFixed(2)}`}</span>
        </div>
      </div>
    );
  }
  return null;
};


// --- The Main Dashboard Component ---

export default function Dashboard() {
  const { invoices, loading } = useInvoiceStore();

  const stats = useMemo(() => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid');
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
    
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const outstandingRevenue = unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalRevenue: totalRevenue.toFixed(2),
      outstandingRevenue: outstandingRevenue.toFixed(2),
      overdueAmount: overdueAmount.toFixed(2),
      totalInvoices: invoices.length,
      paidCount: paidInvoices.length,
      unpaidCount: unpaidInvoices.length,
      overdueCount: overdueInvoices.length,
    };
  }, [invoices]);

  const chartData = useMemo(() => {
    const monthlyRevenue: { [key: string]: number } = {};
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setDate(1); 
      d.setMonth(d.getMonth() - i);
      return { 
        name: d.toLocaleString('default', { month: 'short' }), 
        key: `${d.getFullYear()}-${d.getMonth()}` 
      };
    }).reverse();
    
    months.forEach(m => monthlyRevenue[m.key] = 0);

    invoices
      .filter(inv => inv.status === 'paid')
      .forEach(inv => {
        const date = new Date(inv.issue_date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (key in monthlyRevenue) {
          monthlyRevenue[key] += inv.total;
        }
      });
      
    return months.map(m => ({
      name: m.name,
      Revenue: monthlyRevenue[m.key] || 0,
      currency: invoices[0]?.currency || '$',
    }));
  }, [invoices]);

  const pieChartData = [
    { name: 'Paid', value: stats.paidCount },
    { name: 'Unpaid', value: stats.unpaidCount },
    { name: 'Overdue', value: stats.overdueCount },
  ].filter(item => item.value > 0);
  
 // --- COLOR MAPPING FOR PIE CHART (with Hex Codes) ---
const STATUS_COLORS: { [key: string]: string } = {
  'Paid': '#22C55E',    // A vibrant green
  'Unpaid': '#F97316',  // A strong orange
  'Overdue': '#EF4444', // A clear red
};

  const recentInvoices = invoices.slice(0, 5);

  if (loading) {
    return <Layout><div className="text-center p-8 text-muted-foreground">Loading dashboard...</div></Layout>;
  }

  return (
    <Layout>
      <SEO 
        title="Dashboard | Paynvo"
        description="Get a real-time overview of your business finances. Track total revenue, outstanding payments, and recent invoices at a glance."
        keywords="invoice dashboard, business analytics, revenue tracking, financial overview, paynvo"
      />
      <div className=" px-2 space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's a summary of your business.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Revenue (Paid)" value={stats.totalRevenue} icon={<DollarSign className="h-5 w-5 text-green-500" />} currency={invoices[0]?.currency || '$'} description={`${stats.paidCount} paid invoices`} />
          <StatCard title="Outstanding (Unpaid)" value={stats.outstandingRevenue} icon={<FileText className="h-5 w-5 text-orange-500" />} currency={invoices[0]?.currency || '$'} description={`${stats.unpaidCount} unpaid invoices`} />
          <StatCard title="Overdue Amount" value={stats.overdueAmount} icon={<AlertTriangle className="h-5 w-5 text-red-500" />} currency={invoices[0]?.currency || '$'} description={`${stats.overdueCount} overdue invoices`} />
          <StatCard title="Total Invoices" value={stats.totalInvoices.toString()} icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />} currency="" description="Across all statuses"/>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader><CardTitle>Revenue Overview (Last 6 Months)</CardTitle></CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${invoices[0]?.currency || '$'}${value}`} />
                  <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<CustomTooltip />} />
                  <Bar dataKey="Revenue" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Invoice Status Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={110} dataKey="value" nameKey="name" stroke="hsl(var(--background))" strokeWidth={2}>
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/invoices">View All <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentInvoices.length > 0 ? recentInvoices.map(inv => (
                <Link to={`/invoices/${inv.id}`} key={inv.id} className="block p-3 rounded-lg hover:bg-accent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${inv.status === 'paid' ? 'bg-green-500' : inv.status === 'overdue' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                      <div><p className="font-semibold">{inv.invoice_number}</p><p className="text-sm text-muted-foreground">{inv.clients.name}</p></div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{inv.currency} {inv.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Due: {new Date(inv.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Invoices Yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Create your first invoice to see your dashboard.</p>
                  <Button asChild className="mt-4"><Link to="/invoices/new">Create Invoice</Link></Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}