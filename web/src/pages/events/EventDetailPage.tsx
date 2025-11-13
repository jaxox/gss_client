/**
 * EventDetailPage - Web Event Detail View
 * Shows full event information with Google Maps location
 */

import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  LocationOn,
  People,
  EmojiEvents,
  Person,
  Info,
} from '@mui/icons-material';
import { Loader } from '@googlemaps/js-api-loader';
import { format } from 'date-fns';
import { getEvent, clearCurrentEvent, clearError } from '../../store/events/eventsSlice';
import type { RootState, AppDispatch } from '../../store/store';

const sportIconMap: Record<string, string> = {
  Basketball: '🏀',
  Soccer: '⚽',
  Tennis: '🎾',
  Volleyball: '🏐',
  Running: '🏃',
  Badminton: '🏸',
  'Table Tennis': '🏓',
  Pickleball: '🥒',
};

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { currentEvent, loading, error } = useSelector((state: RootState) => state.events);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (eventId) {
      dispatch(getEvent(eventId));
    }
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [eventId, dispatch]);

  useEffect(() => {
    if (!currentEvent || !mapRef.current || mapLoaded) return;

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (loader as any)
      .load()
      .then(() => {
        if (!mapRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const google = (window as any).google;
        if (!google) return;

        const map = new google.maps.Map(mapRef.current, {
          center: {
            lat: currentEvent.location.coordinates.latitude,
            lng: currentEvent.location.coordinates.longitude,
          },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
        });
        new google.maps.Marker({
          position: {
            lat: currentEvent.location.coordinates.latitude,
            lng: currentEvent.location.coordinates.longitude,
          },
          map: map,
          title: currentEvent.title,
        });
        setMapLoaded(true);
      })
      .catch((err: Error) => console.error('Error loading Google Maps:', err));
  }, [currentEvent, mapLoaded]);

  const handleBack = () => navigate('/events');
  const handleRSVP = () => console.log('RSVP clicked - TODO Task 8');

  if (loading.fetch) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error.fetch || !currentEvent) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error.fetch && (
          <Alert severity="error" onClose={() => dispatch(clearError('fetch'))}>
            {error.fetch}
          </Alert>
        )}
        {!currentEvent && <Typography>Event not found</Typography>}
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mt: 2 }}>
          Back to Events
        </Button>
      </Container>
    );
  }

  const sportIcon = sportIconMap[currentEvent.sport.name] || '🏅';
  const isFull = Boolean(
    currentEvent.capacity && currentEvent.participantCount >= currentEvent.capacity
  );
  const depositAmount = currentEvent.depositAmount
    ? `$${(currentEvent.depositAmount / 100).toFixed(0)}`
    : '$0';
  const isHost = user?.id === currentEvent.hostId;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 3 }}>
        Back to Events
      </Button>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 64, height: 64, fontSize: '2rem' }}>
                {sportIcon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                  {currentEvent.title}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={currentEvent.sport.name} size="small" color="primary" />
                  {currentEvent.depositAmount > 0 && (
                    <Chip
                      icon={<EmojiEvents />}
                      label={depositAmount}
                      size="small"
                      color="warning"
                    />
                  )}
                  {isFull && <Chip label="Event Full" size="small" color="error" />}
                </Stack>
              </Box>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarToday color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {format(new Date(currentEvent.dateTime), 'EEEE, MMMM d, yyyy')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(currentEvent.dateTime), 'h:mm a')}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {currentEvent.location.venueName || 'Venue'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentEvent.location.address}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <People color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Participants
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {currentEvent.participantCount}
                    {currentEvent.capacity && `/${currentEvent.capacity}`} registered
                  </Typography>
                </Box>
              </Box>
            </Stack>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {currentEvent.description}
              </Typography>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Stack spacing={3}>
            <Paper>
              <Box
                ref={mapRef}
                sx={{ height: 300, width: '100%', bgcolor: 'grey.200', borderRadius: 1 }}
              />
            </Paper>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Hosted By
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {currentEvent.host?.displayName || 'Host'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Level {currentEvent.host?.level || 1}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            {!isHost && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleRSVP}
                disabled={isFull}
                sx={{ py: 1.5 }}
              >
                {isFull
                  ? 'Event Full'
                  : currentEvent.depositAmount > 0
                    ? `RSVP (${depositAmount})`
                    : 'RSVP (Free)'}
              </Button>
            )}
            {isHost && (
              <Alert severity="info" icon={<Info />}>
                You are the host of this event
              </Alert>
            )}
            {currentEvent.depositAmount > 0 && !isHost && (
              <Alert severity="info">
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Deposit Required
                </Typography>
                <Typography variant="caption">
                  {depositAmount} deposit will be authorized (not charged) when you RSVP. The
                  deposit will be refunded when you check in at the event.
                </Typography>
              </Alert>
            )}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
