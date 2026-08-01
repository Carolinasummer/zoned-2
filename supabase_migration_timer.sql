-- Етап 4: підготовка timer_sessions для гнучкого таймера
-- Виконати в Supabase → SQL Editor → New query → вставити і натиснути Run

-- 1. Дозволяємо сесію без прив'язки до задачі
alter table timer_sessions
  alter column task_id drop not null;

-- 2. Додаємо тип таймера й фазу (для Pomodoro)
alter table timer_sessions
  add column if not exists mode text not null default 'stopwatch' check (mode in ('pomodoro', 'stopwatch')),
  add column if not exists phase text not null default 'work' check (phase in ('work', 'break')),
  add column if not exists xp_awarded int not null default 0;

-- 3. На випадок якщо RLS ще не покриває нову колонку - переконайся що ці політики вже є
-- (це просто перевірка, якщо політики з Етапу 1 вже стоять - нічого не зламається)
-- select * from pg_policies where tablename = 'timer_sessions';
