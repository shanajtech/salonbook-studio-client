# SalonBook Studio client

An editorial salon booking experience for Dhaka with Next.js, React and an Express REST API. Browse and filter live services, request a time slot, manage appointments and pay through Stripe after confirmation. A separate admin dashboard handles catalog management, users and transactions.

## Run locally

1. Use Node.js 22 or later. Run `npm install`.
2. Copy `.env.example` to `.env.local` and set `API_BASE_URL` to the Express origin.
3. Run `npm run dev` and open `http://localhost:3000`.
4. For production, configure `API_BASE_URL`, then run `npm run build` and `npm start`. The client proxies API and Better Auth requests through its origin.

[Client repository](https://github.com/shanajtech/salonbook-studio-client) · [Server repository](https://github.com/shanajtech/salonbook-studio-server)

[Live website](https://salonbook-studio-client-ktn7.vercel.app) · [API health](https://salonbook-studio-server.vercel.app/api/health)
