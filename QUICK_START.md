# Direct NASA API Integration - Quick Start

## What Changed?
✅ Frontend now calls NASA APIs directly (no backend needed)  
✅ Simplified architecture, lower latency  
✅ 4 hooks updated to use direct NASA API calls  

## Files Modified
- ✏️ `frontend/src/lib/hooks/useApod.js`
- ✏️ `frontend/src/lib/hooks/useAsteroids.js`
- ✏️ `frontend/src/lib/hooks/useEarth.js`
- ✏️ `frontend/src/lib/hooks/useMars.js`

## Files Created
- ✨ `frontend/src/lib/nasaApi.js` - Direct NASA API functions
- ✨ `frontend/.env.example` - Environment template

## Get Started in 3 Steps

### Step 1: Get API Key
👉 Visit https://api.nasa.gov/ and get your free API key

### Step 2: Configure Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env and add your NASA_API_KEY
```

### Step 3: Run
```bash
npm install
npm run dev
```

## Environment Variable
Add to `frontend/.env`:
```
VITE_NASA_API_KEY=your_key_from_nasa.gov
```

That's it! Your app will now call NASA APIs directly. 🚀

For detailed info, see `MIGRATION_TO_DIRECT_API.md`
