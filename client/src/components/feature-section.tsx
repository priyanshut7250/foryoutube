import { Rocket, VideoIcon, Shield } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: Rocket,
      title: "Lightning Fast",
      description: "Download videos quickly with our optimized servers and efficient processing.",
    },
    {
      icon: VideoIcon,
      title: "High Quality",
      description: "Get videos up to 720p resolution with crystal clear audio quality.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your privacy is protected. We don't store any personal data or videos.",
    },
  ];

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-center text-foreground mb-8">Why Choose Priyanshu?</h3>
      <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="text-center" data-testid={`feature-${index}`}>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <feature.icon className="text-primary" size={24} />
            </div>
            <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
