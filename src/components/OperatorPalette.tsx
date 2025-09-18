import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { MATH_OPERATIONS } from '../utils/mathOperations';

interface DraggableOperatorProps {
  symbol: string;
  name: string;
  id: string;
}

const DraggableOperator: React.FC<DraggableOperatorProps> = ({ symbol, name, id }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <Chip
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      label={symbol}
      variant="outlined"
      color="primary"
      sx={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        height: 40,
        minWidth: 50,
        '&:hover': {
          backgroundColor: 'primary.light',
          color: 'white',
        },
        transition: 'all 0.2s ease-in-out',
      }}
      title={name}
    />
  );
};

const OperatorPalette: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" color="primary" mb={2}>
        Math Operators
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={1}>
        {MATH_OPERATIONS.map((operation) => (
          <DraggableOperator
            key={operation.symbol}
            id={`operator-${operation.symbol}`}
            symbol={operation.symbol}
            name={operation.name}
          />
        ))}
      </Box>

      <Typography variant="body2" color="text.secondary" mt={2}>
        Drag operators to build your equation
      </Typography>
    </Paper>
  );
};

export default OperatorPalette;