import { useState, useEffect } from 'react';
import { checkBackendHealth } from '../services/api';

const HealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await checkBackendHealth();
        setHealthStatus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-white">Checking API...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 rounded-full border border-red-300">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-xs font-semibold text-red-700">API Offline</span>
      </div>
    );
  }

  if (healthStatus) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        <span className="text-xs font-semibold text-white">API Online</span>
      </div>
    );
  }

  return null;
};

export default HealthCheck;
