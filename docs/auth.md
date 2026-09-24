Read 

## Complete tenant + admin + employee flow

The actual logic is in `auth.service.js` and `user.service.js`. The route list is in `auth.route.js`.

---

## 1) Tenant registration

### Step 1: Register tenant/company
Endpoint:
```http
POST /api/auth/register
```

Body:
```json
{
  "name": "Acme Business",
  "email": "hello@acme.com"
}
```

What happens:
- creates tenant record
- sends OTP to company email
- returns message to verify company email

---

## 2) Verify company email
Endpoint:
```http
POST /api/auth/verify-email
```

Body:
```json
{
  "email": "hello@acme.com",
  "otp": "123456"
}
```

This marks:
- `tenant.emailVerified = true`
- tenant status becomes active

---

## 3) Admin registration flow

There are 2 cases.

### Case A: Admin email is the same as company email
Example:
- company email = `hello@acme.com`
- admin email = `hello@acme.com`

Then no separate admin OTP step is required.

You can directly call:
```http
POST /api/auth/register-admin
```

Body:
```json
{
  "companyEmail": "hello@acme.com",
  "email": "hello@acme.com",
  "firstName": "Amit",
  "lastName": "Chandure",
  "password": "StrongPassword123",
  "confirmPassword": "StrongPassword123"
}
```

Important rule from code:
- if admin email equals company email, it skips the extra admin-email verification requirement
- this is enforced in the service logic

After this:
- tenant is finalized
- admin user is created with role `admin`
- admin email is considered verified automatically for same-email case

---

### Case B: Admin email is different from company email
Example:
- company email = `hello@acme.com`
- admin email = `admin@acme.com`

Then flow is:

#### Step 3.1: Send admin OTP
```http
POST /api/auth/send-admin-email-verification
```

Body:
```json
{
  "companyEmail": "hello@acme.com",
  "email": "admin@acme.com"
}
```

This:
- finds tenant by company email
- stores admin email
- sends OTP to admin email

#### Step 3.2: Verify admin OTP
```http
POST /api/auth/verify-admin-email
```

Body:
```json
{
  "companyEmail": "hello@acme.com",
  "email": "admin@acme.com",
  "otp": "123456"
}
```

This sets:
- `tenant.adminEmailVerified = true`

#### Step 3.3: Create admin user
```http
POST /api/auth/register-admin
```

Body:
```json
{
  "companyEmail": "hello@acme.com",
  "email": "admin@acme.com",
  "firstName": "Amit",
  "lastName": "Chandure",
  "password": "StrongPassword123",
  "confirmPassword": "StrongPassword123"
}
```

This creates the admin user and completes tenant setup.

> If admin email is different, the code requires admin email verification before finishing registration.

---

## 4) Login after admin creation
Endpoint:
```http
POST /api/auth/login
```

Body:
```json
{
  "email": "admin@acme.com",
  "password": "StrongPassword123"
}
```

This returns:
- accessToken
- refreshToken
- user info

---

## 5) Employee flow

After admin login, the admin can create employees.

### Step 5.1: Create employee
Endpoint:
```http
POST /api/users
```

Header:
```http
Authorization: Bearer <admin-access-token>
```

Body:
```json
{
  "firstName": "Rahul",
  "lastName": "Patil",
  "email": "employee@acme.com",
  "password": "StrongPassword123",
  "confirmPassword": "StrongPassword123"
}
```

What happens:
- employee record is created
- employee email is set to unverified
- OTP is generated
- OTP is sent to employee email
- `otpPurpose = "employee_email_verification"`

This is in `user.service.js`.

---

### Step 5.2: Verify employee email
Endpoint:
```http
POST /api/auth/verify-email
```

Body:
```json
{
  "email": "employee@acme.com",
  "otp": "123456",
  "purpose": "employee_email_verification"
}
```

This sets:
- `user.emailVerified = true`

Only after that can the employee log in.

---

## 6) Minimum flow summary

### Same admin email
1. `POST /api/auth/register`
2. `POST /api/auth/verify-email`
3. `POST /api/auth/register-admin`
4. `POST /api/auth/login`
5. `POST /api/users`
6. `POST /api/auth/verify-email` with employee purpose

### Different admin email
1. `POST /api/auth/register`
2. `POST /api/auth/verify-email`
3. `POST /api/auth/send-admin-email-verification`
4. `POST /api/auth/verify-admin-email`
5. `POST /api/auth/register-admin`
6. `POST /api/auth/login`
7. `POST /api/users`
8. `POST /api/auth/verify-email` with employee purpose

---

## 7) One important rule in code

The service checks this condition:

- if admin email is different from company email, admin verification is mandatory
- if admin email is the same as company email, it skips the extra verification

That is why the “same email” flow is shorter than the “different email” flow.

If you want, I can next give you:
- a single Postman collection list for all these APIs, or
- a sequence diagram of the entire onboarding flow.