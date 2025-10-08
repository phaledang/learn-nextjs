# Lab 02: Routing & Navigation

## 🎯 Objectives

By the end of this lab, you will:
- Master Next.js file-based routing system
- Create dynamic routes with parameters
- Implement catch-all and optional catch-all routes
- Use the Link component for client-side navigation
- Understand and use route groups
- Implement programmatic navigation
- Work with route parameters and search params
- Create nested layouts

## 📋 Prerequisites

- Completed Lab 01
- Understanding of Next.js project structure
- Basic knowledge of React components

## 🔑 Key Concepts

### File-Based Routing

Next.js uses a file-system based router where:
- **Folders** define route segments
- **page.tsx** files make routes publicly accessible
- **layout.tsx** files create shared UI for segments

### Route Types

1. **Static Routes**: Fixed paths like `/about` or `/blog`
2. **Dynamic Routes**: Variable segments like `/blog/[slug]`
3. **Catch-all Routes**: Match multiple segments like `/docs/[...slug]`
4. **Optional Catch-all**: Match zero or more segments like `/docs/[[...slug]]`

### Navigation Methods

1. **Link Component**: Client-side navigation with prefetching
2. **useRouter Hook**: Programmatic navigation in Client Components
3. **redirect**: Server-side navigation in Server Components

## 🏗️ Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page (/)
├── blog/
│   ├── page.tsx           # Blog list (/blog)
│   └── [slug]/
│       └── page.tsx       # Blog post (/blog/my-post)
├── products/
│   ├── page.tsx           # Products list (/products)
│   └── [category]/
│       ├── page.tsx       # Category (/products/electronics)
│       └── [id]/
│           └── page.tsx   # Product (/products/electronics/123)
└── docs/
    └── [...slug]/
        └── page.tsx       # Docs (/docs/a/b/c)
```

## 📚 What You'll Build

In this lab, you'll create:
1. A blog with dynamic post routes
2. A product catalog with nested dynamic routes
3. A documentation section with catch-all routes
4. Navigation components with Link
5. Breadcrumb navigation
6. Search functionality with search params

## 🚀 Getting Started

1. Navigate to the `starter/` folder
2. Follow the instructions in `steps-by-steps.md`
3. Reference `nextjs-syntax-reference.md` as needed
4. Compare your work with the `finish/` folder

## 📖 Reference Files

- **nextjs-syntax-reference.md**: Routing and navigation syntax

## ⏱️ Estimated Time

2-3 hours

## 🎓 Learning Outcomes

After completing this lab, you should be able to:
- Create static and dynamic routes
- Navigate between pages efficiently
- Use route parameters
- Implement nested layouts
- Handle route groups
- Use search parameters
- Create breadcrumb navigation

## 🔗 Additional Resources

- [Next.js Routing Documentation](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js Link Component](https://nextjs.org/docs/app/api-reference/components/link)
- [useRouter Hook](https://nextjs.org/docs/app/api-reference/functions/use-router)

## 💡 Tips

- Dynamic routes are created with square brackets: `[param]`
- Use descriptive parameter names
- Always provide a key when rendering lists with Link components
- Prefetching happens automatically with Link components
- Test your routes by typing URLs directly in the browser

---

Ready to master routing? Open `steps-by-steps.md` and let's begin! 🚀
