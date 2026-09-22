# Backend API Reference

## Authentication

### Register tenant
- Method: POST
- Route: `/api/auth/register`
- Body:
  ```json
  {
    "name": "Acme Business",
    "email": "hello@acme.com"
  }
  ```
- Purpose: start tenant registration and send a company email verification OTP

### Verify tenant email
- Method: POST
- Route: `/api/auth/verify-email`
- Body:
  ```json
  {
    "email": "hello@acme.com",
    "otp": "123456"
  }
  ```

### Verify admin email
- Method: POST
- Route: `/api/auth/verify-admin-email`
- Body:
  ```json
  {
    "companyEmail": "hello@acme.com",
    "email": "admin@acme.com",
    "otp": "123456"
  }
  ```

### Login
- Method: POST
- Route: `/api/auth/login`
- Body:
  ```json
  {
    "email": "admin@acme.com",
    "password": "StrongPassword123"
  }
  ```

### Refresh token
- Method: POST
- Route: `/api/auth/refresh-token`
- Body:
  ```json
  {
    "refreshToken": "..."
  }
  ```

### Logout
- Method: POST
- Route: `/api/auth/logout`
- Auth: required

### Forgot password
- Method: POST
- Route: `/api/auth/forgot-password`
- Body:
  ```json
  {
    "email": "admin@acme.com"
  }
  ```

### Verify reset OTP
- Method: POST
- Route: `/api/auth/verify-reset-otp`
- Body:
  ```json
  {
    "email": "admin@acme.com",
    "otp": "123456"
  }
  ```

### Reset password
- Method: POST
- Route: `/api/auth/reset-password`
- Body:
  ```json
  {
    "email": "admin@acme.com",
    "otp": "123456",
    "newPassword": "NewPass123",
    "confirmPassword": "NewPass123"
  }
  ```

### Resend OTP
- Method: POST
- Route: `/api/auth/resend-otp`
- Body:
  ```json
  {
    "email": "hello@acme.com",
    "purpose": "company_email_verification"
  }
  ```

## Users

### Create employee
- Method: POST
- Route: `/api/users`
- Auth: required
- Admin required
- Body:
  ```json
  {
    "firstName": "Amit",
    "lastName": "Chandure",
    "email": "employee@acme.com",
    "password": "StrongPassword123",
    "confirmPassword": "StrongPassword123"
  }
  ```

### List users
- Method: GET
- Route: `/api/users`
- Auth: required
- Scope: current tenant only

### Get user by ID
- Method: GET
- Route: `/api/users/:id`
- Auth: required
- Scope: current tenant only

### Update user
- Method: PATCH
- Route: `/api/users/:id`
- Auth: required
- Admin required

### Deactivate user
- Method: DELETE
- Route: `/api/users/:id`
- Auth: required
- Admin required

## Tenant endpoints

### Current tenant
- Method: GET
- Route: `/api/tenants/me`
- Auth: required

## Security conventions
- OTPs are purpose-specific
- Email addresses are normalized to lowercase
- Password hashes are created before storage
- Refresh tokens are hashed and rotated
- Access tokens are short-lived
- Admin routes require the `admin` role
- Tenant IDs are fetched from the authenticated user context rather than request body

## Swagger
The application also exposes Swagger docs at `/api-docs` when the app is running.
