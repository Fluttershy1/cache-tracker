# Трекер наличных расходов

Мобильное веб-приложение для учета наличных расходов с возможностью авторизации пользователей.

## Технологии

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Хостинг:** Vercel (Frontend)

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd cash-tracker
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Скопируйте URL и ANON KEY из настроек проекта
3. Создайте файл `.env` на основе `env.example`:
```bash
cp env.example .env
```
4. Заполните переменные окружения в `.env`:
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Настройка базы данных

Выполните следующие SQL команды в Supabase SQL Editor:

```sql
-- Создание таблицы категорий
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы расходов
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Настройка Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Политики для категорий
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Политики для расходов
CREATE POLICY "Users can view own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. Запуск приложения
```bash
npm start
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## Функции

- ✅ Авторизация пользователей (регистрация, вход, выход)
- ✅ Добавление расходов с категориями
- ✅ Просмотр истории расходов
- ✅ Статистика с круговой диаграммой
- ✅ Управление категориями
- ✅ Адаптивный дизайн для мобильных устройств

## Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
├── contexts/           # React контексты
├── lib/               # Библиотеки и конфигурации
├── screens/           # Экраны приложения
├── types/             # TypeScript типы
└── App.tsx           # Главный компонент
```

## Деплой

### На Vercel

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения в настройках проекта
3. Деплой произойдет автоматически при пуше в main ветку

## Лицензия

MIT 