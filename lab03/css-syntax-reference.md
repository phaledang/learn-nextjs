# CSS Syntax Reference

## Table of Contents
1. [CSS Basics](#css-basics)
2. [Selectors](#selectors)
3. [Box Model](#box-model)
4. [Positioning](#positioning)
5. [Flexbox](#flexbox)
6. [Grid](#grid)
7. [Responsive Design](#responsive-design)
8. [Animations](#animations)

---

## CSS Basics

### Inline Styles

```html
<div style="color: blue; font-size: 16px;">Text</div>
```

### Internal Styles

```html
<style>
  .my-class {
    color: blue;
    font-size: 16px;
  }
</style>
```

### External Stylesheet

```css
/* styles.css */
.my-class {
  color: blue;
  font-size: 16px;
}
```

### CSS Variables

```css
:root {
  --primary-color: #0070f3;
  --spacing: 1rem;
}

.element {
  color: var(--primary-color);
  padding: var(--spacing);
}
```

---

## Selectors

### Basic Selectors

```css
/* Element selector */
p { color: blue; }

/* Class selector */
.my-class { color: blue; }

/* ID selector */
#my-id { color: blue; }

/* Universal selector */
* { margin: 0; }
```

### Combinators

```css
/* Descendant selector */
div p { color: blue; }

/* Child selector */
div > p { color: blue; }

/* Adjacent sibling */
div + p { color: blue; }

/* General sibling */
div ~ p { color: blue; }
```

### Pseudo-classes

```css
a:hover { color: red; }
a:active { color: green; }
a:visited { color: purple; }
input:focus { border-color: blue; }
li:first-child { font-weight: bold; }
li:last-child { font-weight: bold; }
li:nth-child(2) { color: blue; }
```

---

## Box Model

```css
.box {
  /* Content */
  width: 200px;
  height: 100px;
  
  /* Padding (inside border) */
  padding: 10px;
  padding-top: 10px;
  padding-right: 15px;
  padding-bottom: 10px;
  padding-left: 15px;
  
  /* Border */
  border: 1px solid black;
  border-width: 1px;
  border-style: solid;
  border-color: black;
  border-radius: 8px;
  
  /* Margin (outside border) */
  margin: 20px;
  margin: 10px 20px; /* vertical horizontal */
  margin: 10px 20px 30px 40px; /* top right bottom left */
}

/* Box sizing */
* {
  box-sizing: border-box; /* Include padding/border in width */
}
```

---

## Positioning

```css
/* Static (default) */
.static { position: static; }

/* Relative - relative to normal position */
.relative {
  position: relative;
  top: 10px;
  left: 20px;
}

/* Absolute - relative to nearest positioned ancestor */
.absolute {
  position: absolute;
  top: 0;
  right: 0;
}

/* Fixed - relative to viewport */
.fixed {
  position: fixed;
  bottom: 0;
  right: 0;
}

/* Sticky - toggles between relative and fixed */
.sticky {
  position: sticky;
  top: 0;
}
```

---

## Flexbox

```css
.container {
  display: flex;
  
  /* Direction */
  flex-direction: row; /* row | row-reverse | column | column-reverse */
  
  /* Wrapping */
  flex-wrap: wrap; /* nowrap | wrap | wrap-reverse */
  
  /* Justify content (main axis) */
  justify-content: flex-start; /* flex-start | flex-end | center | space-between | space-around | space-evenly */
  
  /* Align items (cross axis) */
  align-items: stretch; /* stretch | flex-start | flex-end | center | baseline */
  
  /* Gap */
  gap: 1rem;
  column-gap: 1rem;
  row-gap: 1rem;
}

.item {
  /* Grow */
  flex-grow: 1;
  
  /* Shrink */
  flex-shrink: 1;
  
  /* Basis */
  flex-basis: 200px;
  
  /* Shorthand */
  flex: 1 1 200px; /* grow shrink basis */
  
  /* Self alignment */
  align-self: center;
}
```

---

## Grid

```css
.grid-container {
  display: grid;
  
  /* Columns */
  grid-template-columns: 200px 200px 200px;
  grid-template-columns: 1fr 1fr 1fr; /* Fractional units */
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  
  /* Rows */
  grid-template-rows: 100px auto 100px;
  
  /* Gap */
  gap: 1rem;
  column-gap: 1rem;
  row-gap: 1rem;
  
  /* Alignment */
  justify-items: start; /* start | end | center | stretch */
  align-items: start; /* start | end | center | stretch */
}

.grid-item {
  /* Column span */
  grid-column: 1 / 3; /* From line 1 to line 3 */
  grid-column: span 2; /* Span 2 columns */
  
  /* Row span */
  grid-row: 1 / 3;
  grid-row: span 2;
  
  /* Self alignment */
  justify-self: center;
  align-self: center;
}
```

---

## Responsive Design

### Media Queries

```css
/* Mobile first approach */
.element {
  width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .element {
    width: 33.33%;
  }
}

/* Common breakpoints */
/* 
  Mobile: < 640px
  Tablet: 640px - 1024px
  Desktop: > 1024px
*/
```

---

## Animations

### Transitions

```css
.element {
  transition: property duration timing-function delay;
  transition: all 0.3s ease-in-out;
  transition: background-color 0.3s ease;
}

.button {
  background-color: blue;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: darkblue;
}
```

### Keyframe Animations

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.element {
  animation: fadeIn 1s ease-in-out;
}

/* Animation properties */
.animated {
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-delay: 0s;
  animation-iteration-count: 1; /* or infinite */
  animation-direction: normal; /* normal | reverse | alternate */
}
```

---

This reference covers fundamental CSS concepts. For Tailwind-specific utilities, see TailwindCSS-syntax-reference.md.
