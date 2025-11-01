import { Card } from "@/components/ui/card";
import { TrendingUp, Globe, Award, Users } from "lucide-react";

const impacts = [
  {
    icon: TrendingUp,
    title: "Environmental Transparency",
    description: "Combats greenwashing through verifiable, tamper-proof records on public blockchain",
    stat: "100%",
    label: "Traceable",
  },
  {
    icon: Globe,
    title: "Global Scalability",
    description: "Modular architecture deployable across multiple blockchain ecosystems and energy sources",
    stat: "Multi-Chain",
    label: "Compatible",
  },
  {
    icon: Award,
    title: "Fraud Prevention",
    description: "AI-powered validation eliminates double counting and false carbon offset claims",
    stat: "Zero",
    label: "Fraud Risk",
  },
  {
    icon: Users,
    title: "Sustainable Investment",
    description: "Encourages corporate adoption of clean energy through trusted carbon credit markets",
    stat: "24/7",
    label: "Verification",
  },
];

const Impact = () => {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Impact & Innovation</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Driving global climate action through verifiable, transparent carbon credit systems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {impacts.map((impact, index) => (
            <Card key={index} className="p-8 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300 border-border hover:border-primary/30 group">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-300">
                  <impact.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">{impact.title}</h3>
                  <p className="text-muted-foreground mb-4">{impact.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">{impact.stat}</span>
                    <span className="text-sm text-muted-foreground">{impact.label}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Judging Criteria */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Impact & Relevance", score: "25%", description: "Environmental accountability" },
            { label: "Technical Innovation", score: "25%", description: "AI + Blockchain integration" },
            { label: "Feasibility & Scalability", score: "25%", description: "Enterprise-ready architecture" },
            { label: "Presentation Quality", score: "25%", description: "Clear value demonstration" },
          ].map((criteria, i) => (
            <Card key={i} className="p-6 text-center bg-gradient-to-br from-card to-primary/5 border-primary/20">
              <div className="text-3xl font-bold text-primary mb-2">{criteria.score}</div>
              <div className="font-semibold mb-2">{criteria.label}</div>
              <div className="text-xs text-muted-foreground">{criteria.description}</div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
          <h3 className="text-3xl font-bold mb-4">Code for Energy. Tokenize the Future.</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us in building a transparent, automated, and intelligent carbon economy that drives real climate impact
          </p>
        </div>
      </div>
    </section>
  );
};

export default Impact;
