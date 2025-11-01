import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Zap, Shield, Activity, LogOut } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ProjectForm from "./ProjectForm";
import EnergyReadingForm from "./EnergyReadingForm";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

interface Stats {
  totalEnergy: number;
  totalCO2: number;
  totalCredits: number;
  validationRate: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalEnergy: 0,
    totalCO2: 0,
    totalCredits: 0,
    validationRate: 99.8,
  });
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [verificationData, setVerificationData] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const fetchDashboardData = async () => {
    try {
      const { data: readings, error } = await supabase
        .from("energy_readings")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) throw error;

      if (readings && readings.length > 0) {
        const totalEnergy = readings.reduce((sum, r) => sum + parseFloat(r.energy_kwh.toString()), 0);
        const totalCO2 = readings.reduce((sum, r) => sum + parseFloat(r.co2_offset_tons.toString()), 0);
        const verifiedCount = readings.filter(r => r.verified).length;

        setStats({
          totalEnergy: Math.round(totalEnergy),
          totalCO2: Math.round(totalCO2),
          totalCredits: verifiedCount,
          validationRate: readings.length > 0 ? (verifiedCount / readings.length * 100).toFixed(1) as any : 99.8,
        });

        const last7 = readings.slice(-7);
        const chartData = last7.map((r, i) => ({
          time: new Date(r.timestamp).toLocaleDateString(),
          value: parseFloat(r.energy_kwh.toString()),
        }));
        setEnergyData(chartData);

        const weeklyData = [];
        for (let i = 0; i < 4; i++) {
          const weekReadings = readings.slice(i * 7, (i + 1) * 7);
          const verified = weekReadings.filter(r => r.verified).length;
          const pending = weekReadings.filter(r => !r.verified).length;
          weeklyData.push({
            time: `Week ${i + 1}`,
            verified: verified * 100,
            pending: pending * 20,
          });
        }
        setVerificationData(weeklyData);
      }
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <section id="dashboard" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Live Verification Dashboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Real-time monitoring of energy generation, AI validation, and carbon credit tokenization
            </p>
          </div>
          <div className="flex gap-2">
            <ProjectForm onSuccess={handleRefresh} />
            <EnergyReadingForm onSuccess={handleRefresh} />
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
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
            <div className="text-3xl font-bold mb-1">{stats.totalEnergy.toLocaleString()} kWh</div>
            <div className="text-sm text-muted-foreground">Energy Generated</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Leaf className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xs font-medium text-accent">Live</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalCO2.toLocaleString()} tons</div>
            <div className="text-sm text-muted-foreground">CO₂ Offset</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-secondary/5 border-secondary/20 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-secondary/10">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-xs font-medium text-accent">Verified</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalCredits.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Credits Minted</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-accent">Active</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.validationRate}%</div>
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
