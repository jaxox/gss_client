/**
 * My Events Page (Web)
 * Display user's hosted events with management options
 */

import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  CircularProgress,
  Fab,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getMyEvents, deleteEvent, clearError } from '../../store/events/eventsSlice';
import type { Event } from '@shared/types/event.types';

export default function MyEventsPage() {
  const dispatch = useAppDispatch();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { myEvents, loading, error, deleteLoading, deleteError, deleteSuccess, user } =
    useAppSelector(state => ({
      myEvents: state.events.myEvents,
      loading: state.events.loading.fetch,
      error: state.events.error.fetch,
      deleteLoading: state.events.loading.delete,
      deleteError: state.events.error.delete,
      deleteSuccess: state.events.success.delete,
      user: state.auth.user,
    }));

  const loadEvents = useCallback(() => {
    if (user?.id) {
      dispatch(getMyEvents(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user?.id, loadEvents]);

  useEffect(() => {
    if (deleteSuccess) {
      setCancelDialogOpen(false);
      setSelectedEventId(null);
      loadEvents();
      dispatch(clearError('delete'));
    }
  }, [deleteSuccess, loadEvents, dispatch]);

  const handleCreateEvent = () => {
    // TODO: Navigate to CreateEventPage
    window.location.href = '/events/create';
  };

  const handleEventPress = (eventId: string) => {
    // TODO: Navigate to event detail
    void eventId;
  };

  const handleEditEvent = (eventId: string) => {
    // TODO: Navigate to CreateEventPage with event data
    void eventId;
  };

  const handleCancelEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCancelDialogOpen(true);
  };

  const confirmCancelEvent = () => {
    if (selectedEventId) {
      dispatch(deleteEvent(selectedEventId));
    }
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedEventId(null);
  };

  const getEventStatus = (event: Event): string => {
    const now = new Date();
    const eventDate = new Date(event.dateTime);

    if (event.status === 'cancelled') return 'Cancelled';
    if (eventDate < now) return 'Completed';
    return 'Upcoming';
  };

  const getStatusColor = (status: string): 'primary' | 'default' | 'error' => {
    switch (status) {
      case 'Upcoming':
        return 'primary';
      case 'Completed':
        return 'default';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderEmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        No Events Yet
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Create your first event to get started!
      </Typography>
      <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={handleCreateEvent}>
        Create Event
      </Button>
    </Box>
  );

  const renderEventCard = (event: Event) => {
    const status = getEventStatus(event);
    const participantCount = event.participantCount || 0;
    const capacity = event.capacity;
    const isFull = participantCount >= capacity;

    return (
      <Card key={event.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" component="h2" fontWeight="bold">
              {event.title}
            </Typography>
            <Chip label={status} color={getStatusColor(status)} variant="outlined" size="small" />
          </Box>

          <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
            {event.sport?.icon} {event.sport?.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            📅 {new Date(event.dateTime).toLocaleDateString()} at{' '}
            {new Date(event.dateTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            📍 {event.location.city}, {event.location.state}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label={`${participantCount}/${capacity} ${isFull ? '(Full)' : ''}`}
              size="small"
              variant="outlined"
            />
            {event.depositAmount > 0 && (
              <Chip
                label={`$${(event.depositAmount / 100).toFixed(2)}`}
                size="small"
                variant="outlined"
              />
            )}
            <Chip
              label={event.visibility === 'public' ? 'Public' : 'Private'}
              size="small"
              variant="outlined"
            />
          </Stack>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleEventPress(event.id)}>
            View Details
          </Button>
          {status === 'Upcoming' && (
            <>
              <Button size="small" onClick={() => handleEditEvent(event.id)}>
                Edit
              </Button>
              <Button size="small" color="error" onClick={() => handleCancelEvent(event.id)}>
                Cancel
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    );
  };

  if (loading && myEvents.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your events...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          My Events
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your hosted events
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {myEvents.length === 0 ? (
        renderEmptyState()
      ) : (
        <Box>{myEvents.map(event => renderEventCard(event))}</Box>
      )}

      <Fab
        color="primary"
        aria-label="create event"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateEvent}
      >
        <AddIcon />
      </Fab>

      <Dialog open={cancelDialogOpen} onClose={closeCancelDialog}>
        <DialogTitle>Cancel Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this event? All participants will be notified and their
            deposits will be refunded. This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog} disabled={deleteLoading}>
            No, Keep Event
          </Button>
          <Button onClick={confirmCancelEvent} color="error" disabled={deleteLoading} autoFocus>
            {deleteLoading ? 'Cancelling...' : 'Yes, Cancel Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
