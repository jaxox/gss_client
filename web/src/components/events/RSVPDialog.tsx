/**
 * RSVPDialog - Free Event RSVP Confirmation Dialog
 * Shows confirmation dialog for free events (no payment required)
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Event as EventIcon, LocationOn, CalendarToday } from '@mui/icons-material';
import { format } from 'date-fns';
import type { EventDetailView } from '@gss/shared';

interface RSVPDialogProps {
  open: boolean;
  event: EventDetailView | null;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function RSVPDialog({ open, event, loading, onConfirm, onClose }: RSVPDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon color="primary" />
          <span>Confirm RSVP</span>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>
            {event.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
            <CalendarToday fontSize="small" color="action" />
            <Box>
              <Typography variant="body2">
                {format(new Date(event.dateTime), 'EEEE, MMMM d, yyyy')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(event.dateTime), 'h:mm a')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
            <LocationOn fontSize="small" color="action" />
            <Box>
              <Typography variant="body2">{event.location.venueName || 'Venue'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {event.location.address}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: 'success.lighter',
              p: 2,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CheckCircle color="success" />
            <Typography variant="body2">This is a free event. No payment required.</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <CheckCircle />}
        >
          {loading ? 'Confirming...' : 'Confirm RSVP'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
