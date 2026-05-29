# ProjectBowl Supabase Manual Setup

User akan menjalankan migrasi Supabase dan deployment Vercel secara manual.

## 1. Create Supabase Project

1. Buat project Supabase baru.
2. Buka **SQL Editor**.
3. Jalankan isi `schema.sql`.
4. Opsional: jalankan isi `seed.sql` untuk data demo awal.

## 2. Create Admin User

1. Supabase Dashboard → **Authentication → Users**.
2. Buat user admin dengan email/password.
3. Copy `user id` dari user tersebut.
4. Jalankan SQL berikut dengan mengganti value:

```sql
insert into public.profiles (id, email, name, role)
values (
  'AUTH_USER_ID_HERE',
  'admin@example.com',
  'ProjectBowl Admin',
  'ADMIN'
)
on conflict (id) do update set
  email = excluded.email,
  name = excluded.name,
  role = excluded.role;
```

## 3. Vercel Environment Variables

Set di Vercel project settings:

```txt
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=openai/gpt-4o-mini
```

`SUPABASE_SERVICE_ROLE_KEY` dan `OPENROUTER_API_KEY` harus server-side only. Jangan expose sebagai `NEXT_PUBLIC_*`.

## 4. Deploy Target

- Vercel root directory: repository root (`.`)
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm --filter @projectbowl/web build`
- Framework preset: Next.js
- Keep root at repository root so pnpm can resolve `packages/*` workspace dependencies.

## 5. Notes

- `apps/api` adalah legacy NestJS API dan tidak diperlukan untuk deployment Vercel + Supabase.
- RLS policies di `schema.sql` membuat public hanya bisa membaca project `PUBLIC` dengan `published_at`.
- Dashboard mutations membutuhkan user role `ADMIN` atau `EDITOR` di `profiles`.
