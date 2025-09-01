import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertDownloadRequestSchema, type VideoInfo } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Link, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import VideoPreview from "./video-preview";
import ProgressSection from "./progress-section";

const downloadFormSchema = insertDownloadRequestSchema.extend({
  videoUrl: z.string().url("Please enter a valid URL").refine(
    (url) => url.includes("youtube.com/watch?v=") || url.includes("youtu.be/"),
    "Please enter a valid YouTube URL"
  ),
});

type DownloadFormData = z.infer<typeof downloadFormSchema>;

export default function DownloadForm() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");
  const { toast } = useToast();

  const form = useForm<DownloadFormData>({
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      videoUrl: "",
      resolution: "480p",
    },
  });

  const videoInfoMutation = useMutation({
    mutationFn: async (videoUrl: string) => {
      const response = await apiRequest("POST", "/api/video-info", { videoUrl });
      return response.json();
    },
    onSuccess: (data: VideoInfo) => {
      setVideoInfo(data);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch video information",
      });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async (data: DownloadFormData) => {
      setIsDownloading(true);
      setDownloadProgress(0);
      setProgressStatus("Initializing download...");

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            setProgressStatus("Finalizing...");
            return 90;
          }
          setProgressStatus("Downloading video...");
          return newProgress;
        });
      }, 500);

      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      // Get the filename from headers
      const contentDisposition = response.headers.get("content-disposition");
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || "video.mp4";

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadProgress(100);
      setProgressStatus("Download completed!");
      return filename;
    },
    onSuccess: (filename) => {
      toast({
        title: "Download completed!",
        description: `${filename} has been downloaded to your device.`,
      });
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
        setProgressStatus("");
      }, 2000);
    },
    onError: (error: any) => {
      setIsDownloading(false);
      setDownloadProgress(0);
      setProgressStatus("");
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error.message || "Please check the URL and try again.",
      });
    },
  });

  const onSubmit = async (data: DownloadFormData) => {
    // First get video info if we don't have it
    if (!videoInfo || videoInfo.videoUrl !== data.videoUrl) {
      await videoInfoMutation.mutateAsync(data.videoUrl);
    }
    
    // Then start download
    downloadMutation.mutate(data);
  };

  const handleUrlBlur = () => {
    const url = form.getValues("videoUrl");
    if (url && url !== videoInfo?.videoUrl) {
      videoInfoMutation.mutate(url);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="videoUrl" className="text-sm font-medium text-foreground">
                YouTube Video URL
              </Label>
              <div className="relative">
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="pr-10"
                  data-testid="input-video-url"
                  {...form.register("videoUrl")}
                  onBlur={handleUrlBlur}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Link className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              {form.formState.errors.videoUrl && (
                <p className="text-sm text-destructive" data-testid="error-video-url">
                  {form.formState.errors.videoUrl.message}
                </p>
              )}
            </div>

            {/* Resolution Selection */}
            <div className="space-y-2">
              <Label htmlFor="resolution" className="text-sm font-medium text-foreground">
                Video Resolution
              </Label>
              <Select 
                value={form.watch("resolution")} 
                onValueChange={(value) => form.setValue("resolution", value)}
              >
                <SelectTrigger data-testid="select-resolution">
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="360p">360p - Standard Quality</SelectItem>
                  <SelectItem value="480p">480p - Good Quality</SelectItem>
                  <SelectItem value="720p">720p - High Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Download Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={downloadMutation.isPending || isDownloading || videoInfoMutation.isPending}
              data-testid="button-download"
            >
              {downloadMutation.isPending || isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : videoInfoMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
                </>
              )}
            </Button>
          </form>

          {/* Progress Section */}
          {isDownloading && (
            <ProgressSection 
              progress={downloadProgress} 
              status={progressStatus} 
            />
          )}

          {/* Video Preview */}
          {videoInfo && <VideoPreview videoInfo={videoInfo} />}
        </CardContent>
      </Card>
    </div>
  );
}
