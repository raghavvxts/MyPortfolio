import "./styles/Career.css";
import { portfolioData } from "../data/portfolioData";

const Career = () => {
  const { career, careerIntro } = portfolioData;

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <p className="career-intro">{careerIntro}</p>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {career.map((item, index) => (
            <div className="career-info-box" key={`${item.role}-${index}`}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  {item.company && <h5>{item.company}</h5>}
                </div>
                <h3>{item.period}</h3>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
