import { Calendar, Target, Users } from "lucide-react";

const ProductDirectionSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Brain clarity
              <br />
              system
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Export your brain dumps to your favorite productivity tools. Seamlessly integrate with Notion, Todoist, and Asana to turn thoughts into actionable tasks.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-purple/20 rounded-lg flex items-center justify-center mt-1">
                  <Target className="w-4 h-4 text-brand-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Export to Notion</h3>
                  <p className="text-text-secondary">
                    Automatically transfer your organized thoughts to Notion pages and databases for further planning.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-blue/20 rounded-lg flex items-center justify-center mt-1">
                  <Calendar className="w-4 h-4 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Todoist Integration</h3>
                  <p className="text-text-secondary">
                    Send tasks directly to Todoist with proper categorization and due dates for seamless workflow.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-purple/20 rounded-lg flex items-center justify-center mt-1">
                  <Users className="w-4 h-4 text-brand-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Asana Sync</h3>
                  <p className="text-text-secondary">
                    Create projects and tasks in Asana to maintain team alignment and project management.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-2xl rounded-full"></div>
            <img 
              src="/code-monitor.jpg" 
              alt="Product direction interface" 
              className="w-full rounded-2xl shadow-elegant relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDirectionSection;