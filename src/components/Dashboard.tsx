import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Zap, Shield, Activity, LogOut } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AddProjectDialog from "./AddProjectDialog";
import AddReadingDialog from "./AddReadingDialog";

interface DashboardStats {
  totalEnergy: number;
  totalCO2: number;
  creditsMinted: number;
  validationRate: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalEnergy: 0,
    totalCO2: 0,
    creditsMinted: 0,
    validationRate: 0,
  });
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [verificationData, setVerificationData] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadDashboardData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      loadDashboardData();
    }
  };

  const loadDashboardData = async () => {
    const { data: readings } = await supabase
      .from("energy_readings")
      .select("*, projects!inner(user_id)")
      .order("timestamp", { ascending: true });

    if (readings) {
      const totalEnergy = readings.reduce((sum, r) => sum + Number(r.energy_kwh), 0);
      const totalCO2 = readings.reduce((sum, r) => sum + Number(r.co2_offset_tons), 0);
      const verifiedCount = readings.filter(r => r.verified).length;
      
      setStats({
        totalEnergy: Math.round(totalEnergy),
        totalCO2: Math.round(totalCO2),
        creditsMinted: verifiedCount,
        validationRate: readings.length > 0 ? Math.round((verifiedCount / readings.length) * 100) : 0,
      });

      // Process energy data for chart (last 7 readings)
      const recentReadings = readings.slice(-7);
      const chartData = recentReadings.map(r => ({
        time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: Number(r.energy_kwh),
      }));
      setEnergyData(chartData);

      // Process verification data
      const verifiedByWeek = readings.reduce((acc: any, r) => {
        const week = `Week ${Math.floor(readings.indexOf(r) / 7) + 1}`;
        if (!acc[week]) acc[week] = { time: week, verified: 0, pending: 0 };
        if (r.verified) acc[week].verified++;
        else acc[week].pending++;
        return acc;
      }, {});
      setVerificationData(Object.values(verifiedByWeek));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  if (!user) {
    return (
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Dashboard</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sign in to view your projects and energy data
          </p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex justify-between items-start mb-16 flex-wrap gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Live Verification Dashboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Real-time monitoring of energy generation, AI validation, and carbon credit tokenization
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <AddProjectDialog onProjectAdded={loadDashboardData} />
            <AddReadingDialog onReadingAdded={loadDashboardData} />
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
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
              <span className="text-xs font-medium text-accent">Live</span>
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
            <div className="text-3xl font-bold mb-1">{stats.creditsMinted.toLocaleString()}</div>
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
              <AreaChart data={energyData.length > 0 ? energyData : [{ time: "No data", value: 0 }]}>
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
              <LineChart data={verificationData.length > 0 ? verificationData : [{ time: "No data", verified: 0, pending: 0 }]}>
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
