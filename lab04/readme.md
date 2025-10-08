# Lab 04: API Integration & Data Fetching

## 🎯 Objectives

By the end of this lab, you will:
- Understand different data fetching methods in Next.js
- Fetch data from external APIs
- Implement server-side rendering (SSR)
- Use static site generation (SSG)
- Implement incremental static regeneration (ISR)
- Handle loading and error states
- Use React Server Components for data fetching

## 📋 Prerequisites

- Completed Lab 01-03
- Understanding of promises and async/await
- Basic knowledge of REST APIs

## 🔑 Key Concepts

### Data Fetching in Next.js

Next.js offers multiple ways to fetch data:

1. **Server Components (Default)**: Fetch data directly in components
2. **Client Components**: Fetch data with useEffect and fetch
3. **Static Generation**: Pre-render at build time
4. **Server-Side Rendering**: Render on each request
5. **Incremental Static Regeneration**: Update static content after build

### When to Use Each Method

- **Server Components**: Most use cases (default, preferred)
- **Client-side**: User-specific data, real-time updates
- **Static**: Content that doesn't change often (blog posts)
- **SSR**: Dynamic data that changes per request
- **ISR**: Static content that updates periodically

## 📚 What You'll Build

In this lab, you'll create:
1. A page that fetches data from a public API
2. A blog with static generation
3. A product page with ISR
4. Error and loading states
5. Data caching strategies

## ⏱️ Estimated Time

2-3 hours

## 📖 Reference Files

- **nextjs-syntax-reference.md**: Data fetching patterns

---

Ready to fetch data? Open `steps-by-steps.md` and let's begin! 🚀
