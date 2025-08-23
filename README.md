# Zano Monitor

A modern dashboard for monitoring the Zano cryptocurrency network. Aggregates and visualizes data from the Zano blockchain, CoinGecko, GitHub, and Reddit to provide a comprehensive overview of network health, price, development, and social activity.

## Features

- **Price Overview:**
  - ZANO price, market cap, volume, and network score (CoinGecko)
- **Development Activity:**
  - GitHub stats: stars, forks, contributors, commits, issues, top repositories, recent events
- **Onchain Metrics:**
  - Blockchain stats: hashrate, block time, mempool size, block utilization, adoption score, and more (Zano Explorer)
- **Social Metrics:**
  - Reddit data: subscribers, active users, recent posts, average upvotes, average comments
- **Responsive UI:**
  - Built with Next.js, TailwindCSS, Radix UI (shadcn/ui), and Lucide icons

## Tech Stack

- **Frontend:** Next.js (React), TailwindCSS, Radix UI (shadcn/ui), Lucide icons
- **Data Fetching:** Custom services for CoinGecko, GitHub, Zano Explorer, Reddit
- **State Management:** React hooks
- **Styling:** TailwindCSS, custom themes
- **Deployment:** Vercel

## Project Structure

- `app/page.tsx` — Main dashboard page
- `components/` — UI components for dashboard sections
- `services/` — API service classes for each data source
- `hooks/useZanoData.ts` — Central hook for fetching and refreshing dashboard data
- `config/api.ts` — Centralized API configuration
- `types/` — TypeScript interfaces for data models

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Run locally:**
   ```bash
   pnpm run dev
   ```
3. **Build for production:**
   ```bash
   pnpm run build
   ```
4. **Lint:**
   ```bash
   pnpm run lint
   ```
5. **Start production server:**
   ```bash
   pnpm start
   ```

## Environment

- Node.js >= 20
- pnpm >= 10

## Configuration

- API endpoints and refresh intervals are managed in `config/api.ts`.
- Environment variables can be added for secrets or custom endpoints if needed.

## Data Sources

- **CoinGecko:** Price, market cap, volume
- **GitHub:** Repository activity, contributors, commits, issues
- **Zano Explorer:** Blockchain stats
- **Reddit:** Social metrics

## Deployment

- Deployed on Vercel: [https://vercel.com/mtmarctonis-projects/v0-zano-monitor](https://vercel.com/mtmarctonis-projects/v0-zano-monitor)

## License

MIT
