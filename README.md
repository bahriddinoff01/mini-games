# Mini Arcade

A collection of 8 small browser games (plus a to-do list) with accounts, a global leaderboard,
dark mode and 4 languages (O'zbekcha, 한국어, English, Русский).

Built with React, Vite, Tailwind CSS, Framer Motion and Supabase.

## Run locally

```bash
npm install
npm run dev
```

The games work without any setup. Accounts and the leaderboard need Supabase (below).

## Connect accounts and the leaderboard (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the project, open **SQL Editor → New query**, paste everything from
   [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. Open **Project Settings → API** and copy the **Project URL** and the **anon / publishable** key.
4. Copy `.env.example` to `.env.local` and paste the two values in.
   Never use the `service_role` / secret key in this app.
5. In **Authentication → URL Configuration**, set **Site URL** to your live site address and add
   `http://localhost:5173/**` under **Redirect URLs** (used by the email confirmation link).
6. Restart `npm run dev`.

When deploying, add the same two `VITE_SUPABASE_…` variables in your hosting provider's settings.

### How user data is protected

- Emails and passwords are handled by Supabase Auth. Passwords are hashed; emails are never sent
  to other players. The leaderboard only shows usernames.
- Row Level Security is enabled on every table: players can only add results for their own
  account, and nobody can edit or delete other people's data.
- Scores are range-checked and rate-limited on the server to make fake scores harder.
- Players can delete their account and all their results from the **My results** page.

## Project structure

- `src/pages` — one file per game, plus login / sign-up, leaderboard and profile
- `src/components` — shared layout, navbar, cards
- `src/i18n` — translations (`en.js`, `uz.js`, `ko.js`, `ru.js`)
- `src/index.css` — color tokens (light and dark) and shared styles
- `src/data/activities.js` — the list of games and how each one is scored
- `supabase/schema.sql` — database tables and security rules
