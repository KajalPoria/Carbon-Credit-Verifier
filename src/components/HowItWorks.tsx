import { Card } from "@/components/ui/card";
import { Database, Brain, Link2, Coins, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "IoT Data Collection",
    description: "Renewable energy sites transmit real-time sensor data from solar, wind, and other clean energy sources",
    color: "primary",
  },
  {
    icon: Brain,
    title: "AI Validation",
    description: "LangChain + OpenAI models verify energy production and detect anomalies, ensuring data authenticity",
    color: "secondary",
  },
  {
    icon: Link2,
    title: "Blockchain Integration",
    description: "Chainlink oracles trigger smart contracts once AI confirms legitimate emission reductions",
    color: "accent",
  },
  {
    icon: Coins,
    title: "Credit Tokenization",
    description: "Verified carbon credits are minted as transparent, tradeable tokens on Polygon blockchain",
    color: "primary",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A seamless pipeline from energy generation to verified carbon credit tokens
          </p>
        </div>

        <div className="relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <Card className="p-6 h-full bg-card hover:shadow-[var(--shadow-elevated)] transition-all duration-300 border-border hover:border-primary/30">
                  <div className={`inline-flex p-4 rounded-2xl mb-6 bg-gradient-to-br ${
                    step.color === 'primary' ? 'from-primary/10 to-primary/5' :
                    step.color === 'secondary' ? 'from-secondary/10 to-secondary/5' :
                    'from-accent/10 to-accent/5'
                  }`}>
                    <step.icon className={`w-8 h-8 ${
                      step.color === 'primary' ? 'text-primary' :
                      step.color === 'secondary' ? 'text-secondary' :
                      'text-accent'
                    }`} />
                  </div>
                  
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      step.color === 'primary' ? 'bg-primary/10 text-primary' :
                      step.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                      'bg-accent/10 text-accent'
                    }`}>
                      {index + 1}
                    </span>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </Card>

                {/* Arrow between cards */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 z-10 -translate-y-1/2">
                    <div className="p-2 rounded-full bg-background border border-border shadow-sm">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
          <h3 className="text-2xl font-bold mb-8 text-center">Tech Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "React", category: "Frontend" },
              { name: "Node.js", category: "Backend" },
              { name: "LangChain", category: "AI" },
              { name: "OpenAI", category: "AI" },
              { name: "Polygon", category: "Blockchain" },
              { name: "Chainlink", category: "Oracle" },
            ].map((tech, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300">
                <div className="font-semibold text-foreground mb-1">{tech.name}</div>
                <div className="text-xs text-muted-foreground">{tech.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
