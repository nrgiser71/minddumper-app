import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
            <a 
              href="https://order.minddumper.com/checkout/minddumper"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-primary text-primary-foreground hover:opacity-90 h-12 px-8 text-lg group"
            >
              Clear My Mind Now - €49
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link 
              href="/app"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 text-lg"
            >
              Try It Now
            </Link>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
          <Image 
            src="/minddumper-hero.png" 
            alt="MindDumper interface showing brain dump functionality" 
            width={600}
            height={400}
            quality={100}
            priority
            unoptimized
            className="w-full max-w-5xl mx-auto relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;