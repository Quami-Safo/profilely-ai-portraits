import { Link } from "react-router-dom";
import { HeroButton } from "@/components/ui/hero-button";
import { Sparkles, Palette, Code, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in-up">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-scale-in">
            ✨ AI-Powered Portfolio Generation
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-[hsl(247,83%,65%)] to-accent bg-clip-text text-transparent">
            Build Your Dream Portfolio
            <br />
            in Minutes
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let AI craft a stunning, professional portfolio that showcases your work beautifully. No coding required.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/auth">
              <HeroButton variant="hero" size="lg">
                <Sparkles className="w-5 h-5" />
                Start Building Free
              </HeroButton>
            </Link>
            <Link to="/auth">
              <HeroButton variant="heroOutline" size="lg">
                View Examples
              </HeroButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need to Shine
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Content Generation</h3>
              <p className="text-muted-foreground">
                Let AI write compelling bios, project descriptions, and taglines that capture your unique voice.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-primary/5 border border-border hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Beautiful Templates</h3>
              <p className="text-muted-foreground">
                Choose from professionally designed templates that look amazing on any device.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Publishing</h3>
              <p className="text-muted-foreground">
                Get a shareable link instantly. Your portfolio is live at profilely.app/u/yourname
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Stand Out?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already created their perfect portfolio.
          </p>
          <Link to="/auth">
            <HeroButton variant="hero" size="lg">
              <Sparkles className="w-5 h-5" />
              Get Started Now
            </HeroButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
