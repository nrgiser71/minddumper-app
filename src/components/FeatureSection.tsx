import Image from "next/image";

const FeatureSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Advanced trigger words
            <br />
            in 5 languages
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Our scientifically-backed system uses 250+ trigger words per language to help you recall forgotten tasks and clear mental clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="relative group overflow-hidden rounded-xl">
            <div className="h-64 star-wars-container relative">
              <Image 
                src="/minddumper-trigger-words.png" 
                alt="MindDumper trigger words scrolling list" 
                width={600}
                height={400}
                className="w-full h-auto absolute top-0 left-0 animate-star-wars"
                style={{ 
                  height: 'auto', 
                  minHeight: '400%',
                  transformOrigin: 'center bottom',
                  filter: 'brightness(1.2) contrast(1.1)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-darker via-transparent to-transparent rounded-xl pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="text-lg font-semibold text-text-primary mb-2 drop-shadow-lg">250+ Trigger Words</h3>
                <p className="text-text-secondary text-sm drop-shadow-lg">Extensive library in 5 languages</p>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <Image 
              src="/minddumper-custom-triggers.png" 
              alt="MindDumper custom triggers interface" 
              width={600}
              height={400}
              className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-darker/80 to-transparent rounded-xl"></div>
            <div className="absolute bottom-6 left-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Custom Triggers</h3>
              <p className="text-text-secondary text-sm">Add your own personalized trigger words</p>
            </div>
          </div>
          
          <div className="relative group">
            <Image 
              src="/minddumper-export-integrations.png" 
              alt="MindDumper export and integrations interface" 
              width={600}
              height={400}
              className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-darker/80 to-transparent rounded-xl"></div>
            <div className="absolute bottom-6 left-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">CSV Export & Integrations</h3>
              <p className="text-text-secondary text-sm">Export to Notion, Todoist, Asana & more</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;