This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Commit Message Standard

Use Conventional Commits so history stays consistent and easy to scan.

Format:

```txt
<type>(<scope>): <summary>
```

Rules:

- Use lowercase `type` and `scope`.
- Keep the summary short, imperative, and under 72 characters.
- Do not end the summary with a period.
- Use English for commit messages.
- Add a body only when the change needs extra context.

Common types:

- `feat`: new feature or user-facing capability
- `fix`: bug fix
- `refactor`: code change without behavior change
- `style`: formatting or visual-only adjustment
- `test`: add or update tests
- `docs`: documentation change
- `chore`: tooling, dependency, or maintenance task
- `build`: build system or package change
- `ci`: CI workflow change

Recommended scopes:

- `auth`
- `home`
- `products`
- `checkout`
- `orders`
- `flash-sale`
- `admin`
- `observability`
- `load-test`
- `architecture`
- `ui`
- `deps`
- `config`

Examples:

```txt
feat(auth): add standalone sign-in screen
fix(auth): align otp input width
style(ui): polish auth form spacing
docs(readme): add commit message standard
chore(deps): update package lock
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
