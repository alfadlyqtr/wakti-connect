
# Domain-Driven Design Structure

This directory organizes the codebase by domain/feature rather than by technical type.

## Benefits

- **Cohesion**: Related code is kept together
- **Decoupling**: Features are self-contained and have clear boundaries
- **Discoverability**: Easier to find code related to a specific feature
- **Maintainability**: Easier to understand, test, and change a feature in isolation

## Structure

Each feature folder follows this structure:

```
feature-name/
  ├── components/       # UI components specific to this feature
  ├── hooks/            # Custom hooks specific to this feature
  ├── types/            # TypeScript types and interfaces
  ├── utils/            # Utility functions
  ├── store/            # State management (if applicable)
  ├── api/              # API calls specific to this feature
  └── index.ts          # Barrel export file for public API
```

## Usage Guidelines

1. Import from feature barrels whenever possible:
   ```typescript
   // Good
   import { useAuth, ProtectedRoute } from '@/features/auth';
   
   // Avoid
   import useAuth from '@/features/auth/hooks/useAuth';
   import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
   ```

2. Keep features focused and cohesive
3. Use shared UI components for truly reusable elements
4. Avoid cross-feature dependencies when possible

## Migration Strategy

This structure is being adopted incrementally. Some components may still be located
in the legacy structure while migration is in progress.
