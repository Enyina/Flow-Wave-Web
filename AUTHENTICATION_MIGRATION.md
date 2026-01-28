# Authentication System Migration Guide

## Overview
Your authentication system has been consolidated and secured with the following improvements:

## ✅ Completed Improvements

### 1. **Consolidated API Client**
- **Before**: 3 separate API clients (`api.js`, `axios.js`, `utils/api.js`)
- **After**: Single `consolidatedApi.js` with unified token handling
- **Benefits**: Eliminates code duplication, consistent behavior

### 2. **Secure Token Management**
- **Before**: localStorage (XSS vulnerable)
- **After**: sessionStorage + TokenManager class
- **Benefits**: 
  - Survives page reloads ✅
  - Cleared when tab closes (more secure)
  - Automatic token validation
  - Migration from localStorage

### 3. **Centralized Auth Store**
- **Before**: Zustand store with localStorage persistence
- **After**: Enhanced Zustand store with sessionStorage + token refresh
- **Benefits**: 
  - Automatic token refresh scheduling
  - Session validation
  - Better state management

### 4. **Token Refresh Strategy**
- **Before**: Manual token handling
- **After**: Automatic refresh 5 minutes before expiration
- **Benefits**: 
  - Seamless user experience
  - Prevents session timeouts
  - Automatic retry on 401/403

## 🔄 Migration Steps

### Update Imports
```javascript
// OLD
import { apiFetch } from '../utils/api';
import { getStoredUser } from '../api/authService';

// NEW
import { apiFetch } from '../api';
import { getStoredUser } from '../api';
```

### Update API Calls
```javascript
// OLD - Multiple clients
import api from '../api/axios';
import { apiFetch } from '../utils/api';

// NEW - Single consolidated client
import { apiClient, apiFetch, api } from '../api';
```

## 🛡️ Security Improvements

### Token Storage
- **sessionStorage**: Access tokens (survives reload, cleared on tab close)
- **httpOnly cookies**: Refresh tokens (recommended, not accessible to JavaScript)

### Automatic Migration
- Existing localStorage tokens automatically migrated to sessionStorage
- Legacy token names consolidated to single `flowwave_access_token`
- Invalid tokens automatically cleaned

### Token Validation
- JWT format validation
- Expiration checking
- Automatic refresh before expiration

## 📁 New File Structure

```
src/
├── api/
│   ├── index.js              # Main API exports
│   ├── consolidatedApi.js    # Single API client
│   ├── authApi.js           # Auth API endpoints
│   └── authService.js       # Updated auth service
├── stores/
│   └── authStore.js         # Enhanced auth store
├── utils/
│   └── tokenManager.js      # Secure token management
└── contexts/
    └── AuthContext.js       # Updated to use new system
```

## 🔄 Backward Compatibility

The new system maintains backward compatibility:
- All existing function signatures unchanged
- Same response formats
- Automatic migration of existing tokens

## 🚀 Usage Examples

### Basic API Calls
```javascript
import { api, apiFetch } from '../api';

// GET request
const users = await api.get('/users');

// POST request
const result = await api.post('/auth/login', { email, password });

// Advanced options
const response = await apiFetch('/custom-endpoint', {
  method: 'POST',
  body: formData,
  timeout: 10000
});
```

### Authentication
```javascript
import { useAuth } from '../contexts/AuthContext';

function LoginComponent() {
  const { login, user, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    await login(email, password);
    // Token refresh happens automatically
  };
}
```

### Token Management
```javascript
import TokenManager from '../utils/tokenManager';

// Get current token
const token = TokenManager.getAccessToken();

// Check if token needs refresh
const shouldRefresh = TokenManager.shouldRefreshToken(token);

// Get expiration time
const expires = TokenManager.getTokenExpiration(token);
```

## ⚠️ Important Notes

### Server-Side Requirements
For optimal security, your backend should:
1. Use httpOnly cookies for refresh tokens
2. Implement `/api/auth/refresh` endpoint
3. Set appropriate CORS headers for credentials

### Environment Variables
```javascript
// .env
REACT_APP_API_URL=http://localhost:3001/api
```

### Development vs Production
- Development: sessionStorage (easier debugging)
- Production: sessionStorage + httpOnly cookies (most secure)

## 🐛 Troubleshooting

### Common Issues

1. **"Token not found" errors**
   - Check automatic migration completed
   - Verify user is logged in

2. **401 errors not refreshing**
   - Ensure `/api/auth/refresh` endpoint exists
   - Check httpOnly cookie configuration

3. **State not updating**
   - Verify auth store integration
   - Check component re-renders

### Debug Mode
Add to your environment for debug logging:
```javascript
localStorage.setItem('auth-debug', 'true');
```

## 📊 Performance Impact

- **Reduced bundle size**: Eliminated duplicate API clients
- **Faster initialization**: Single token validation on load
- **Better UX**: No more unexpected logouts
- **Security**: Reduced XSS attack surface

## 🎯 Next Steps

1. **Test thoroughly**: Verify all auth flows work
2. **Update server**: Implement httpOnly refresh tokens
3. **Monitor**: Check for any auth-related errors
4. **Clean up**: Remove old API files after testing

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify token migration in sessionStorage
3. Ensure API endpoints are accessible
4. Test with both localStorage and sessionStorage scenarios
