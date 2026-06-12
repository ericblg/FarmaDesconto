---
name: react-best-practices
description: React 19 and Hooks best practices, component structure, state management.
---

# React Best Practices

## 1. Principles
- **Functional Components**: Use functional components with Hooks exclusively. No class components.
- **Component State**: Keep state as local as possible. Use `useState` and `useReducer` for complex state.
- **Side Effects**: Manage side effects correctly with `useEffect`. Always specify the dependency array.

## 2. Component Structure
- Split UI into small, reusable components.
- Use a `components/` directory for shared components, and `pages/` or `views/` for route-level components.
- Export components as default from their respective files if they are the primary export, or use named exports for utility components.

## 3. Performance
- Use `React.memo` for components that render frequently with the same props.
- Use `useMemo` for expensive calculations.
- Use `useCallback` for functions passed as props to child components.
