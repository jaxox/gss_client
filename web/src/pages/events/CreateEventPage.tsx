/**
 * Create Event Page (Web)
 * Web event creation form with MUI components and validation
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  FormHelperText,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createEvent, clearError } from '../../store/events/eventsSlice';
import {
  validateEventTitle,
  validateEventDescription,
  validateCapacity,
  validateDepositAmount,
  DEFAULT_CAPACITY,
  DEFAULT_DEPOSIT_AMOUNT,
  DEFAULT_VISIBILITY,
  DEPOSIT_OPTIONS,
} from '@shared/validation/eventValidation';
import type { CreateEventRequest } from '@shared/types/event.types';

// Sport options (hardcoded for now, can be fetched from backend later)
const SPORTS = [
  { label: 'Pickleball', value: 'pickleball', icon: '🏓' },
  { label: 'Basketball', value: 'basketball', icon: '🏀' },
  { label: 'Soccer', value: 'soccer', icon: '⚽' },
  { label: 'Tennis', value: 'tennis', icon: '🎾' },
  { label: 'Volleyball', value: 'volleyball', icon: '🏐' },
];

interface FormErrors {
  title?: string | null;
  description?: string | null;
  capacity?: string | null;
  depositAmount?: string | null;
  location?: string | null;
  dateTime?: string | null;
}

export default function CreateEventPage() {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector(state => ({
    loading: state.events.loading.create,
    error: state.events.error.create,
    success: state.events.success.create,
  }));

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sportId, setSportId] = useState('pickleball');
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY.toString());
  const [depositAmount, setDepositAmount] = useState(DEFAULT_DEPOSIT_AMOUNT);
  const [visibility, setVisibility] = useState<'public' | 'private'>(DEFAULT_VISIBILITY);
  const [dateTime, setDateTime] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Form errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time validation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (touched.title) {
      setErrors(prev => ({ ...prev, title: validateEventTitle(value) }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescription(value);
    if (touched.description) {
      setErrors(prev => ({
        ...prev,
        description: validateEventDescription(value),
      }));
    }
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCapacity(value);
    if (touched.capacity) {
      const numValue = parseInt(value, 10);
      setErrors(prev => ({
        ...prev,
        capacity: isNaN(numValue) ? 'Invalid number' : validateCapacity(numValue),
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate on blur
    if (field === 'title') {
      setErrors(prev => ({ ...prev, title: validateEventTitle(title) }));
    } else if (field === 'description') {
      setErrors(prev => ({
        ...prev,
        description: validateEventDescription(description),
      }));
    } else if (field === 'capacity') {
      const numValue = parseInt(capacity, 10);
      setErrors(prev => ({
        ...prev,
        capacity: isNaN(numValue) ? 'Invalid number' : validateCapacity(numValue),
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      title: validateEventTitle(title),
      description: validateEventDescription(description),
      capacity: validateCapacity(parseInt(capacity, 10)),
      depositAmount: validateDepositAmount(depositAmount),
    };

    // Basic location validation
    if (!address.trim()) {
      newErrors.location = 'Address is required';
    }
    if (!city.trim()) {
      newErrors.location = 'City is required';
    }
    if (!state.trim()) {
      newErrors.location = 'State is required';
    }
    if (!zipCode.trim() || !/^\d{5}(-\d{4})?$/.test(zipCode)) {
      newErrors.location = 'Valid ZIP code is required';
    }

    // Date/time validation
    if (!dateTime) {
      newErrors.dateTime = 'Date and time are required';
    } else {
      const eventDate = new Date(dateTime);
      const now = new Date();
      if (eventDate <= now) {
        newErrors.dateTime = 'Event must be in the future';
      }
    }

    setErrors(newErrors);
    setTouched({
      title: true,
      description: true,
      capacity: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      dateTime: true,
    });

    return !Object.values(newErrors).some(error => error !== null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // For now, use hardcoded coordinates (San Francisco)
    // TODO: Integrate geocoding service
    const eventData: CreateEventRequest = {
      title,
      description,
      sportId,
      capacity: parseInt(capacity, 10),
      depositAmount,
      visibility,
      dateTime: new Date(dateTime).toISOString(),
      location: {
        address,
        city,
        state,
        zipCode,
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      },
    };

    try {
      await dispatch(createEvent(eventData)).unwrap();
      // Success! Navigation would happen here
      // TODO: Navigate to event detail page
    } catch (err) {
      // Error is handled by Redux state
      if (err) {
        // Log for debugging
      }
    }
  };

  const handleCancel = () => {
    // TODO: Navigate back or show confirmation dialog
  };

  useEffect(() => {
    if (error) {
      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        dispatch(clearError('create'));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 3,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Create Event
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Fill in the details to create your sports event
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Error Banner */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError('create'))}>
              {error}
            </Alert>
          )}

          {/* Success Banner */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Event created successfully!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Title Input */}
            <TextField
              fullWidth
              label="Event Title *"
              value={title}
              onChange={handleTitleChange}
              onBlur={() => handleBlur('title')}
              error={touched.title && !!errors.title}
              helperText={
                touched.title && errors.title ? errors.title : `${title.length}/50 characters`
              }
              required
              inputProps={{ maxLength: 50 }}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            {/* Description Input */}
            <TextField
              fullWidth
              label="Description *"
              value={description}
              onChange={handleDescriptionChange}
              onBlur={() => handleBlur('description')}
              error={touched.description && !!errors.description}
              helperText={
                touched.description && errors.description
                  ? errors.description
                  : `${description.length}/1000 characters`
              }
              required
              multiline
              rows={4}
              inputProps={{ maxLength: 1000 }}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            {/* Sport Selector */}
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">Sport *</FormLabel>
              <ToggleButtonGroup
                value={sportId}
                exclusive
                onChange={(_, value) => value && setSportId(value)}
                fullWidth
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {SPORTS.map(sport => (
                  <ToggleButton key={sport.value} value={sport.value}>
                    <span style={{ marginRight: 4 }}>{sport.icon}</span>
                    {sport.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </FormControl>

            {/* Capacity Input */}
            <TextField
              fullWidth
              label="Capacity"
              type="number"
              value={capacity}
              onChange={handleCapacityChange}
              onBlur={() => handleBlur('capacity')}
              error={touched.capacity && !!errors.capacity}
              helperText={touched.capacity && errors.capacity}
              required
              inputProps={{ min: 1, max: 100 }}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            {/* Deposit Amount */}
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">Deposit Amount *</FormLabel>
              <ToggleButtonGroup
                value={depositAmount.toString()}
                exclusive
                onChange={(_, value) => value && setDepositAmount(parseInt(value, 10))}
                fullWidth
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {DEPOSIT_OPTIONS.map(option => (
                  <ToggleButton key={option.value} value={option.value.toString()}>
                    {option.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </FormControl>

            {/* Visibility */}
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">Visibility *</FormLabel>
              <ToggleButtonGroup
                value={visibility}
                exclusive
                onChange={(_, value) => value && setVisibility(value as 'public' | 'private')}
                fullWidth
                disabled={loading}
                sx={{ mt: 1 }}
              >
                <ToggleButton value="public">Public</ToggleButton>
                <ToggleButton value="private">Private</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            {/* Location Section */}
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Location
            </Typography>

            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              onBlur={() => handleBlur('address')}
              error={touched.address && !!errors.location}
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="City"
              value={city}
              onChange={e => setCity(e.target.value)}
              onBlur={() => handleBlur('city')}
              error={touched.city && !!errors.location}
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  onBlur={() => handleBlur('state')}
                  error={touched.state && !!errors.location}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  onBlur={() => handleBlur('zipCode')}
                  error={touched.zipCode && !!errors.location}
                  required
                  disabled={loading}
                />
              </Grid>
            </Grid>

            {errors.location && touched.address && (
              <FormHelperText error sx={{ mb: 2 }}>
                {errors.location}
              </FormHelperText>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Date/Time Section */}
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Date & Time
            </Typography>

            <TextField
              fullWidth
              label="Date & Time"
              type="datetime-local"
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              onBlur={() => handleBlur('dateTime')}
              error={touched.dateTime && !!errors.dateTime}
              helperText={touched.dateTime && errors.dateTime}
              required
              InputLabelProps={{ shrink: true }}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button variant="outlined" onClick={handleCancel} disabled={loading} fullWidth>
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
