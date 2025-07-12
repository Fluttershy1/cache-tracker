import { OfflineStorage } from '../offlineStorage';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true
});

describe('OfflineStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveExpenses', () => {
    it('должен сохранять расходы в localStorage', () => {
      const expenses = [
        { id: '1', title: 'Test', amount: 100, category_id: '1', date: '2024-01-01', user_id: '1', created_at: '2024-01-01' }
      ];

      OfflineStorage.saveExpenses(expenses);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cash_tracker_expenses',
        JSON.stringify(expenses)
      );
    });
  });

  describe('getExpenses', () => {
    it('должен возвращать пустой массив если данных нет', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = OfflineStorage.getExpenses();

      expect(result).toEqual([]);
    });

    it('должен возвращать сохраненные расходы', () => {
      const expenses = [
        { id: '1', title: 'Test', amount: 100, category_id: '1', date: '2024-01-01', user_id: '1', created_at: '2024-01-01' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(expenses));

      const result = OfflineStorage.getExpenses();

      expect(result).toEqual(expenses);
    });
  });

  describe('isOnline', () => {
    it('должен возвращать true когда есть интернет', () => {
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
      expect(OfflineStorage.isOnline()).toBe(true);
    });

    it('должен возвращать false когда нет интернета', () => {
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
      expect(OfflineStorage.isOnline()).toBe(false);
    });
  });

  describe('clearAll', () => {
    it('должен очищать все данные', () => {
      OfflineStorage.clearAll();

      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(5);
    });
  });
}); 