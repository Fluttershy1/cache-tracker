# Инструкции по деплою

## Подготовка к деплою

### 1. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Перейдите в Settings > API
3. Скопируйте:
   - Project URL
   - anon public key

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Настройка базы данных

Выполните SQL команды в Supabase SQL Editor:

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

## Деплой на Vercel

### 1. Подготовка репозитория

1. Убедитесь, что все изменения закоммичены в Git
2. Создайте репозиторий на GitHub/GitLab
3. Запушьте код в репозиторий

### 2. Настройка Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Создайте аккаунт или войдите
3. Нажмите "New Project"
4. Импортируйте ваш репозиторий
5. Настройте переменные окружения:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### 3. Настройка домена (опционально)

1. В настройках проекта перейдите в "Domains"
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям Vercel

## Деплой на другие платформы

### Netlify

1. Создайте аккаунт на [netlify.com](https://netlify.com)
2. Подключите репозиторий
3. Настройте переменные окружения
4. Укажите build command: `npm run build`
5. Укажите publish directory: `build`

### GitHub Pages

1. В настройках репозитория перейдите в "Pages"
2. Выберите source: "GitHub Actions"
3. Создайте workflow файл `.github/workflows/deploy.yml`
4. Настройте переменные окружения в Secrets

## Мониторинг и аналитика

### 1. Настройка аналитики

Добавьте Google Analytics или другие сервисы:

```html
<!-- В public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Мониторинг ошибок

Добавьте Sentry или другие сервисы для отслеживания ошибок.

### 3. Проверка производительности

Используйте Lighthouse для проверки:
- Производительности
- Доступности
- SEO
- Лучших практик

## Обновления

### Автоматические обновления

При пуше в main ветку Vercel автоматически:
1. Соберет проект
2. Запустит тесты
3. Развернет новую версию

### Ручные обновления

1. Войдите в Vercel Dashboard
2. Выберите проект
3. Перейдите в "Deployments"
4. Нажмите "Redeploy"

## Безопасность

### 1. Проверка переменных окружения

Убедитесь, что все секретные данные хранятся в переменных окружения, а не в коде.

### 2. HTTPS

Vercel автоматически предоставляет SSL сертификаты.

### 3. CSP (Content Security Policy)

Добавьте заголовки безопасности в `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

## Резервное копирование

### 1. База данных

Настройте автоматическое резервное копирование в Supabase:
1. Перейдите в Settings > Database
2. Настройте Backup Schedule

### 2. Код

Используйте Git для версионирования кода.

## Поддержка

При возникновении проблем:

1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что база данных настроена правильно
4. Обратитесь в поддержку Vercel или Supabase 