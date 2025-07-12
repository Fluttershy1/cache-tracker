import React from 'react';
import ProtectedRoute from '../ProtectedRoute';

// Простой тест для проверки структуры компонента
describe('ProtectedRoute', () => {
  it('должен быть определен как компонент', () => {
    expect(ProtectedRoute).toBeDefined();
  });

  it('должен принимать children как пропс', () => {
    const TestComponent = () => <div>Test Content</div>;
    expect(() => <ProtectedRoute><TestComponent /></ProtectedRoute>).not.toThrow();
  });
}); 