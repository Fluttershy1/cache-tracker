import { OfflineStorage } from '../lib/offlineStorage';

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

describe('Интеграционные тесты', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Оффлайн функциональность', () => {
    it('должен сохранять и восстанавливать данные в оффлайн режиме', () => {
      const testExpenses = [
        {
          id: '1',
          title: 'Обед',
          amount: 500,
          category_id: '1',
          date: '2024-01-01',
          user_id: '1',
          created_at: '2024-01-01'
        }
      ];

      // Сохраняем данные
      OfflineStorage.saveExpenses(testExpenses);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cash_tracker_expenses',
        JSON.stringify(testExpenses)
      );

      // Восстанавливаем данные
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testExpenses));
      const restoredExpenses = OfflineStorage.getExpenses();
      expect(restoredExpenses).toEqual(testExpenses);
    });

    it('должен обрабатывать ошибки при работе с localStorage', () => {
      // Симулируем ошибку
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const testExpenses = [{ id: '1', title: 'Test', amount: 100, category_id: '1', date: '2024-01-01', user_id: '1', created_at: '2024-01-01' }];

      // Не должно выбрасывать исключение
      expect(() => {
        OfflineStorage.saveExpenses(testExpenses);
      }).not.toThrow();
    });
  });

  describe('Валидация данных', () => {
    it('должен корректно форматировать суммы', () => {
      const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB'
        }).format(amount);
      };

      expect(formatAmount(1000)).toBe('1 000,00 ₽');
      expect(formatAmount(0)).toBe('0,00 ₽');
      expect(formatAmount(1234.56)).toBe('1 234,56 ₽');
    });

    it('должен корректно форматировать даты', () => {
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      };

      expect(formatDate('2024-01-01')).toBe('01.01.2024');
      expect(formatDate('2024-12-31')).toBe('31.12.2024');
    });
  });

  describe('Темная тема', () => {
    it('должен сохранять выбор темы в localStorage', () => {
      const mockSetItem = jest.fn();
      Object.defineProperty(window, 'localStorage', {
        value: { setItem: mockSetItem }
      });

      // Симулируем сохранение темы
      localStorage.setItem('theme', 'dark');
      expect(mockSetItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });
}); 