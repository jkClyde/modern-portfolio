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
    // BUILD A HIDDEN REFERENCE TO MEASURE "RANDALL AQUIN"
    // AS ONE COMBINED, CENTERED LINE
    // --------------------------------------------------

    const measureContainer = document.createElement("div");
    measureContainer.style.position = "fixed";
    measureContainer.style.top = "0";
    measureContainer.style.left = "0";
    measureContainer.style.visibility = "hidden";
    measureContainer.style.whiteSpace = "nowrap";
    measureContainer.style.display = "flex";
    measureContainer.style.alignItems = "baseline";
    measureContainer.style.gap = "40px"; // space between words, tune as needed

    // Clone classes so font-size/weight match the real headings.
    const firstClone = firstName.cloneNode(true);
    const lastClone = lastName.cloneNode(true);

    // Reset any absolute positioning inherited from the originals.
    firstClone.style.position = "static";
    lastClone.style.position = "static";
    firstClone.style.opacity = "1";
    lastClone.style.opacity = "1";

    measureContainer.appendChild(firstClone);
    measureContainer.appendChild(lastClone);
    document.body.appendChild(measureContainer);

    // Center this combined block on screen.
    const combinedRect = measureContainer.getBoundingClientRect();
    const combinedCenterX = window.innerWidth / 2;
    const combinedCenterY = window.innerHeight / 2;
    const combinedLeft = combinedCenterX - combinedRect.width / 2;
    const combinedTop = combinedCenterY - combinedRect.height / 2;

    const firstCloneRect = firstClone.getBoundingClientRect();
    const lastCloneRect = lastClone.getBoundingClientRect();

    // Where each word WOULD be, in the centered combined line.
    const targetFirstLeft = combinedLeft + (firstCloneRect.left - combinedRect.left);
    const targetFirstTop = combinedTop + (firstCloneRect.top - combinedRect.top);

    const targetLastLeft = combinedLeft + (lastCloneRect.left - combinedRect.left);
    const targetLastTop = combinedTop + (lastCloneRect.top - combinedRect.top);

    document.body.removeChild(measureContainer);

    // --------------------------------------------------
    // NOW COMPARE TO EACH WORD'S ACTUAL NATURAL POSITION
    // --------------------------------------------------

    const firstRect = firstName.getBoundingClientRect();
    const lastRect = lastName.getBoundingClientRect();

    const firstX = targetFirstLeft - firstRect.left;
    const firstY = targetFirstTop - firstRect.top;

    const lastX = targetLastLeft - lastRect.left;
    const lastY = targetLastTop - lastRect.top;

    // --------------------------------------------------
    // INITIAL STATE
    // --------------------------------------------------

    if (navbar) gsap.set(navbar, { opacity: 0 });
    gsap.set("#hero-video", { opacity: 0 });
    gsap.set("#hero-details", { opacity: 0 });
    gsap.set("#first-name", { opacity: 1, color: "black" });
    gsap.set(".lastname", { opacity: 1, color: "black" });
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

    intro.fromTo(
      "#first-name",
      { x: firstX, y: firstY, color: "black", opacity: 1 },
      { x: 0, y: 0, color: "white", opacity: 1, duration: 2, ease: "power2.inOut", delay: 0.2 },
      0
    );

    intro.fromTo(
      ".lastname",
      { x: lastX, y: lastY, color: "black", opacity: 1 },
      { x: 0, y: 0, color: "white", opacity: 1, duration: 2, ease: "power2.inOut", delay: 0.2 },
      0
    );

    intro.to("#hero-video", { opacity: 1, duration: 1.8, ease: "power2.inOut" }, 0.6);

    if (navbar) {
      intro.to(navbar, { opacity: 1, duration: 1.5, ease: "power2.inOut" }, 0.9);
    }

    intro.to("#hero-details", { opacity: 1, duration: 1.5, ease: "power2.inOut" }, 0.9);

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
            <h1 id="first-name" className="special-font hero-heading text-blue-100">
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