import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { getMyRSVPs } from '../../store/events/eventsSlice';
import type { RootState, AppDispatch } from '../../store/store';

export default function MyRSVPsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { myRSVPs, loading, user } = useSelector((state: RootState) => ({
    myRSVPs: state.events.myRSVPs,
    loading: state.events.loading.fetch,
    user: state.auth.user,
  }));

  useEffect(() => {
    if (user?.id) {
      dispatch(getMyRSVPs(user.id));
    }
  }, [user, dispatch]);

  if (loading && myRSVPs.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">My RSVPs</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/events')}>
          Browse Events
        </Button>
      </Box>
      {myRSVPs.length === 0 ? (
        <Typography>No RSVPs yet. Browse events to get started!</Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {myRSVPs.map(event => (
            <Box key={event.id} sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="h6">{event.title}</Typography>
              <Typography variant="body2">{new Date(event.dateTime).toLocaleString()}</Typography>
              <Button size="small" onClick={() => navigate(`/events/${event.id}`)}>
                View
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
