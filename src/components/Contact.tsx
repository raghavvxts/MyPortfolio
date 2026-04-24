import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { portfolioData } from "../data/portfolioData";

const Contact = () => {
  const { links, contact, connect, education, achievements } = portfolioData;
  const socialLinks = [
    { label: "GitHub", href: links.github },
    { label: "LinkedIn", href: links.linkedin },
    { label: "YouTube", href: links.youtube },
    { label: "Instagram", href: links.instagram },
  ].filter((item) => Boolean(item.href));

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a href={links.linkedin} target="_blank" rel="noreferrer" data-cursor="disable">
                {connect.linkedinLabel}
              </a>
            </p>
            <p>
              <a href={`mailto:${contact.email}`} data-cursor="disable">
                Email - {contact.email}
              </a>
            </p>
            <p>
              <a href={`tel:${contact.phone}`} data-cursor="disable">
                Phone - {contact.phone}
              </a>
            </p>
            <h4>Education</h4>
            {education.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            {socialLinks.map((item) => (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="contact-social"
                key={item.label}
              >
                {item.label} <MdArrowOutward />
              </a>
            ))}
            <h4>Achievements</h4>
            {achievements.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>{connect.creditName}</span>
            </h2>
            <h5>
              <MdCopyright /> {connect.year}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
