# API DOCUMENT - AnyTrans Dashboard & Settings

**Version:** 1.0.0  
**Base URL:** `https://api.anytrans.vn/v1`  
**Content-Type:** `application/json`  
**Last Updated:** February 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Dashboard APIs](#3-dashboard-apis)
4. [Settings APIs](#4-settings-apis)
5. [Common Types & Schemas](#5-common-types--schemas)
6. [Error Handling](#6-error-handling)

---

## 1. Overview

### 1.1 API Requirements by UI Component

| UI Component | Required APIs |
|--------------|---------------|
| **Dashboard - Stats Cards** | `GET /dashboard/stats`, `GET /wallet` |
| **Dashboard - Jobs Chart** | `GET /dashboard/charts/jobs` |
| **Dashboard - Credit Usage Chart** | `GET /dashboard/charts/credits` |
| **Dashboard - Recent Jobs Table** | `GET /translations` |
| **Dashboard - Activity Feed** | `GET /dashboard/activity` |
| **Dashboard - Storage Usage** | `GET /dashboard/storage` |
| **Settings - Profile Tab** | `GET/PATCH /settings/profile`, `POST/DELETE /settings/profile/avatar` |
| **Settings - Preferences Tab** | `GET/PATCH /settings/preferences` |
| **Settings - Security Tab** | `POST /auth/change-password`, Sessions & Identities APIs |
| **Settings - Notifications Tab** | Notifications CRUD, Notification Preferences APIs |
| **Settings - Billing Tab** | Wallet, Ledger, Packages, Payments APIs |
| **Settings - Files Tab** | Files CRUD APIs |
| **Settings - Activity Tab** | `GET /settings/activity` |

### 1.2 Request Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
Accept-Language: vi | en
X-Idempotency-Key: <uuid>  # For POST/PUT/PATCH requests
```

---

## 2. Authentication

### 2.1 Token Structure

| Token Type | Lifetime | Storage |
|------------|----------|---------|
| Access Token | 1 hour | Memory (Zustand store) |
| Refresh Token | 7 days | HTTP-only cookie |

### 2.2 JWT Payload

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "user",
  "iat": 1704067200,
  "exp": 1704070800
}
```

---

## 3. Dashboard APIs

### 3.1 GET /dashboard/stats

Get dashboard statistics overview.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| period | string | No | `month` | `week`, `month`, `quarter`, `year` |
| timezone | string | No | `Asia/Ho_Chi_Minh` | User timezone |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "totalCredits": 12450,
    "creditsChange": "+15.2%",
    "creditsTrend": "up",
    
    "totalJobs": 156,
    "documentJobs": 120,
    "subtitleJobs": 36,
    "jobsChange": "+8.5%",
    "jobsTrend": "up",
    
    "processingJobs": 3,
    "processingChange": "-2",
    "processingTrend": "down",
    
    "completedThisMonth": 42,
    "completedChange": "+23.5%",
    "completedTrend": "up",
    "successRate": 97.8
  }
}
```

**UI Mapping - Stats Cards:**

| Card | Data Field |
|------|------------|
| Credits Balance | `totalCredits`, `creditsChange`, `creditsTrend` |
| Total Jobs | `totalJobs`, `documentJobs`, `subtitleJobs`, `jobsChange`, `jobsTrend` |
| Processing | `processingJobs`, `processingChange`, `processingTrend` |
| Completed | `completedThisMonth`, `completedChange`, `completedTrend`, `successRate` |

**Cache:** 60 seconds

---

### 3.2 GET /dashboard/charts/jobs

Get jobs chart data by day.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| days | integer | No | 7 | Number of days (7, 14, 30) |
| timezone | string | No | `Asia/Ho_Chi_Minh` | User timezone |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": [
    { "date": "2026-02-01", "day": "T2", "document": 5, "subtitle": 2 },
    { "date": "2026-02-02", "day": "T3", "document": 8, "subtitle": 3 },
    { "date": "2026-02-03", "day": "T4", "document": 6, "subtitle": 4 },
    { "date": "2026-02-04", "day": "T5", "document": 10, "subtitle": 1 },
    { "date": "2026-02-05", "day": "T6", "document": 7, "subtitle": 5 },
    { "date": "2026-02-06", "day": "T7", "document": 3, "subtitle": 2 },
    { "date": "2026-02-07", "day": "CN", "document": 4, "subtitle": 1 }
  ]
}
```

**UI Mapping - JobsChart (Bar Chart):**

- X-axis: `day` field (T2, T3, T4...)
- Y-axis: Job count
- Series 1: `document` (blue)
- Series 2: `subtitle` (orange)

**Cache:** 5 minutes

---

### 3.3 GET /dashboard/charts/credits

Get credit usage breakdown.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| period | string | No | `month` | `week`, `month`, `quarter`, `year` |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "totalCredits": 24450,
    "breakdown": [
      { "name": "Documents", "value": 8200, "percentage": 33.5 },
      { "name": "Subtitles", "value": 3800, "percentage": 15.5 },
      { "name": "Remaining", "value": 12450, "percentage": 51.0 }
    ],
    "usage": {
      "documentsUsed": 8200,
      "subtitlesUsed": 3800,
      "remaining": 12450
    }
  }
}
```

**UI Mapping - CreditUsageChart (Pie/Donut Chart):**

- Segments: `breakdown` array
- Each segment: `name`, `value`, `percentage`
- Colors: Documents (blue), Subtitles (orange), Remaining (gray)

**Cache:** 5 minutes

---

### 3.4 GET /dashboard/storage

Get storage usage information.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "used": 2.4,
    "total": 10.0,
    "unit": "GB",
    "percentage": 24,
    "fileCount": 156,
    "breakdown": {
      "documents": { "count": 98, "size": 1.8 },
      "subtitles": { "count": 58, "size": 0.6 }
    }
  }
}
```

**UI Mapping - StorageUsage Component:**

- Progress bar: `percentage`
- Label: `used` / `total` `unit`
- Tooltip: `breakdown` details

---

### 3.5 GET /dashboard/activity

Get recent activity feed.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | integer | No | 10 | Number of items (max 50) |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "act-001",
      "type": "job_complete",
      "title": "Translation completed",
      "description": "Document 'report.pdf' has been translated",
      "createdAt": "2026-02-07T10:30:00.000Z",
      "metadata": {
        "jobId": "job-123",
        "fileName": "report.pdf"
      }
    },
    {
      "id": "act-002",
      "type": "payment",
      "title": "Credits purchased",
      "description": "Successfully added 5,000 credits to your wallet",
      "createdAt": "2026-02-07T09:15:00.000Z"
    },
    {
      "id": "act-003",
      "type": "warning",
      "title": "Files expiring soon",
      "description": "3 files will expire in 24 hours",
      "createdAt": "2026-02-07T08:00:00.000Z"
    }
  ]
}
```

**UI Mapping - ActivityFeed Component:**

| Activity Type | Icon | Color |
|---------------|------|-------|
| `job_complete` | CheckCircle | green |
| `job_failed` | XCircle | red |
| `payment` | CreditCard | blue |
| `warning` | AlertTriangle | yellow |

---

### 3.6 GET /translations

Get recent translation jobs for dashboard table.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 5 | Items per page (5 for dashboard, max 100) |
| status | string | No | - | Filter: `pending`, `processing`, `succeeded`, `failed` |
| jobType | string | No | - | Filter: `document`, `subtitle` |
| sortBy | string | No | `createdAt` | Sort field |
| sortOrder | string | No | `desc` | `asc`, `desc` |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "id": "job-123",
        "jobType": "document",
        "srcLang": "en",
        "tgtLang": "vi",
        "status": "succeeded",
        "costCredits": 150,
        "createdAt": "2026-02-07T10:00:00.000Z",
        "finishedAt": "2026-02-07T10:02:30.000Z",
        "file": {
          "id": "file-001",
          "name": "annual_report_2025.pdf",
          "mime": "application/pdf",
          "sizeBytes": 2456789
        },
        "resultFile": {
          "id": "file-002",
          "name": "annual_report_2025_vi.pdf"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 156,
      "totalPages": 32,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**UI Mapping - RecentJobsTable:**

| Column | Data Field |
|--------|------------|
| File Name | `file.name` |
| Type | `jobType` |
| Languages | `srcLang` -> `tgtLang` |
| Status | `status` (badge) |
| Credits | `costCredits` |
| Date | `createdAt` |

---

### 3.7 GET /wallet

Get current user wallet balance.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "id": "wallet-123",
    "balance": 12450,
    "updatedAt": "2026-02-07T10:30:00.000Z"
  }
}
```

**UI Mapping:** Sidebar wallet display, Stats card credits

---

## 4. Settings APIs

### 4.1 Profile Tab

#### GET /settings/profile

Get user profile information.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "id": "user-001",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "phone": "+84901234567",
    "avatarUrl": "https://storage.anytrans.vn/avatars/user-001.jpg",
    "emailVerified": true,
    "isOAuthUser": false,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "lastLoginAt": "2026-02-07T08:00:00.000Z"
  }
}
```

**UI Mapping - ProfileTab:**

| Field | UI Element |
|-------|------------|
| `avatarUrl` | Avatar with upload button |
| `fullName` | Editable text input |
| `email` | Read-only with verified badge |
| `phone` | Editable text input |
| `createdAt` | Member since date |

---

#### PATCH /settings/profile

Update user profile.

**Request Body:**

```json
{
  "fullName": "Nguyen Van An",
  "phone": "+84909876543"
}
```

**Validation:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| fullName | string | No | 1-100 chars |
| phone | string | No | E.164 format |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "user-001",
    "fullName": "Nguyen Van An",
    "phone": "+84909876543",
    "updatedAt": "2026-02-07T10:30:00.000Z"
  }
}
```

---

#### POST /settings/profile/avatar

Upload profile avatar.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| avatar | file | Image (JPEG, PNG, WebP), max 5MB |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatarUrl": "https://storage.anytrans.vn/avatars/user-001-v2.jpg"
  }
}
```

---

#### DELETE /settings/profile/avatar

Delete profile avatar.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Avatar deleted successfully"
}
```

---

### 4.2 Preferences Tab

#### GET /settings/preferences

Get user preferences.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "uiLanguage": "vi",
    "theme": "system",
    "sendResultViaEmail": true,
    "fileTtl": 7
  }
}
```

**UI Mapping - PreferencesTab:**

| Setting | UI Element | Options |
|---------|------------|---------|
| `uiLanguage` | Select dropdown | vi, en, ja, ko, zh |
| `theme` | Radio group | light, dark, system |
| `sendResultViaEmail` | Toggle switch | true/false |
| `fileTtl` | Select dropdown | 7, 14, 30, 60, 90 days |

---

#### PATCH /settings/preferences

Update user preferences.

**Request Body:**

```json
{
  "uiLanguage": "en",
  "theme": "dark",
  "sendResultViaEmail": false,
  "fileTtl": 14
}
```

**Validation:**

| Field | Type | Values |
|-------|------|--------|
| uiLanguage | string | `vi`, `en`, `ja`, `ko`, `zh` |
| theme | string | `light`, `dark`, `system` |
| sendResultViaEmail | boolean | `true`, `false` |
| fileTtl | integer | `7`, `14`, `30`, `60`, `90` (days) |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Preferences updated successfully",
  "data": {
    "uiLanguage": "en",
    "theme": "dark",
    "sendResultViaEmail": false,
    "fileTtl": 14
  }
}
```

---

### 4.3 Security Tab

#### POST /auth/change-password

Change user password.

**Request Body:**

```json
{
  "currentPassword": "OldP@ssword123!",
  "newPassword": "NewP@ssword456!",
  "confirmPassword": "NewP@ssword456!"
}
```

**Validation:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| currentPassword | string | Yes | Must match current |
| newPassword | string | Yes | Min 8 chars, uppercase, lowercase, number, special char |
| confirmPassword | string | Yes | Must match newPassword |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Password changed successfully."
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `CURRENT_PASSWORD_INCORRECT` | Current password is incorrect |
| 400 | `PASSWORDS_NOT_MATCH` | New passwords do not match |
| 400 | `SAME_AS_CURRENT` | New password must be different |

---

#### GET /settings/security/identities

Get linked authentication providers.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "identity-001",
      "provider": "credentials",
      "email": "user@example.com",
      "linkedAt": "2025-01-15T10:00:00.000Z",
      "canUnlink": false
    },
    {
      "id": "identity-002",
      "provider": "google",
      "email": "user@gmail.com",
      "linkedAt": "2025-06-20T14:30:00.000Z",
      "canUnlink": true
    }
  ]
}
```

**UI Mapping - OAuth Providers Section:**

| Provider | Icon | Status |
|----------|------|--------|
| `credentials` | Key | Primary (cannot unlink) |
| `google` | Google logo | Linked (can unlink if not only method) |

---

#### POST /settings/security/identities/:provider/link

Link an OAuth provider.

**Path Parameters:**

| Parameter | Values |
|-----------|--------|
| provider | `google` |

**Response:** 302 Redirect to OAuth consent screen

---

#### DELETE /settings/security/identities/:identityId

Unlink an authentication provider.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Provider unlinked successfully"
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `CANNOT_UNLINK_LAST_IDENTITY` | Cannot unlink only authentication method |
| 400 | `CANNOT_UNLINK_PRIMARY` | Cannot unlink primary method |

---

#### GET /settings/security/sessions

Get active sessions.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "session-001",
      "device": "Windows PC",
      "browser": "Chrome 121",
      "os": "Windows 11",
      "ip": "123.45.67.89",
      "location": "Ho Chi Minh City, Vietnam",
      "lastActiveAt": "2026-02-07T10:30:00.000Z",
      "createdAt": "2026-02-07T08:00:00.000Z",
      "isCurrent": true
    },
    {
      "id": "session-002",
      "device": "iPhone 15",
      "browser": "Safari 17",
      "os": "iOS 17.3",
      "ip": "123.45.67.90",
      "location": "Ho Chi Minh City, Vietnam",
      "lastActiveAt": "2026-02-06T20:15:00.000Z",
      "createdAt": "2026-02-05T10:00:00.000Z",
      "isCurrent": false
    }
  ]
}
```

**UI Mapping - Active Sessions Section:**

| Field | Display |
|-------|---------|
| `device` | Device icon + name |
| `browser`, `os` | Browser on OS |
| `location`, `ip` | Location (IP) |
| `lastActiveAt` | Last active time |
| `isCurrent` | "Current session" badge |

---

#### DELETE /settings/security/sessions/:sessionId

Revoke a specific session.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Session revoked successfully"
}
```

---

#### DELETE /settings/security/sessions

Revoke all other sessions (except current).

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "All other sessions revoked",
  "data": {
    "revokedCount": 3
  }
}
```

---

### 4.4 Notifications Tab

#### GET /notifications

List user notifications.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 20 | Items per page (max 100) |
| isRead | boolean | No | - | Filter by read status |
| type | string | No | - | Filter by notification type |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "id": "notif-001",
        "type": "translation_complete",
        "title": "Translation completed",
        "message": "Your document 'report.pdf' has been translated.",
        "data": {
          "jobId": "job-123",
          "fileName": "report.pdf"
        },
        "isRead": false,
        "readAt": null,
        "createdAt": "2026-02-07T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    },
    "unreadCount": 5
  }
}
```

**Notification Types:**

| Type | Icon | Description |
|------|------|-------------|
| `translation_complete` | CheckCircle | Job finished successfully |
| `credit_purchase` | CreditCard | Credits added |
| `file_expiring` | Clock | Files expiring soon |
| `security_alert` | Shield | Login from new device |
| `promotion` | Gift | Special offers |
| `system` | Bell | System announcements |

---

#### PATCH /notifications/:id/read

Mark notification as read.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Notification marked as read",
  "data": {
    "id": "notif-001",
    "isRead": true,
    "readAt": "2026-02-07T10:35:00.000Z"
  }
}
```

---

#### PATCH /notifications/read-all

Mark all notifications as read.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "All notifications marked as read",
  "data": {
    "updatedCount": 5
  }
}
```

---

#### DELETE /notifications/:id

Delete a notification.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Notification deleted"
}
```

---

#### GET /settings/notification-preferences

Get notification preferences.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "type": "translation_complete",
      "label": "Translation Complete",
      "description": "When a translation job finishes",
      "emailEnabled": true,
      "pushEnabled": true
    },
    {
      "type": "credit_purchase",
      "label": "Credit Purchase",
      "description": "When credits are added to your wallet",
      "emailEnabled": true,
      "pushEnabled": false
    },
    {
      "type": "file_expiring",
      "label": "File Expiring",
      "description": "When files are about to expire",
      "emailEnabled": true,
      "pushEnabled": true
    },
    {
      "type": "security_alert",
      "label": "Security Alert",
      "description": "Login from new device or location",
      "emailEnabled": true,
      "pushEnabled": true
    },
    {
      "type": "promotion",
      "label": "Promotions",
      "description": "Special offers and discounts",
      "emailEnabled": false,
      "pushEnabled": false
    }
  ]
}
```

**UI Mapping - Notification Preferences:**

| Type | Email Toggle | Push Toggle |
|------|--------------|-------------|
| Each notification type | `emailEnabled` | `pushEnabled` |

---

#### PATCH /settings/notification-preferences

Update notification preferences.

**Request Body:**

```json
{
  "preferences": [
    { "type": "translation_complete", "emailEnabled": true, "pushEnabled": false },
    { "type": "promotion", "emailEnabled": true, "pushEnabled": true }
  ]
}
```

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Notification preferences updated"
}
```

---

### 4.5 Billing Tab

#### GET /wallet

(See section 3.7)

---

#### GET /wallet/ledger

Get wallet transaction history.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 20 | Items per page (max 100) |
| type | string | No | - | Filter: `topup`, `spend`, `refund` |
| from | string | No | - | Start date (ISO 8601) |
| to | string | No | - | End date (ISO 8601) |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "id": "ledger-001",
        "ledgerType": "topup",
        "delta": 5000,
        "refTable": "payments",
        "refId": "pay-123",
        "note": "Credit package purchase - Basic",
        "createdAt": "2026-02-07T09:00:00.000Z"
      },
      {
        "id": "ledger-002",
        "ledgerType": "spend",
        "delta": -150,
        "refTable": "translation_jobs",
        "refId": "job-456",
        "note": "Document translation - report.pdf",
        "createdAt": "2026-02-07T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 78,
      "totalPages": 4,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "totalTopup": 50000,
      "totalSpend": 37550,
      "totalRefund": 0,
      "netChange": 12450
    }
  }
}
```

**UI Mapping - Transaction History Table:**

| Column | Data Field | Format |
|--------|------------|--------|
| Type | `ledgerType` | Badge (green/red/blue) |
| Amount | `delta` | +5,000 / -150 |
| Description | `note` | Text |
| Date | `createdAt` | Formatted date |

---

#### GET /credit-packages

List available credit packages.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "pkg-001",
      "name": "Starter",
      "description": ["500 credits", "Valid for 1 year", "Email support"],
      "credits": 500,
      "price": 99000,
      "currency": "vnd",
      "type": "personal",
      "active": true,
      "bonus": null,
      "discount": null,
      "tags": []
    },
    {
      "id": "pkg-002",
      "name": "Professional",
      "description": ["2,000 credits", "Valid for 1 year", "Priority support"],
      "credits": 2000,
      "price": 349000,
      "currency": "vnd",
      "type": "personal",
      "active": true,
      "bonus": 10,
      "discount": null,
      "tags": ["popular"]
    },
    {
      "id": "pkg-003",
      "name": "Business",
      "description": ["5,000 credits", "Valid for 1 year", "Dedicated support"],
      "credits": 5000,
      "price": 799000,
      "currency": "vnd",
      "type": "personal",
      "active": true,
      "bonus": 15,
      "discount": 10,
      "tags": ["best-value"]
    }
  ]
}
```

**UI Mapping - Credit Packages:**

| Field | Display |
|-------|---------|
| `name` | Package title |
| `credits` | Credits amount |
| `price` | Price with currency |
| `bonus` | "+10% bonus" badge |
| `discount` | "10% off" badge |
| `tags` | "Popular" / "Best Value" badge |

---

#### POST /payments/vnpay/create

Create VNPay payment for credit purchase.

**Request Body:**

```json
{
  "packageId": "pkg-002",
  "returnUrl": "https://anytrans.vn/settings/billing"
}
```

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "paymentId": "pay-123",
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "expiresAt": "2026-02-07T10:45:00.000Z"
  }
}
```

**UI Flow:**
1. User selects package
2. Frontend calls this API
3. Redirect user to `paymentUrl`
4. VNPay redirects back to `returnUrl` with result

---

#### GET /payments

List payment history.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 20 | Items per page |
| status | string | No | - | Filter: `pending`, `succeeded`, `failed`, `cancelled` |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "id": "pay-001",
        "provider": "vnpay",
        "providerPaymentId": "VNP123456",
        "amount": 349000,
        "currency": "vnd",
        "status": "succeeded",
        "createdAt": "2026-02-07T09:00:00.000Z",
        "paidAt": "2026-02-07T09:02:00.000Z",
        "package": {
          "id": "pkg-002",
          "name": "Professional",
          "credits": 2000
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 4.6 Files Tab

#### GET /files

List user files.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 20 | Items per page (max 100) |
| type | string | No | - | Filter: `doc`, `sub`, `doc-result`, `sub-result` |
| status | string | No | - | Filter: `pending`, `uploaded`, `parsed`, `failed` |
| search | string | No | - | Search in file name |
| sortBy | string | No | `createdAt` | Sort field |
| sortOrder | string | No | `desc` | Sort direction |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "id": "file-001",
        "name": "report.pdf",
        "mime": "application/pdf",
        "sizeBytes": 2456789,
        "status": "parsed",
        "type": "doc",
        "createdAt": "2026-02-07T10:30:00.000Z",
        "storeUntil": "2026-02-14T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**UI Mapping - Files Table:**

| Column | Data Field | Format |
|--------|------------|--------|
| Name | `name` | With file type icon |
| Size | `sizeBytes` | Formatted (2.4 MB) |
| Type | `type` | Badge |
| Status | `status` | Badge |
| Uploaded | `createdAt` | Date |
| Expires | `storeUntil` | Date + countdown |
| Actions | - | Download, Delete buttons |

---

#### GET /files/:fileId

Get file metadata.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "id": "file-001",
    "name": "annual_report_2025.pdf",
    "mime": "application/pdf",
    "sizeBytes": 2456789,
    "sha256": "abc123def456...",
    "status": "parsed",
    "type": "doc",
    "createdAt": "2026-02-07T10:30:00.000Z",
    "storeUntil": "2026-02-14T10:30:00.000Z",
    "metadata": {
      "pageCount": 15,
      "wordCount": 4500,
      "detectedLanguage": "en"
    }
  }
}
```

---

#### GET /files/:fileId/download

Get pre-signed download URL.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "downloadUrl": "https://storage.anytrans.vn/files/abc123?X-Amz-Algorithm=...",
    "expiresAt": "2026-02-08T10:30:00.000Z",
    "fileName": "annual_report_2025.pdf"
  }
}
```

**UI Action:** Open `downloadUrl` in new tab or trigger download.

---

#### DELETE /files/:fileId

Delete a file.

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "message": "File deleted successfully"
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `FILE_IN_USE` | File is being used by active translation job |
| 404 | `FILE_NOT_FOUND` | File not found |

---

### 4.7 Activity Tab

#### GET /settings/activity

Get user activity/audit log.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 20 | Items per page (max 100) |
| action | string | No | - | Filter by action type |
| from | string | No | - | Start date (ISO 8601) |
| to | string | No | - | End date (ISO 8601) |

**Response 200 OK:**

```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "id": "audit-001",
        "action": "login",
        "description": "Logged in from Chrome on Windows",
        "ip": "123.45.67.89",
        "userAgent": "Mozilla/5.0...",
        "device": "Windows PC",
        "browser": "Chrome 121",
        "location": "Ho Chi Minh City, Vietnam",
        "createdAt": "2026-02-07T08:00:00.000Z"
      },
      {
        "id": "audit-002",
        "action": "translation_start",
        "description": "Started translation for 'report.pdf'",
        "ip": "123.45.67.89",
        "createdAt": "2026-02-07T10:00:00.000Z",
        "metadata": {
          "jobId": "job-123",
          "fileName": "report.pdf"
        }
      },
      {
        "id": "audit-003",
        "action": "password_change",
        "description": "Password changed successfully",
        "ip": "123.45.67.89",
        "createdAt": "2026-02-06T15:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Audit Action Types:**

| Action | Icon | Description |
|--------|------|-------------|
| `login` | LogIn | User logged in |
| `logout` | LogOut | User logged out |
| `password_change` | Key | Password changed |
| `profile_update` | User | Profile updated |
| `provider_link` | Link | OAuth provider linked |
| `provider_unlink` | Unlink | OAuth provider unlinked |
| `session_revoke` | Shield | Session revoked |
| `file_upload` | Upload | File uploaded |
| `file_delete` | Trash | File deleted |
| `translation_start` | Play | Translation started |
| `translation_complete` | Check | Translation completed |
| `credit_purchase` | CreditCard | Credits purchased |
| `settings_change` | Settings | Settings updated |

---

## 5. Common Types & Schemas

### 5.1 Dashboard Types

```typescript
// Job Status
type JobStatus = "pending" | "processing" | "succeeded" | "failed"

// Job Type
type JobType = "document" | "subtitle"

// Language Codes (ISO 639-1)
type LanguageCode = "vi" | "en" | "ja" | "ko" | "zh" | "fr" | "de"

// Activity Types
type ActivityType = "job_complete" | "job_failed" | "payment" | "warning"

// Trend Direction
type TrendDirection = "up" | "down" | "neutral"
```

### 5.2 Settings Types

```typescript
// UI Language
type UILanguage = "vi" | "en" | "ja" | "ko" | "zh"

// Theme
type Theme = "light" | "dark" | "system"

// File TTL (days)
type FileTTL = 7 | 14 | 30 | 60 | 90

// Auth Provider
type AuthProvider = "google" | "credentials"

// Notification Types
type NotificationType = 
  | "translation_complete"
  | "credit_purchase"
  | "file_expiring"
  | "security_alert"
  | "promotion"
  | "system"

// Ledger Types
type LedgerType = "topup" | "spend" | "refund"

// Payment Status
type PaymentStatus = "pending" | "succeeded" | "failed" | "cancelled"

// File Status
type FileStatus = "pending" | "uploaded" | "parsed" | "failed"

// Audit Actions
type AuditAction =
  | "login" | "logout"
  | "password_change" | "profile_update"
  | "provider_link" | "provider_unlink"
  | "session_revoke"
  | "file_upload" | "file_delete"
  | "translation_start" | "translation_complete"
  | "credit_purchase" | "settings_change"
```

### 5.3 Pagination Schema

```json
{
  "page": 1,
  "limit": 20,
  "total": 156,
  "totalPages": 8,
  "hasNext": true,
  "hasPrev": false
}
```

---

## 6. Error Handling

### 6.1 Error Response Format

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "reason": "Invalid email format"
  },
  "timestamp": "2026-02-07T10:30:00.000Z",
  "path": "/api/v1/settings/profile",
  "requestId": "req-abc123"
}
```

### 6.2 Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `AUTH_TOKEN_MISSING` | 401 | Authorization token required |
| `AUTH_TOKEN_INVALID` | 401 | Invalid or malformed token |
| `AUTH_TOKEN_EXPIRED` | 401 | Token has expired |
| `AUTH_PERMISSION_DENIED` | 403 | Insufficient permissions |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RESOURCE_NOT_FOUND` | 404 | Resource not found |
| `RESOURCE_ALREADY_EXISTS` | 409 | Resource already exists |
| `INSUFFICIENT_CREDITS` | 402 | Not enough credits |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |

### 6.3 Validation Error Format

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "value": "invalid-email",
      "constraints": {
        "isEmail": "email must be a valid email address"
      }
    },
    {
      "field": "password",
      "constraints": {
        "minLength": "password must be at least 8 characters"
      }
    }
  ]
}
```

---

## Appendix: API Summary Table

### Dashboard APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Dashboard statistics |
| GET | `/dashboard/charts/jobs` | Jobs chart data |
| GET | `/dashboard/charts/credits` | Credit usage chart |
| GET | `/dashboard/storage` | Storage usage info |
| GET | `/dashboard/activity` | Activity feed |
| GET | `/translations` | Recent jobs list |
| GET | `/wallet` | Wallet balance |

### Settings APIs - Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings/profile` | Get profile |
| PATCH | `/settings/profile` | Update profile |
| POST | `/settings/profile/avatar` | Upload avatar |
| DELETE | `/settings/profile/avatar` | Delete avatar |

### Settings APIs - Preferences

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings/preferences` | Get preferences |
| PATCH | `/settings/preferences` | Update preferences |

### Settings APIs - Security

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/change-password` | Change password |
| GET | `/settings/security/identities` | List OAuth providers |
| POST | `/settings/security/identities/:provider/link` | Link OAuth |
| DELETE | `/settings/security/identities/:id` | Unlink OAuth |
| GET | `/settings/security/sessions` | List sessions |
| DELETE | `/settings/security/sessions/:id` | Revoke session |
| DELETE | `/settings/security/sessions` | Revoke all sessions |

### Settings APIs - Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/:id/read` | Mark as read |
| PATCH | `/notifications/read-all` | Mark all as read |
| DELETE | `/notifications/:id` | Delete notification |
| GET | `/settings/notification-preferences` | Get preferences |
| PATCH | `/settings/notification-preferences` | Update preferences |

### Settings APIs - Billing

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallet` | Wallet balance |
| GET | `/wallet/ledger` | Transaction history |
| GET | `/credit-packages` | List packages |
| POST | `/payments/vnpay/create` | Create payment |
| GET | `/payments` | Payment history |

### Settings APIs - Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files` | List files |
| GET | `/files/:id` | Get file details |
| GET | `/files/:id/download` | Download URL |
| DELETE | `/files/:id` | Delete file |

### Settings APIs - Activity

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings/activity` | Audit log |
