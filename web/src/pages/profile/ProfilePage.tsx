import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getProfile,
  updateProfile,
  setEditing,
  clearError,
} from '../../store/profile/profileSlice';
import { generateAvatarColor, getInitials, validateDisplayName, validateCity } from '@gss/shared';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { currentProfile, isLoading, isEditing, error } = useAppSelector(state => state.profile);

  const [displayName, setDisplayName] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load profile on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getProfile(user.id));
    }
  }, [dispatch, user?.id]);

  // Populate form when profile loads
  useEffect(() => {
    if (currentProfile) {
      setDisplayName(currentProfile.displayName);
      setHomeCity(currentProfile.homeCity);
    }
  }, [currentProfile]);

  const handleEdit = () => {
    dispatch(setEditing(true));
  };

  const handleCancel = () => {
    if (currentProfile) {
      setDisplayName(currentProfile.displayName);
      setHomeCity(currentProfile.homeCity);
    }
    setErrors({});
    dispatch(setEditing(false));
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    if (!validateDisplayName(displayName)) {
      newErrors.displayName = 'Display name must be 2-50 characters';
    }

    if (!validateCity(homeCity)) {
      newErrors.homeCity = 'Home city must be 2-100 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && user?.id) {
      const result = await dispatch(
        updateProfile({
          userId: user.id,
          updates: { displayName, homeCity },
        })
      );

      if (updateProfile.fulfilled.match(result)) {
        // Success handled by reducer
      }
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning">Please log in to view your profile</Alert>
        </Box>
      </Container>
    );
  }

  if (isLoading && !currentProfile) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const profile = currentProfile || user;
  const initials = getInitials(profile.displayName);
  const avatarColor = generateAvatarColor(profile.id);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {error && error.includes('network') && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            ⚠️ Offline Mode - Showing cached data
          </Alert>
        )}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: avatarColor,
                fontSize: '2.5rem',
                mr: 3,
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                {profile.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={`Level ${profile.level}`}
                  size="small"
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Chip label={`${profile.xp} XP`} size="small" variant="outlined" />
              </Box>
            </Box>
            {!isEditing && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                disabled={isLoading}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button disabled variant="text" size="small">
              📷 Avatar Upload Coming Soon
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Display Name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              disabled={!isEditing || isLoading}
              error={!!errors.displayName}
              helperText={errors.displayName}
            />
            <TextField
              fullWidth
              label="Email"
              value={profile.email}
              disabled
              helperText="Email cannot be changed"
            />
            <TextField
              fullWidth
              label="Home City"
              value={homeCity}
              onChange={e => setHomeCity(e.target.value)}
              disabled={!isEditing || isLoading}
              error={!!errors.homeCity}
              helperText={errors.homeCity}
            />
            <TextField
              fullWidth
              label="Reliability Score"
              value={`${(profile.reliabilityScore * 100).toFixed(0)}%`}
              disabled
              InputProps={{
                endAdornment: <Chip label="Private" size="small" color="warning" />,
              }}
              helperText="Your reliability score is private by default"
            />
          </Stack>

          {isEditing && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
