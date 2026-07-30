# Zoned — Setup Guide

Цей архів — готовий каркас Етапу 1 (налаштування проекту). Я написав весь код,
конфіги та SQL-схему. Нижче — те, що **тільки ти можеш зробити**, бо це вимагає
твоїх особистих акаунтів, ключів і команд на твоєму комп'ютері (я працюю в
ізольованому середовищі без доступу до інтернету і без доступу до твоєї машини).

## Що вже зроблено (у цьому архіві)

- `package.json` — всі залежності з ТЗ (Next.js, Supabase, Claude SDK, Recharts, next-intl)
- `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js` — конфіги
- `.gitignore` — `.env.local` вже виключено
- `.env.example` — список змінних, які треба заповнити
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css` — робоча заглушка лендінгу
- `lib/supabase.ts` — клієнт Supabase, готовий до використання
- `types/database.ts` — TypeScript-типи під схему з ТЗ (users, tasks, timer_sessions)
- `supabase/schema.sql` — повна схема БД + Row Level Security + тригер на реєстрацію

## Що зробити тобі (покроково)

### 1. Розпакувати і встановити залежності
```bash
cd zoned
npm install
```
Це завантажить всі пакети з `package.json`. Команда `npm install` потребує
інтернету на твоїй машині — у мене його немає, тому я не міг сам запустити
цей крок і перевірити що все встановлюється без помилок.

### 2. Створити проект на Supabase
- Зайди на [supabase.com](https://supabase.com), зареєструйся, створи новий проект (Free tier)
- Це особистий акаунт — я не можу зареєструвати його за тебе
- В Project Settings → API скопіюй `Project URL` і `anon public key`

### 3. Запустити SQL-схему
- В Supabase Dashboard відкрий SQL Editor → New query
- Встав весь вміст файлу `supabase/schema.sql` і натисни Run
- Перевір у Table Editor що з'явились таблиці `users`, `tasks`, `timer_sessions`

### 4. Заповнити .env.local
```bash
cp .env.example .env.local
```
Встав туди свої реальні значення з Supabase (крок 2). `ANTHROPIC_API_KEY` поки
можна лишити пустим — він знадобиться на Етапі 4 (інтеграція Claude API),
ключ береш у [console.anthropic.com](https://console.anthropic.com).

### 5. Перевірити що все працює локально
```bash
npm run dev
```
Відкрий `localhost:3000` — має зʼявитись лендінг Zoned.

### 6. Git та GitHub
```bash
git init
git add .
git commit -m "Initial setup: project scaffold + Supabase schema"
```
Створи новий репозиторій на [github.com](https://github.com) (через свій акаунт)
і запуш:
```bash
git remote add origin <твоє посилання на репозиторій>
git push -u origin main
```

### 7. Деплой на Vercel
- Зайди на [vercel.com](https://vercel.com), залогінься через GitHub
- Import Project → обери свій репозиторій zoned
- В налаштуваннях Environment Variables додай ті самі змінні що в `.env.local`
- Deploy

## Чому саме ці кроки я не можу виконати сам

Я працюю в пісочниці без доступу до мережі (не можу звернутись ні до npm,
ні до supabase.com, ні до github.com, ні до vercel.com). Все, що вимагає
твого особистого акаунта, твого браузера або реального встановлення пакетів
з інтернету — фізично поза моїми можливостями. Все інше (код, конфіги, SQL,
структура проекту) я зробив за тебе вище.

## Далі

Коли виконаєш кроки 1-7 і `npm run dev` + Vercel-деплой працюють — пиши,
перейдемо до Етапу 2 (Auth: реєстрація і вхід через Supabase)..
