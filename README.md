# Discord Clone

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

[`Clerk`](https://clerk.com/docs) for authorization and user management.

[`Prisma`](https://www.prisma.io/docs) database toolkit for easier management.

Using [`Neon DB`](https://neon.tech/docs/introduction) Postgress database service free tier.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
