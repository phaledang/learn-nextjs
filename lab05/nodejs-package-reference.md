# Node.js Package Reference - Lab 05

## Overview
This lab focuses on state management, forms, and user interactions in Next.js applications. It introduces packages for client-side state management, form handling, and user interface interactions while building upon the foundation established in previous labs.

## Core Dependencies (Inherited from Previous Labs)

### `next` (v14.0.4)
**Enhanced for interactive features:**
- **Client Components**: Interactive components with `'use client'` directive
- **Server Actions**: Form handling with server-side processing
- **Route Handlers**: API endpoints for state synchronization
- **Middleware**: Request processing for authentication and routing

### `react` (^18) & `react-dom` (^18)
**Enhanced for state management:**
- **React Hooks**: useState, useEffect, useReducer, useContext
- **Concurrent Features**: Automatic batching and transitions
- **Suspense**: Loading states for async operations
- **Error Boundaries**: Error handling for interactive components

## State Management Packages

### `zustand`
**Description:** A small, fast, and scalable state management solution.

**Purpose:**
- Lightweight alternative to Redux
- TypeScript-first design
- No boilerplate code required
- Excellent DevTools integration

**Installation:**
```bash
npm install zustand
```

**Usage:**
```typescript
// stores/counter.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

// components/Counter.tsx
'use client'
import { useCounterStore } from '@/stores/counter'

export function Counter() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

**Advanced Usage with Persistence:**
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)
```

### `@reduxjs/toolkit` (Alternative)
**Description:** Official Redux toolkit for efficient Redux development.

**Purpose:**
- Simplified Redux usage
- Built-in immutability with Immer
- DevTools integration
- RTK Query for data fetching

**Installation:**
```bash
npm install @reduxjs/toolkit react-redux
```

**Usage:**
```typescript
// store/store.ts
import { configureStore, createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
  },
})

export const { increment, decrement } = counterSlice.actions

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### `jotai` (Atomic State Management)
**Description:** Primitive and flexible state management for React.

**Installation:**
```bash
npm install jotai
```

**Usage:**
```typescript
// atoms/counter.ts
import { atom } from 'jotai'

export const countAtom = atom(0)
export const doubledCountAtom = atom((get) => get(countAtom) * 2)

// components/Counter.tsx
'use client'
import { useAtom } from 'jotai'
import { countAtom, doubledCountAtom } from '@/atoms/counter'

export function Counter() {
  const [count, setCount] = useAtom(countAtom)
  const [doubled] = useAtom(doubledCountAtom)

  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

## Form Handling Packages

### `react-hook-form`
**Description:** Performant, flexible forms with easy validation.

**Purpose:**
- Minimal re-renders
- Built-in validation
- TypeScript support
- Easy integration with UI libraries

**Installation:**
```bash
npm install react-hook-form
```

**Basic Usage:**
```typescript
'use client'
import { useForm } from 'react-hook-form'

interface FormData {
  firstName: string
  lastName: string
  email: string
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        reset()
        alert('Message sent successfully!')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register('firstName', { required: 'First name is required' })}
          placeholder="First Name"
        />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>

      <div>
        <input
          {...register('lastName', { required: 'Last name is required' })}
          placeholder="Last Name"
        />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>

      <div>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address'
            }
          })}
          placeholder="Email"
          type="email"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

**Advanced Usage with Validation:**
```typescript
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be at least 18'),
})

type FormData = z.infer<typeof schema>

export function ValidatedForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <input {...field} placeholder="First Name" />
        )}
      />
      {errors.firstName && <span>{errors.firstName.message}</span>}
    </form>
  )
}
```

### `@hookform/resolvers`
**Description:** Validation resolvers for react-hook-form.

**Installation:**
```bash
npm install @hookform/resolvers
```

**Usage with Zod:**
```typescript
import { zodResolver } from '@hookform/resolvers/zod'
```

**Usage with Yup:**
```typescript
import { yupResolver } from '@hookform/resolvers/yup'
```

### `formik` (Alternative)
**Description:** Build forms without tears.

**Installation:**
```bash
npm install formik
```

**Usage:**
```typescript
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short').required('Required'),
})

export function LoginForm() {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="email" name="email" />
          <ErrorMessage name="email" component="div" />
          
          <Field type="password" name="password" />
          <ErrorMessage name="password" component="div" />
          
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  )
}
```

## Validation Packages

### `zod` (Enhanced for Forms)
**Already covered in Lab 04, enhanced usage for forms:**

```typescript
import { z } from 'zod'

// Complex form schema
const userSchema = z.object({
  profile: z.object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    bio: z.string().optional(),
  }),
  preferences: z.object({
    newsletter: z.boolean(),
    notifications: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
  }),
  contacts: z.array(
    z.object({
      type: z.enum(['email', 'phone']),
      value: z.string(),
    })
  ),
})

type UserFormData = z.infer<typeof userSchema>
```

### `yup` (Alternative Validation)
**Description:** JavaScript schema builder for value parsing and validation.

**Installation:**
```bash
npm install yup
```

**Usage:**
```typescript
import * as yup from 'yup'

const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  age: yup.number().positive().integer().min(18, 'Must be at least 18'),
})

// Validation
try {
  const validData = await userSchema.validate(formData)
} catch (error) {
  console.error('Validation error:', error.message)
}
```

## UI Interaction Packages

### `framer-motion`
**Description:** Production-ready motion library for React.

**Purpose:**
- Smooth animations and transitions
- Gesture recognition
- Layout animations
- Page transitions

**Installation:**
```bash
npm install framer-motion
```

**Usage:**
```typescript
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function AnimatedButton() {
  const [isClicked, setIsClicked] = useState(false)

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{ backgroundColor: isClicked ? '#10b981' : '#3b82f6' }}
      transition={{ duration: 0.2 }}
      onClick={() => setIsClicked(!isClicked)}
      className="px-4 py-2 text-white rounded"
    >
      {isClicked ? 'Clicked!' : 'Click me'}
    </motion.button>
  )
}

export function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white p-6 rounded-lg"
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### `react-spring` (Alternative Animation)
**Description:** Spring-physics based animation library.

**Installation:**
```bash
npm install react-spring
```

**Usage:**
```typescript
import { useSpring, animated } from 'react-spring'

export function SpringButton() {
  const [props, api] = useSpring(() => ({
    from: { scale: 1 },
  }))

  return (
    <animated.button
      style={props}
      onMouseEnter={() => api.start({ scale: 1.1 })}
      onMouseLeave={() => api.start({ scale: 1 })}
    >
      Hover me
    </animated.button>
  )
}
```

## Client-Side Storage Packages

### `js-cookie`
**Description:** Simple, lightweight JavaScript API for handling cookies.

**Installation:**
```bash
npm install js-cookie
npm install --save-dev @types/js-cookie
```

**Usage:**
```typescript
import Cookies from 'js-cookie'

// Set cookie
Cookies.set('user-preference', 'dark-mode', { expires: 7 })

// Get cookie
const preference = Cookies.get('user-preference')

// Remove cookie
Cookies.remove('user-preference')

// Usage in component
'use client'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = Cookies.get('theme') || 'light'
    setTheme(savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    Cookies.set('theme', newTheme, { expires: 365 })
  }

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  )
}
```

### `use-local-storage-state`
**Description:** React hook for localStorage with SSR support.

**Installation:**
```bash
npm install use-local-storage-state
```

**Usage:**
```typescript
'use client'
import useLocalStorageState from 'use-local-storage-state'

export function ShoppingCart() {
  const [cart, setCart] = useLocalStorageState('shopping-cart', {
    defaultValue: [],
  })

  const addItem = (item) => {
    setCart([...cart, item])
  }

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  return (
    <div>
      <p>Items in cart: {cart.length}</p>
      {/* Cart UI */}
    </div>
  )
}
```

## Event Handling and Utilities

### `use-debounce`
**Description:** Debounce hook for React.

**Installation:**
```bash
npm install use-debounce
```

**Usage:**
```typescript
'use client'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

export function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)

  // Effect to perform search with debounced term
  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

### `react-use`
**Description:** Collection of essential React hooks.

**Installation:**
```bash
npm install react-use
```

**Usage:**
```typescript
import {
  useLocalStorage,
  useSessionStorage,
  useToggle,
  useCounter,
  useInterval,
  useWindowSize,
} from 'react-use'

export function UtilityComponent() {
  const [value, setValue] = useLocalStorage('my-key', 'default')
  const [on, toggle] = useToggle(false)
  const [count, { inc, dec, reset }] = useCounter(0)
  const { width, height } = useWindowSize()

  useInterval(() => {
    inc()
  }, 1000)

  return (
    <div>
      <p>Stored value: {value}</p>
      <p>Toggle state: {on ? 'ON' : 'OFF'}</p>
      <p>Counter: {count}</p>
      <p>Window size: {width}x{height}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={reset}>Reset Counter</button>
    </div>
  )
}
```

## Development and TypeScript Enhancements

### Enhanced TypeScript Patterns

#### State Type Definitions
```typescript
// types/state.ts
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface AppState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
  isValid: boolean
}
```

#### Custom Hook Types
```typescript
// hooks/useApi.ts
interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>
}

export function useApi<T>(url: string): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const response = await fetch(url)
      const data = await response.json()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { ...state, refetch: fetchData }
}
```

## Testing Interactive Components

### `@testing-library/user-event`
**Description:** User event simulation for testing.

**Installation:**
```bash
npm install --save-dev @testing-library/user-event
```

**Usage:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

test('submits form with user input', async () => {
  const user = userEvent.setup()
  render(<ContactForm />)

  const nameInput = screen.getByPlaceholderText('Name')
  const emailInput = screen.getByPlaceholderText('Email')
  const submitButton = screen.getByRole('button', { name: /submit/i })

  await user.type(nameInput, 'John Doe')
  await user.type(emailInput, 'john@example.com')
  await user.click(submitButton)

  expect(screen.getByText('Form submitted successfully')).toBeInTheDocument()
})
```

## Performance Optimization

### `react-window` (Virtualization)
**Description:** Efficiently rendering large lists and tabular data.

**Installation:**
```bash
npm install react-window
npm install --save-dev @types/react-window
```

**Usage:**
```typescript
import { FixedSizeList as List } from 'react-window'

interface ItemProps {
  index: number
  style: React.CSSProperties
}

const Item = ({ index, style }: ItemProps) => (
  <div style={style}>Item {index}</div>
)

export function VirtualizedList({ items }: { items: any[] }) {
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Item}
    </List>
  )
}
```

## Common Patterns and Best Practices

### Custom Hooks for State Logic
```typescript
// hooks/useForm.ts
export function useForm<T>(initialState: T) {
  const [state, setState] = useState(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const updateField = (field: keyof T, value: any) => {
    setState(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateField = (field: keyof T, validator: (value: any) => string | undefined) => {
    const error = validator(state[field])
    setErrors(prev => ({ ...prev, [field]: error }))
    return !error
  }

  const reset = () => {
    setState(initialState)
    setErrors({})
  }

  return {
    state,
    errors,
    updateField,
    validateField,
    reset,
    isValid: Object.values(errors).every(error => !error),
  }
}
```

### Error Boundary for Interactive Components
```typescript
'use client'
import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class InteractiveErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Interactive component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-300 rounded bg-red-50">
          <h3 className="text-red-800">Something went wrong</h3>
          <p className="text-red-600">Please try refreshing the page.</p>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Common Issues and Solutions

### State Management Anti-patterns
```typescript
// ❌ Avoid: Mutating state directly
const [items, setItems] = useState([])
items.push(newItem) // Don't do this

// ✅ Correct: Use state updater
setItems(prev => [...prev, newItem])

// ❌ Avoid: Complex state in useState
const [complexState, setComplexState] = useState({
  user: null,
  posts: [],
  loading: false,
  error: null,
})

// ✅ Better: Use multiple state variables or useReducer
const [user, setUser] = useState(null)
const [posts, setPosts] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
```

### Form Validation Best Practices
```typescript
// ✅ Client and server-side validation
const validateForm = (data: FormData) => {
  const errors: Partial<Record<keyof FormData, string>> = {}
  
  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format'
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}

// Server-side validation in API route
export async function POST(request: Request) {
  const data = await request.json()
  const { isValid, errors } = validateForm(data)
  
  if (!isValid) {
    return Response.json({ errors }, { status: 400 })
  }
  
  // Process valid data
}
```