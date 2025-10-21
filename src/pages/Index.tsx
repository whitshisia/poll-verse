import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { BarChart3, Zap, Users, TrendingUp, Share2, Lock } from "lucide-react";
import heroBackground from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section
        className="relative py-20 px-4 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-gold">
              Create Powerful Polls in Seconds
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl mx-auto">
              Engage your audience with beautiful, real-time polling experiences. Perfect for events, teams, and educators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="text-lg">
                  <Zap className="h-5 w-5" />
                  Start Creating Free
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="text-lg">
                  View Demo Poll
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-gold mb-4">
              Everything You Need for Engaging Polls
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make polling simple, beautiful, and effective
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-6 hover:shadow-xl hover:shadow-primary/20 transition-all">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Results</h3>
              <p className="text-muted-foreground">
                Watch responses come in live with beautiful animated charts and instant updates
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-xl hover:shadow-primary/20 transition-all">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Sharing</h3>
              <p className="text-muted-foreground">
                Share polls via URL, QR code, or unique code. Works on any device, no app needed
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-xl hover:shadow-primary/20 transition-all">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Unlimited Responses</h3>
              <p className="text-muted-foreground">
                Collect unlimited responses on all plans. No caps, no limits, just pure engagement
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-xl hover:shadow-primary/20 transition-all">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multiple Question Types</h3>
              <p className="text-muted-foreground">
                MCQs, open text, scales, and ranking questions. Create the perfect poll for any scenario
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-xl hover:shadow-primary/20 transition-all">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Anonymous Voting</h3>
              <p className="text-muted-foreground">
                Protect voter privacy with optional anonymous responses for honest feedback
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-xl hover:shadow-primary/20 transition-all">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Create polls in under 60 seconds. Clean interface designed for speed and simplicity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gradient-gold mb-4">
              Ready to Create Your First Poll?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users creating engaging polls with Pollverse
            </p>
            <Link to="/auth">
              <Button variant="hero" size="lg" className="text-lg">
                Get Started Now - It's Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Pollverse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
