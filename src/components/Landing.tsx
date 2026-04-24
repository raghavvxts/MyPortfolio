import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { portfolioData } from "../data/portfolioData";

const Landing = ({ children }: PropsWithChildren) => {
  const { profile } = portfolioData;
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {profile.firstName.toUpperCase()}
              <br />
              <span>{profile.lastName.toUpperCase()}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>{profile.headlineTop}</h3>
            <h2 className="landing-info-h2">{profile.headlineWords[0]}</h2>
            <h2 className="landing-info-secondary">{profile.headlineWords[1]}</h2>
            <p>{profile.heroTagline}</p>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
