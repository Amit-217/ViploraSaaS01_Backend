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
- Purpose: start company registration and send a company email verification OTP

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

### Send admin email verification
- Method: POST
- Route: `/api/auth/send-admin-email-verification`
- Body:
  ```json
  {
    "email": "admin@acme.com",
    "companyEmail": "hello@acme.com"
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

### Register admin
- Method: POST
- Route: `/api/auth/register-admin`
- Body:
  ```json
  {
    "companyEmail": "hello@acme.com",
    "email": "admin@acme.com",
    "firstName": "Amit",
    "lastName": "Chandure",
    "password": "StrongPassword123",
    "confirmPassword": "StrongPassword123",
    "otp": "123456"
  }
  ```

### Finalize registration
- Method: POST
- Route: `/api/auth/finalize-registration`
- Body:
  ```json
  {
    "companyEmail": "hello@acme.com",
    "email": "admin@acme.com",
    "firstName": "Amit",
    "lastName": "Chandure",
    "password": "StrongPassword123",
    "confirmPassword": "StrongPassword123",
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

### Create tenant record
- Method: POST
- Route: `/api/tenants`
- Body:
  ```json
  {
    "name": "Acme Business",
    "email": "hello@acme.com"
  }
  ```

## Raw material endpoints

### List raw material categories
- Method: GET
- Route: `/api/v1/raw-material-categories`
- Auth: required

### Create raw material category
- Method: POST
- Route: `/api/v1/raw-material-categories`
- Auth: required
- Body:
  ```json
  {
    "name": "Chemicals"
  }
  ```

### Get raw material category by ID
- Method: GET
- Route: `/api/v1/raw-material-categories/:id`
- Auth: required

### Update raw material category
- Method: PATCH
- Route: `/api/v1/raw-material-categories/:id`
- Auth: required

### Delete raw material category
- Method: DELETE
- Route: `/api/v1/raw-material-categories/:id`
- Auth: required

### List raw materials
- Method: GET
- Route: `/api/v1/raw-materials`
- Auth: required

### Create raw material
- Method: POST
- Route: `/api/v1/raw-materials`
- Auth: required
- Body:
  ```json
  {
    "code": "RM-001",
    "name": "Cotton Fiber",
    "categoryId": "66c2f2e2d9d87f1a12345678",
    "unit": "kg",
    "minimumStock": 50
  }
  ```

### Get raw material by ID
- Method: GET
- Route: `/api/v1/raw-materials/:id`
- Auth: required

### Update raw material
- Method: PATCH
- Route: `/api/v1/raw-materials/:id`
- Auth: required

### Delete raw material
- Method: DELETE
- Route: `/api/v1/raw-materials/:id`
- Auth: required

### List vendors
- Method: GET
- Route: `/api/v1/vendors`
- Auth: required

### Create vendor
- Method: POST
- Route: `/api/v1/vendors`
- Auth: required
- Body:
  ```json
  {
    "name": "Apex Supply",
    "phone": "+91 9876543210",
    "email": "vendor@apex.com",
    "address": "Delhi, India",
    "gstin": "29ABCDE1234F1Z5"
  }
  ```

### Get vendor by ID
- Method: GET
- Route: `/api/v1/vendors/:id`
- Auth: required

### Update vendor
- Method: PATCH
- Route: `/api/v1/vendors/:id`
- Auth: required

### Delete vendor
- Method: DELETE
- Route: `/api/v1/vendors/:id`
- Auth: required

### List material transactions
- Method: GET
- Route: `/api/v1/material-transactions`
- Auth: required

### Create material transaction
- Method: POST
- Route: `/api/v1/material-transactions`
- Auth: required
- Body:
  ```json
  {
    "rawMaterialId": "66c2f2e2d9d87f1a12345678",
    "type": "IN",
    "direction": "IN",
    "quantity": 25,
    "rate": 120,
    "vendorId": "66c2f2e2d9d87f1a12345679",
    "referenceType": "PURCHASE",
    "reason": "Monthly purchase",
    "notes": "Arrival from vendor"
  }
  ```

### Get material transaction by ID
- Method: GET
- Route: `/api/v1/material-transactions/:id`
- Auth: required

### Delete material transaction
- Method: DELETE
- Route: `/api/v1/material-transactions/:id`
- Auth: required

## Security conventions
- OTPs are purpose-specific
- Email addresses are normalized to lowercase
- Password hashes are created before storage
- Refresh tokens are hashed and rotated
- Access tokens are short-lived
- Admin routes require the `admin` role
- Tenant IDs are fetched from the authenticated user context rather than request body
- Raw material stock changes must be performed only through material transaction APIs to keep inventory history reliable

## Swagger
The application also exposes Swagger docs at `/api-docs` when the app is running.
