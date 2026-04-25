import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { portfolioData } from "../data/portfolioData";

const projects = portfolioData.projects.filter(
  (project) =>
    Boolean(project.title?.trim()) &&
    Boolean(project.image?.trim()) &&
    Boolean(project.tools?.trim())
);

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
    },
    []
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        {projects.length === 0 && (
          <p className="work-empty">Projects will appear here once added in portfolio data.</p>
        )}

        <div className="carousel-wrapper">
          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-main">
                        <div className="carousel-details">
                          <h4>{project.title}</h4>
                          <p className="carousel-category">{project.category}</p>
                        </div>

                        <div className="carousel-image-wrapper">
                          <WorkImage
                            image={project.image}
                            alt={project.title}
                            imagePosition={project.imagePosition}
                            link={project.link}
                          />
                        </div>

                        <div className="carousel-tools">
                          <span className="tools-label">Built With</span>
                          <p>{project.tools}</p>
                          {project.demoLink && (
                            <a
                              className="project-live-link"
                              href={project.demoLink}
                              target="_blank"
                              rel="noreferrer"
                              data-cursor="disable"
                            >
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-controls">
            <button
              className="carousel-arrow"
              onClick={goToPrev}
              aria-label="Previous project"
              data-cursor="disable"
            >
              <MdArrowBack />
            </button>

            <div className="carousel-dots">
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                    }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to project ${index + 1}`}
                  data-cursor="disable"
                />
              ))}
            </div>

            <button
              className="carousel-arrow"
              onClick={goToNext}
              aria-label="Next project"
              data-cursor="disable"
            >
              <MdArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
