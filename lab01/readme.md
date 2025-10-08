# Lab 01: Next.js Setup & Basics

## 🎯 Objectives

By the end of this lab, you will:
- Understand what Next.js is and its key features
- Set up a Next.js development environment
- Understand the Next.js project structure
- Create your first pages and components
- Learn the basics of React Server Components
- Understand the App Router architecture

## 📋 Prerequisites

- Node.js 18.17 or higher installed
- npm or yarn package manager
- Basic knowledge of React
- Code editor (VS Code recommended)

## 🔑 Key Concepts

### What is Next.js?

Next.js is a React framework that enables you to build full-stack web applications. It provides:
- **Server-Side Rendering (SSR)**: Render pages on the server for better performance and SEO
- **Static Site Generation (SSG)**: Pre-render pages at build time
- **API Routes**: Build API endpoints within your Next.js app
- **File-based Routing**: Automatic routing based on file structure
- **Image Optimization**: Automatic image optimization
- **Built-in CSS Support**: Support for CSS Modules, Sass, and CSS-in-JS

### Next.js 14 App Router

The App Router is built on React Server Components and supports:
- **Layouts**: Share UI across multiple pages
- **Server Components**: Components that run on the server by default
- **Client Components**: Interactive components that run on the client
- **Streaming**: Progressively render and send UI from the server

## 🏗️ Project Structure

```
my-nextjs-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── public/                 # Static files
├── node_modules/           # Dependencies
├── package.json            # Project configuration
├── next.config.js          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## 📚 What You'll Build

In this lab, you'll create:
1. A new Next.js project from scratch
2. A simple home page with components
3. An about page
4. A reusable layout component
5. Basic styling

## 🚀 Getting Started

1. Navigate to the `starter/` folder
2. Follow the instructions in `steps-by-steps.md`
3. Reference `nextjs-syntax-reference.md` as needed
4. Compare your work with the `finish/` folder

## 📖 Reference Files

- **nextjs-syntax-reference.md**: Next.js syntax and patterns

## ⏱️ Estimated Time

2-3 hours

## 🎓 Learning Outcomes

After completing this lab, you should be able to:
- Create a new Next.js project
- Understand the App Router structure
- Create pages and components
- Use layouts effectively
- Navigate between pages
- Apply basic styling

## 🔗 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Next.js Learn Course](https://nextjs.org/learn)

## 💡 Tips

- Read error messages carefully - they're very helpful in Next.js
- Use the Next.js documentation frequently
- Experiment with the code
- Don't worry about making mistakes - that's how we learn!

---

Ready to start? Open `steps-by-steps.md` and let's build! 🚀
