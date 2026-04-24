import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import { portfolioData } from "../data/portfolioData";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  const { links } = portfolioData;

  const socialLinks = [
    { href: links.github, icon: <FaGithub />, label: "GitHub" },
    { href: links.linkedin, icon: <FaLinkedinIn />, label: "LinkedIn" },
    { href: links.youtube, icon: <FaYoutube />, label: "YouTube" },
    { href: links.instagram, icon: <FaInstagram />, label: "Instagram" },
  ].filter((item) => Boolean(item.href));

  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        {socialLinks.map((item) => (
          <span key={item.label}>
            <a href={item.href} target="_blank" rel="noreferrer">
              {item.icon}
            </a>
          </span>
        ))}
      </div>
      {links.resume && (
        <a
          className="resume-button"
          href={encodeURI(links.resume)}
          target="_blank"
          rel="noreferrer"
        >
          <HoverLinks text="RESUME" />
          <span>
            <TbNotes />
          </span>
        </a>
      )}
    </div>
  );
};

export default SocialIcons;
