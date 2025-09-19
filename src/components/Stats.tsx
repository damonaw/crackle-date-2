import { useMemo } from 'react';
import { Box, Typography, Paper, Divider, IconButton } from '@mui/material';
import { Star, TrendingUp, CheckCircle, Calculate, ArrowBack } from '@mui/icons-material';
import type { Solution } from '../types/game';
import { useTheme as useMuiTheme, alpha } from '@mui/material/styles';
import MathEquation from './MathEquation';

interface StatsProps {
  onBack?: () => void;
  score: number;
  streak: number;
  solutions: Solution[];
  currentDate: string;
}

export default function Stats({ onBack, score, streak, solutions, currentDate }: StatsProps) {
  const theme = useMuiTheme();

  const statCards = useMemo(
    () => [
      {
        icon: <CheckCircle sx={{ color: theme.palette.primary.main }} />,
        label: 'Solutions Today',
        value: solutions.length,
        description: `Equations solved for ${currentDate}`,
      },
      {
        icon: <Star sx={{ color: theme.palette.secondary.main }} />,
        label: 'Total Score',
        value: score,
        description: 'Points earned from all solutions',
      },
      {
        icon: <TrendingUp sx={{ color: theme.palette.success.main }} />,
        label: 'Current Streak',
        value: streak,
        description: 'Days with at least one solution',
      },
      {
        icon: <Calculate sx={{ color: theme.palette.primary.main }} />,
        label: 'Average Score',
        value: solutions.length > 0 ? Math.round(score / solutions.length) : 0,
        description: 'Average points per solution',
      },
    ],
    [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      solutions.length,
      currentDate,
      score,
      streak,
    ]
  );

  const solutionsReversed = useMemo(() => solutions.slice().reverse(), [solutions]);

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        px: 2,
        py: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
      }}
    >
      <Box sx={{ position: 'relative', mb: 4 }}>
        {onBack && (
          <IconButton
            onClick={onBack}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: theme.palette.text.primary,
            }}
            aria-label="back to game"
          >
            <ArrowBack />
          </IconButton>
        )}

        <Typography
          variant="h4"
          sx={{
            fontFamily: theme.typography.fontFamily,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: theme.palette.text.primary,
            mb: 0.5,
            textAlign: 'center',
          }}
        >
          Your Stats
        </Typography>

        <Typography
          sx={{
            fontSize: '14px',
            color: theme.palette.text.secondary,
            fontWeight: 400,
            textAlign: 'center',
          }}
        >
          Performance overview for {currentDate}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        {statCards.map((stat, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: theme.palette.background.paper,
              borderRadius: '8px',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              {stat.icon}
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {stat.label}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: '32px',
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              {stat.value}
            </Typography>

            <Typography
              sx={{
                fontSize: '12px',
                color: theme.palette.text.secondary,
                lineHeight: 1.4,
              }}
            >
              {stat.description}
            </Typography>
          </Paper>
        ))}
      </Box>

      {solutionsReversed.length > 0 && (
        <>
          <Divider sx={{ my: 3, borderColor: alpha(theme.palette.primary.main, 0.12) }} />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Today's Solutions
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {solutionsReversed.map((solution: Solution, index: number) => (
              <Paper
                key={
                  typeof solution.timestamp === 'string' || solution.timestamp instanceof Date
                    ? new Date(solution.timestamp).getTime()
                    : index
                }
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '4px',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <MathEquation equation={solution.equation} className="math-equation" />

                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: theme.palette.text.secondary,
                        textTransform: 'capitalize',
                      }}
                    >
                      {solution.complexity}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: theme.palette.success.main,
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
            color: theme.palette.text.secondary,
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
}
