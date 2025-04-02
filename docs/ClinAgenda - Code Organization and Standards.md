# ClinAgenda - Code Organization and Standards

## Introduction

This document outlines the code organization, architecture, and best practices for the ClinAgenda project. Following these guidelines will ensure consistency across the codebase and improve maintainability as the project grows.

## Project Overview

ClinAgenda is a Vue 3 application built with TypeScript and Vuetify, designed for healthcare appointment management. The project uses Pinia for state management and follows a component-based architecture.

## Tech Stack

- **Vue 3**: Core framework using Composition API
- **TypeScript**: For type safety and better developer experience
- **Vuetify 3**: UI component library
- **Pinia**: State management
- **Vue Router**: Routing
- **Axios**: HTTP client
- **date-fns**: Date manipulation
- **Maska**: Input masking

## Directory Structure

```
src/
├── assets/            # Static assets (images, fonts, etc.)
├── components/        # Reusable Vue components
│   ├── common/        # Common UI components
│   ├── layout/        # Layout components
│   └── domain/        # Domain-specific components
├── engine/            # Core functionality
│   ├── httpClient.ts  # Axios configuration
│   ├── mock.ts        # Mock server configuration
│   └── vuetify.ts     # Vuetify configuration
├── pages/             # Page components organized by feature
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   └── appointments/  # Appointment management pages
├── router/            # Vue Router configuration
│   ├── index.ts       # Router setup
│   └── routes.ts      # Route definitions
├── stores/            # Pinia stores
│   ├── index.ts       # Store registration
│   ├── auth.ts        # Authentication store
│   └── toast.ts       # Toast notification store
├── styles/            # Global styles
│   └── settings.scss  # SCSS variables and mixins
├── template/          # Layout templates
│   ├── DefaultTemplate.vue  # Main application template
│   └── index.ts       # Template exports
├── types/             # TypeScript type definitions
│   ├── models.ts      # Domain models
│   └── api.ts         # API interfaces
└── utils/             # Utility functions
    ├── dateFormat.ts  # Date formatting utilities
    ├── mask.ts        # Input masking utilities
    └── string.ts      # String manipulation utilities
```

## Component Design Principles

1. **Single Responsibility**: Each component should focus on a single responsibility
2. **Reusability**: Components should be designed for reuse when appropriate
3. **Composition**: Use composition over inheritance
4. **Naming**: Use clear, descriptive names that indicate the component's purpose

## Component Structure

```vue
<template>
  <!-- Template markup -->
</template>

<script setup lang="ts">
// Imports
import { ref, computed, onMounted } from 'vue'
import type { ComponentProps } from '@/types/models'

// Props definition
const props = defineProps<{
  propName: PropType
}>()

// Emits definition
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'customEvent', data: any): void
}>()

// State and logic
const localState = ref<string>('')

// Computed properties
const computedValue = computed(() => {
  return someTransformation(localState.value)
})

// Methods
function handleAction() {
  // Implementation
  emit('customEvent', { data: localState.value })
}

// Lifecycle hooks
onMounted(() => {
  // Initialization logic
})
</script>

<style scoped lang="scss">
/* Component-specific styles */
</style>
```

## Naming Conventions

1. **Components**: PascalCase (e.g., `UserProfile.vue`)
2. **Files**:
   - Vue components: PascalCase (e.g., `UserProfile.vue`)
   - TypeScript files: camelCase (e.g., `httpClient.ts`)
3. **CSS Classes**: kebab-case (e.g., `user-profile-container`)
4. **Types and Interfaces**: PascalCase with descriptive names (e.g., `UserProfile`, `AppointmentDetails`)
5. **Component Prefixes**:
   - `Clin` prefix for custom components (e.g., `ClinDatePicker`)
   - Add appropriate prefixes for different component categories

## Vuetify Usage Guidelines

1. **Default Styles**: Use Vuetify's built-in styling when possible
2. **Custom Styling**: For custom styling, use the `theme` configuration in `vuetify.ts`
3. **Consistent Components**: Use the component defaults defined in `vuetify.ts`
4. **Responsive Design**: Leverage Vuetify's responsive utilities (`xs`, `sm`, `md`, `lg`, `xl`) for layouts

## State Management with Pinia

1. **Store Organization**: Create stores around features or domains
2. **Type Safety**: Use TypeScript for type-safe store definitions
3. **Composable Stores**: Use composition to share functionality between stores
4. **Actions vs. Getters**:
   - Actions for async operations and side effects
   - Getters for derived state

```typescript
// Example Pinia store
import { defineStore } from 'pinia'
import type { User } from '@/types/models'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userFullName: (state) => (state.user ? `${state.user.firstName} ${state.user.lastName}` : '')
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      this.loading = true
      try {
        // Implementation
      } catch (error) {
        // Error handling
      } finally {
        this.loading = false
      }
    }
  }
})
```

## API Communication

1. **HTTP Client**: Use the centralized `httpClient.ts` for all API requests
2. **Error Handling**: Implement consistent error handling
3. **Response Typing**: Define TypeScript interfaces for API responses
4. **Request Organization**: Group related API calls in service modules

## Form Handling

1. **Validation**: Use Vuetify's built-in validation or a dedicated form validation library
2. **Input Masking**: Use Maska for input formatting (defined in `mask.ts`)
3. **Form Submission**: Handle form submission with proper loading states and error handling
4. **Two-way Binding**: Use `v-model` with appropriate `.sync` modifiers for form inputs

## Error Handling

1. **User Feedback**: Display user-friendly error messages
2. **Logging**: Log detailed errors for debugging
3. **Graceful Degradation**: Handle errors gracefully to prevent application crashes
4. **Error Boundaries**: Implement error boundaries for critical components

## Responsive Design

1. **Mobile-First**: Design for mobile first, then enhance for larger screens
2. **Breakpoints**: Use Vuetify's responsive breakpoints
3. **Flexible Layouts**: Use Vuetify's grid system for responsive layouts
4. **Testing**: Test on various device sizes and orientations

## Performance Considerations

1. **Lazy Loading**: Use Vue Router's lazy loading for routes
2. **Component Optimization**: Keep components small and focused
3. **Computed Properties**: Use computed properties for derived values
4. **Debouncing and Throttling**: Implement for frequently triggered events
5. **Pagination**: Implement pagination for large data sets

## Authentication and Authorization

1. **Token Storage**: Store authentication tokens securely
2. **Route Guards**: Implement Vue Router navigation guards for protected routes
3. **Permission Checking**: Check permissions before rendering sensitive UI elements
4. **Token Refresh**: Implement token refresh mechanism

## Testing Strategy

1. **Unit Tests**: Test individual components and utilities
2. **Component Tests**: Test component behavior and interactions
3. **Store Tests**: Test Pinia store logic
4. **E2E Tests**: Test critical user flows

## Documentation

1. **Component Documentation**: Document component props, events, and usage
2. **API Documentation**: Document API endpoints and data structures
3. **Code Comments**: Add comments for complex logic
4. **TypeScript Types**: Use detailed TypeScript types as self-documentation

## Git Workflow

1. **Branch Naming**: Use feature/bugfix/hotfix prefixes
2. **Commit Messages**: Write clear, descriptive commit messages
3. **Pull Requests**: Use pull requests for code review
4. **Code Review**: Conduct thorough code reviews

## Conclusion

Following these guidelines will help maintain consistency and quality throughout the ClinAgenda project. This document should evolve as the project grows and new patterns emerge.
