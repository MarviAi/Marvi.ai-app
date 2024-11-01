import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const SecurityWarning: React.FC = () => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 fixed bottom-5 left-5 z-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Development mode: API keys are exposed. Deploy with server-side API handling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityWarning;