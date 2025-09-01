import { Download, Shield, Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Download className="text-primary-foreground" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="app-title">Priyanshu</h1>
              <p className="text-sm text-muted-foreground">YouTube Video Downloader</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Shield size={16} className="mr-1" />
              Safe & Secure
            </span>
            <span className="flex items-center">
              <Zap size={16} className="mr-1" />
              Fast Download
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
