import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

interface CategoryStats {
  category: Category;
  total: number;
  percentage: number;
}

const StatisticsScreen: React.FC = () => {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          amount,
          category_id,
          category:categories(*)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Группируем по категориям
      const stats = new Map<string, CategoryStats>();
      let total = 0;

      data?.forEach((expense: any) => {
        const categoryId = expense.category_id || 'no-category';
        const category: Category = expense.category || { 
          id: 'no-category', 
          name: 'Без категории', 
          icon: '❓', 
          color: '#9CA3AF',
          user_id: user?.id || '',
          created_at: new Date().toISOString()
        };
        
        if (!stats.has(categoryId)) {
          stats.set(categoryId, {
            category,
            total: 0,
            percentage: 0
          });
        }

        const stat = stats.get(categoryId)!;
        stat.total += expense.amount;
        total += expense.amount;
      });

      // Вычисляем проценты
      stats.forEach((stat) => {
        stat.percentage = total > 0 ? (stat.total / total) * 100 : 0;
      });

      setCategoryStats(Array.from(stats.values()).sort((a, b) => b.total - a.total));
      setTotalAmount(total);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-800 text-white px-4 py-3 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="mr-4 text-white hover:text-gray-200"
        >
          ←
        </button>
        <h1 className="text-xl font-semibold">Статистика</h1>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Общая сумма */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Общие расходы</h2>
          <div className="text-3xl font-bold text-red-500">
            {formatAmount(totalAmount)}
          </div>
        </div>

        {/* Круговая диаграмма (упрощенная версия) */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">По категориям</h2>
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              {categoryStats.map((stat, index) => {
                const angle = (stat.percentage / 100) * 360;
                const startAngle = categoryStats
                  .slice(0, index)
                  .reduce((sum, s) => sum + (s.percentage / 100) * 360, 0);
                
                return (
                  <div
                    key={stat.category.id}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(${stat.category.color} ${startAngle}deg, ${stat.category.color} ${startAngle + angle}deg, transparent ${startAngle + angle}deg)`
                    }}
                  />
                );
              })}
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-sm text-gray-500">Всего</span>
              </div>
            </div>
          </div>
        </div>

        {/* Список категорий */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Детализация</h2>
          <div className="space-y-3">
            {categoryStats.map((stat) => (
              <div key={stat.category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{stat.category.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{stat.category.name}</div>
                    <div className="text-sm text-gray-500">{stat.percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatAmount(stat.total)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsScreen; 