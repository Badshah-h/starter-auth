# Laravel Backend API Integration

## Overview

This directory contains service files that interface with the Laravel backend API. The frontend communicates with the backend exclusively through these service files, which handle all API requests and responses.

## API Endpoints

The Laravel backend should implement the following API endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user and get authentication token
- `POST /api/auth/logout` - Logout the current user
- `GET /api/auth/user` - Get the current authenticated user
- `POST /api/auth/email/verify/{id}` - Verify a user's email address
- `POST /api/auth/password/email` - Send password reset email
- `POST /api/auth/password/reset` - Reset password with token

### User Profile

- `GET /api/user/profile` - Get the current user's profile
- `PUT /api/user/profile` - Update the current user's profile
- `PUT /api/user/password` - Update the current user's password

## Laravel Backend Implementation

The Laravel backend should be implemented with the following features:

1. **Laravel Sanctum** for API authentication
2. **Middleware** for protecting routes
3. **Form Requests** for validation
4. **Resource Controllers** for handling API requests
5. **API Resources** for formatting responses

### Example Laravel Directory Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginController.php
│   │   │   │   ├── RegisterController.php
│   │   │   │   ├── ForgotPasswordController.php
│   │   │   │   ├── ResetPasswordController.php
│   │   │   │   └── VerificationController.php
│   │   │   └── UserController.php
│   │   ├── Middleware/
│   │   │   └── EnsureEmailIsVerified.php
│   │   └── Requests/
│   │       ├── Auth/
│   │       │   ├── LoginRequest.php
│   │       │   └── RegisterRequest.php
│   │       └── User/
│   │           ├── UpdateProfileRequest.php
│   │           └── UpdatePasswordRequest.php
│   ├── Models/
│   │   └── User.php
│   └── Providers/
│       └── AuthServiceProvider.php
├── routes/
│   └── api.php
└── config/
    ├── auth.php
    └── sanctum.php
```

## Security Considerations

1. **CSRF Protection** - Laravel Sanctum handles CSRF protection for you
2. **Rate Limiting** - Implement rate limiting on authentication endpoints
3. **Input Validation** - Use Form Requests for validation
4. **Token Management** - Properly handle token storage and expiration
5. **Error Handling** - Provide clear error messages without exposing sensitive information
