import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CollaborationSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Works across all
            <br />
            your devices
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Access your brain dumps anywhere, anytime. Cloud sync ensures your thoughts and tasks are always available across all your devices and platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="space-y-4">
            <img 
              src="/hero-laptop.jpg" 
              alt="Dashboard interface" 
              className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
            />
            <div className="bg-surface-light rounded-lg p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Desktop App</h3>
              <p className="text-xs text-text-secondary">
                Native desktop application for deep focus sessions and comprehensive brain dumping.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <img 
              src="/code-monitor.jpg" 
              alt="Development UI" 
              className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
            />
            <div className="bg-surface-light rounded-lg p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Web Platform</h3>
              <p className="text-xs text-text-secondary">
                Access Minddumper from any browser for quick brain dumps and task reviews.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <img 
              src="/person-laptop.jpg" 
              alt="Mobile interface" 
              className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
            />
            <div className="bg-surface-light rounded-lg p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Mobile App</h3>
              <p className="text-xs text-text-secondary">
                Capture thoughts instantly on your phone or tablet - never lose an idea again.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <img 
              src="/team-collaboration.jpg" 
              alt="Team collaboration" 
              className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
            />
            <div className="bg-surface-light rounded-lg p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Cloud Sync</h3>
              <p className="text-xs text-text-secondary">
                All your data syncs seamlessly across devices with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="group">
            Download apps
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;