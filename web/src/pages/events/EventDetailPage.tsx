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
  Snackbar,
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  LocationOn,
  People,
  EmojiEvents,
  Person,
  Info,
  CheckCircle,
} from '@mui/icons-material';
import { Loader } from '@googlemaps/js-api-loader';
import { format } from 'date-fns';
import {
  getEvent,
  clearCurrentEvent,
  clearError,
  createRSVP,
  getMyRSVPs,
} from '../../store/events/eventsSlice';
import type { RootState, AppDispatch } from '../../store/store';
import RSVPDialog from '../../components/events/RSVPDialog';
import RSVPPaymentDialog from '../../components/events/RSVPPaymentDialog';

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

  const { currentEvent, loading, error, myRSVPs, success } = useSelector(
    (state: RootState) => state.events
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  useEffect(() => {
    if (eventId && user) {
      dispatch(getEvent(eventId));
      dispatch(getMyRSVPs(user.id));
    }
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [eventId, user, dispatch]);

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

  // Show success snackbar when RSVP succeeds
  useEffect(() => {
    if (success.rsvp) {
      setShowSuccessSnackbar(true);
      setShowRSVPDialog(false);
      setShowPaymentDialog(false);
      // Refresh event details and RSVPs
      if (eventId && user) {
        dispatch(getEvent(eventId));
        dispatch(getMyRSVPs(user.id));
      }
    }
  }, [success.rsvp, eventId, user, dispatch]);

  const handleBack = () => navigate('/events');

  const handleRSVP = () => {
    if (currentEvent?.depositAmount === 0) {
      // Free event - show confirmation dialog
      setShowRSVPDialog(true);
    } else {
      // Deposit event - show payment dialog
      setShowPaymentDialog(true);
    }
  };

  const handleConfirmRSVP = async () => {
    if (!eventId) return;

    await dispatch(
      createRSVP({
        eventId,
        paymentMethodId: undefined, // Free event
      })
    );
  };

  const handleConfirmPayment = async (paymentMethodId: string) => {
    if (!eventId) return;

    await dispatch(
      createRSVP({
        eventId,
        paymentMethodId,
      })
    );
  };

  const userHasRSVPd = myRSVPs.some(event => event.id === eventId);

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
            {userHasRSVPd && (
              <Alert severity="success" icon={<CheckCircle />}>
                You're registered for this event!
              </Alert>
            )}
            {!isHost && !userHasRSVPd && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleRSVP}
                disabled={isFull || loading.rsvp}
                sx={{ py: 1.5 }}
              >
                {loading.rsvp
                  ? 'Processing...'
                  : isFull
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

      {/* RSVP Dialog for free events */}
      <RSVPDialog
        open={showRSVPDialog}
        event={currentEvent}
        loading={loading.rsvp}
        onConfirm={handleConfirmRSVP}
        onClose={() => setShowRSVPDialog(false)}
      />

      {/* Payment Dialog for deposit events */}
      <RSVPPaymentDialog
        open={showPaymentDialog}
        event={currentEvent}
        loading={loading.rsvp}
        onConfirm={handleConfirmPayment}
        onClose={() => setShowPaymentDialog(false)}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccessSnackbar(false)}
          severity="success"
          icon={<CheckCircle />}
          sx={{ width: '100%' }}
        >
          Successfully RSVP'd! Check your email for confirmation.
        </Alert>
      </Snackbar>

      {/* Error Alert for RSVP */}
      {error.rsvp && (
        <Snackbar
          open={!!error.rsvp}
          autoHideDuration={6000}
          onClose={() => dispatch(clearError('rsvp'))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => dispatch(clearError('rsvp'))}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error.rsvp}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}
