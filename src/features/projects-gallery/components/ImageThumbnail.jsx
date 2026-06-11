import './ImageThumbnail.css';

/**
 * ImageThumbnail renders an individual thumbnail button for the gallery slider.
 * Optimized with proper size attributes, loading="lazy", and semantic accessibility.
 */
export default function ImageThumbnail({
  image,
  isActive,
  onSelect,
}) {
  return (
    <button
      type="button"
      className={`thumbnail-btn ${isActive ? 'thumbnail-btn--active' : ''}`}
      onClick={() => onSelect(image)}
      aria-label={`View image: ${image.alt || 'Project photo'}`}
      aria-current={isActive ? 'true' : 'false'}
    >
      <img
        src={image.src}
        alt="" /* Empty alt on the internal img since the button has a descriptive aria-label */
        className="thumbnail-img"
        loading="lazy"
        width="120"
        height="80"
      />
    </button>
  );
}
