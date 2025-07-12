import { Expense, Category } from '../types';

const STORAGE_KEYS = {
  EXPENSES: 'cash_tracker_expenses',
  CATEGORIES: 'cash_tracker_categories',
  PENDING_EXPENSES: 'cash_tracker_pending_expenses',
  PENDING_CATEGORIES: 'cash_tracker_pending_categories',
  LAST_SYNC: 'cash_tracker_last_sync'
};

export class OfflineStorage {
  // Сохранение расходов
  static saveExpenses(expenses: Expense[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error('Ошибка сохранения расходов в localStorage:', error);
    }
  }

  // Получение расходов
  static getExpenses(): Expense[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка получения расходов из localStorage:', error);
      return [];
    }
  }

  // Сохранение категорий
  static saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Ошибка сохранения категорий в localStorage:', error);
    }
  }

  // Получение категорий
  static getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка получения категорий из localStorage:', error);
      return [];
    }
  }

  // Добавление расходов в очередь для синхронизации
  static addPendingExpense(expense: Omit<Expense, 'id'>): void {
    try {
      const pending = this.getPendingExpenses();
      pending.push({
        ...expense,
        id: `pending_${Date.now()}_${Math.random()}`
      });
      localStorage.setItem(STORAGE_KEYS.PENDING_EXPENSES, JSON.stringify(pending));
    } catch (error) {
      console.error('Ошибка добавления расходов в очередь:', error);
    }
  }

  // Получение расходов в очереди
  static getPendingExpenses(): Expense[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка получения расходов из очереди:', error);
      return [];
    }
  }

  // Очистка очереди расходов
  static clearPendingExpenses(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PENDING_EXPENSES);
    } catch (error) {
      console.error('Ошибка очистки очереди расходов:', error);
    }
  }

  // Добавление категорий в очередь для синхронизации
  static addPendingCategory(category: Omit<Category, 'id'>): void {
    try {
      const pending = this.getPendingCategories();
      pending.push({
        ...category,
        id: `pending_${Date.now()}_${Math.random()}`
      });
      localStorage.setItem(STORAGE_KEYS.PENDING_CATEGORIES, JSON.stringify(pending));
    } catch (error) {
      console.error('Ошибка добавления категорий в очередь:', error);
    }
  }

  // Получение категорий в очереди
  static getPendingCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_CATEGORIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка получения категорий из очереди:', error);
      return [];
    }
  }

  // Очистка очереди категорий
  static clearPendingCategories(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PENDING_CATEGORIES);
    } catch (error) {
      console.error('Ошибка очистки очереди категорий:', error);
    }
  }

  // Сохранение времени последней синхронизации
  static setLastSync(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      console.error('Ошибка сохранения времени синхронизации:', error);
    }
  }

  // Получение времени последней синхронизации
  static getLastSync(): number {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return data ? parseInt(data) : 0;
    } catch (error) {
      console.error('Ошибка получения времени синхронизации:', error);
      return 0;
    }
  }

  // Проверка наличия интернета
  static isOnline(): boolean {
    return navigator.onLine;
  }

  // Очистка всех данных
  static clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Ошибка очистки всех данных:', error);
    }
  }
} 