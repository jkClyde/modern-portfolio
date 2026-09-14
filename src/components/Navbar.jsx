import clsx from "clsx";
import { useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useLenis } from "lenis/react";

import Button from "./Button";

const navItems = ["Services", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  const audioElementRef = useRef(null);
  const lenis = useLenis();

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  const handleAudioToggle = () => {
    toggleAudioIndicator();
    if (!isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  };

  const handleNavClick = (e, item) => {
    e.preventDefault();
    const target = `#${item.toLowerCase()}`;
    lenis?.scrollTo(target, { offset: 0, duration: 1.5 });
  };

  return (
    <div className="absolute inset-x-0 top-4 z-50 h-16 border-none sm:inset-x-6">
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <img src="/img/dp.webp" alt="logo" className="w-10" />
          </div>

          <div className="flex h-full items-center gap-5">
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => handleNavClick(e, item)}
                  className="nav-hover-btn"
                >
                  {item}
                </a>
              ))}
            </div>
            <Button
              href="#work"
              title="Projects"
              onClick={(e) => handleNavClick(e, "work")}
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>
        </nav>
      </header>
    </div >
  );
};

export default NavBar;