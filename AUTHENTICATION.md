# Authentication System

This document describes the authentication system implemented for the kiosk application.

## Overview

The authentication system provides secure login/logout functionality with role-based access control. It uses server-side session management with HTTP-only cookies for security.

## Features

- **Secure Login**: Email/password authentication with server-side validation
- **Session Management**: HTTP-only cookies for secure session storage
- **Role-Based Access**: Support for admin, staff, and visitor roles
- **Automatic Redirect**: Middleware automatically redirects unauthenticated users
- **Persistent Sessions**: Sessions persist across browser restarts

## API Endpoints

### POST /api/auth/login

Authenticates a user with email and password.

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "password"
}
```

**Response:**

```json
{
	"success": true,
	"user": {
		"id": "1",
		"email": "user@example.com",
		"name": "User Name",
		"role": "admin"
	}
}
```

### POST /api/auth/logout

Logs out the current user and clears the session.

**Response:**

```json
{
	"success": true,
	"message": "Logged out successfully"
}
```

### GET /api/auth/me

Returns the current user's information if authenticated.

**Response:**

```json
{
	"success": true,
	"user": {
		"id": "1",
		"email": "user@example.com",
		"name": "User Name",
		"role": "admin"
	}
}
```

## Test Credentials

For testing purposes, the following credentials are available:

- **Admin User**: admin@kiosk.com / password
- **Staff User**: staff@kiosk.com / password
- **Visitor User**: visitor@kiosk.com / password

## Components

### useAuth Composable

Located at `app/composables/useAuth.ts`, this composable provides:

- `login(credentials)`: Authenticates a user
- `logout()`: Logs out the current user
- `checkAuth()`: Checks current authentication status

### Auth Store

Located at `app/stores/auth.ts`, manages authentication state:

- `logged`: Boolean indicating if user is logged in
- `role`: Current user's role
- `user`: Current user's information
- `isRoleGranted(roles)`: Checks if user has required roles

## Middleware

The global authentication middleware (`app/middleware/auth.global.ts`) automatically:

- Redirects unauthenticated users to `/login` for protected routes
- Redirects authenticated users away from login pages
- Enforces role-based access control

## Route Protection

Pages can be protected by adding metadata:

```typescript
definePageMeta({
	auth: true, // Requires authentication
	roles: ["admin"] // Requires specific roles
})
```

## Security Features

- **HTTP-Only Cookies**: Session tokens are stored in HTTP-only cookies
- **Server-Side Validation**: All authentication logic runs on the server
- **Secure Headers**: Cookies use secure flags in production
- **Session Expiration**: Sessions expire after 7 days

## Usage Examples

### Login Form

```vue
<template>
	<n-form @submit="handleLogin">
		<n-form-item label="Email">
			<n-input v-model="email" type="email" />
		</n-form-item>
		<n-form-item label="Password">
			<n-input v-model="password" type="password" />
		</n-form-item>
		<n-button type="submit">Login</n-button>
	</n-form>
</template>

<script setup>
const { login } = useAuth()

async function handleLogin() {
	const success = await login({ email, password })
	if (success) {
		// Redirect to dashboard
	}
}
</script>
```

### Protected Component

```vue
<template>
	<div v-if="authStore.isLogged">
		Welcome, {{ authStore.user.name }}!
		<n-button @click="handleLogout">Logout</n-button>
	</div>
</template>

<script setup>
const authStore = useAuthStore()
const { logout } = useAuth()

async function handleLogout() {
	await logout()
	// User will be redirected to login
}
</script>
```

## Demo Page

Visit `/demo` to see a demonstration of the authentication system in action. This page shows:

- Current user information
- Login/logout functionality
- Test credentials
- Authentication state

## Future Enhancements

- JWT token support for stateless authentication
- Password hashing with bcrypt
- Two-factor authentication
- Password reset functionality
- Account registration
- Social login integration
