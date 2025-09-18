import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import DateDisplay from '../DateDisplay';

// Mock the game store
vi.mock('../../stores/gameStore', () => ({
  useGameStore: vi.fn((selector) => {
    const state = { currentDate: '9-17-2025' };
    return selector ? selector(state) : state;
  }),
}));

describe('DateDisplay', () => {
  it('renders today\'s puzzle with correct date', () => {
    render(<DateDisplay />);

    expect(screen.getByText('Today\'s Puzzle')).toBeInTheDocument();
    expect(screen.getByText('9-17-2025')).toBeInTheDocument();
    expect(screen.getByText('Use these digits in order:')).toBeInTheDocument();
  });

  it('displays individual digits correctly', () => {
    render(<DateDisplay />);

    // Should show digits: 9, 1, 7, 2, 0, 2, 5
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getAllByText('2')).toHaveLength(2); // Two 2s in the date
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});