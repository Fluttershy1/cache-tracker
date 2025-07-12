import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { OfflineStorage } from '../lib/offlineStorage';
import OfflineIndicator from '../components/OfflineIndicator';
import AnimatedTransition from '../components/AnimatedTransition';
import { Expense } from '../types';

const MainScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      // Сначала загружаем из кэша
      const cachedExpenses = OfflineStorage.getExpenses();
      if (cachedExpenses.length > 0) {
        setExpenses(cachedExpenses);
      }

      // Затем пытаемся загрузить с сервера
      if (OfflineStorage.isOnline()) {
        const { data, error } = await supabase
          .from('expenses')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const serverExpenses = data || [];
        setExpenses(serverExpenses);
        OfflineStorage.saveExpenses(serverExpenses);
      }
    } catch (error) {
      console.error('Ошибка загрузки расходов:', error);
      // Если нет данных в кэше, показываем пустой список
      if (OfflineStorage.getExpenses().length === 0) {
        setExpenses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OfflineIndicator />
      {/* App Bar */}
      <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Мои расходы</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="text-white hover:text-gray-200"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => navigate('/statistics')}
            className="text-white hover:text-gray-200"
          >
            📊
          </button>
          <button
            onClick={() => navigate('/categories')}
            className="text-white hover:text-gray-200"
          >
            🏷️
          </button>
          <button
            onClick={handleSignOut}
            className="text-white hover:text-gray-200"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Нет расходов
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Добавьте свой первый расход, нажав на кнопку ниже
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <div
                key={expense.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {expense.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {expense.category?.name || 'Без категории'}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(expense.date)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-red-500">
                      {formatAmount(expense.amount)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-2xl"
      >
        +
      </button>
    </div>
  );
};

export default MainScreen; 