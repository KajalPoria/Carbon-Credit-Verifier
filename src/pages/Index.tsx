import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import HowItWorks from "@/components/HowItWorks";
import Impact from "@/components/Impact";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Dashboard />
      <HowItWorks />
      <Impact />
    </main>
  );
};

export default Index;
