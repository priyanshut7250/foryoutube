import Header from "@/components/header";
import DownloadForm from "@/components/download-form";
import FeatureSection from "@/components/feature-section";
import HowItWorks from "@/components/how-it-works";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Download YouTube Videos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Easily download your favorite YouTube videos in high quality up to 720p with audio. 
            Fast, reliable, and completely free to use.
          </p>
        </div>

        <DownloadForm />
        <FeatureSection />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
