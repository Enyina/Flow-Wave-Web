# Flowwave Admin API Specifications

## Base URL
```
http://localhost:5600/api
```

## Authentication
All admin endpoints require JWT Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication & User Management

### POST /auth/login
Login user and return JWT token
```json
Request:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "admin@example.com",
      "role": "admin",
      "firstName": "Admin",
      "lastName": "User"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}

Response (401):
{
  "success": false,
  "error": "Invalid credentials"
}
```

### GET /auth/me
Get current authenticated user
```json
Response (200):
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "admin@example.com",
    "role": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "permissions": ["read:users", "write:users", "read:transactions"]
  }
}
```

---

## User Management

### GET /admin/users
Get all users with pagination and filtering
```json
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- search: string (optional)
- status: string (optional: "active", "inactive", "suspended")
- role: string (optional: "user", "admin")
- sortBy: string (default: "createdAt")
- sortOrder: string (default: "desc")

Response (200):
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "user",
        "status": "active",
        "phoneNumber": "+1234567890",
        "country": "Nigeria",
        "createdAt": "2026-01-27T00:00:00.000Z",
        "lastLoginAt": "2026-01-27T12:00:00.000Z",
        "totalTransactions": 15,
        "totalVolume": 15000.50
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### GET /admin/users/:id
Get specific user details
```json
Response (200):
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "status": "active",
    "phoneNumber": "+1234567890",
    "profilePicture": "https://example.com/avatar.jpg",
    "address": {
      "street": "123 Main St",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "zipCode": "100001"
    },
    "kycStatus": "verified",
    "createdAt": "2026-01-27T00:00:00.000Z",
    "lastLoginAt": "2026-01-27T12:00:00.000Z",
    "stats": {
      "totalTransactions": 15,
      "totalVolume": 15000.50,
      "successfulTransactions": 14,
      "failedTransactions": 1
    }
  }
}
```

### PUT /admin/users/:id
Update user information
```json
Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "status": "active",
  "phoneNumber": "+1234567890",
  "kycStatus": "verified"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "status": "active",
    "phoneNumber": "+1234567890",
    "kycStatus": "verified",
    "updatedAt": "2026-01-27T12:00:00.000Z"
  }
}
```

### DELETE /admin/users/:id
Delete/suspend user
```json
Response (200):
{
  "success": true,
  "message": "User deleted successfully"
}
```

### GET /admin/users/stats
Get user statistics
```json
Response (200):
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 1100,
    "inactiveUsers": 100,
    "suspendedUsers": 50,
    "newUsersThisMonth": 85,
    "verifiedUsers": 950,
    "unverifiedUsers": 300,
    "usersByCountry": [
      {"country": "Nigeria", "count": 800},
      {"country": "Ghana", "count": 200},
      {"country": "Kenya", "count": 250}
    ]
  }
}
```

---

## Transaction Management

### GET /admin/transactions
Get all transactions with pagination and filtering
```json
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- status: string (optional: "pending", "completed", "failed", "cancelled")
- userId: string (optional)
- startDate: string (ISO date)
- endDate: string (ISO date)
- minAmount: number (optional)
- maxAmount: number (optional)
- currency: string (optional)

Response (200):
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "transaction_id",
        "userId": "user_id",
        "amount": 1000.00,
        "totalAmount": 1000.20,
        "transferFee": 0.20,
        "fromCurrency": "NGN",
        "toCurrency": "NGN",
        "status": "completed",
        "recipient": {
          "id": "recipient_id",
          "name": "John Doe",
          "bank": "GTBank",
          "accountNumber": "****1234"
        },
        "exchangeRate": 1.0,
        "reference": "FW123456789",
        "createdAt": "2026-01-27T00:00:00.000Z",
        "completedAt": "2026-01-27T00:05:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "totalPages": 25
    }
  }
}
```

### GET /admin/transactions/:id
Get specific transaction details
```json
Response (200):
{
  "success": true,
  "data": {
    "id": "transaction_id",
    "userId": "user_id",
    "user": {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "amount": 1000.00,
    "totalAmount": 1000.20,
    "transferFee": 0.20,
    "fromCurrency": "NGN",
    "toCurrency": "NGN",
    "status": "completed",
    "recipient": {
      "id": "recipient_id",
      "name": "Jane Smith",
      "bank": "Access Bank",
      "accountNumber": "****5678",
      "accountType": "Personal"
    },
    "exchangeRate": 1.0,
    "reference": "FW123456789",
    "paymentDescription": "Family support",
    "virtualAccount": {
      "accountNumber": "9988776655",
      "bankName": "Flowwave Virtual Bank",
      "expiresAt": "2026-01-27T01:00:00.000Z"
    },
    "createdAt": "2026-01-27T00:00:00.000Z",
    "completedAt": "2026-01-27T00:05:00.000Z",
    "auditLog": [
      {
        "action": "created",
        "timestamp": "2026-01-27T00:00:00.000Z",
        "userId": "admin_id"
      },
      {
        "action": "completed",
        "timestamp": "2026-01-27T00:05:00.000Z",
        "userId": "system_id"
      }
    ]
  }
}
```

### PUT /admin/transactions/:id/status
Update transaction status
```json
Request:
{
  "status": "completed",
  "reason": "Payment confirmed",
  "adminNotes": "Manual verification completed"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "transaction_id",
    "status": "completed",
    "updatedAt": "2026-01-27T12:00:00.000Z",
    "updatedBy": "admin_id"
  }
}
```

### GET /admin/transactions/stats
Get transaction statistics
```json
Response (200):
{
  "success": true,
  "data": {
    "totalTransactions": 5000,
    "totalVolume": 2500000.00,
    "totalFees": 500.00,
    "pendingTransactions": 50,
    "completedTransactions": 4800,
    "failedTransactions": 100,
    "cancelledTransactions": 50,
    "todayTransactions": 25,
    "todayVolume": 12500.00,
    "transactionsByStatus": [
      {"status": "completed", "count": 4800, "volume": 2400000.00},
      {"status": "pending", "count": 50, "volume": 25000.00},
      {"status": "failed", "count": 100, "volume": 50000.00},
      {"status": "cancelled", "count": 50, "volume": 25000.00}
    ],
    "transactionsByCurrency": [
      {"currency": "NGN", "count": 4000, "volume": 2000000.00},
      {"currency": "USD", "count": 800, "volume": 400000.00},
      {"currency": "GBP", "count": 200, "volume": 100000.00}
    ]
  }
}
```

---

## Exchange Rates Management

### GET /admin/exchange-rates
Get all exchange rates
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": "rate_id",
      "fromCurrency": "USD",
      "toCurrency": "NGN",
      "rate": 1500.50,
      "isActive": true,
      "createdAt": "2026-01-27T00:00:00.000Z",
      "updatedAt": "2026-01-27T12:00:00.000Z"
    }
  ]
}
```

### POST /admin/exchange-rates
Create new exchange rate
```json
Request:
{
  "fromCurrency": "USD",
  "toCurrency": "NGN",
  "rate": 1500.50,
  "isActive": true
}

Response (201):
{
  "success": true,
  "data": {
    "id": "new_rate_id",
    "fromCurrency": "USD",
    "toCurrency": "NGN",
    "rate": 1500.50,
    "isActive": true,
    "createdAt": "2026-01-27T12:00:00.000Z"
  }
}
```

### PUT /admin/exchange-rates/:id
Update exchange rate
```json
Request:
{
  "rate": 1550.00,
  "isActive": true
}

Response (200):
{
  "success": true,
  "data": {
    "id": "rate_id",
    "rate": 1550.00,
    "updatedAt": "2026-01-27T12:00:00.000Z"
  }
}
```

---

## Analytics & Reporting

### GET /admin/analytics/dashboard
Get dashboard analytics
```json
Response (200):
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalTransactions": 5000,
      "totalVolume": 2500000.00,
      "totalRevenue": 500.00,
      "activeUsers": 1100
    },
    "trends": {
      "dailyTransactions": [
        {"date": "2026-01-20", "count": 100, "volume": 50000.00},
        {"date": "2026-01-21", "count": 120, "volume": 60000.00}
      ],
      "monthlyGrowth": [
        {"month": "2025-12", "users": 1000, "transactions": 4000},
        {"month": "2026-01", "users": 1250, "transactions": 5000}
      ]
    },
    "topMetrics": {
      "fastestGrowingCountries": [
        {"country": "Nigeria", "growth": 15.5},
        {"country": "Ghana", "growth": 12.3}
      ],
      "topRecipients": [
        {"name": "Jane Smith", "count": 25},
        {"name": "John Doe", "count": 20}
      ]
    }
  }
}
```

### GET /admin/reports/daily
Get daily report
```json
Query Parameters:
- date: string (ISO date, default: today)

Response (200):
{
  "success": true,
  "data": {
    "date": "2026-01-27",
    "totalTransactions": 150,
    "totalVolume": 75000.00,
    "totalFees": 15.00,
    "successfulTransactions": 145,
    "failedTransactions": 5,
    "newUsers": 8,
    "activeUsers": 850,
    "breakdown": {
      "byHour": [
        {"hour": "00:00", "transactions": 5},
        {"hour": "01:00", "transactions": 8}
      ],
      "byCurrency": [
        {"currency": "NGN", "count": 120, "volume": 60000.00},
        {"currency": "USD", "count": 30, "volume": 15000.00}
      ]
    }
  }
}
```

---

## System Administration

### GET /admin/system/health
Get system health status
```json
Response (200):
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-01-27T12:00:00.000Z",
    "services": {
      "database": "healthy",
      "redis": "healthy",
      "paymentGateway": "healthy",
      "emailService": "healthy"
    },
    "metrics": {
      "uptime": 99.9,
      "responseTime": 120,
      "memoryUsage": 65.5,
      "cpuUsage": 45.2
    },
    "version": "1.0.0"
  }
}
```

### GET /admin/system/settings
Get system settings
```json
Response (200):
{
  "success": true,
  "data": {
    "maintenanceMode": false,
    "registrationEnabled": true,
    "maxTransactionAmount": 10000.00,
    "feePercentage": 0.02,
    "supportedCurrencies": ["NGN", "USD", "GBP"],
    "autoApproveTransactions": false,
    "emailNotifications": true
  }
}
```

### PUT /admin/system/settings
Update system settings
```json
Request:
{
  "maintenanceMode": false,
  "maxTransactionAmount": 15000.00,
  "feePercentage": 0.025,
  "autoApproveTransactions": true
}

Response (200):
{
  "success": true,
  "data": {
    "maintenanceMode": false,
    "maxTransactionAmount": 15000.00,
    "feePercentage": 0.025,
    "autoApproveTransactions": true,
    "updatedAt": "2026-01-27T12:00:00.000Z"
  }
}
```

---

## Audit Trail

### GET /admin/audit/logs
Get audit logs
```json
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- userId: string (optional)
- action: string (optional)
- startDate: string (ISO date)
- endDate: string (ISO date)

Response (200):
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_id",
        "userId": "user_id",
        "action": "transaction.created",
        "resource": "transaction",
        "resourceId": "transaction_id",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "details": {
          "amount": 1000.00,
          "currency": "NGN"
        },
        "timestamp": "2026-01-27T12:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1000,
      "totalPages": 50
    }
  }
}
```

---

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "path": "/api/endpoint",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "requestId": "unique_request_id"
}
```

Common status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Validation Error
- 500: Internal Server Error

---

## Rate Limiting

API endpoints are rate-limited:
- Authentication endpoints: 5 requests per minute
- Admin endpoints: 100 requests per minute
- General endpoints: 60 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643299200
```

---

## Pagination

All list endpoints support pagination with these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```
