import { type VideoInfo } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface VideoPreviewProps {
  videoInfo: VideoInfo;
}

export default function VideoPreview({ videoInfo }: VideoPreviewProps) {
  return (
    <div className="mt-6 video-preview fade-in" data-testid="video-preview">
      <Card className="bg-secondary">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <img 
              src={videoInfo.thumbnail} 
              alt="Video thumbnail" 
              className="w-20 h-15 rounded object-cover bg-muted flex-shrink-0"
              data-testid="img-video-thumbnail"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-secondary-foreground truncate" data-testid="text-video-title">
                {videoInfo.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1" data-testid="text-video-duration">
                {videoInfo.duration}
              </p>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Eye size={12} className="mr-1" />
                <span data-testid="text-video-views">{videoInfo.views}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
