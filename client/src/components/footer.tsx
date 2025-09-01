import { Download } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Download className="text-primary-foreground" size={16} />
            </div>
            <span className="font-semibold text-foreground">Priyanshu</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            A simple and reliable YouTube video downloader built with care.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <span>© 2024 Priyanshu</span>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-privacy">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-terms">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
