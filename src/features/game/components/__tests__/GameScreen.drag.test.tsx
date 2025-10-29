import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GameScreen from '../GameScreen';
import { useGameStore } from '../../state/game-store';

const TEST_DATE = '1-02-2024';

const mockRect = (
  element: Element,
  rect: Partial<DOMRect> & { left: number; top: number; width: number; height: number }
) => {
  Object.defineProperty(element, 'getBoundingClientRect', {
    value: () => ({
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      x: rect.left,
      y: rect.top,
      toJSON: () => {},
    }),
    configurable: true,
  });
};

const configureStore = (overrides: Partial<ReturnType<typeof useGameStore.getState>> = {}) => {
  const state = useGameStore.getState();
  useGameStore.setState({
    ...state,
    currentDate: TEST_DATE,
    equation: '',
    isValid: false,
    score: 0,
    solutions: [],
    hintsUsed: 0,
    streak: 0,
    availableDates: [TEST_DATE],
    tutorialSeen: true,
    dragAndDropEnabled: false,
    loadGameState: () => {},
    saveGameState: () => {},
    ...overrides,
  });
};

const getFirstDigitButton = () => {
  const digitPad = screen.getByLabelText('Date digits');
  const [firstDigit] = within(digitPad).getAllByRole('button');
  return firstDigit as HTMLButtonElement;
};

describe('GameScreen drag-and-drop', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('allows dragging the next digit into the equation', async () => {
    configureStore({ dragAndDropEnabled: true });
    vi.useFakeTimers();

    render(<GameScreen />);

    const equation = screen.getByRole('textbox', { name: 'Current equation' });
    mockRect(equation, { left: 0, top: 0, width: 320, height: 120 });

    const digitButton = getFirstDigitButton();
    const digitLabel = digitButton.textContent?.trim() ?? '';

    fireEvent.pointerDown(digitButton, {
      pointerId: 1,
      button: 0,
      clientX: 16,
      clientY: 16,
    });

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    fireEvent.pointerMove(window, { pointerId: 1, clientX: 40, clientY: 20 });
    const overlayDuringDrag = document.querySelector('.floating-token') as HTMLElement | null;
    expect(overlayDuringDrag).toBeTruthy();
    fireEvent.pointerUp(window, { pointerId: 1, clientX: 40, clientY: 20 });

    await act(async () => {
      vi.runOnlyPendingTimers();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(useGameStore.getState().equation).toBe(digitLabel);
    expect(screen.getByRole('button', { name: `Digit ${digitLabel}` })).toBeInTheDocument();
    expect(digitButton).toBeDisabled();
  });

  it('snaps operators back to the pad when dropped outside the equation', async () => {
    configureStore({ dragAndDropEnabled: true });
    vi.useFakeTimers();

    render(<GameScreen />);

    const equation = screen.getByRole('textbox', { name: 'Current equation' });
    mockRect(equation, { left: 0, top: 0, width: 320, height: 120 });

    const operatorPad = screen.getByLabelText('Math operators');
    const [plusButton] = within(operatorPad).getAllByRole('button');

    fireEvent.pointerDown(plusButton, {
      pointerId: 2,
      button: 0,
      clientX: 12,
      clientY: 12,
    });

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    fireEvent.pointerMove(window, { pointerId: 2, clientX: 520, clientY: 420 });
    fireEvent.pointerUp(window, { pointerId: 2, clientX: 520, clientY: 420 });

    const floatingToken = document.querySelector('.floating-token') as HTMLElement;
    expect(floatingToken).toHaveAttribute('data-returning', 'true');

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(document.querySelector('.floating-token')).not.toBeInTheDocument();
    expect(useGameStore.getState().equation).toBe('');
  });

  it('removes tokens dragged out of the equation and re-enables digits', async () => {
    configureStore({ dragAndDropEnabled: true });
    vi.useFakeTimers();

    render(<GameScreen />);

    const equation = screen.getByRole('textbox', { name: 'Current equation' });
    mockRect(equation, { left: 0, top: 0, width: 320, height: 120 });

    const digitButton = getFirstDigitButton();
    fireEvent.click(digitButton);
    await act(async () => {
      await Promise.resolve();
    });

    const digitLabel = digitButton.textContent?.trim() ?? '';
    const token = screen.getByRole('button', { name: `Digit ${digitLabel}` });
    mockRect(token, { left: 40, top: 20, width: 32, height: 32 });

    fireEvent.pointerDown(token, {
      pointerId: 3,
      button: 0,
      clientX: 48,
      clientY: 28,
    });

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    fireEvent.pointerMove(window, { pointerId: 3, clientX: 48, clientY: 220 });
    fireEvent.pointerUp(window, { pointerId: 3, clientX: 48, clientY: 220 });
    const removalOverlay = document.querySelector('.floating-token') as HTMLElement | null;
    expect(removalOverlay).toHaveAttribute('data-removing', 'true');

    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(document.querySelector('.floating-token')).not.toBeInTheDocument();
    expect(useGameStore.getState().equation).toBe('');
    expect(screen.queryByRole('button', { name: `Digit ${digitLabel}` })).not.toBeInTheDocument();
    expect(digitButton).not.toBeDisabled();
  });

  it('persists the beta toggle preference to localStorage', async () => {
    configureStore({ dragAndDropEnabled: false });
    const setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem');

    render(<GameScreen />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const toggle = screen.getByRole('checkbox', { name: /Drag & drop builder/i });
    await user.click(toggle);

    expect(useGameStore.getState().dragAndDropEnabled).toBe(true);
    const prefsCall = setItemSpy.mock.calls.find(([key]) => key === 'crackle-date-prefs');
    expect(prefsCall?.[1]).toContain('"dragAndDropBetaEnabled":true');

    setItemSpy.mockRestore();
  });

  it('continues to accept keyboard input while drag & drop is enabled', async () => {
    configureStore({ dragAndDropEnabled: true });

    render(<GameScreen />);

    const digitButton = getFirstDigitButton();
    const digitLabel = digitButton.textContent?.trim() ?? '';

    fireEvent.keyDown(window, { key: digitLabel });

    await screen.findByRole('button', { name: `Digit ${digitLabel}` });
    expect(digitButton).toBeDisabled();
  });
});
