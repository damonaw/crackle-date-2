import type { ReactNode } from 'react';

interface AppHeaderProps {
  tagline: string;
  title: string;
  date?: string;
  dateLabel?: string;
  condensed?: boolean;
  className?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export default function AppHeader({
  tagline,
  title,
  date,
  dateLabel,
  condensed = false,
  className,
  leftSlot,
  rightSlot,
}: AppHeaderProps) {
  const classes = ['game-header'];
  if (className) {
    classes.push(className);
  }
  const hasLeft = Boolean(leftSlot);
  const hasRight = Boolean(rightSlot);

  return (
    <header
      className={classes.join(' ')}
      data-condensed={condensed}
      data-has-left={hasLeft}
      data-has-right={hasRight}
    >
      {hasLeft ? (
        <div className="game-header-slot" data-align="left">
          {leftSlot}
        </div>
      ) : null}
      <div className="game-header-title">
        <p className="game-header-tagline">{tagline}</p>
        <h1>{title}</h1>
        {date ? (
          <p className="game-header-date" aria-label={dateLabel}>
            {date}
          </p>
        ) : null}
      </div>
      {hasRight ? (
        <div className="game-header-slot" data-align="right">
          {rightSlot}
        </div>
      ) : null}
    </header>
  );
}
