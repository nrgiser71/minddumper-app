import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 tracking-tight">
            The fastest way to
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              clear your head
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            Finally stop juggling endless tasks in your head. Extract forgotten tasks, reduce mental clutter, and improve focus with our scientifically-backed brain dumping system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" className="group">
              Clear My Mind Now - €49
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl">
              Try It Now
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
          <img 
            src="/minddumper-hero.png" 
            alt="MindDumper interface showing brain dump functionality" 
            className="w-full max-w-5xl mx-auto relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;