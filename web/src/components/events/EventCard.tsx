/**
 * EventCard Component - Web
 * Displays event information in a card format for event lists
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import { CalendarToday, LocationOn, People, EmojiEvents } from '@mui/icons-material';
import { Event } from '@gss/shared';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

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

export default function EventCard({ event, onClick }: EventCardProps) {
  const sportIcon = sportIconMap[event.sport] || '🏅';
  const spotsAvailable = event.capacity ? event.capacity - event.currentParticipants : null;
  const isFull = event.capacity && event.currentParticipants >= event.capacity;
  const depositAmount = event.depositAmount ? `$${(event.depositAmount / 100).toFixed(0)}` : '$0';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <CardContent sx={{ width: '100%', flexGrow: 1 }}>
          {/* Header with sport icon and deposit badge */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1.5,
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.light',
                width: 48,
                height: 48,
                fontSize: '1.5rem',
              }}
            >
              {sportIcon}
            </Avatar>
            {event.depositAmount > 0 && (
              <Chip
                icon={<EmojiEvents sx={{ fontSize: '1rem' }} />}
                label={depositAmount}
                size="small"
                color="warning"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>

          {/* Event Title */}
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '3em',
            }}
          >
            {event.title}
          </Typography>

          {/* Event Details */}
          <Stack spacing={1} sx={{ mt: 2 }}>
            {/* Date/Time */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {format(new Date(event.startTime), 'MMM d, yyyy • h:mm a')}
              </Typography>
            </Box>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {event.location.address}
                {event.distance && ` • ${event.distance.toFixed(1)} mi`}
              </Typography>
            </Box>

            {/* Participants */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {event.currentParticipants}
                {event.capacity && `/${event.capacity}`} participants
                {isFull && (
                  <Chip
                    label="Full"
                    size="small"
                    color="error"
                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                  />
                )}
                {!isFull && spotsAvailable && spotsAvailable <= 3 && (
                  <Chip
                    label={`${spotsAvailable} left`}
                    size="small"
                    color="warning"
                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
