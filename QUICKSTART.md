# Quick Start Guide

## Get Started in 5 Minutes! 🚀

### Step 1: Prerequisites

Make sure you have installed:
- **Node.js 18+**: [Download here](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js
- **Git**: [Download here](https://git-scm.com/)
- **VS Code** (recommended): [Download here](https://code.visualstudio.com/)

### Step 2: Start with Lab 01

```bash
# Navigate to Lab 01
cd lab01/starter

# Create your Next.js project
npx create-next-app@latest my-nextjs-app

# Follow the prompts:
# ✔ Would you like to use TypeScript? Yes
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Tailwind CSS? No (we'll add it in Lab 03)
# ✔ Would you like to use `src/` directory? No
# ✔ Would you like to use App Router? Yes
# ✔ Would you like to customize the default import alias? No

# Navigate into your project
cd my-nextjs-app

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

### Step 3: Follow the Guide

1. Open `lab01/steps-by-steps.md`
2. Follow each step carefully
3. Reference `lab01/nextjs-syntax-reference.md` as needed
4. Compare with `lab01/finish/` when done

### Step 4: Progress Through Labs

Each lab builds on the previous one:

```
Lab 01 → Lab 02 → Lab 03 → ... → Lab 10
```

**Tips:**
- Complete labs in order
- Code along with the exercises
- Don't skip the syntax references
- Use the finish folder if you get stuck

## Lab Overview

| Lab | Topic | Time | Key Skills |
|-----|-------|------|------------|
| **01** | Next.js Setup & Basics | 2-3h | Project setup, routing basics, components |
| **02** | Routing & Navigation | 2-3h | Dynamic routes, navigation, parameters |
| **03** | Tailwind CSS & UI | 2-3h | Styling, responsive design, components |
| **04** | API Integration | 2-3h | Data fetching, SSR, SSG, ISR |
| **05** | Authentication | 3-4h | NextAuth, login/logout, protected routes |
| **06** | Forms & Validation | 2-3h | Form handling, validation, React Hook Form |
| **07** | API Routes | 2-3h | Backend development, REST APIs |
| **08** | Database Integration | 3-4h | Prisma, MongoDB, CRUD operations |
| **09** | Azure Deployment | 3-4h | Cloud deployment, CI/CD, Docker |
| **10** | Performance & Capstone | 4-5h | Optimization, SEO, FastAPI + Cosmos DB |

**Total Time:** ~28-35 hours

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter

# Install packages
npm install package-name
npm install -D package-name  # Dev dependency

# Prisma (Lab 08)
npx prisma init
npx prisma generate
npx prisma studio

# Azure CLI (Lab 09)
az login
az webapp create ...
```

## Need Help?

- **Stuck on a step?** Check the `finish/` folder
- **Syntax question?** Check the reference files
- **Error messages?** Read them carefully - they're usually helpful!
- **Still stuck?** Review the step again or search the [Next.js docs](https://nextjs.org/docs)

## Best Practices

1. **Read before coding** - Understand what you're building first
2. **Type along** - Don't copy-paste; you'll learn better
3. **Experiment** - Try variations and see what happens
4. **Save often** - Git commit your progress regularly
5. **Test frequently** - Check your work in the browser often

## VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prisma**
- **GitLens**
- **Thunder Client** (for testing APIs)

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module not found
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## What's Next?

After completing all labs:
1. Build your own project
2. Contribute to open source
3. Deploy a real application
4. Share your knowledge with others

---

**Ready?** Let's start with Lab 01! Open `lab01/readme.md` 🚀
