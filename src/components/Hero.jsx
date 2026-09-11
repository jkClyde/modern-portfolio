import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useState } from "react";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);

  const handleVideoLoad = () => {
    setLoading(false);
  };

  useGSAP(() => {
    const video = document.querySelector("#hero-video");
    const firstName = document.querySelector("#first-name");
    const lastName = document.querySelector(".lastname");
    const navbar = document.querySelector("#main-navbar");

    if (!video || !firstName || !lastName) return;

    // --------------------------------------------------
    // GET ORIGINAL POSITION
    // --------------------------------------------------

    const firstRect = firstName.getBoundingClientRect();

    const firstX =
      window.innerWidth / 2 -
      (firstRect.left + firstRect.width / 2);

    const firstY =
      window.innerHeight / 2 -
      (firstRect.top + firstRect.height / 2);

    // --------------------------------------------------
    // INITIAL STATE
    // --------------------------------------------------

    // Navbar starts invisible.
    if (navbar) {
      gsap.set(navbar, {
        opacity: 0,
      });
    }

    // Video starts invisible.
    gsap.set("#hero-video", {
      opacity: 0,
    });

    // Content starts invisible.
    gsap.set("#hero-details", {
      opacity: 0,
    });

    // Names are ALWAYS visible.
    gsap.set("#first-name", {
      opacity: 1,
      color: "black",
    });

    gsap.set(".lastname", {
      opacity: 1,
      color: "black",
    });

    // Initial frame.
    gsap.set("#video-frame", {
      backgroundColor: "white",
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });

    // --------------------------------------------------
    // INTRO TIMELINE
    // --------------------------------------------------

    const intro = gsap.timeline({
      delay: 0.5,

      onComplete: () => {
        video.play().catch(() => { });
      },
    });

    // --------------------------------------------------
    // RANDALL
    // --------------------------------------------------

    intro.fromTo(
      "#first-name",
      {
        x: firstX,
        y: firstY,
        color: "black",
        opacity: 1,
      },
      {
        x: 0,
        y: 0,
        color: "white",
        opacity: 1,
        duration: 2,
        ease: "power2.inOut",
        delay: 0.2
      },
      0
    );

    // --------------------------------------------------
    // AQUIN
    // --------------------------------------------------

    intro.fromTo(
      ".lastname",
      {
        y: -window.innerHeight / 2,
        color: "black",
        opacity: 1,
      },
      {
        y: 0,
        color: "white",
        opacity: 1,
        duration: 2,
        ease: "power2.inOut",
        delay: 0.2

      },
      0
    );

    // --------------------------------------------------
    // VIDEO
    // --------------------------------------------------

    intro.to(
      "#hero-video",
      {
        opacity: 1,
        duration: 1.8,
        ease: "power2.inOut",
      },
      0.6
    );

    // --------------------------------------------------
    // NAVBAR
    // --------------------------------------------------

    // Navbar appears smoothly at the same time
    // as the Home content.
    if (navbar) {
      intro.to(
        navbar,
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        0.9
      );
    }

    // --------------------------------------------------
    // HOME CONTENT
    // --------------------------------------------------

    intro.to(
      "#hero-details",
      {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      },
      0.9
    );

    // --------------------------------------------------
    // SCROLL ANIMATION
    // --------------------------------------------------

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",

      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">

      {/* LOADER */}
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      {/* VIDEO FRAME */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-white"
      >

        {/* VIDEO */}
        <video
          id="hero-video"
          src="videos/banner.mp4"
          loop
          muted
          playsInline
          className="absolute left-0 top-0 size-full object-cover object-center"
          onLoadedData={handleVideoLoad}
        />

        {/* LAST NAME */}
        <h1 className="lastname special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          AQUIN
        </h1>

        {/* CONTENT */}
        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">

            {/* FIRST NAME */}
            <h1
              id="first-name"
              className="special-font hero-heading text-blue-100"
            >
              RANDALL
            </h1>

            {/* DESCRIPTION + BUTTON */}
            <div id="hero-details">
              <p className="mb-5 max-w-66 font-robert-regular text-blue-100">
                Full-Stack Developer
                <br />
                Turning Ideas Into Working Products
              </p>

              <Button
                id="watch-trailer"
                title="Download Resume"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 flex-center gap-1"
              />
            </div>

          </div>
        </div>
      </div>
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        AQUIN
      </h1>
    </div>
  );
};

export default Hero;