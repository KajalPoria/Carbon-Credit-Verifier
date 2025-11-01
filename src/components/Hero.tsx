import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-renewable.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      
      {/* Hero image with overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Renewable energy landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Assets on Chain Hackathon 2025</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent">
          AI-Powered Carbon Credit Verifier
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          Bringing trust, automation, and intelligence to the carbon economy through blockchain verification and AI validation
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <Button size="lg" className="group bg-[var(--gradient-primary)] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[var(--glow-primary)]">
            View Dashboard
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/5">
            <TrendingUp className="mr-2 w-4 h-4" />
            See Impact
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
          <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Verified Credits</div>
          </div>
          <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div className="text-4xl font-bold text-accent mb-2">Zero</div>
            <div className="text-sm text-muted-foreground">Fraud Risk</div>
          </div>
          <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div className="text-4xl font-bold text-secondary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">AI Monitoring</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
