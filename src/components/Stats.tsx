import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import { Star, TrendingUp, CheckCircle, Calculate, ArrowBack } from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';

interface StatsProps {
  onBack?: () => void;
}

const Stats: React.FC<StatsProps> = ({ onBack }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { score, streak, solutions, currentDate } = useGameStore();

  // NYT-style colors
  const colors = {
    text: isDarkMode ? '#FFFFFF' : '#121213',
    textLight: isDarkMode ? '#818384' : '#787C7E',
    border: isDarkMode ? '#3A3A3C' : '#D3D6DA',
    borderLight: isDarkMode ? '#3A3A3C' : '#E4E4E7',
    success: '#6AAA64',
    warning: '#C9B458',
    error: '#787C7E',
    background: isDarkMode ? '#121213' : '#FFFFFF',
    surfaceLight: isDarkMode ? '#1A1A1B' : '#F7F7F7',
    hover: isDarkMode ? '#2C2C2E' : '#F0F0F0',
    keyBackground: isDarkMode ? '#818384' : '#D3D6DA',
  };

  const statCards = [
    {
      icon: <CheckCircle sx={{ color: colors.success }} />,
      label: 'Solutions Today',
      value: solutions.length,
      description: `Equations solved for ${currentDate}`,
    },
    {
      icon: <Star sx={{ color: colors.warning }} />,
      label: 'Total Score',
      value: score,
      description: 'Points earned from all solutions',
    },
    {
      icon: <TrendingUp sx={{ color: colors.success }} />,
      label: 'Current Streak',
      value: streak,
      description: 'Days with at least one solution',
    },
    {
      icon: <Calculate sx={{ color: colors.text }} />,
      label: 'Average Score',
      value: solutions.length > 0 ? Math.round(score / solutions.length) : 0,
      description: 'Average points per solution',
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        px: 2,
        py: 3,
        backgroundColor: colors.background,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        {onBack && (
          <IconButton
            onClick={onBack}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: colors.text,
            }}
            aria-label="back to game"
          >
            <ArrowBack />
          </IconButton>
        )}
        
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"NYT-Franklin", "Helvetica Neue", Arial, sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: colors.text,
            mb: 0.5,
            textAlign: 'center',
          }}
        >
          Your Stats
        </Typography>
        
        <Typography
          sx={{
            fontSize: '14px',
            color: colors.textLight,
            fontWeight: 400,
            textAlign: 'center',
          }}
        >
          Performance overview for {currentDate}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        {statCards.map((stat, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: colors.surfaceLight,
              borderRadius: '8px',
              border: `1px solid ${colors.borderLight}`,
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              {stat.icon}
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.text,
                }}
              >
                {stat.label}
              </Typography>
            </Box>
            
            <Typography
              sx={{
                fontSize: '32px',
                fontWeight: 700,
                color: colors.text,
                mb: 0.5,
              }}
            >
              {stat.value}
            </Typography>
            
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.textLight,
                lineHeight: 1.4,
              }}
            >
              {stat.description}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Solutions History */}
      {solutions.length > 0 && (
        <>
          <Divider sx={{ my: 3, borderColor: colors.borderLight }} />
          
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: colors.text,
              mb: 2,
            }}
          >
            Today's Solutions
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {solutions.slice().reverse().map((solution, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: colors.surfaceLight,
                  borderRadius: '4px',
                  border: `1px solid ${colors.borderLight}`,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      color: colors.text,
                      fontWeight: 500,
                    }}
                  >
                    {solution.equation}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: colors.textLight,
                        textTransform: 'capitalize',
                      }}
                    >
                      {solution.complexity}
                    </Typography>
                    
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: colors.success,
                      }}
                    >
                      {solution.score}pts
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </>
      )}

      {solutions.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: colors.textLight,
          }}
        >
          <Calculate sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
            No solutions yet today
          </Typography>
          <Typography variant="body2">
            Solve your first equation to start tracking your progress!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Stats;