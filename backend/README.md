# Laravel Backend for React Authentication

## Overview

This directory contains a Laravel backend API for the React authentication system. The backend provides RESTful API endpoints for user authentication, registration, and profile management using Laravel Sanctum for token-based authentication.

## Setup Instructions

1. **Install Laravel and dependencies**

   ```bash
   cd backend
   composer install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure your database in the .env file**

   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_username
   DB_PASSWORD=your_database_password
   ```

4. **Run migrations**

   ```bash
   php artisan migrate
   ```

5. **Configure mail settings in .env for email verification**

   ```
   MAIL_MAILER=smtp
   MAIL_HOST=your_mail_host
   MAIL_PORT=your_mail_port
   MAIL_USERNAME=your_mail_username
   MAIL_PASSWORD=your_mail_password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=no-reply@example.com
   MAIL_FROM_NAME="${APP_NAME}"
   ```

6. **Configure frontend URL for CORS**

   ```
   FRONTEND_URL=http://localhost:5173
   SANCTUM_STATEFUL_DOMAINS=localhost:5173
   ```

7. **Start the Laravel development server**

   ```bash
   php artisan serve
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user and get authentication token
- `POST /api/auth/logout` - Logout the current user (requires authentication)
- `GET /api/auth/user` - Get the current authenticated user (requires authentication)
- `GET /api/auth/email/verify/{id}/{hash}` - Verify a user's email address
- `POST /api/auth/email/verification-notification` - Resend verification email (requires authentication)
- `POST /api/auth/password/email` - Send password reset email
- `POST /api/auth/password/reset` - Reset password with token

### User Profile

- `GET /api/user/profile` - Get the current user's profile (requires authentication)
- `PUT /api/user/profile` - Update the current user's profile (requires authentication)
- `PUT /api/user/password` - Update the current user's password (requires authentication)

## Directory Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginController.php
│   │   │   │   ├── RegisterController.php
│   │   │   │   ├── LogoutController.php
│   │   │   │   ├── VerificationController.php
│   │   │   │   ├── ForgotPasswordController.php
│   │   │   │   └── ResetPasswordController.php
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
├── config/
│   ├── sanctum.php
│   └── cors.php
├── database/
│   └── migrations/
│       ├── 2014_10_12_000000_create_users_table.php
│       └── 2023_01_01_000000_add_username_and_avatar_to_users_table.php
└── routes/
    └── api.php
```

## Security Features

1. **Token-based Authentication** - Using Laravel Sanctum for secure API authentication
2. **Email Verification** - Users must verify their email before they can log in
3. **Password Reset** - Secure password reset functionality
4. **CSRF Protection** - Laravel's built-in CSRF protection
5. **Input Validation** - All inputs are validated using Laravel's validation system
6. **Rate Limiting** - Email verification endpoints are rate-limited to prevent abuse

## Integration with React Frontend

The React frontend should be configured to communicate with this Laravel backend API. Make sure to set the environment variable `VITE_API_URL` in your React app to point to this Laravel backend:

```
VITE_API_URL=http://localhost:8000/api
```

This will ensure that all API requests from the frontend are directed to the correct backend endpoints.
