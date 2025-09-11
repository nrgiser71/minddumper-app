import { ArrowRight } from "lucide-react";
import Image from "next/image";

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
              More opportunities slip by because you&apos;re too overwhelmed to focus.
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
            
            <a 
              href="https://pay.baasoverjetijd.be/checkout/minddumper"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-primary text-primary-foreground hover:opacity-90 h-12 px-8 text-lg group"
            >
              Clear My Mind Now - €49
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-2xl rounded-full"></div>
            <Image 
              src="/minddumper-stop-carrying.png" 
              alt="MindDumper stop carrying weight interface" 
              width={600}
              height={400}
              quality={100}
              unoptimized
              className="w-full rounded-2xl shadow-elegant relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StopCarryingSection;