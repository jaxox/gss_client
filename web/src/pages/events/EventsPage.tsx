/**
 * EventsPage - Web Event Discovery
 * Displays searchable/filterable list of nearby public events
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Button,
  Alert,
  Paper,
  IconButton,
  Skeleton,
} from '@mui/material';
import { Search, FilterList, Refresh, Add, DirectionsRun } from '@mui/icons-material';
import { searchEvents, clearError } from '../../store/events/eventsSlice';
import type { RootState, AppDispatch } from '../../store/store';
import EventCard from '../../components/events/EventCard';

const SPORT_FILTERS = [
  { value: 'Basketball', label: 'Basketball', emoji: '🏀' },
  { value: 'Soccer', label: 'Soccer', emoji: '⚽' },
  { value: 'Tennis', label: 'Tennis', emoji: '🎾' },
  { value: 'Volleyball', label: 'Volleyball', emoji: '🏐' },
  { value: 'Running', label: 'Running', emoji: '🏃' },
];

export default function EventsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { searchResults, loading, error } = useSelector((state: RootState) => state.events);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(() => {
    const filters: {
      page: number;
      limit: number;
      sport?: string;
      query?: string;
    } = {
      page: 1,
      limit: 20,
    };

    if (selectedSport) {
      filters.sport = selectedSport;
    }

    if (searchQuery.trim()) {
      filters.query = searchQuery.trim();
    }

    // Add user location if available (for distance calculation)
    // TODO: Implement geolocation
    // if (userLocation) {
    //   filters.latitude = userLocation.latitude;
    //   filters.longitude = userLocation.longitude;
    // }

    dispatch(searchEvents(filters));
  }, [dispatch, selectedSport, searchQuery]);

  // Load events on mount and when filters change
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleRefresh = () => {
    handleSearch();
  };

  const handleSportFilter = (sport: string) => {
    if (selectedSport === sport) {
      setSelectedSport(null);
    } else {
      setSelectedSport(sport);
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  const renderEmptyState = () => (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <DirectionsRun sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" gutterBottom color="text.secondary">
        No Events Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {selectedSport || searchQuery
          ? 'Try adjusting your filters or search query'
          : 'Be the first to create an event!'}
      </Typography>
      <Button variant="contained" startIcon={<Add />} onClick={handleCreateEvent} size="large">
        Create Event
      </Button>
    </Paper>
  );

  const renderLoadingSkeletons = () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 3,
      }}
    >
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Skeleton key={i} variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Discover Events
          </Typography>
          <Stack direction="row" spacing={2}>
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
            <Button variant="contained" startIcon={<Add />} onClick={handleCreateEvent}>
              Create Event
            </Button>
          </Stack>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search events..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                  <FilterList color={showFilters ? 'primary' : 'inherit'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Sport Filters */}
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
          {SPORT_FILTERS.map(sport => (
            <Chip
              key={sport.value}
              label={`${sport.emoji} ${sport.label}`}
              onClick={() => handleSportFilter(sport.value)}
              color={selectedSport === sport.value ? 'primary' : 'default'}
              variant={selectedSport === sport.value ? 'filled' : 'outlined'}
            />
          ))}
          {selectedSport && (
            <Chip
              label="Clear"
              onClick={() => setSelectedSport(null)}
              color="secondary"
              variant="outlined"
              onDelete={() => setSelectedSport(null)}
            />
          )}
        </Stack>
      </Box>

      {/* Error Alert */}
      {error.search && (
        <Alert severity="error" onClose={() => dispatch(clearError('search'))} sx={{ mb: 3 }}>
          {error.search}
        </Alert>
      )}

      {/* Event Grid */}
      {loading.search ? (
        renderLoadingSkeletons()
      ) : searchResults.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Found {searchResults.length} events
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {searchResults.map(event => (
              <EventCard key={event.id} event={event} onClick={() => handleEventClick(event.id)} />
            ))}
          </Box>
        </>
      )}
    </Container>
  );
}
