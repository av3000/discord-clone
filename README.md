# Discord Clone

Live at [https://discord-clone-production-80db.up.railway.app/](https://discord-clone-production-80db.up.railway.app/). Please do not Ddos my free tiers 🙏

[!Application demo](./docs/assets/images/dc-clone-create-edit-server.gif)
[!Application demo2](./docs/assets/images/dc-clone-search-invite-attachment.gif)
[!Application demo3](./docs/assets/images/dc-clone-change-theme.gif)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

[`Clerk`](https://clerk.com/docs) for authorization and user management.

[`Prisma`](https://www.prisma.io/docs) database toolkit for easier management.

Using [`Neon DB`](https://neon.tech/docs/introduction) Postgress database service free tier.

[`Uploadthing`](https://docs.uploadthing.com/) way to add file uploads to fullstack TypeScript app.

[`Livekit`](https://docs.livekit.io/home/) for realtime streaming service.

[`Zod`](https://zod.dev) TypeScript-first schema validation with static type inference and easy-to-use forms validation zodResolver from [`hookform/resolvers`](https://github.com/react-hook-form/react-hook-form).

[`Zustand`](https://github.com/pmndrs/zustand) client-side simplified state-management.

[`tanstack/react-query`](https://github.com/TanStack/query) server-side data state management.

[`Tailwind CSS`](https://tailwindui.com/) styling and [`shadcn/ui`](https://ui.shadcn.com/) UI copy-paste library for generating and extending UI components.
Based on [`radix-ui`](https://www.radix-ui.com/primitives) primitives design system.

[`lucide-react`](https://lucide.dev/guide/packages/lucide-react) icon library.

[`Emoji Mart`](https://github.com/missive/emoji-mart) emoji picker component.

[`WebSockets`](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) server and [`SocketIO`](https://socket.io/) for enabling easier communication between client and server.

## Project features

- CRUD for discord Server, Channel, Messages and Roles management.
- Audio and Video feature with Livekit.
- In-chat emojies.
- Responsive template layouts and Dark mode.
- Attachements sending.
- Server-side state data syncronization, caching, and infinite messages scrolling with react query.
- Postgres DB with Prisma ORM.
- Authentication with Clerk.
- Real-time updates for messages using websockets.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Commands

Install new UI library components from [shadcn-ui](https://ui.shadcn.com/docs):

```bash
npx shadcn-ui@latest add <component-name>
```

Run these 2 commands every time schema.prisma is modified.

Generate schema to add it to the node modules to develop with it:

```bash
npx prisma generate
```

Create the collections in database:

```bash
npx prisma db push
```

To re-migrate and reset all of database data:

```bash
npx prisma migrate reset
```

After re-migrate you need to run `generate` and `push` again.

Manipulate data in all of Prisma projects with [`Prisma Studio`](https://www.prisma.io/studio):

```bash
npx prisma studio
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
