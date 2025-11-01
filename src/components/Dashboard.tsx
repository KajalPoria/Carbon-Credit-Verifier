import { Card } from "@/components/ui/card";
import { Leaf, Zap, Shield, Activity } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const energyData = [
  { time: "00:00", value: 45 },
  { time: "04:00", value: 32 },
  { time: "08:00", value: 78 },
  { time: "12:00", value: 125 },
  { time: "16:00", value: 98 },
  { time: "20:00", value: 65 },
  { time: "24:00", value: 42 },
];

const verificationData = [
  { time: "Week 1", verified: 120, pending: 20 },
  { time: "Week 2", verified: 280, pending: 35 },
  { time: "Week 3", verified: 450, pending: 28 },
  { time: "Week 4", verified: 680, pending: 15 },
];

const Dashboard = () => {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Live Verification Dashboard</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring of energy generation, AI validation, and carbon credit tokenization
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-accent">+12.5%</span>
            </div>
            <div className="text-3xl font-bold mb-1">1,247 kWh</div>
            <div className="text-sm text-muted-foreground">Energy Generated</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Leaf className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xs font-medium text-accent">Live</span>
            </div>
            <div className="text-3xl font-bold mb-1">623 tons</div>
            <div className="text-sm text-muted-foreground">CO₂ Offset</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-secondary/5 border-secondary/20 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-secondary/10">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-xs font-medium text-accent">Verified</span>
            </div>
            <div className="text-3xl font-bold mb-1">1,542</div>
            <div className="text-sm text-muted-foreground">Credits Minted</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-accent">Active</span>
            </div>
            <div className="text-3xl font-bold mb-1">99.8%</div>
            <div className="text-sm text-muted-foreground">Validation Rate</div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold mb-6">Real-Time Energy Production</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={energyData}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#colorEnergy)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold mb-6">Verification Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={verificationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="verified" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--muted-foreground))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
