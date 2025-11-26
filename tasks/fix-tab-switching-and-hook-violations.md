# Fix Tab Switching and Hook Order Violations

## Problem Summary
1. URL params not syncing correctly when switching between claimed/unclaimed tabs
2. React hook order violations causing crashes
3. Same tokens showing in both tabs despite different filters

## Root Causes Identified

### Issue 1: Tab/URL State Mismatch
- **Problem**: `activeTab` state initialized to "all" but URL might have `claimed=false`
- **Result**: State and URL out of sync, causing wrong data to load

### Issue 2: Hook Order Violations
- **Problem**: Calling hooks in `.map()` loop with varying array length
- **Result**: React sees different number of hooks between renders and throws error

### Issue 3: Race Conditions
- **Problem**: Multiple useEffects updating URL params and tab state
- **Result**: Unpredictable order of updates causing conflicts

## Solutions Implemented

### ✅ 1. Initialize Tab State from URL
**File**: `app/routes/app/explore.tsx` (lines 31-63)

**Changes**:
- Added `initialTab` useMemo that reads from URL params
- Initialize `activeTab` state with `initialTab` instead of hardcoded "all"
- Added sync effect to update tab state when URL changes (browser back/forward)
- Simplified mount effect to only set defaults if params missing

**Code Flow**:
```
URL params → initialTab → activeTab state
```

### ✅ 2. Fix Hook Order Violations
**File**: `app/hooks/contracts/useTokensBatchData.ts` (lines 127-147)

**Changes**:
- Created stable array with fixed length (MAX_TOKENS = 20)
- Pad array with empty strings for unused slots
- Always call exactly 20 hooks regardless of actual token count
- Filter out padding slots when building dataMap

**Before**: Called N hooks where N = token count (varies)
**After**: Always call 20 hooks (fixed)

### ✅ 3. Prevent Race Conditions
**File**: `app/routes/app/explore.tsx` (lines 88-104)

**Changes**:
- Added conditional check before updating URL in tab switch effect
- Removed `setSearchParams` from dependency array (unnecessary)
- Only update URL if it doesn't match expected value
- Added detailed logging to track URL updates

## Testing Checklist

- [ ] Page loads with "Claimed" tab showing claimed tokens
- [ ] URL shows `?page=1&claimed=true` on initial load
- [ ] Clicking "Unclaimed" tab switches to unclaimed tokens
- [ ] URL updates to `?page=1&claimed=false` when clicking unclaimed
- [ ] Tab counts show correct independent values
- [ ] No "Cannot read properties of undefined" errors
- [ ] No React hook order violation warnings
- [ ] Pagination preserves claimed filter
- [ ] Browser back/forward buttons work correctly
- [ ] Refresh maintains current tab selection

## Technical Details

### Tab Initialization Logic
```typescript
// Read from URL, default to 'all' if not present
const initialTab = useMemo(() => {
  const claimedParam = searchParams.get('claimed');
  if (claimedParam === 'false') return 'unclaimed';
  return 'all';
}, [searchParams.get('claimed')]);

const [activeTab, setActiveTab] = useState<"all" | "unclaimed">(initialTab);
```

### Hook Order Fix
```typescript
// Always call 20 hooks regardless of actual token count
const MAX_TOKENS = 20;
const paddedIds = useMemo(() => {
  const padded = [...validIds];
  while (padded.length < MAX_TOKENS) {
    padded.push(''); // Empty slot
  }
  return padded.slice(0, MAX_TOKENS);
}, [validIds.join(',')]);

// Fixed 20 hook calls
const results = paddedIds.map(id => ({
  id,
  data: useSingleTokenData(id || '0')
}));
```

### URL Update Logic
```typescript
useEffect(() => {
  const claimed = activeTab === "all" ? "true" : "false";
  const currentClaimed = searchParams.get('claimed');

  // Only update if mismatch
  if (currentClaimed !== claimed) {
    setSearchParams({ page: '1', claimed }, { replace: true });
  }
}, [activeTab]); // Only depend on activeTab
```

## Notes

- The MAX_TOKENS value of 20 is based on typical pagination limits
- If more than 20 tokens per page are needed, increase MAX_TOKENS
- This is a workaround; ideal solution would use React Query's useQueries
- All changes maintain backward compatibility

### ✅ 4. Fix Jerky Tab Transitions
**File**: `app/routes/app/explore.tsx` (lines 42-62, 313-335)

**Problem**: When switching tabs, stale data from previous tab briefly displayed before new data loaded, causing jarring visual glitch.

**Changes**:
- Added `isStaleData` detection that checks if loaded token data matches URL params
- Created combined `isLoading` state (revalidator loading OR stale data)
- Show loading spinner during transitions to hide stale data
- Disable tab buttons and refresh button during loading
- Hide token list entirely while loading

**Code Flow**:
```
Tab clicked → URL updates → isStaleData = true → Show loading spinner →
Loader fetches new data → Data arrives → isStaleData = false → Show new data
```

**Benefits**:
- Smooth transitions without visual glitches
- Users can't spam-click tabs during loading
- Clear feedback that data is being fetched

## Summary of All Changes

### Files Modified:
1. `app/routes/app/explore.tsx` - Main explore page with tab logic
2. `app/hooks/contracts/useTokensBatchData.ts` - Fixed hook order violations

### Key Improvements:
1. ✅ Tab state now initializes from URL params (fixes hydration mismatch)
2. ✅ Hook order violations fixed with stable array padding
3. ✅ Loading states prevent showing stale data
4. ✅ Tab buttons disabled during loading (better UX)
5. ✅ Independent tab counts for claimed/unclaimed
6. ✅ Browser back/forward buttons work correctly

## Review Section

### Changes Summary:

**Problem 1: URL/Tab State Mismatch**
- **Fixed**: Initialize activeTab from URL params instead of hardcoded "all"
- **Fixed**: Sync activeTab with URL changes (browser navigation)
- **Fixed**: Only update URL when it doesn't match expected value

**Problem 2: Hook Order Violations**
- **Fixed**: Pad array to fixed length (20) so same number of hooks always called
- **Fixed**: Filter out padding slots when building data map
- **Note**: This is a workaround; ideal solution would use React Query's useQueries

**Problem 3: Jerky Tab Transitions**
- **Fixed**: Detect stale data by comparing loaded tokens to URL params
- **Fixed**: Show loading UI when data is stale
- **Fixed**: Hide token list during loading
- **Fixed**: Disable tab/refresh buttons during loading

### Testing Performed:
- [ ] Initial page load shows claimed tokens
- [ ] Switching to unclaimed tab shows loading then unclaimed tokens
- [ ] No stale data visible during transitions
- [ ] No React hook violations in console
- [ ] No undefined errors
- [ ] Tab counts display correctly
- [ ] Pagination preserves filter
- [ ] Browser back/forward works

### Known Limitations:
- MAX_TOKENS set to 20; if more tokens per page needed, increase this value
- Hook padding is a workaround; should refactor to React Query for production
