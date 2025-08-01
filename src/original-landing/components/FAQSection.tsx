import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqItems = [
    {
      question: "How is this different from just making a to-do list?",
      answer: "Regular to-do lists only capture what you remember. Our trigger word method uses psychological prompts to help your brain recall tasks you didn't even know you forgot."
    },
    {
      question: "Is this scientifically proven?",
      answer: "Yes. Our method is based on memory retrieval psychology and cognitive offloading research. Studies show that external memory aids significantly reduce mental load and improve focus performance."
    },
    {
      question: "What if I have too many tasks?",
      answer: "That's exactly why you need this. The more overwhelmed you feel, the more tasks are probably stuck in your head creating anxiety."
    },
    {
      question: "Do I need to be tech-savvy to use this?",
      answer: "No technical skills required. MindDumper works in your browser - just open it and start."
    },
    {
      question: "Can I use this for both work and personal tasks?",
      answer: "Absolutely. Your brain doesn't separate work and personal stress. Our system covers everything from client projects to weekend plans."
    },
    {
      question: "What if I'm already using other productivity tools?",
      answer: "Perfect! MindDumper works with your existing tools. Export your extracted tasks to Todoist, Notion, Asana, or any app you prefer."
    },
    {
      question: "Will this work if I'm not good at remembering things?",
      answer: "That's exactly who this is for! If you were good at remembering, you wouldn't need trigger words."
    },
    {
      question: "What if I can&apos;t think of anything during the brain dump?",
      answer: "This happens to everyone initially. That's why we use trigger words - they act as memory prompts."
    },
    {
      question: "Can I customize the trigger words for my industry/role?",
      answer: "Absolutely. While we provide 1000+ proven trigger words across 5 languages, you can add your own industry-specific triggers."
    },
    {
      question: "What happens if I get interrupted during a brain dump?",
      answer: "No problem. Your progress is automatically saved. You can pause anytime and pick up exactly where you left off."
    },
    {
      question: "Does this replace my current task management system?",
      answer: "No, it feeds into it. MindDumper is designed to extract tasks from your head, then export them to whatever system you already use."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Everything you need to know about clearing your mind with MindDumper.
          </p>
        </div>

        <div className="bg-surface-light rounded-2xl p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left text-text-primary hover:text-text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;