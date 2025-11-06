import { BookX } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, description }) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <BookX className="h-16 w-16 text-muted-foreground" />
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">{message}</p>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
};
