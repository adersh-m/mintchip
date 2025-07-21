# Vite Environment Files Guide

## 📁 Environment File Hierarchy

Vite loads environment files in this order (later files override earlier ones):

1. **`.env`** ✅ _Always loaded_
2. **`.env.local`** ❌ _Always loaded, git-ignored_
3. **`.env.[mode]`** ✅ _Mode-specific (development/production)_
4. **`.env.[mode].local`** ❌ _Mode-specific, git-ignored_

## 🔧 Current Setup

### `.env` (Base Configuration)

```env
VITE_FIREBASE_API_KEY="AIzaSyASeSMTN_0zk0TlAYNm2u-aBIKSLJFSj18"
VITE_FIREBASE_AUTH_DOMAIN="mintchip-web.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="mintchip-web"
VITE_FIREBASE_APP_ID="1:477335096746:web:462a91b8ca2dd7e0a52fd3"
VITE_FIREBASE_MEASUREMENT_ID="G-RFRXVPHHR7"

VITE_API_BASE_URL=https://api.mintchip.app
VITE_ENABLE_MOCK_API=false
VITE_DEBUG_MODE=false
```

### `.env.development` (Development Mode)

```env
VITE_FIREBASE_API_KEY="AIzaSyASeSMTN_0zk0TlAYNm2u-aBIKSLJFSj18"
VITE_FIREBASE_AUTH_DOMAIN="mintchip-web.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="mintchip-web"
VITE_FIREBASE_APP_ID="1:477335096746:web:462a91b8ca2dd7e0a52fd3"
VITE_FIREBASE_MEASUREMENT_ID="G-RFRXVPHHR7"

VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MOCK_API=true
VITE_DEBUG_MODE=true
```

### `.env.production` (Production Mode)

```env
VITE_FIREBASE_API_KEY="AIzaSyASeSMTN_0zk0TlAYNm2u-aBIKSLJFSj18"
VITE_FIREBASE_AUTH_DOMAIN="mintchip-web.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="mintchip-web"
VITE_FIREBASE_APP_ID="1:477335096746:web:462a91b8ca2dd7e0a52fd3"
VITE_FIREBASE_MEASUREMENT_ID="G-RFRXVPHHR7"

VITE_API_BASE_URL=https://api.mintchip.app
VITE_ENABLE_MOCK_API=false
VITE_DEBUG_MODE=false
```

## 🚀 Usage

### Development

```bash
pnpm dev
# Loads: .env + .env.development + .env.local (if exists)
```

### Production

```bash
pnpm build
# Loads: .env + .env.production + .env.local (if exists)
```

### Local Overrides (Optional)

Create `.env.local` for personal settings that shouldn't be committed:

```env
# .env.local (git-ignored)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_DEBUG_MODE=true
```

## 📋 Environment Variable Checklist

- ✅ Variables prefixed with `VITE_` are exposed to the client
- ✅ `.env` and `.env.[mode]` files are committed to git
- ✅ `.env.local` and `.env.[mode].local` are git-ignored
- ✅ Use `import.meta.env.VITE_VARIABLE_NAME` in code
- ✅ Access via `env` utility in `src/lib/env.ts`

## 🔍 Debugging Environment Variables

Add this to any component to see loaded variables:

```typescript
console.log('Environment:', {
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  API_URL: import.meta.env.VITE_API_BASE_URL,
  MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API,
});
```
