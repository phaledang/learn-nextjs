# Contributing to Next.js Training Labs

Thank you for your interest in contributing to the Next.js Training Labs! This document provides guidelines for contributions.

## How to Contribute

### Reporting Issues

If you find errors or issues in the training materials:

1. Check if the issue already exists
2. Create a new issue with:
   - Clear title
   - Lab number and step
   - Description of the problem
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Improvements

We welcome suggestions for:
- Additional examples
- Clarifications in instructions
- New lab topics
- Better explanations
- Code improvements

### Submitting Changes

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/learn-nextjs.git
   cd learn-nextjs
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/improve-lab03
   ```

3. **Make your changes**
   - Follow the existing structure
   - Test all code examples
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Improve Lab 03: Add more Tailwind examples"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/improve-lab03
   ```

## Lab Structure Guidelines

Each lab should maintain this structure:

```
labXX/
├── readme.md              # Overview, objectives, key concepts
├── steps-by-steps.md      # Detailed implementation guide
├── starter/
│   └── README.md         # Quick start instructions
├── finish/               # Complete working example
└── *-syntax-reference.md # Technology-specific syntax guide
```

## Content Guidelines

### Writing Style

- **Be clear and concise**
- Use bullet points and numbered lists
- Include code examples
- Add comments to explain complex code
- Use consistent terminology

### Code Standards

- Use TypeScript where applicable
- Follow Next.js best practices
- Include error handling
- Add helpful comments
- Test all code examples

### Documentation

- Start with clear objectives
- Explain the "why" not just the "how"
- Include screenshots for UI changes
- Add troubleshooting tips
- Link to official documentation

## Lab Content Guidelines

### readme.md Should Include:
- Clear objectives
- Prerequisites
- Key concepts explained
- Estimated time
- Learning outcomes

### steps-by-steps.md Should Include:
- Step-by-step instructions
- Code examples with explanations
- Test/verification steps
- Common pitfalls
- Congratulations message

### Syntax Reference Should Include:
- Organized by topic
- Clear examples
- Common patterns
- Best practices
- Quick tips

## Testing Your Changes

Before submitting:

1. **Test all code examples**
   ```bash
   npm run dev
   npm run build
   npm run lint
   ```

2. **Check markdown formatting**
   - Use a markdown previewer
   - Check all links work
   - Verify code blocks have language tags

3. **Verify completeness**
   - All steps can be followed
   - Code examples are complete
   - No broken references

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
Good:
✅ "Add authentication example to Lab 05"
✅ "Fix typo in Lab 03 steps-by-steps.md"
✅ "Improve Tailwind syntax reference with more examples"

Bad:
❌ "Update files"
❌ "Fix stuff"
❌ "Changes"
```

## Code of Conduct

- Be respectful and constructive
- Help others learn
- Give credit where due
- Focus on education quality
- Welcome beginners

## Questions?

- Open an issue for questions
- Discuss in pull request comments
- Be patient - maintainers are volunteers

## Recognition

Contributors will be:
- Listed in the CONTRIBUTORS.md file
- Mentioned in release notes
- Appreciated by the community!

---

Thank you for helping make this training better! 🙏

Every contribution, no matter how small, makes a difference.
