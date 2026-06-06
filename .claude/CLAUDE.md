# Frontend Dashboard

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS 4 + Emotion
- **UI Components**: shadcn (Base UI + Radix UI)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Notifications**: Sonner
- **Theme**: next-themes (dark mode support)
- **Analytics**: PostHog
- **Security**: reCAPTCHA v3
- **Date Handling**: date-fns
- **Image Crop**: react-image-crop
- **Resizable Panels**: react-resizable-panels
- **Loading Bar**: react-top-loading-bar

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Next.js pages/routes
├── lib/              # Utilities & helpers
├── styles/           # Global styles
public/              # Static assets
types/               # TypeScript definitions [although user prefer jsx only]
```

## Key Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Build for production
- `npm run lint` — Run ESLint
- `npm run format` — Format with Prettier

## Build & Deploy

- **Format**: Prettier + Tailwind CSS plugin (sorts classes)
- **Linting**: ESLint 9 with Next.js config
- **Next Config**: Minimal setup in `next.config.mjs`

## Important Notes

- Dark mode support via `next-themes` — check theme context in components
- Form validation uses Zod schemas — keep validation logic with forms
- Socket.io configured for real-time features — check `.env` for server URL
- PostHog analytics active — review tracking for privacy compliance
