export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Paste YouTube URL",
      description: "Copy and paste the YouTube video URL into the input field above.",
    },
    {
      number: 2,
      title: "Choose Resolution",
      description: "Select your preferred video quality from 360p to 720p.",
    },
    {
      number: 3,
      title: "Download & Enjoy",
      description: "Click download and wait for your video file to be ready.",
    },
  ];

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-center text-foreground mb-8">How It Works</h3>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start space-x-4" data-testid={`step-${step.number}`}>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">{step.number}</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
