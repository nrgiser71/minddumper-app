const PainPointsSection = () => {
  const painPoints = [
    {
      title: "That client call you forgot to schedule",
      description: "It's 11 PM and you suddenly remember the follow-up meeting you promised last week"
    },
    {
      title: "The brilliant idea that vanished",
      description: "You had the perfect solution for your product, but now it's gone - lost in the mental chaos"
    },
    {
      title: "Projects stuck in your head",
      description: "Half-finished tasks pile up because you can't remember what needs to happen next"
    },
    {
      title: "The email you meant to send",
      description: "Important messages sit in drafts while you lose deals because you forgot to hit send"
    },
    {
      title: "Team commitments falling through",
      description: "You promised deliverables to your team but can't recall all the details you agreed on"
    },
    {
      title: "Weekend work anxiety",
      description: "You can't relax because you're sure you're forgetting something important for Monday"
    },
    {
      title: "The important deadline you almost missed",
      description: "You realize with panic that the proposal/report/presentation is due tomorrow, not next week like you thought"
    },
    {
      title: "The family commitment you double-booked",
      description: "You promised to attend your kid's school event but scheduled an important client meeting at the same time"
    },
    {
      title: "The expense report from 3 months ago",
      description: "Business receipts pile up in your wallet while you keep forgetting to submit them, losing money every month"
    },
    {
      title: "The subscription you meant to cancel",
      description: "You're paying for 5 different tools/services you don't use because canceling them never makes it to your action list"
    },
    {
      title: "The strategic decision stuck in limbo",
      description: "Your business needs a direction change, but the analysis and decision-making keeps getting pushed aside by daily fires"
    },
    {
      title: "The health appointment you keep postponing",
      description: "That important check-up or dental cleaning stays mentally noted but never actually scheduled, affecting your wellbeing"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Every day, every hour, every minute
            <br />
            your mind races with unfinished business
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {painPoints.map((point, index) => (
            <div key={index} className="bg-surface-light rounded-lg p-6 hover:bg-surface-lighter transition-colors duration-200">
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                {point.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;