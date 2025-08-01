import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Globe, Lock, Brain, Download, Settings, Cloud, Headphones } from "lucide-react";


const FoundationsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-primary opacity-30 blur-3xl rounded-full"></div>
            <img 
              src="/minddumper-hero.png" 
              alt="MindDumper pricing and features interface" 
              className="w-full rounded-2xl shadow-elegant relative z-10"
            />
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Simple, transparent
              <br />
              pricing
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              One-time payment, no subscriptions. Get lifetime access to Minddumper with all future updates included. Clear your mind without recurring costs.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">No Subscriptions</h3>
                  <p className="text-xs text-text-secondary">Pay once, use forever</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">All Updates</h3>
                  <p className="text-xs text-text-secondary">Future features included</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Fair Pricing</h3>
                  <p className="text-xs text-text-secondary">€49 one-time payment</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Lock className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Immediate Access</h3>
                  <p className="text-xs text-text-secondary">Start clearing your mind today</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Brain className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Advanced Trigger Words</h3>
                  <p className="text-xs text-text-secondary">1000+ triggers in 5 languages</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Download className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">CSV Export + Integrations</h3>
                  <p className="text-xs text-text-secondary">Export to Notion, Todoist, Asana</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Settings className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Custom Trigger Words</h3>
                  <p className="text-xs text-text-secondary">Add industry-specific triggers</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Cloud Sync</h3>
                  <p className="text-xs text-text-secondary">Access from phone, laptop, tablet</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Headphones className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Priority Support</h3>
                  <p className="text-xs text-text-secondary">Get help when you need it</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="group">
              Get Lifetime Access - €49
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundationsSection;