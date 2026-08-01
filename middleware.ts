import { NextResponse, type NextRequest } from "next/server";

// Захист /dashboard тимчасово вимкнено на рівні middleware.
//
// Причина: supabase-js на клієнті зберігає сесію в localStorage, а не в
// cookie "sb-access-token" - тому ця перевірка ЗАВЖДИ не знаходила токен
// і миттєво відкидала щойно залогіненого користувача назад на /login,
// навіть після успішного входу.
//
// Захист сторінки /dashboard вже реалізований на клієнті в
// app/dashboard/page.tsx (виклик getUser() при завантаженні), тож
// незалогінений користувач все одно не побачить дашборд - middleware
// для цього зараз не потрібен.
//
// Якщо в майбутньому знадобиться саме server-side захист (наприклад, для
// SEO чи серверних компонентів) - треба переходити на @supabase/ssr з
// createServerClient і правильною синхронізацією cookie в middleware.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = { matcher: [] };
