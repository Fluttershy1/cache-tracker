import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

const CategoriesScreen: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '🏷️',
    color: '#3B82F6'
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const iconOptions = [
    '🍕', '🚗', '🎮', '🛒', '🏠', '💊', '🎬', '📚', '👕', '🍺', '☕', '🍎',
    '🎵', '🏋️', '✈️', '🚌', '🚇', '🚲', '⛽', '💡', '📱', '💻', '🎨', '🎭'
  ];

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
    '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user?.id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) return;

    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.name.trim(),
          icon: newCategory.icon,
          color: newCategory.color,
          user_id: user?.id
        });

      if (error) throw error;
      
      setNewCategory({ name: '', icon: '🏷️', color: '#3B82F6' });
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Ошибка добавления категории:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Удалить эту категорию?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', user?.id);

      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error('Ошибка удаления категории:', error);
    }
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
      <div className="bg-blue-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 text-white hover:text-gray-200"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold">Категории</h1>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="text-white hover:text-gray-200"
        >
          +
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Нет категорий
            </h2>
            <p className="text-gray-500 mb-6">
              Создайте свою первую категорию для организации расходов
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Добавить категорию
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal для добавления категории */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Добавить категорию</h2>
            
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Например: Еда"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Иконка
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                      className={`w-10 h-10 rounded-lg border-2 text-xl ${
                        newCategory.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цвет
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-lg border-2 ${
                        newCategory.color === color ? 'border-gray-800' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesScreen; 