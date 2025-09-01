import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressSectionProps {
  progress: number;
  status: string;
}

export default function ProgressSection({ progress, status }: ProgressSectionProps) {
  return (
    <div className="mt-6 fade-in" data-testid="progress-section">
      <Card className="bg-secondary">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary-foreground">Download Progress</span>
              <span className="text-sm text-muted-foreground" data-testid="text-progress-percent">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="w-full" data-testid="progress-bar" />
            <p className="text-xs text-muted-foreground" data-testid="text-progress-status">
              {status}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
