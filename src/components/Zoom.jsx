"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
};

// Scroll distance (px) the pinned zoom animation plays over.
const SCROLL_DISTANCE = 1200;

// How much each image scales up by the end of the scroll (index 0 = center hint box).
const SCALE_TARGETS = [4, 5, 6, 5, 6, 8, 9];

// One entry per image (index 0 is reserved for the center content block, handled separately below).
const IMAGES = [
    {
        src: "/img/w3.png",
        alt: "",
        containerClass:
            "imageContainer relative w-[50vw] h-[10vh] md:w-[30vw] md:h-[30vh] -top-[18vh] md:-top-[29.5vh] left-[3.5vw] overflow-hidden",
        overlayClass: "bg-black/5",
    },
    {
        src: "/img/w2.png",
        asBackground: true,
        containerClass:
            "imageContainer relative w-[50vw] h-[10vh] md:w-[28vw] md:h-[30vh] -top-[5vh] md:-top-[10vh] -left-[40vw] md:-left-[27.5vw] overflow-hidden bg-cover bg-center bg-no-repeat",
        overlayClass: "bg-black/30",
    },
    {
        src: "img/w1.png",
        alt: "image",
        containerClass:
            "imageContainer w-[50vw] md:w-[25vw] h-[12vh] md:h-[25vh] relative left-[40vw] md:left-[26vw] -top-[5vh] md:top-0",
        overlayClass: "bg-black/5",
    },
    {
        src: "/img/w4.png",
        asBackground: true,
        containerClass:
            "imageContainer w-[50vw] md:w-[24vw] h-[10vh] md:h-[25vh] relative top-[20vh] md:top-[27.5vh] left-[10.5vw] md:left-[2vw] bg-cover bg-center bg-no-repeat bg-top",
        overlayClass: null, // original has no overlay on this one
    },
    {
        src: "/img/w5.png",
        asBackground: true,
        containerClass:
            "imageContainer w-[50vw] md:w-[24vw] h-[12vh] md:h-[25vh] relative top-[7.5vh] md:top-[21vh] -left-[45.5vw] md:-left-[25.5vw] bg-cover bg-center bg-no-repeat bg-top",
        overlayClass: "bg-black/30",
    },
    {
        src: "/img/w6.png",
        asBackground: true,
        containerClass:
            "imageContainer w-[50vw] md:w-[20vw] h-[10vh] md:h-[20vh] relative top-[8vh] md:top-[24vh] left-[45vw] md:left-[26vw] bg-cover bg-center bg-no-repeat",
        overlayClass: "bg-black/50",
    },
];

const ScrollHint = () => (
    <div className="flex flex-col items-center mt-6 mb-8">
        <p className="scroll-label text-white text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 opacity-80 font-light">
            Scroll
        </p>

        {/* Mouse-shaped indicator */}
        <div className="relative w-[20px] sm:w-[24px] h-[34px] sm:h-[38px] rounded-full border border-white/50 flex justify-center pt-1.5 sm:pt-2">
            <div className="scroll-wheel-dot w-[3px] h-[6px] rounded-full bg-white" />
        </div>

        {/* Chevrons */}
        <div className="flex flex-col items-center -space-y-1.5 mt-3">
            {[0, 1].map((i) => (
                <svg
                    key={i}
                    className="scroll-chevron"
                    width="14"
                    height="7"
                    viewBox="0 0 16 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1 1L8 7L15 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ))}
        </div>
    </div>
);

const ZoomParallax = () => {
    const container = useRef(null);
    const imageRefs = useRef([]);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: `+=${SCROLL_DISTANCE}`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            imageRefs.current.forEach((el, index) => {
                if (!el) return;

                tl.fromTo(
                    el,
                    { scale: 1 },
                    { scale: SCALE_TARGETS[index], ease: "none" },
                    0
                );
            });

            // Decorative "scroll down" hint animation (unrelated to the zoom timeline).
            gsap
                .timeline({ repeat: -1 })
                .to(".scroll-wheel-dot", {
                    y: 10,
                    opacity: 0,
                    duration: 1,
                    ease: "power1.in",
                })
                .set(".scroll-wheel-dot", { y: 0, opacity: 1 });

            gsap.to(".scroll-chevron", {
                y: 6,
                opacity: 0.15,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                stagger: 0.15,
                ease: "power1.inOut",
            });

            gsap.to(".scroll-label", {
                opacity: 0.4,
                duration: 1.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        },
        { scope: container }
    );

    return (
        <div
            ref={container}
            className="relative h-dvh overflow-hidden"
            id="gallery"
        >
            {/* CENTER CONTENT */}
            <div
                ref={(el) => (imageRefs.current[0] = el)}
                className="flex justify-center items-center"
                style={overlayStyle}
            >
                <div
                    className="contentContainer w-[110px] md:w-[25vw] h-[23vh] md:h-[25vh] relative overflow-auto shadow flex flex-col justify-center"
                    style={{
                        backgroundImage: `url(img/image.png)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background to-transparent w-full pointer-events-none z-10"></div>

                    <div className="p-4 bg-black bg-opacity-70 h-full w-full flex justify-center items-center flex-col">
                        <ScrollHint />
                    </div>
                </div>
            </div>

            {/* IMAGES 1-6 */}
            {IMAGES.map((image, i) => (
                <div
                    key={image.src}
                    ref={(el) => (imageRefs.current[i + 1] = el)}
                    className="flex justify-center items-center"
                    style={overlayStyle}
                >
                    <div
                        className={image.containerClass}
                        style={
                            image.asBackground
                                ? { backgroundImage: `url('${image.src}')` }
                                : undefined
                        }
                    >
                        {!image.asBackground && (
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="absolute inset-0 w-full h-full object-cover object-top"
                            />
                        )}

                        {image.overlayClass && (
                            <div
                                className={`absolute inset-0 z-10 ${image.overlayClass}`}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ZoomParallax;