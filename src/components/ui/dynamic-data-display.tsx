
import React from 'react';
import { LoadingState } from './loading-state';
import ErrorBoundary from './error-boundary';
import { Alert, AlertDescription } from './alert';
import { FolderOpen } from 'lucide-react';

interface DynamicDataDisplayProps<T> {
  data: T[] | null | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
  emptyMessage?: string;
  loadingMessage?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderContainer?: (children: React.ReactNode) => React.ReactNode;
}

export function DynamicDataDisplay<T>({
  data,
  isLoading,
  error,
  onRetry,
  emptyMessage = "No data found",
  loadingMessage = "Loading data...",
  renderItem,
  renderContainer = (children) => <div className="space-y-4">{children}</div>
}: DynamicDataDisplayProps<T>) {
  // Show loading state
  if (isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorBoundary>
        <Alert variant="destructive" className="animate-fade-in">
          <AlertDescription>
            {error.message || "An error occurred while loading data"}
          </AlertDescription>
          {onRetry && (
            <div className="mt-4">
              <button 
                onClick={onRetry}
                className="text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          )}
        </Alert>
      </ErrorBoundary>
    );
  }

  // Show empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
        <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">{emptyMessage}</p>
      </div>
    );
  }

  // Render the data
  return renderContainer(
    <>
      {data.map((item, index) => (
        <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
          {renderItem(item, index)}
        </div>
      ))}
    </>
  );
}
