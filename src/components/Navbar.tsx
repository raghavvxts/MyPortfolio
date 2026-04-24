import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";
import { portfolioData } from "../data/portfolioData";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother | null = null;

const Navbar = () => {
  const { profile } = portfolioData;
  useEffect(() => {
    const isDesktop = window.innerWidth > 1024;
    const navLinks = Array.from(document.querySelectorAll(".header ul a")) as HTMLAnchorElement[];
    const clickHandlers = new Map<HTMLAnchorElement, (e: Event) => void>();

    if (isDesktop) {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.7,
        speed: 1.7,
        effects: true,
        autoResize: true,
        ignoreMobileResize: true,
      });

      smoother.scrollTop(0);
      smoother.paused(true);
    }

    navLinks.forEach((element) => {
      const onClick = (e: Event) => {
        if (window.innerWidth > 1024 && smoother) {
          e.preventDefault();
          const target = e.currentTarget as HTMLAnchorElement;
          const section = target.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      };

      clickHandlers.set(element, onClick);
      element.addEventListener("click", onClick);
    });

    const onResize = () => {
      if (window.innerWidth > 1024) {
        ScrollSmoother.refresh(true);
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      navLinks.forEach((element) => {
        const handler = clickHandlers.get(element);
        if (handler) {
          element.removeEventListener("click", handler);
        }
      });

      window.removeEventListener("resize", onResize);

      if (smoother) {
        smoother.kill();
        smoother = null;
      }
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          {profile.initials}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
