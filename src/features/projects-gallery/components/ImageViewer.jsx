import './ImageViewer.css';

/**
 * ImageViewer displays the currently active image in full size
 * within the active phase of the project modal.
 * Contains navigation buttons to cycle through the phase's images.
 */
export default function ImageViewer({
  image,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentIndex,
  totalImages,
}) {
  if (!image) {
    return (
      <div className="image-viewer-placeholder">
        <p>No image available</p>
      </div>
    );
  }

  return (
    <div className="image-viewer">
      <div className="image-viewer-display">
        {hasPrev && (
          <button
            type="button"
            className="viewer-nav-btn viewer-nav-btn--prev"
            onClick={onPrev}
            aria-label="Previous image"
          >
            ‹
          </button>
        )}

        <img
          src={image.src}
          alt={image.alt || 'Project phase image'}
          className="viewer-img"
          decoding="async"
        />

        {hasNext && (
          <button
            type="button"
            className="viewer-nav-btn viewer-nav-btn--next"
            onClick={onNext}
            aria-label="Next image"
          >
            ›
          </button>
        )}
      </div>

      <div className="image-viewer-meta">
        <span className="image-counter" aria-live="polite">
          {currentIndex + 1} / {totalImages}
        </span>
      </div>
    </div>
  );
}
