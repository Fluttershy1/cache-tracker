import React, { useState, useEffect } from 'react';
import { OfflineStorage } from '../lib/offlineStorage';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasPendingData, setHasPendingData] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Проверяем наличие данных в очереди
    const checkPendingData = () => {
      const pendingExpenses = OfflineStorage.getPendingExpenses();
      const pendingCategories = OfflineStorage.getPendingCategories();
      setHasPendingData(pendingExpenses.length > 0 || pendingCategories.length > 0);
    };

    checkPendingData();
    const interval = setInterval(checkPendingData, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && !hasPendingData) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        {!isOnline && (
          <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm">
            📡 Работа в оффлайн-режиме
          </div>
        )}
        {isOnline && hasPendingData && (
          <div className="bg-green-500 text-white px-4 py-2 text-center text-sm">
            🔄 Синхронизация данных...
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator; 