import './PhaseSelector.css';
import { PHASE_ORDER } from '../utils/galleryUtils';

/**
 * Tab buttons for switching between project phases.
 * Phase order: Before → During → After
 */
export default function PhaseSelector({ phases, activePhase, onSelectPhase }) {
  return (
    <nav className="phase-selector" aria-label="Project phases">
      {PHASE_ORDER.map((key) => {
        const phase = phases[key];
        if (!phase) return null;
        const isActive = activePhase === key;

        return (
          <button
            key={key}
            type="button"
            className={`phase-tab ${isActive ? 'phase-tab--active' : ''}`}
            onClick={() => onSelectPhase(key)}
            aria-pressed={isActive}
          >
            {phase.label}
          </button>
        );
      })}
    </nav>
  );
}
