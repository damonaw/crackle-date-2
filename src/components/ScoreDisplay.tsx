import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { Star, TrendingUp } from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';

const ScoreDisplay: React.FC = () => {
  const { score, streak, solutions } = useGameStore();

  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="primary">
          Your Progress
        </Typography>
      </Box>

      <Box display="flex" gap={2} justifyContent="space-around" alignItems="center">
        <Box textAlign="center">
          <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={1}>
            <Star color="warning" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Score
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {score}
          </Typography>
        </Box>

        <Box textAlign="center">
          <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={1}>
            <TrendingUp color="success" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Streak
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight="bold" color="success.main">
            {streak}
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary" mb={1}>
            Solutions
          </Typography>
          <Chip
            label={solutions.length}
            color="info"
            variant="outlined"
            size="small"
            sx={{ fontSize: '1rem', fontWeight: 'bold' }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default ScoreDisplay;