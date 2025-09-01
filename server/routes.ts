import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import ytdl from "@distube/ytdl-core";
import { insertDownloadRequestSchema, videoInfoSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get video info endpoint
  app.post("/api/video-info", async (req, res) => {
    try {
      const { videoUrl } = req.body;
      
      if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ 
          message: "Invalid YouTube URL provided" 
        });
      }

      const info = await ytdl.getInfo(videoUrl);
      const videoDetails = info.videoDetails;
      
      // Format duration from seconds to mm:ss
      const duration = parseInt(videoDetails.lengthSeconds);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Format view count
      const views = parseInt(videoDetails.viewCount);
      const formattedViews = views > 1000000 
        ? `${(views / 1000000).toFixed(1)}M views`
        : views > 1000
        ? `${(views / 1000).toFixed(1)}K views`
        : `${views} views`;

      const videoInfo = {
        title: videoDetails.title,
        duration: formattedDuration,
        views: formattedViews,
        thumbnail: videoDetails.thumbnails[0]?.url || "",
        videoUrl: videoUrl,
      };

      // Validate the response
      const validatedInfo = videoInfoSchema.parse(videoInfo);
      
      res.json(validatedInfo);
    } catch (error) {
      console.error("Error fetching video info:", error);
      res.status(500).json({ 
        message: "Failed to fetch video information" 
      });
    }
  });

  // Download video endpoint
  app.post("/api/download", async (req, res) => {
    try {
      const validatedData = insertDownloadRequestSchema.parse(req.body);
      
      if (!ytdl.validateURL(validatedData.videoUrl)) {
        return res.status(400).json({ 
          message: "Invalid YouTube URL provided" 
        });
      }

      // Create download request
      const downloadRequest = await storage.createDownloadRequest(validatedData);
      
      // Update status to processing
      await storage.updateDownloadRequestStatus(downloadRequest.id, "processing");

      // Get video info
      const info = await ytdl.getInfo(validatedData.videoUrl);
      const videoDetails = info.videoDetails;

      // Set response headers for file download
      const filename = `${videoDetails.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}_${validatedData.resolution}.mp4`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'video/mp4');

      // Stream the video with proper quality selection
      let quality: string;
      
      switch (validatedData.resolution) {
        case "720p":
          quality = "720p";
          break;
        case "480p":
          quality = "480p";
          break;
        case "360p":
          quality = "360p";
          break;
        default:
          quality = "480p";
      }

      const videoStream = ytdl(validatedData.videoUrl, {
        quality: quality,
        filter: (format: any) => format.hasVideo && format.hasAudio
      });

      videoStream.on('error', (error: any) => {
        console.error("Video stream error:", error);
        if (!res.headersSent) {
          res.status(500).json({ message: "Failed to download video" });
        }
      });

      videoStream.on('end', async () => {
        await storage.updateDownloadRequestStatus(downloadRequest.id, "completed");
      });

      // Pipe the video stream to response
      videoStream.pipe(res);
      
    } catch (error) {
      console.error("Download error:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        message: "Failed to process download request" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
