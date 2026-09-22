# Viplora SaaS Backend

## Overview
This backend is the tenant-first SaaS foundation for Viplora. The current V1 scope includes tenant setup, tenant user management, email verification, login, JWT access/refresh tokens, admin authorization, password reset, and tenant isolation.

## Architecture

### Core folders
- `src/app.js` - Express app bootstrap and route mounting
- `src/server.js` - server entrypoint and database initialization
- `src/config/` - environment and external service configuration
- `src/common/` - reusable utilities, middleware, and shared models
- `src/modules/tenant/` - tenant-specific auth, tenant, and users modules

### Security model
- Platform and tenant domains are separated by module structure
- Tenant users are stored under the tenant users module only
- Admin and employee roles are limited to `admin` and `employee`
- JWT access tokens are short-lived and stored in the Authorization header as Bearer token
- Refresh tokens are rotated and stored as hashed values on the user record
- OTPs are purpose-specific and cleared after successful verification

## Validation
Validation is implemented using Zod instead of Joi.

The validation files are:
- `src/modules/tenant/auth/auth.validation.js`
- `src/modules/tenant/users/user.validation.js`
- `src/modules/tenant/tenant/tenant.validation.js`

Each schema validates request payloads before they reach the controller.

## Auth flow
### Tenant registration
1. POST `/api/auth/register`
2. Company email is validated and normalized
3. A secure OTP is created for company email verification
4. The OTP is emailed to the company email
5. POST `/api/auth/verify-email` confirms the OTP

### Admin creation
1. Company email is verified
2. Admin email verification may be triggered if the admin email differs from the company email
3. Final admin account creation is completed with password and confirmPassword checks

### Login
- POST `/api/auth/login`
- Shared user login endpoint for both admin and employee
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days

### Password reset
- POST `/api/auth/forgot-password`
- POST `/api/auth/verify-reset-otp`
- POST `/api/auth/reset-password`

## User management
- Admin-only employee creation: POST `/api/users`
- Tenant-scoped listing: GET `/api/users`
- Tenant-scoped user lookup: GET `/api/users/:id`
- Admin-only updates and deactivation: PATCH/DELETE on user resource

## Tenant isolation
Requests are expected to use the authenticated user context instead of trusting `req.body`, `req.query`, or `req.params` tenant IDs.

This keeps tenant A and tenant B users fully separated.

## Current status
The project is in an early V1 stage, with the core SaaS foundation implemented in the current module structure.
