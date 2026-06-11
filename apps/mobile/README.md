# TickrX Mobile (Expo SDK 52)

React Native app for iOS, Android, and web. Expo Router + NativeWind v4 + Supabase.

## Setup

1. Copy `.env.example` to `.env` and fill in your Supabase project values:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
2. Apply migrations from `../../supabase/migrations/` (`supabase db push`, or `supabase start && supabase migration up` locally).
3. In the Supabase dashboard, enable the Google provider (Auth → Providers) and add `tickrx://` and your web origin to the redirect allowlist.

## Run

```bash
npm install
npm run web      # or: npm run ios / npm run android
```

## Test

```bash
npm test                 # jest-expo + React Native Testing Library
npm run test:coverage    # enforces ≥80% coverage
supabase test db         # pgTAP tests for schema, RLS, signup trigger
```
