
import React, { useState } from 'react';
import { LoadingState } from './loading-state';
import { Alert, AlertDescription } from './alert';
import { Button } from './button';
import { RefreshCw } from 'lucide-react';

interface DynamicFormProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  onSubmit: (e: React.FormEvent) => void;
  onRetry?: () => void;
  submitLabel?: string;
  loadingLabel?: string;
  submitting?: boolean;
}

export function DynamicForm({
  children,
  isLoading = false,
  error = null,
  onSubmit,
  onRetry,
  submitLabel = 'Submit',
  loadingLabel = 'Loading form...',
  submitting = false
}: DynamicFormProps) {
  const [formError, setFormError] = useState<Error | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      await onSubmit(e);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred during form submission');
      setFormError(error);
    }
  };

  if (isLoading) {
    return <LoadingState message={loadingLabel} />;
  }

  if (error || formError) {
    const currentError = error || formError;
    return (
      <Alert variant="destructive" className="animate-fade-in">
        <AlertDescription>
          {currentError?.message || "An error occurred"}
        </AlertDescription>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4" 
            onClick={onRetry}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-4">
      {children}
      <Button type="submit" disabled={submitting} className="mt-2">
        {submitting ? 'Submitting...' : submitLabel}
      </Button>
    </form>
  );
}
