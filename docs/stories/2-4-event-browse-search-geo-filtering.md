# Story 2.4: Event Browse & Search with Geo-Filtering

Status: ready-for-dev

## Story

As a **participant user**,
I want **to discover events through advanced browsing and filtering with map views**,
so that **I can find events that match my interests, location, and schedule**.

## Acceptance Criteria

**AC1: Event List View with Sorting (Tech Spec AC2)**

1. Events tab displays list of nearby public events by default
2. Events sorted by: date (default), distance (if location available), capacity remaining
3. Event cards show: title, sport icon with name, date/time, location with distance, participant count (X/Y capacity), deposit badge
4. Pull-to-refresh reloads event list from backend (cache invalidation)
5. Infinite scroll loads more events (pagination: 20 events per page)
6. Empty state when no events found: "No events nearby. Try adjusting your filters."
7. Loading skeleton while fetching events
8. Tap event card navigates to event detail screen

**AC2: Map Toggle View (Tech Spec AC2, AC11)**

1. Toggle button switches between list view and map view smoothly
2. Map view displays all events as markers with clustering for dense areas
3. Map centered on user's current location (if permission granted)
4. Event markers show sport icon and deposit badge
5. Tap marker shows event card preview (title, date, participants, deposit)
6. Tap preview card navigates to event detail
7. Map bounds adjust as user pans/zooms
8. "Redo search in this area" button appears after panning
9. Distance radius circle overlay shows search area

**AC3: Advanced Filtering (Tech Spec AC2)**

1. Filter panel accessible via filter button/icon
2. Sport filter: multi-select dropdown with icons (All, Pickleball, Tennis, Basketball, Soccer, etc.)
3. Date range filter: preset options (Today, Tomorrow, This Week, This Weekend, Custom)
4. Custom date range picker (start date - end date)
5. Distance radius slider: 5, 10, 25, 50 miles (or km based on locale)
6. Capacity filter toggle: "Available spots only" (filters out full events)
7. Deposit amount filter: All, Free only, $5 only, $10 only
8. Apply filters button updates event list immediately (<800ms per Tech Spec)
9. Active filter chips displayed above event list with remove (X) option
10. Clear all filters button resets to defaults
11. Filter state persists across app sessions

**AC4: Location Services Integration (Tech Spec AC11)**

1. Location permission requested on first event browse with clear rationale
2. Permission dialog: "Show nearby events sorted by distance"
3. If granted: get user's GPS coordinates, calculate distances for all events
4. Distance displayed on event cards: "1.2 mi away" or "3.5 km away"
5. Events sorted by distance (nearest first) when location available
6. If denied: prompt for manual location entry (city/zip code)
7. Manual location geocoded to coordinates for distance calculation
8. Location icon indicator shows location source: GPS, manual, or unavailable
9. "Update location" button allows refreshing GPS or changing manual location
10. Location data not stored persistently (privacy)

**AC5: Search Functionality**

1. Search bar at top of events screen
2. Search by: event title, sport name, location (address/city)
3. Real-time search results update as user types (debounced 300ms)
4. Search highlights matching text in event cards
5. Clear search button (X) resets to full list
6. Recent searches saved locally (last 5)
7. Search combines with active filters (AND logic)

**AC6: Performance and Caching (Tech Spec NFR Performance)**

1. Event list loads in <1200ms (p95) on initial fetch
2. Filter application updates list in <800ms
3. Distance calculations complete in <100ms for 50 events
4. Map rendering with 100+ markers completes in <2s at 60fps
5. TanStack Query caches event data for 5 minutes
6. Stale data fetched in background without blocking UI
7. Offline mode displays cached events with staleness indicator

## Tasks / Subtasks

**Task 1: Advanced Filtering Service Layer (AC: 3)**

- [ ] Update `EventService.searchEvents()` to support all filter parameters
  - [ ] URL query params: sport[], dateStart, dateEnd, lat, lng, radius, minCapacity, depositAmount[]
  - [ ] Backend pagination support (limit, offset)
  - [ ] Response parsing: EventSearchResult with events[], totalCount, hasMore
- [ ] Implement filter state management
  - [ ] Create `FiltersStore` Redux slice or use EventStore
  - [ ] State: activeSport[], dateRange, radius, capacityOnly, depositFilter, searchQuery
  - [ ] Actions: updateFilter, clearFilters, resetFilters
  - [ ] Selectors: selectActiveFilters, selectFilterCount
- [ ] Implement filter persistence
  - [ ] Save filters to AsyncStorage (mobile) / localStorage (web)
  - [ ] Restore filters on app launch

**Task 2: Location Services Implementation (AC: 4)**

- [ ] Implement `LocationService.getCurrentLocation()` (from Story 2-2, enhance)
  - [ ] Request location permission with rationale
  - [ ] Get GPS coordinates on mobile (react-native-geolocation-service)
  - [ ] Get browser location on web (Geolocation API)
  - [ ] Handle permission denial gracefully
- [ ] Implement `LocationService.geocodeLocation()` for manual entry
  - [ ] API call to Google Maps Geocoding API
  - [ ] Convert city/zip code to lat/lng coordinates
  - [ ] Error handling for invalid locations
- [ ] Implement `LocationService.calculateDistance()` using geolib
  - [ ] Haversine formula for accurate distance
  - [ ] Format distance: miles or km based on user locale
  - [ ] Batch calculation for event list (optimize performance)

**Task 3: Map View Implementation (AC: 2)**

- [ ] Mobile: Implement map view with react-native-maps
  - [ ] MapView component with Google Maps (Android) / Apple Maps (iOS)
  - [ ] Custom event markers with sport icons
  - [ ] Marker clustering for dense areas (react-native-map-clustering)
  - [ ] Event card preview on marker tap (Callout component)
  - [ ] Camera animation to user location
  - [ ] Region change handling for "Redo search"
- [ ] Web: Implement map view with @googlemaps/js-api-loader
  - [ ] Google Maps JavaScript API initialization
  - [ ] Custom markers with OverlayView
  - [ ] MarkerClusterer for clustering
  - [ ] InfoWindow for event previews
  - [ ] Map controls and event listeners
- [ ] Implement map/list toggle UI
  - [ ] Toggle button with smooth transition
  - [ ] State management for active view
  - [ ] Preserve scroll position on toggle

**Task 4: Mobile Event List UI (AC: 1, 3, 5)**

- [ ] Enhance `EventsScreen` with filtering and search
  - [ ] Search bar component at top
  - [ ] Filter button opening filter panel (modal/drawer)
  - [ ] Active filter chips displayed below search
  - [ ] Sort dropdown: Date, Distance, Capacity
  - [ ] Infinite scroll with FlatList onEndReached
  - [ ] Pull-to-refresh with RefreshControl
- [ ] Create `FilterPanel` component (modal)
  - [ ] Sport multi-select with checkboxes
  - [ ] Date range picker (preset + custom)
  - [ ] Distance radius slider
  - [ ] Capacity toggle
  - [ ] Deposit filter dropdown
  - [ ] Apply and Clear buttons
- [ ] Create `EventCard` component enhancements
  - [ ] Distance badge with location icon
  - [ ] Capacity indicator (visual progress bar)
  - [ ] Deposit badge styling
  - [ ] Search highlight for matched text

**Task 5: Web Event List UI (AC: 1, 3, 5)**

- [ ] Enhance `EventsPage` with filtering and search
  - [ ] Search bar (MUI TextField)
  - [ ] Filter sidebar or drawer (MUI Drawer)
  - [ ] Active filters chips (MUI Chip)
  - [ ] Sort dropdown (MUI Select)
  - [ ] Pagination or infinite scroll
  - [ ] Refresh button
- [ ] Create `FilterSidebar` component
  - [ ] Sport multi-select (MUI Select with checkboxes)
  - [ ] Date range picker (MUI DateRangePicker)
  - [ ] Distance slider (MUI Slider)
  - [ ] Capacity checkbox
  - [ ] Deposit radio buttons
  - [ ] Apply and Reset buttons
- [ ] Enhance `EventCard` component (same as mobile)

**Task 6: Search Implementation (AC: 5)**

- [ ] Implement search service
  - [ ] Debounced search input (300ms)
  - [ ] Search query sent to backend API
  - [ ] Client-side search for cached events (offline)
  - [ ] Search result highlighting
- [ ] Implement recent searches
  - [ ] Store last 5 searches in local storage
  - [ ] Display recent searches dropdown
  - [ ] Tap recent search applies it
  - [ ] Clear recent searches option

**Task 7: Performance Optimization (AC: 6)**

- [ ] Implement TanStack Query for event caching
  - [ ] `useEvents` hook with 5-minute cache
  - [ ] Background refetching when stale
  - [ ] Cache key includes filters for separate cache entries
  - [ ] Pagination with infinite queries
- [ ] Optimize distance calculations
  - [ ] Batch calculate distances for all events
  - [ ] Memoize results until location changes
  - [ ] Use Web Workers (web) or separate thread (mobile) for large lists
- [ ] Optimize map rendering
  - [ ] Marker clustering reduces render count
  - [ ] Virtualize event list (only render visible items)
  - [ ] Debounce map region changes (500ms)

**Task 8: Testing (AC: All)**

- [ ] Unit tests for filtering and search logic
  - [ ] Test searchEvents with various filter combinations
  - [ ] Test distance calculations with known coordinates
  - [ ] Test search query parsing and highlighting
- [ ] Unit tests for state management
  - [ ] Test filter updates and persistence
  - [ ] Test event list pagination
  - [ ] Test map/list toggle state
- [ ] Component tests for UI
  - [ ] Test filter panel interactions
  - [ ] Test search bar with debouncing
  - [ ] Test map marker rendering
- [ ] Integration tests
  - [ ] Test complete filtering flow
  - [ ] Test map view with event markers
  - [ ] Test location permission and distance calculation
- [ ] E2E tests
  - [ ] Test browse events with filters
  - [ ] Test map toggle and marker interaction
  - [ ] Test search and filter combination

## Dev Notes

**Implementation Priority:** This story enhances event discovery from Story 2-2 with advanced filtering and map views. Can be implemented in parallel with Story 2-3.

**Architecture Alignment:**

- Implements Tech Spec AC2 (Event Discovery and Browsing System) completely
- Implements Tech Spec AC11 (Geo-Location Integration and Distance Filtering)
- Aligns with EventService, LocationService, EventStore, MapView modules

**Key Dependencies:**

- Story 2-1: Events must exist to browse
- Story 2-2: Basic event discovery already implemented, this story enhances it
- Google Maps Platform API keys for geocoding and maps
- Backend API: `GET /api/v1/events` with advanced query parameters

**Technical Considerations:**

1. **Map Libraries:**
   - Mobile: react-native-maps (^1.7.1) + react-native-map-clustering
   - Web: @googlemaps/js-api-loader (^1.16.2) + @googlemaps/markerclusterer
   - Shared: geolib (^3.3.4) for distance calculations

2. **Performance Targets:**
   - Event list load: <1200ms (p95) per NFR001
   - Filter application: <800ms per Tech Spec
   - Distance calculations: <100ms for 50 events
   - Map rendering: <2s with 100+ markers at 60fps

3. **Location Privacy:**
   - GPS coordinates not stored persistently
   - Only used for distance calculation during session
   - Clear permission rationale: "Show nearby events"
   - Fallback to manual location if permission denied

4. **Filter State Persistence:**
   - Save active filters to local storage
   - Restore on app launch for better UX
   - Clear filters option available

5. **Map Marker Clustering:**
   - Improves performance with many events
   - Clusters markers when zoom level low
   - Expands to individual markers on zoom in
   - Cluster count badge shows event count

**Testing Strategy:**

- **Unit Tests (70%):** EventService filtering, LocationService distance calculations, filter state management
- **Integration Tests (20%):** Complete filtering flow, map integration, location permission handling
- **E2E Tests (10%):** Browse with filters, map toggle, search + filter combination

**Security Considerations:**

- Location data not stored (privacy)
- API rate limiting for geocoding requests
- Filter inputs validated to prevent injection

**UX Considerations:**

- Clear filter indicators (active filter chips)
- Empty state guidance when no results
- Loading states for async operations
- Smooth map/list toggle transition
- Distance radius visual indicator on map

### Project Structure Notes

**Shared:**

- `shared/services/api/events.service.ts` - Enhanced searchEvents with filters
- `shared/services/api/location.service.ts` - Enhanced location services
- `shared/types/filter.ts` - Filter interfaces

**Mobile:**

- `mobile/src/screens/events/EventsScreen.tsx` - Enhanced with filters
- `mobile/src/components/events/FilterPanel.tsx` - Filter modal
- `mobile/src/components/events/MapView.tsx` - Event map view
- `mobile/src/components/events/EventCard.tsx` - Enhanced card

**Web:**

- `web/src/pages/events/EventsPage.tsx` - Enhanced with filters
- `web/src/components/events/FilterSidebar.tsx` - Filter sidebar
- `web/src/components/events/EventMap.tsx` - Event map component
- `web/src/components/events/EventCard.tsx` - Enhanced card

### References

- [Source: docs/tech-spec-epic-2.md#AC2: Event Discovery and Browsing System]
- [Source: docs/tech-spec-epic-2.md#AC11: Geo-Location Integration and Distance Filtering]
- [Source: docs/tech-spec-epic-2.md#NFR Performance - Event list <1200ms]
- [Source: docs/tech-spec-epic-2.md#Services - EventService, LocationService]
- [Source: docs/tech-spec-epic-2.md#Dependencies - react-native-maps, @googlemaps/js-api-loader, geolib]

## Dev Agent Record

### Context Reference

`docs/stories/2-4-event-browse-search-geo-filtering.context.xml` - Generated: 2025-11-10

### Agent Model Used

Claude 3.5 Sonnet (Bob - Scrum Master Agent)

### Debug Log References

None

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->
