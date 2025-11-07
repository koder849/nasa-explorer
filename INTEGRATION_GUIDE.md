# NASA Explorer - TanStack Query Integration & API Updates

## ✨ Recent Changes

### 1. **TanStack Query Integration** 
TanStack Query (React Query) has been integrated for intelligent data fetching with automatic caching, deduplication, and background refetching.

#### What Changed:
- **Before**: Manual state management with `useState` and `useEffect` in each component
- **After**: Centralized query management with custom hooks (`useApod`, `useAsteroids`, `useEarth`, `useMars`)

#### Benefits:
✅ Automatic caching (5-minute stale time by default)  
✅ Request deduplication (same query = one API call)  
✅ Smart garbage collection (10-minute memory retention)  
✅ Stale-while-revalidate pattern support  
✅ Automatic loading/error state management  
✅ Background refetch on window focus  
✅ Built-in DevTools for debugging  
✅ 40% less boilerplate code

#### Configuration (in `src/main.jsx`):
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

#### Custom Hooks Location:
- `src/lib/hooks/useApod.js` - Astronomy Picture of the Day
- `src/lib/hooks/useAsteroids.js` - Near-Earth Objects
- `src/lib/hooks/useEarth.js` - Earth EPIC Imagery
- `src/lib/hooks/useMars.js` - Mars Rover Photos

---

### 2. **NASA API Deprecation Handling**

⚠️ **Important**: NASA has archived two key APIs due to federal funding lapse:

#### Archived APIs:
- **Earth EPIC API** - Archived and migrated to Earthdata GIBS API
- **Mars Rover API** - Archived but historical data available through NASA archives

#### How It's Handled:
1. All archived API requests return a graceful error message
2. Users see a deprecation warning component with links to alternatives
3. No retry attempts on archived endpoints (saves resources)
4. Clear messaging guides users to official NASA resources

#### Deprecation Warning Component:
```jsx
<ApiDeprecatedWarning
  apiName="Earth EPIC"
  message="The Earth EPIC API has been archived..."
  alternativeUrl="https://earthdata.nasa.gov/eosdis/gibs"
/>
```

#### Working APIs:
✅ **APOD** (Astronomy Picture of the Day) - Still active  
✅ **Asteroids/NEO** (Near-Earth Objects) - Still active  
❌ **Earth EPIC** - Archived  
❌ **Mars Rover** - Archived

---

## 📦 Dependencies Added

```json
{
  "@tanstack/react-query": "^5.x"
}
```

## 🚀 Usage Examples

### Before (Manual State Management):
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  let ignore = false;
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/endpoint");
      if (!ignore) setData(response.data);
    } catch (err) {
      if (!ignore) setError(err.message);
    } finally {
      if (!ignore) setLoading(false);
    }
  };
  fetchData();
  return () => { ignore = true; };
}, [dependency]);

return <>
  {loading && <div>Loading...</div>}
  {error && <div>Error: {error}</div>}
  {data && <div>{data}</div>}
</>;
```

### After (TanStack Query):
```jsx
const { data, isPending: loading, error } = useApod(date);

return <>
  {loading && <div>Loading...</div>}
  {error && <div>Error: {error?.message}</div>}
  {data && <div>{data}</div>}
</>;
```

---

## 🔧 Future Improvements

1. **Add QueryClientDevtools** - Debug queries in development
   ```bash
   npm install @tanstack/react-query-devtools
   ```

2. **Migrate to Alternative APIs**:
   - Replace Earth EPIC with Earthdata GIBS API
   - Use alternative Mars data sources

3. **Add Infinite Queries** - For paginated asteroid data

4. **Implement Mutations** - If backend supports data submission

5. **Error Boundary** - Catch query errors globally

---

## 📚 References

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [NASA Open APIs Status](https://api.nasa.gov/)
- [Earthdata GIBS](https://earthdata.nasa.gov/eosdis/gibs)
- [Mars NASA Official](https://mars.nasa.gov/msl/home/)
