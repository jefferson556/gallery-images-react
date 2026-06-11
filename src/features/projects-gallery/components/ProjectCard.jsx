import './ProjectCard.css';

/**
 * Reusable card component for a project.
 * Adapted from Ecotech's gen-card visual pattern.
 * No brand-specific names or colors hardcoded.
 */
export default function ProjectCard({ project, onView, viewButtonRef }) {
  const { title, description, coverImage } = project;

  return (
    <article className="gen-card">
      <div className="gen-card-img-wrap">
        <img
          src={coverImage.src}
          alt={coverImage.alt}
          className="gen-card-img"
          loading="lazy"
          decoding="async"
          width="600"
          height="338"
        />
      </div>
      <div className="gen-card-body">
        <h3 className="gen-card-title">{title}</h3>
        <p className="gen-card-text">{description}</p>
        <button
          ref={viewButtonRef}
          type="button"
          className="view-project-btn"
          onClick={() => onView(project)}
        >
          View Project
        </button>
      </div>
    </article>
  );
}
