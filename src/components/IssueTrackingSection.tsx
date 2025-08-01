import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, AlertCircle, Clock } from "lucide-react";
import Image from "next/image";

const IssueTrackingSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-2xl rounded-full"></div>
            <Image 
              src="/macbook-desk.jpg" 
              alt="Issue tracking interface" 
              width={600}
              height={400}
              className="w-full rounded-2xl shadow-elegant relative z-10"
            />
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Reduce mental
              <br />
              clutter & stress
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Stop juggling endless tasks in your head. Our systematic approach helps busy professionals extract forgotten tasks and minimize work-related stress.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Extract Forgotten Tasks</h3>
                  <p className="text-text-secondary">
                    Uncover tasks you didn't even know you were tracking mentally. Our trigger system reveals hidden mental load.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mt-1">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Improve Focus</h3>
                  <p className="text-text-secondary">
                    Clear your mind of task anxiety and concentrate on what truly matters without mental distractions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Systematic Recall</h3>
                  <p className="text-text-secondary">
                    Use our scientifically-backed memory retrieval method to ensure nothing important slips through the cracks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IssueTrackingSection;