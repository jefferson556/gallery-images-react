import { useEffect, useRef, useState } from 'react';
import { getPhaseImages } from '../utils/galleryUtils';
import PhaseSelector from './PhaseSelector';
import ImageViewer from './ImageViewer';
import ImageThumbnail from './ImageThumbnail';
import './GalleryModal.css';

const FOCUSABLE_SELECTORS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * GalleryModal displays details, phases, main image, and thumbnails for a project.
 * Implements WAI-ARIA Dialog guidelines:
 * - Traps Tab focus inside the modal.
 * - Closes on Escape.
 * - Returns focus to the trigger button on close.
 * - Lock background scrolling.
 */
export default function GalleryModal({ project, onClose }) {
  const modalRef = useRef(null);

  // Initialize phase to the first available phase in the project
  const availablePhases = Object.keys(project.phases || {});
  const initialPhase = availablePhases.includes('before') ? 'before' : (availablePhases[0] || '');
  const [activePhase, setActivePhase] = useState(initialPhase);

  // Track active image ID in the current phase
  const [activeImageId, setActiveImageId] = useState(null);

  // Fetch images for active phase
  const images = getPhaseImages(project, activePhase);
  
  // Resolve active image from ID, falling back to the first image of the phase
  const activeImage = images.find((img) => img.id === activeImageId) || images[0] || null;

  // Accessibility: Focus trap & Escape key listener
  useEffect(() => {
    const previousActiveElement = document.activeElement;
    document.body.classList.add('modal-open');

    // Move focus inside the modal
    if (modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(FOCUSABLE_SELECTORS);
      if (focusable.length > 0) {
        // Prefer focusing the close button or first interactive item
        focusable[0].focus();
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(modalRef.current.querySelectorAll(FOCUSABLE_SELECTORS));
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
      // Return focus to the element that triggered the modal
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [onClose]);

  if (!project) return null;

  // Handler for image index navigation
  const currentIndex = images.findIndex((img) => img.id === activeImage?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setActiveImageId(images[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setActiveImageId(images[currentIndex + 1].id);
    }
  };

  const activePhaseDescription = project.phases[activePhase]?.description || '';

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal-header">
          <div className="modal-title-wrap">
            <h2 id="modal-title" className="modal-title">
              {project.title}
            </h2>
            <p className="modal-subtitle">{project.description}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </header>

        <main className="modal-body">
          {/* Phase tab selectors */}
          <PhaseSelector
            phases={project.phases}
            activePhase={activePhase}
            onSelectPhase={setActivePhase}
          />

          {/* Phase Description */}
          {activePhaseDescription && (
            <p className="phase-description" aria-live="polite">
              {activePhaseDescription}
            </p>
          )}

          {/* Large image viewer */}
          <div className="viewer-section">
            <ImageViewer
              image={activeImage}
              onPrev={handlePrev}
              onNext={handleNext}
              hasPrev={hasPrev}
              hasNext={hasNext}
              currentIndex={currentIndex}
              totalImages={images.length}
            />
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="thumbnails-section">
              <h4 className="thumbnails-title">Images in this phase:</h4>
              <div className="thumbnails-strip" role="list">
                {images.map((img) => (
                  <div key={img.id} role="listitem">
                    <ImageThumbnail
                      image={img}
                      isActive={activeImage?.id === img.id}
                      onSelect={(selectedImg) => setActiveImageId(selectedImg.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
