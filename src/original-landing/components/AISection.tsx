import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Brain } from "lucide-react";

const AISection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Scientifically-backed
            <br />
            memory retrieval
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Our brain dumping method is based on cognitive science research about memory retrieval and task management for optimal mental clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">Memory Trigger System</h3>
                  <p className="text-text-secondary leading-relaxed">
                    Our trigger words are designed based on cognitive psychology research to activate different areas of memory and recall.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">Designed for Professionals</h3>
                  <p className="text-text-secondary leading-relaxed">
                    Built specifically for busy professionals juggling multiple responsibilities across work and personal domains.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">Friction-Free Interface</h3>
                  <p className="text-text-secondary leading-relaxed">
                    Simple, intuitive design that doesn&apos;t add complexity to your workflow. Focus on clearing your mind, not learning new tools.
                  </p>
                </div>
              </div>
            </div>
            
            <Button variant="hero" className="mt-8 group">
              Learn the science
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
            <img 
              src="/minddumper-hero.png" 
              alt="AI-powered interface" 
              className="w-full rounded-2xl shadow-elegant relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;