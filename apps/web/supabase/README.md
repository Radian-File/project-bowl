# ProjectBowl Supabase Manual Setup

User menjalankan migrasi Supabase dan deployment Vercel secara manual. File di folder ini adalah migration packet untuk ProjectBowl.

## File

| File | Fungsi |
| --- | --- |
| `schema.sql` | Membuat tabel, index, trigger, function, RLS, dan policies. Aman dijalankan ulang untuk bagian trigger/policy. |
| `seed.sql` | Data demo opsional: tech stacks + project `ProjectBowl`. |
| `site-tech-stack.sql` | Tabel + seed untuk mengatur section homepage `/#stack` dari dashboard `/dashboard/tech`. Jalankan setelah `schema.sql`. |
| `verify.sql` | Query pengecekan setelah migration/seed/admin setup. |

## 1. Create Supabase Project

1. Buka Supabase dashboard.
2. Create new project.
3. Simpan database password di tempat aman.
4. Tunggu project selesai provisioning.
5. Buka **Project Settings → API** dan copy:
   - Project URL
   - anon public key
   - service_role secret key

## 2. Run SQL Migration

1. Buka **SQL Editor**.
2. Buat query baru.
3. Copy seluruh isi `schema.sql`.
4. Run.
5. Kalau sukses, lanjut opsional copy seluruh isi `seed.sql`, lalu Run.
6. Copy seluruh isi `site-tech-stack.sql`, lalu Run untuk mengaktifkan manager homepage Tech Stack di `/dashboard/tech`.

## 3. Create Admin User

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

## 4. Verify Migration

Buka **SQL Editor**, copy isi `verify.sql`, lalu Run.

Expected:

- Semua core tables muncul.
- `rls_enabled = true` untuk semua tabel ProjectBowl.
- Policies muncul di `pg_policies`.
- Minimal 1 profile role `ADMIN` jika admin sudah dibuat.
- Jika `seed.sql` dijalankan, project `projectbowl` muncul dengan `visibility = PUBLIC`.

## 5. Local Environment Variables

Buat file lokal:

```bash
cp .env.example apps/web/.env.local
```

Isi minimal:

```txt
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Cloudinary optional untuk future upload integration:

```txt
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=projectbowl
```

## 6. Vercel Environment Variables

Set di Vercel project settings:

```txt
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=openai/gpt-4o-mini
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=projectbowl
```

`SUPABASE_SERVICE_ROLE_KEY` dan `OPENROUTER_API_KEY` harus server-side only. Jangan expose sebagai `NEXT_PUBLIC_*`.

## 7. Deploy Target

- Vercel root directory: repository root (`.`)
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm --filter @projectbowl/web build`
- Framework preset: Next.js
- Keep root at repository root so pnpm can resolve `packages/*` workspace dependencies.

## 8. Local Test

Run:

```bash
pnpm --filter @projectbowl/web dev
```

Test:

1. Open `http://localhost:3000`.
2. Open `/login`.
3. Login with the Supabase Auth admin user.
4. Open `/dashboard/projects`.
5. Create/edit/delete a project.
6. Set project `visibility = PUBLIC` and confirm it appears on public portfolio.

## 9. Notes

- `apps/api` adalah legacy NestJS API dan tidak diperlukan untuk deployment Vercel + Supabase.
- RLS policies di `schema.sql` membuat public hanya bisa membaca project `PUBLIC` dengan `published_at`.
- Dashboard mutations membutuhkan user role `ADMIN` atau `EDITOR` di `profiles`.
