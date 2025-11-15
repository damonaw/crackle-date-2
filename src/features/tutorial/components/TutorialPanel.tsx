import PanelBackButton from '../../ui/components/PanelBackButton';
import '../../ui/components/panel-base.css';
import './tutorial-panel.css';

// Material UI style icons as SVG components
const SchoolIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
  </svg>
);

const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
  </svg>
);

const StarsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

interface TutorialPanelProps {
  onBack?: () => void;
}

export default function TutorialPanel({ onBack }: TutorialPanelProps) {
  return (
    <section className="app-panel tutorial-panel" aria-labelledby="tutorial-heading">
      <header className="app-panel-header tutorial-panel-header">
        {onBack && (
          <PanelBackButton
            className="app-panel-back"
            onClick={onBack}
            ariaLabel="Back to game"
            label="Back"
          />
        )}
        <h2 id="tutorial-heading">How to Play</h2>
      </header>

      <div className="app-panel-body">
        <div className="tutorial-panel-summary">
          <div className="tutorial-panel-stats">
            <div className="tutorial-panel-stat">
              <div className="tutorial-panel-stat-icon">
                <TargetIcon />
              </div>
              <div className="tutorial-panel-stat-content">
                <div className="tutorial-panel-stat-value">Goal</div>
                <div className="tutorial-panel-stat-label">Create equations using today's date</div>
              </div>
            </div>
            <div className="tutorial-panel-stat">
              <div className="tutorial-panel-stat-icon">
                <StarsIcon />
              </div>
              <div className="tutorial-panel-stat-content">
                <div className="tutorial-panel-stat-value">Points</div>
                <div className="tutorial-panel-stat-label">
                  Score points for complexity and speed
                </div>
              </div>
            </div>
            <div className="tutorial-panel-stat">
              <div className="tutorial-panel-stat-icon">
                <LightbulbIcon />
              </div>
              <div className="tutorial-panel-stat-content">
                <div className="tutorial-panel-stat-value">Strategy</div>
                <div className="tutorial-panel-stat-label">
                  Use all four digits and any operations
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tutorial-panel-content">
          <div className="tutorial-panel-sections">
            <div className="tutorial-panel-section">
              <h3>
                <SchoolIcon />
                Basic Rules
              </h3>
              <div className="tutorial-panel-cards">
                <div className="tutorial-panel-card">
                  <h4>Use Today's Date</h4>
                  <p>
                    Each day you get four digits from the current date (MMDD). Use each digit
                    exactly once to create mathematical equations.
                  </p>
                </div>
                <div className="tutorial-panel-card">
                  <h4>Mathematical Operations</h4>
                  <p>
                    You can use addition (+), subtraction (-), multiplication (*), division (/), and
                    parentheses to create valid equations.
                  </p>
                </div>
                <div className="tutorial-panel-card">
                  <h4>Valid Equations</h4>
                  <p>
                    Your equation must equal a valid number. The more complex your equation, the
                    more points you'll score!
                  </p>
                </div>
              </div>
            </div>

            <div className="tutorial-panel-section">
              <h3>
                <StarsIcon />
                Scoring System
              </h3>
              <div className="tutorial-panel-cards">
                <div className="tutorial-panel-card">
                  <h4>Base Points</h4>
                  <p>
                    Every valid equation starts with 10 points. Simple equations like "1+2+3+4=10"
                    earn the minimum.
                  </p>
                </div>
                <div className="tutorial-panel-card">
                  <h4>Complexity Bonus</h4>
                  <p>
                    Using multiplication, division, and parentheses increases your score. More
                    complex operations = more points!
                  </p>
                </div>
                <div className="tutorial-panel-card">
                  <h4>Speed Bonus</h4>
                  <p>
                    Solve equations quickly to earn time bonuses. The faster you think, the higher
                    your score!
                  </p>
                </div>
              </div>
            </div>

            <div className="tutorial-panel-section">
              <h3>
                <LightbulbIcon />
                Pro Tips
              </h3>
              <div className="tutorial-panel-cards">
                <div className="tutorial-panel-card">
                  <h4>Think Outside the Box</h4>
                  <p>
                    Try unusual combinations like (1+2)*3+4=13 or 1*2*3+4=10. Creativity pays off!
                  </p>
                </div>
                <div className="tutorial-panel-card">
                  <h4>Use Parentheses</h4>
                  <p>
                    Control the order of operations with parentheses to create more complex
                    equations.
                  </p>
                </div>
                <div className="tutorial-panel-card">
                  <h4>Practice Daily</h4>
                  <p>
                    Come back every day for new date combinations. The more you play, the better
                    you'll get!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
