# Tailwind CSS Syntax Reference

## Table of Contents
1. [Installation](#installation)
2. [Layout](#layout)
3. [Flexbox & Grid](#flexbox--grid)
4. [Spacing](#spacing)
5. [Sizing](#sizing)
6. [Typography](#typography)
7. [Colors](#colors)
8. [Backgrounds](#backgrounds)
9. [Borders](#borders)
10. [Effects](#effects)
11. [Responsive Design](#responsive-design)
12. [Dark Mode](#dark-mode)

---

## Installation

### Install Tailwind in Next.js

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configure tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Add Tailwind directives to globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Layout

### Display

```html
<div class="block">Block</div>
<div class="inline-block">Inline Block</div>
<div class="inline">Inline</div>
<div class="flex">Flex</div>
<div class="grid">Grid</div>
<div class="hidden">Hidden</div>
```

### Container

```html
<div class="container mx-auto">Centered container</div>
<div class="container mx-auto px-4">Container with padding</div>
```

---

## Flexbox & Grid

### Flexbox

```html
<!-- Flex container -->
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Direction -->
<div class="flex flex-row">Row (default)</div>
<div class="flex flex-col">Column</div>
<div class="flex flex-row-reverse">Reverse row</div>

<!-- Justify content -->
<div class="flex justify-start">Start</div>
<div class="flex justify-center">Center</div>
<div class="flex justify-between">Space between</div>
<div class="flex justify-around">Space around</div>
<div class="flex justify-evenly">Space evenly</div>

<!-- Align items -->
<div class="flex items-start">Start</div>
<div class="flex items-center">Center</div>
<div class="flex items-end">End</div>
<div class="flex items-stretch">Stretch</div>

<!-- Wrap -->
<div class="flex flex-wrap">Wrap</div>
<div class="flex flex-nowrap">No wrap</div>

<!-- Gap -->
<div class="flex gap-4">Gap between items</div>
<div class="flex gap-x-4 gap-y-2">Different gaps</div>
```

### Grid

```html
<!-- Grid container -->
<div class="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Grid columns -->
<div class="grid grid-cols-1">1 column</div>
<div class="grid grid-cols-2">2 columns</div>
<div class="grid grid-cols-3">3 columns</div>
<div class="grid grid-cols-4">4 columns</div>

<!-- Auto-fit columns -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
  Responsive grid
</div>

<!-- Column span -->
<div class="grid grid-cols-3">
  <div class="col-span-2">Spans 2 columns</div>
  <div>1 column</div>
</div>
```

---

## Spacing

### Padding

```html
<!-- All sides -->
<div class="p-4">Padding all sides</div>
<div class="p-8">Larger padding</div>

<!-- Specific sides -->
<div class="pt-4">Padding top</div>
<div class="pr-4">Padding right</div>
<div class="pb-4">Padding bottom</div>
<div class="pl-4">Padding left</div>

<!-- X and Y axis -->
<div class="px-4">Padding horizontal</div>
<div class="py-4">Padding vertical</div>

<!-- Spacing scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64 -->
```

### Margin

```html
<!-- All sides -->
<div class="m-4">Margin all sides</div>

<!-- Specific sides -->
<div class="mt-4">Margin top</div>
<div class="mr-4">Margin right</div>
<div class="mb-4">Margin bottom</div>
<div class="ml-4">Margin left</div>

<!-- X and Y axis -->
<div class="mx-4">Margin horizontal</div>
<div class="my-4">Margin vertical</div>

<!-- Auto margin (centering) -->
<div class="mx-auto">Centered</div>

<!-- Negative margin -->
<div class="-mt-4">Negative margin top</div>
```

---

## Sizing

### Width

```html
<div class="w-1/2">50% width</div>
<div class="w-1/3">33.33% width</div>
<div class="w-full">100% width</div>
<div class="w-screen">100vw width</div>
<div class="w-64">256px width (16rem)</div>
<div class="w-auto">Auto width</div>

<!-- Min/Max width -->
<div class="min-w-full">Min width 100%</div>
<div class="max-w-md">Max width 28rem</div>
<div class="max-w-xl">Max width 36rem</div>
<div class="max-w-2xl">Max width 42rem</div>
<div class="max-w-4xl">Max width 56rem</div>
```

### Height

```html
<div class="h-64">256px height</div>
<div class="h-full">100% height</div>
<div class="h-screen">100vh height</div>

<!-- Min/Max height -->
<div class="min-h-screen">Min height 100vh</div>
<div class="max-h-96">Max height 24rem</div>
```

---

## Typography

### Font Family

```html
<p class="font-sans">Sans-serif font</p>
<p class="font-serif">Serif font</p>
<p class="font-mono">Monospace font</p>
```

### Font Size

```html
<p class="text-xs">Extra small</p>
<p class="text-sm">Small</p>
<p class="text-base">Base (16px)</p>
<p class="text-lg">Large</p>
<p class="text-xl">Extra large</p>
<p class="text-2xl">2x large</p>
<p class="text-3xl">3x large</p>
<p class="text-4xl">4x large</p>
```

### Font Weight

```html
<p class="font-thin">Thin</p>
<p class="font-light">Light</p>
<p class="font-normal">Normal</p>
<p class="font-medium">Medium</p>
<p class="font-semibold">Semibold</p>
<p class="font-bold">Bold</p>
<p class="font-extrabold">Extra bold</p>
```

### Text Alignment

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>
<p class="text-justify">Justified</p>
```

### Text Color

```html
<p class="text-black">Black text</p>
<p class="text-white">White text</p>
<p class="text-gray-500">Gray text</p>
<p class="text-red-500">Red text</p>
<p class="text-blue-500">Blue text</p>
<p class="text-green-500">Green text</p>
```

### Line Height

```html
<p class="leading-none">Line height 1</p>
<p class="leading-tight">Line height 1.25</p>
<p class="leading-normal">Line height 1.5</p>
<p class="leading-relaxed">Line height 1.625</p>
<p class="leading-loose">Line height 2</p>
```

---

## Colors

### Color Palette

Tailwind includes these color scales (50-900):
- `gray`, `red`, `yellow`, `green`, `blue`, `indigo`, `purple`, `pink`

```html
<div class="bg-blue-50">Lightest blue</div>
<div class="bg-blue-500">Medium blue</div>
<div class="bg-blue-900">Darkest blue</div>
```

### Text Colors

```html
<p class="text-blue-600">Blue text</p>
<p class="text-red-500">Red text</p>
<p class="text-green-600">Green text</p>
```

### Background Colors

```html
<div class="bg-blue-500">Blue background</div>
<div class="bg-gray-100">Light gray background</div>
<div class="bg-white">White background</div>
<div class="bg-transparent">Transparent</div>
```

---

## Backgrounds

### Background Gradients

```html
<div class="bg-gradient-to-r from-blue-500 to-purple-500">
  Left to right gradient
</div>
<div class="bg-gradient-to-b from-blue-500 to-purple-500">
  Top to bottom gradient
</div>
<div class="bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500">
  Three-color gradient
</div>
```

---

## Borders

### Border Width

```html
<div class="border">1px border</div>
<div class="border-2">2px border</div>
<div class="border-4">4px border</div>
<div class="border-t">Top border only</div>
<div class="border-x">Horizontal borders</div>
```

### Border Radius

```html
<div class="rounded">Small radius</div>
<div class="rounded-md">Medium radius</div>
<div class="rounded-lg">Large radius</div>
<div class="rounded-full">Full radius (circle)</div>
<div class="rounded-t-lg">Top corners only</div>
```

### Border Color

```html
<div class="border border-gray-300">Gray border</div>
<div class="border border-blue-500">Blue border</div>
```

---

## Effects

### Shadow

```html
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Default shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>
<div class="shadow-2xl">2x large shadow</div>
```

### Opacity

```html
<div class="opacity-0">Invisible</div>
<div class="opacity-50">50% opacity</div>
<div class="opacity-100">Fully opaque</div>
```

### Hover Effects

```html
<button class="hover:bg-blue-700">Hover for darker blue</button>
<div class="hover:shadow-lg">Hover for shadow</div>
<a class="hover:text-blue-500 hover:underline">Hover link</a>
```

### Transition

```html
<button class="transition duration-300 hover:bg-blue-500">
  Smooth transition
</button>
<div class="transition-all duration-500 ease-in-out">
  Transition all properties
</div>
```

---

## Responsive Design

### Breakpoints

```
sm: 640px   @media (min-width: 640px)
md: 768px   @media (min-width: 768px)
lg: 1024px  @media (min-width: 1024px)
xl: 1280px  @media (min-width: 1280px)
2xl: 1536px @media (min-width: 1536px)
```

### Responsive Utilities

```html
<!-- Mobile first: default applies to all sizes -->
<div class="text-sm md:text-base lg:text-lg">
  Small on mobile, larger on desktop
</div>

<!-- Hide/show at different breakpoints -->
<div class="hidden md:block">
  Hidden on mobile, visible on tablet+
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  1 column mobile, 2 tablet, 3 desktop
</div>

<!-- Responsive padding -->
<div class="p-4 md:p-6 lg:p-8">
  More padding on larger screens
</div>
```

---

## Dark Mode

### Enable Dark Mode

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}
```

### Dark Mode Classes

```html
<div class="bg-white dark:bg-gray-800 text-black dark:text-white">
  Light background in light mode, dark in dark mode
</div>

<button class="bg-blue-500 dark:bg-blue-700">
  Darker blue in dark mode
</button>
```

### Toggle Dark Mode (Client Component)

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? '☀️' : '🌙'}
    </button>
  )
}
```

---

## Common Patterns

### Button

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
  Click Me
</button>
```

### Card

```html
<div class="bg-white rounded-lg shadow-md p-6">
  <h2 class="text-xl font-bold mb-2">Card Title</h2>
  <p class="text-gray-600">Card content goes here...</p>
</div>
```

### Input

```html
<input 
  type="text" 
  class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter text..."
/>
```

### Badge

```html
<span class="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
  Badge
</span>
```

### Navbar

```html
<nav class="bg-white shadow-lg">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <div class="text-xl font-bold">Logo</div>
      <div class="flex space-x-4">
        <a href="#" class="text-gray-700 hover:text-blue-500">Home</a>
        <a href="#" class="text-gray-700 hover:text-blue-500">About</a>
      </div>
    </div>
  </div>
</nav>
```

---

## Customization

### Extend Theme

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0070f3',
        'brand-gray': '#f5f5f5',
      },
      spacing: {
        '128': '32rem',
      },
      fontFamily: {
        'custom': ['Inter', 'sans-serif'],
      },
    },
  },
}
```

### Custom Classes

```css
/* globals.css */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition;
  }
}
```

---

This reference covers essential Tailwind CSS utilities. For more details, visit [tailwindcss.com/docs](https://tailwindcss.com/docs).
