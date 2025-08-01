import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


const StopCarryingSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Stop Carrying The Weight
              <br />
              of Unfinished Business
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Every day you wait, more tasks pile up in your head. More brilliant ideas get forgotten. 
              More opportunities slip by because you're too overwhelmed to focus.
            </p>
            
            <div className="mb-8">
              <p className="text-lg text-text-primary font-semibold mb-6">
                Your mind is your most valuable asset. Stop using it as a storage device.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  One-time payment
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Works immediately
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Lifetime access
                </span>
              </div>
            </div>
            
            <Button variant="hero" size="xl" className="group">
              Clear My Mind Now - €49
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-2xl rounded-full"></div>
            <img 
              src="/minddumper-hero.png" 
              alt="MindDumper stop carrying weight interface" 
              className="w-full rounded-2xl shadow-elegant relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StopCarryingSection;