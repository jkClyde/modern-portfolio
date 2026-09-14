"use client";

import { useRef } from "react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/all";

import Laptop3D from "./3d/Laptop3D";


gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------------
// Each card is a looping muted video with two floating pill tags
// top-left and a gradient-backed title + one-liner bottom-left.
// Swap `video` for your own footage per service whenever you have it —
// these are free Mixkit stock clips chosen to roughly match each
// service (coding, gears/automation, a phone, a circuit board, etc).
//
// NOTE: the first card ("WordPress Development") now renders the
// Laptop3D model instead of its video — see the conditional render
// below. Its `video`/`poster` fields are kept in the data so it's a
// one-line change to swap back if needed.
// --------------------------------------------------

const services = [
    {
        name: "WordPress Development",
        video: "https://assets.mixkit.co/videos/41646/41646-720.mp4",
        poster: "https://assets.mixkit.co/videos/41646/41646-thumb-720-0.jpg",
        tags: ["WordPress", "Elementor"],
        description:
            "Custom builds on WordPress and Elementor, tuned for speed and easy edits.",
    },
    {
        name: "Web Applications",
        video: "https://assets.mixkit.co/videos/41647/41647-720.mp4",
        poster: "https://assets.mixkit.co/videos/41647/41647-thumb-720-0.jpg",
        tags: ["React", "Next.js"],
        description:
            "Dashboards and internal tools built with React, Next.js, and Laravel.",
    },
    {
        name: "GoHighLevel Automation",
        video: "https://assets.mixkit.co/videos/32651/32651-720.mp4",
        poster: "https://assets.mixkit.co/videos/32651/32651-thumb-720-0.jpg",
        tags: ["GoHighLevel", "Automation"],
        description:
            "Funnels, CRM pipelines, and automations that run without you.",
    },
    {
        name: "Mobile Apps",
        video: "https://assets.mixkit.co/videos/4915/4915-720.mp4",
        poster: "https://assets.mixkit.co/videos/4915/4915-thumb-720-0.jpg",
        tags: ["React Native", "Expo"],
        description:
            "Cross-platform apps built once with React Native, shipped to both stores.",
    },
    {
        name: "Systems Engineering",
        video: "https://assets.mixkit.co/videos/22027/22027-720.mp4",
        poster: "https://assets.mixkit.co/videos/22027/22027-thumb-720-0.jpg",
        tags: ["Backend", "IoT"],
        description:
            "Backend systems and IoT integrations built to handle real data.",
    },
    {
        name: "AI Solutions",
        video: "https://assets.mixkit.co/videos/31590/31590-720.mp4",
        poster: "https://assets.mixkit.co/videos/31590/31590-thumb-720-0.jpg",
        tags: ["AI", "Automation"],
        description:
            "LLM-powered tools and chat interfaces built into your existing workflow.",
    },
];

const Services = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const trackRef = useRef(null);
    const progressRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(headingRef.current, {
                opacity: 0,
                y: 40,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 80%",
                },
            });
        },
        { scope: headingRef },
    );

    useGSAP(
        () => {
            // Smooth scroll (Lenis) is owned once, page-wide, in Home.jsx —
            // this section only creates its own ScrollTrigger and reacts to
            // whatever scroll position Lenis/ScrollTrigger reports. Do not
            // create another Lenis instance here: two instances fight over
            // scroll position and that's what was causing the sudden jump.

            // Pin + drive the track on every breakpoint, mobile included —
            // vertical touch scroll gets converted into horizontal motion
            // the same way mouse-wheel scroll does on desktop.
            const track = trackRef.current;
            const getScrollDistance = () =>
                track.scrollWidth - window.innerWidth;

            const st = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${getScrollDistance()}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const distance = getScrollDistance();
                    gsap.set(track, { x: -distance * self.progress });
                    if (progressRef.current) {
                        gsap.set(progressRef.current, {
                            scaleX: self.progress,
                        });
                    }
                },
            });

            // Same reasoning as the Work section: if content above this
            // changes height after ScrollTrigger measured it, the cached
            // start/end goes stale. Refresh once everything has loaded.
            const handleLoad = () => ScrollTrigger.refresh();
            window.addEventListener("load", handleLoad);

            return () => {
                st.kill();
                window.removeEventListener("load", handleLoad);
            };
        },
        { scope: sectionRef, dependencies: [] },
    );

    return (
        <section
            id="services"
            ref={sectionRef}
            className="relative flex h-screen flex-col bg-black"
        >
            <div
                ref={headingRef}
                className="container relative z-10 mx-auto shrink-0 px-5 pt-16 md:px-10 md:pt-20"
            >
                <p className="font-circular-web text-lg text-blue-50">
                    Services
                </p>
                <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
                    Six disciplines, one team — from a WordPress rebuild to a
                    system that talks to hardware.
                </p>
            </div>

            <div className="relative mt-8 min-h-0 w-full flex-1 overflow-hidden md:mt-10">
                {/* This inner box is capped/centered exactly like the
                    heading above (`container mx-auto px-5 md:px-10`, which
                    Tailwind caps at 1536px at the 2xl breakpoint). The
                    track is absolutely positioned inside it starting at
                    left-0, so the first card's left edge lines up with the
                    heading text — while the track itself is free to overflow
                    past the container's right edge and off the viewport for
                    the horizontal scroll. */}
                <div className="container relative mx-auto h-full px-5 md:px-10">
                    <div
                        ref={trackRef}
                        className="absolute inset-y-0 left-5 flex h-full w-max items-stretch gap-4 will-change-transform md:left-10 md:gap-6"
                    >
                        {services.map((service) => (
                            <div
                                key={service.name}
                                className="service-panel relative h-full w-[85vw] shrink-0 overflow-hidden rounded-2xl bg-white/5 sm:w-[55vw] md:w-[38vw] lg:w-[31vw]"
                            >
                                {service.name === "WordPress Development" ? (
                                    <Laptop3D />
                                ) : (
                                    <video
                                        src={service.video}
                                        poster={service.poster}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="absolute inset-0 size-full object-cover"
                                    />
                                )}

                                <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-3 sm:p-4">
                                    {service.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-white/15 bg-black/40 px-3 py-1 font-circular-web text-[10px] uppercase tracking-wide text-white backdrop-blur-md sm:text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-6 sm:pt-24">
                                    <h3 className="bento-title special-font text-2xl uppercase leading-none tracking-tight text-white sm:text-3xl md:text-4xl">
                                        {service.name}
                                    </h3>
                                    <p className="mt-2 max-w-md font-circular-web text-xs text-white/70 sm:text-sm">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* End-of-track cue: signals the horizontal ride is
                            over and normal vertical scrolling is about to
                            take back over. Bundled into the track itself so
                            it's included in the scrollWidth the pin
                            distance is based on. */}
                        <div className="flex h-full w-[45vw] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl bg-white/5 sm:w-[28vw] md:w-[18vw] lg:w-[14vw]">
                            <svg
                                viewBox="0 0 100 140"
                                className="h-12 w-12 animate-bounce sm:h-16 sm:w-16"
                                fill="none"
                            >
                                <line
                                    x1="50"
                                    y1="0"
                                    x2="50"
                                    y2="95"
                                    stroke="white"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M10 70 L50 125 L90 70"
                                    stroke="white"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className="font-circular-web text-[10px] uppercase tracking-wide text-white/50 sm:text-xs">
                                Keep scrolling
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative mx-5 mb-6 mt-6 h-[2px] shrink-0 bg-white/10 md:mx-10 md:mb-8">
                <div
                    ref={progressRef}
                    className="h-full w-full origin-left bg-white/70"
                    style={{ transform: "scaleX(0)" }}
                />
            </div>
        </section>
    );
};

export default Services;