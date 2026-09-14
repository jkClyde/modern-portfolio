import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useLenis } from "lenis/react";
import { TiLocationArrow } from "react-icons/ti";
import { useState, useRef, useEffect } from "react";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

// ---- tunables, named instead of scattered magic numbers ----
const MOBILE_BREAKPOINT = "(max-width: 767px)";
const EDGE_MARGIN = 16; // px, keeps the "combined name" measurement on-screen
const INTRO_DELAY = 0.2; // small buffer once loader clears, not a load-time guess
const VIDEO_FADE_DELAY = 0.6;
const CHROME_FADE_DELAY = 0.9; // navbar + hero details

const VIDEO_FRAME_CLIP_CLOSED = "polygon(14% 0, 72% 0, 88% 90%, 0 95%)";
const VIDEO_FRAME_CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const lenis = useLenis();

  const videoRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const videoFrameRef = useRef(null);

  // Holds the built-but-paused intro timeline, and whether we're
  // on the mobile (no-animation) code path.
  const introTimelineRef = useRef(null);
  const isMobileRef = useRef(false);

  const handleVideoLoad = () => setLoading(false);

  const playVideoSafely = (video) => {
    video.play().catch((err) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Autoplay blocked or video failed to play:", err);
      }
    });
  };

  // Scroll-triggered "reveal" clip-path on the video frame.
  // Shared by both the mobile and desktop code paths.
  const setupFrameScrollReveal = () => {
    gsap.from(videoFrameRef.current, {
      clipPath: VIDEO_FRAME_CLIP_OPEN,
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: videoFrameRef.current,
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  };

  // Runs once on mount: sets initial visual states and, on desktop,
  // BUILDS the intro timeline paused. It does NOT play it — playback
  // is gated on the `loading` effect below, so it can never run ahead
  // of (or finish underneath) the loader.
  useGSAP(
    () => {
      const video = videoRef.current;
      const firstName = firstNameRef.current;
      const lastName = lastNameRef.current;
      const navbar = document.querySelector("#main-navbar"); // lives outside this component
      const videoFrame = videoFrameRef.current;

      if (!video || !firstName || !lastName || !videoFrame) return;

      const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;
      isMobileRef.current = isMobile;

      // --------------------------------------------------
      // MOBILE: skip the text-position animation and the
      // opacity fades — just show everything in its final
      // state and play the video. The scroll-triggered
      // frame reveal still runs on mobile.
      // --------------------------------------------------
      if (isMobile) {
        if (navbar) gsap.set(navbar, { opacity: 1 });
        gsap.set(video, { opacity: 1 });
        gsap.set("#hero-details", { opacity: 1 });
        gsap.set(firstName, { opacity: 1, color: "white", x: 0, y: 0 });
        gsap.set(lastName, { opacity: 1, color: "white", x: 0, y: 0 });
        gsap.set(videoFrame, {
          backgroundColor: "white",
          clipPath: VIDEO_FRAME_CLIP_CLOSED,
          borderRadius: "0% 0% 40% 10%",
        });

        playVideoSafely(video);
        setupFrameScrollReveal();
        return;
      }

      // --------------------------------------------------
      // INITIAL STATE (desktop)
      // --------------------------------------------------
      if (navbar) gsap.set(navbar, { opacity: 0 });
      gsap.set(video, { opacity: 0 });
      gsap.set("#hero-details", { opacity: 0 });
      gsap.set(firstName, { opacity: 1, color: "black" });
      gsap.set(lastName, { opacity: 1, color: "black" });
      gsap.set(videoFrame, {
        backgroundColor: "white",
        clipPath: VIDEO_FRAME_CLIP_CLOSED,
        borderRadius: "0% 0% 40% 10%",
      });

      // Lock scroll (via Lenis) until the intro animation completes.
      lenis?.stop();

      // --------------------------------------------------
      // BUILD A HIDDEN REFERENCE TO MEASURE "RANDALL AQUIN"
      // AS ONE COMBINED, CENTERED LINE. This is the original,
      // working measurement logic — unchanged.
      // --------------------------------------------------
      const measureContainer = document.createElement("div");
      measureContainer.style.position = "fixed";
      measureContainer.style.top = "0";
      measureContainer.style.left = "0";
      measureContainer.style.visibility = "hidden";
      measureContainer.style.whiteSpace = "nowrap";
      measureContainer.style.display = "flex";
      measureContainer.style.alignItems = "baseline";
      measureContainer.style.gap = "20px";

      const firstClone = firstName.cloneNode(true);
      const lastClone = lastName.cloneNode(true);

      firstClone.style.position = "static";
      lastClone.style.position = "static";
      firstClone.style.opacity = "1";
      lastClone.style.opacity = "1";

      measureContainer.appendChild(firstClone);
      measureContainer.appendChild(lastClone);
      document.body.appendChild(measureContainer);

      const combinedRect = measureContainer.getBoundingClientRect();
      const combinedCenterX = window.innerWidth / 2;
      const combinedCenterY = window.innerHeight / 2;

      let combinedLeft = combinedCenterX - combinedRect.width / 2;
      let combinedTop = combinedCenterY - combinedRect.height / 2;

      const maxLeft = window.innerWidth - EDGE_MARGIN - combinedRect.width;
      const maxTop = window.innerHeight - EDGE_MARGIN - combinedRect.height;

      combinedLeft = Math.min(Math.max(combinedLeft, EDGE_MARGIN), Math.max(EDGE_MARGIN, maxLeft));
      combinedTop = Math.min(Math.max(combinedTop, EDGE_MARGIN), Math.max(EDGE_MARGIN, maxTop));

      const firstCloneRect = firstClone.getBoundingClientRect();
      const lastCloneRect = lastClone.getBoundingClientRect();

      const targetFirstLeft = combinedLeft + (firstCloneRect.left - combinedRect.left);
      const targetFirstTop = combinedTop + (firstCloneRect.top - combinedRect.top);
      const targetLastLeft = combinedLeft + (lastCloneRect.left - combinedRect.left);
      const targetLastTop = combinedTop + (lastCloneRect.top - combinedRect.top);

      document.body.removeChild(measureContainer);

      const firstRect = firstName.getBoundingClientRect();
      const lastRect = lastName.getBoundingClientRect();

      const firstX = targetFirstLeft - firstRect.left;
      const firstY = targetFirstTop - firstRect.top;
      const lastX = targetLastLeft - lastRect.left;
      const lastY = targetLastTop - lastRect.top;

      // Built PAUSED. It only starts once the loading effect below
      // sees `loading === false` and calls .play() on it.
      const intro = gsap.timeline({
        paused: true,
        delay: INTRO_DELAY,
        onComplete: () => {
          playVideoSafely(video);
          lenis?.start();
        },
      });

      intro.fromTo(
        firstName,
        { x: firstX, y: firstY, color: "black", opacity: 1 },
        { x: 0, y: 0, color: "white", opacity: 1, duration: 2, ease: "power2.inOut", delay: 0.2 },
        0
      );

      intro.fromTo(
        lastName,
        { x: lastX, y: lastY, color: "black", opacity: 1 },
        { x: 0, y: 0, color: "white", opacity: 1, duration: 2, ease: "power2.inOut", delay: 0.2 },
        0
      );

      intro.to(video, { opacity: 1, duration: 1.8, ease: "power2.inOut" }, VIDEO_FADE_DELAY);

      if (navbar) {
        intro.to(navbar, { opacity: 1, duration: 1.5, ease: "power2.inOut" }, CHROME_FADE_DELAY);
      }

      intro.to("#hero-details", { opacity: 1, duration: 1.5, ease: "power2.inOut" }, CHROME_FADE_DELAY);

      introTimelineRef.current = intro;

      setupFrameScrollReveal();

      // Safety net: if the component unmounts before the intro
      // finishes, make sure scroll gets unlocked.
      return () => {
        lenis?.start();
      };
    },
    { dependencies: [lenis] }
  );

  // Plays the (already-built) intro timeline the moment the loader
  // actually clears — i.e. once the video has really finished loading —
  // instead of racing it against a fixed timer set at mount.
  useEffect(() => {
    if (!loading && !isMobileRef.current && introTimelineRef.current) {
      introTimelineRef.current.play();
    }
  }, [loading]);

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
        ref={videoFrameRef}
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-white"
      >
        <video
          ref={videoRef}
          id="hero-video"
          src="videos/banner.mp4"
          loop
          muted
          playsInline
          className="absolute left-0 top-0 size-full object-cover object-center"
          onLoadedData={handleVideoLoad}
        />

        {/* LAST NAME (foreground, clipped inside the frame) */}
        <h1
          ref={lastNameRef}
          className="lastname special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75"
        >
          AQUIN
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1
              ref={firstNameRef}
              id="first-name"
              className="special-font hero-heading text-blue-100"
            >
              RANDALL
            </h1>

            <div id="hero-details">
              <p className="mb-5 max-w-66 font-robert-regular text-blue-100">
                Full-Stack Developer
                <br />
                Turning Ideas Into Working Products
              </p>

              <Button
                title="Download Resume"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-[#4B3FD1] flex-center gap-1 text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fallback "AQUIN": revealed behind the frame once its
          clip-path opens on scroll. Not a duplicate bug — intentional. */}
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        AQUIN
      </h1>
    </div>
  );
};

export default Hero;