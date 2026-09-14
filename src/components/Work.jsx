"use client";

import { useRef } from "react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/all";

import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers fire a resize event when the address bar collapses/expands
// on scroll, which changes window.innerHeight. Since our pin `end` is based
// on innerHeight, an auto-refresh at that moment recalculates a shorter end,
// landing behind the current scroll position — the pin unlocks instantly and
// it looks like the section "jumps" straight to whatever comes after it.
// This tells ScrollTrigger to ignore that specific class of resize.
ScrollTrigger.config({ ignoreMobileResize: true });

// --------------------------------------------------
// Swap `desktop`/`mobile` for real screenshots when you have them —
// each can be an image URL (rendered as <img>) or a hex color
// (rendered as a placeholder block) so the layout works today.
// --------------------------------------------------

const isColor = (value) => value.startsWith("#");

// Darken/lighten a hex color by a percentage (-100 to 100).
const shade = (hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.max(0, Math.min(255, (num >> 16) + amt));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Build a diagonal gradient (light -> dark) from a project's base color.
const cardGradient = (hex) =>
    `linear-gradient(135deg, ${shade(hex, 15)}, ${shade(hex, -20)})`;

// Translucent tint of a project's color, used as the glass card's surface color.
// Darkened first so white text stays readable against the glass.
const glassTint = (hex, alpha) => {
    const darkened = shade(hex, -35);
    const num = parseInt(darkened.replace("#", ""), 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const projects = [
    {
        client: "Ayoha",
        heading: "Ayoha Cafe",
        description:
            "A modern landing page built with Next.js, Tailwind CSS, and GSAP, focused on creating an engaging and immersive browsing experience through smooth scroll interactions and dynamic animations. The page uses scroll-driven transitions, motion effects, and carefully timed visual elements to guide users through the content while maintaining a clean and responsive design.",
        tags: ["Next.js", "Tailwind CSS", "GSAP"],
        color: "#5B21B6", // violet
        link: "#",
        desktop: "/img/works/ayoha-desktop.png",
        mobile: "/img/works/ayoha-mobile.png",
    },
    {
        client: "BDN Shop",
        heading: "BDN Shop",
        description:
            "A modern e-commerce store built with Next.js and Tailwind CSS, using WooCommerce as a headless CMS for product and order management. The frontend delivers a responsive shopping experience with dynamic product browsing, cart functionality, and a streamlined checkout flow.",
        tags: ["NextJS", "Tailwind CSS", "WooCommerce", "REST API"],
        color: "#0369A1", // teal-blue
        link: "#",
        desktop: "/img/works/bdn-desktop.png",
        mobile: "/img/works/bdn-desktop.png",
    },
    {
        client: "CalaTrace",
        heading: "CalaTrace",
        description:
            "A mobile application for tracking produce batches throughout the supply chain, providing chain-of-custody tracking with real-time location mapping and IoT sensor monitoring. The app displays live temperature, humidity, and vibration readings to help monitor produce conditions from harvest to delivery.",
        tags: ["React Native", "Supabase", "IoT"],
        color: "#15803D", // green
        link: "#",
        desktop: "/img/works/calatrace-dashboard.png",
        mobile: "/img/works/calatrace-mobile.png",
    },

    {
        client: "Project Management",
        heading: "PMS",
        description:
            "A project management SaaS platform designed to help teams organize projects, manage tasks, and track progress in one centralized workspace. Built with a modern responsive interface featuring role-based access, project and task management, and a structured workflow for keeping teams organized and productive.",
        tags: ["NextJS", "Firebase", "Tailwind", "ShadCN", "Prisma"],
        color: "#9D174D", // deep purple/plum
        link: "#",
        desktop: "/img/works/pms-desktop.png",
        mobile: "/img/works/pms-mobile.png",
    },
];

// --------------------------------------------------
// Stack tuning — mirrors the reference implementation:
// cards sit centered (xPercent/yPercent -50/-50), waiting cards are
// nudged down + scaled down per layer, and the active card animates
// straight up and tilts back on exit as the next one takes over.
// --------------------------------------------------

const CARD_Y_OFFSET = 8;        // % vertical offset per waiting layer
const CARD_SCALE_STEP = 0.075;  // scale reduction per waiting layer
const EXIT_Y_PERCENT = -200;    // where the active card ends up on exit
const EXIT_ROTATION_X = 35;     // degrees it tilts back on exit (desktop only — see isMobile branch below)
const PIN_TOP_OFFSET_MOBILE = 40;  // px gap on small screens
const PIN_TOP_OFFSET_DESKTOP = 80; // px gap on md+ screens
const MOBILE_BREAKPOINT = 768;     // matches Tailwind's `md` breakpoint
const SCROLL_LENGTH_MULTIPLIER = 0.5; // viewport-heights of scroll per card — this directly sets the size of the reserved pin-spacer gap before the next section
const MOBILE_SCRUB = 0.9;  // lowered from 1.4 — a heavy scrub value means GSAP keeps animating after the finger lifts, which reads as extra lag on touch
const DESKTOP_SCRUB = 1;

// How big a single-frame scroll delta (px) has to be before ScrollTrigger
// treats it as a "fast scroll" and snaps straight to a boundary instead of
// animating through the pin. Mobile flings can legitimately produce very
// large single-tick deltas (much bigger than a desktop wheel tick), so the
// GSAP default was triggering on ordinary fast flicks — specifically on
// scroll-up, where there's very little runway (PIN_TOP_OFFSET) before the
// start boundary — and snapping the pin open early, which looked like a
// jump straight back up to Hero/About. Raising the threshold on mobile
// stops normal flings from being misread as "fast scroll end" events.
const FAST_SCROLL_END_THRESHOLD_MOBILE = 8000;

const Work = () => {
    const total = projects.length;
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const stackRef = useRef(null);
    const cardRefs = useRef({});

    useGSAP(() => {
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
    }, { scope: headingRef });

    useGSAP(() => {
        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

        // Smooth scroll (Lenis) is owned once, page-wide, in Home.jsx — this
        // section only creates its own ScrollTrigger and reacts to whatever
        // scroll position Lenis/ScrollTrigger reports. Do not create another
        // Lenis instance here: two instances fight over scroll position and
        // that's what was causing the sudden jump.
        const cards = projects.map((_, i) => cardRefs.current[i]).filter(Boolean);
        const totalCards = cards.length;
        const segmentSize = 1 / totalCards;

        cards.forEach((card, i) => {
            gsap.set(card, {
                xPercent: -50,
                yPercent: -50 + i * CARD_Y_OFFSET,
                scale: 1 - i * CARD_SCALE_STEP,
                // Pre-declare the properties we'll animate so the browser can
                // promote each card to its own compositor layer up front,
                // instead of promoting it mid-scroll the first time rotationX
                // or transform changes — that late promotion is itself a
                // dropped-frame moment, which reads as a "jolt" right as the
                // pin engages.
                force3D: true,
            });
        });

        const st = ScrollTrigger.create({
            trigger: stackRef.current,
            start: () =>
                `top ${window.innerWidth < MOBILE_BREAKPOINT ? PIN_TOP_OFFSET_MOBILE : PIN_TOP_OFFSET_DESKTOP}px`,
            end: () => `+=${window.innerHeight * totalCards * SCROLL_LENGTH_MULTIPLIER}`,
            pin: true,
            pinSpacing: true,
            scrub: isMobile ? MOBILE_SCRUB : DESKTOP_SCRUB,
            // On a fast flick, the scroll delta between two Lenis/ScrollTrigger
            // updates can jump across the entire pinned range in one tick.
            // fastScrollEnd tells ScrollTrigger to snap straight to whichever
            // boundary (pinned-in or released) instead of trying to interpolate
            // through it. `true` uses GSAP's default (fairly low) threshold,
            // which was firing on ordinary mobile flings — especially
            // scrolling UP, where there's little runway before the start
            // boundary — and snapping the pin open early. Mobile gets an
            // explicit, much higher threshold instead.
            fastScrollEnd: isMobile ? FAST_SCROLL_END_THRESHOLD_MOBILE : true,
            // Precomputes the pin position slightly ahead of the boundary so
            // there's no lag/flash right at the pin engage point. Keep this
            // on for both — turning it off is what usually causes a visible
            // "pop" the instant the pin locks in.
            anticipatePin: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const activeIndex = Math.min(
                    Math.floor(progress / segmentSize),
                    totalCards - 1,
                );
                const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

                cards.forEach((card, i) => {
                    if (i < activeIndex) {
                        // Already had its turn — parked off-screen.
                        gsap.set(card, {
                            yPercent: EXIT_Y_PERCENT,
                            // Skip the 3D tilt on mobile: rotationX forces the
                            // browser to keep re-flattening/recompositing a
                            // 3D transform on a blurred layer every scroll
                            // tick, which is one of the more expensive things
                            // you can ask a phone GPU to do continuously.
                            rotationX: isMobile ? 0 : EXIT_ROTATION_X,
                            scale: 1,
                        });
                    } else if (i === activeIndex) {
                        // Currently flipping/sliding away.
                        gsap.set(card, {
                            yPercent: gsap.utils.interpolate(-50, EXIT_Y_PERCENT, segProgress),
                            rotationX: isMobile
                                ? 0
                                : gsap.utils.interpolate(0, EXIT_ROTATION_X, segProgress),
                            scale: 1,
                        });
                    } else {
                        // Still waiting, stacked behind.
                        const distanceFromActive = i - activeIndex;

                        if (distanceFromActive === 1) {
                            // The next card in line: grow/rise into place
                            // continuously as the active card exits, driven
                            // by the same segProgress, instead of jumping
                            // straight to its new size once it becomes active.
                            const fromScale = 1 - distanceFromActive * CARD_SCALE_STEP;
                            const fromYPercent = -50 + distanceFromActive * CARD_Y_OFFSET;
                            gsap.set(card, {
                                yPercent: gsap.utils.interpolate(fromYPercent, -50, segProgress),
                                scale: gsap.utils.interpolate(fromScale, 1, segProgress),
                                rotationX: 0,
                            });
                        } else {
                            gsap.set(card, {
                                yPercent: -50 + distanceFromActive * CARD_Y_OFFSET,
                                rotationX: 0,
                                scale: 1 - distanceFromActive * CARD_SCALE_STEP,
                            });
                        }
                    }
                });
            },
        });

        // If content above this section (e.g. Hero/About video or images)
        // finishes loading and changes height after this ScrollTrigger was
        // created, the cached start/end positions go stale and the pinned
        // stack can appear to overlap the section above. Refresh once
        // everything has loaded to resync positions with the real layout.
        const handleLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", handleLoad);

        return () => {
            st.kill();
            window.removeEventListener("load", handleLoad);
        };
    }, { scope: sectionRef, dependencies: [] });

    return (
        <section id="work" ref={sectionRef} className="bg-black pt-24">
            <div className="container mx-auto px-3 md:px-10">
                <div ref={headingRef} className="relative z-10 mb-16 px-5">
                    <p className="font-circular-web text-lg text-blue-50">Selected Work</p>
                    <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
                        A look at the projects I've built, from full-stack SaaS apps to
                        mobile traceability tools and custom WordPress tooling.
                    </p>
                </div>
                <div
                    ref={stackRef}
                    className="relative mx-auto mt-16 h-[80vh] min-h-[600px] max-h-[900px] w-full max-w-[1400px] [perspective:1600px] md:mt-24 md:h-[70vh] md:min-h-[520px] md:max-h-[820px]"
                >
                    {projects.map((project, i) => (
                        <div
                            key={project.client}
                            ref={(el) => (cardRefs.current[i] = el)}
                            style={{
                                zIndex: total - i,
                                backgroundColor: glassTint(project.color, 0.45),
                            }}
                            className="absolute left-1/2 top-1/2 flex size-full flex-col justify-center overflow-hidden rounded-2xl p-6 sm:p-10 md:p-14 border border-white/20 shadow-2xl shadow-black/40 backdrop-blur-md md:backdrop-blur-2xl [will-change:transform] [transform:translateZ(0)]"
                        >
                            {/* Soft glow blobs behind the glass, tinted with the project's color,
                                so there's something with color/texture for the blur to pick up */}
                            <div
                                className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full opacity-25 blur-3xl"
                                style={{ backgroundColor: project.color }}
                            />
                            <div
                                className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full opacity-20 blur-3xl"
                                style={{ backgroundColor: shade(project.color, -20) }}
                            />

                            {/* Dark scrim so text keeps contrast regardless of the underlying color */}
                            <div className="pointer-events-none absolute inset-0 bg-black/35" />

                            {/* Faint top sheen for the classic glass "catching light" edge */}
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                            <div className="relative flex flex-col  gap-[4rem] md:h-full md:flex-row md:items-center md:gap-14">
                                {/* Left: details */}
                                <div className="flex flex-col gap-3 md:flex-1 md:gap-6">
                                    <div className="flex items-start justify-between gap-6">
                                        <h3 className="bento-title  special-font max-w-xl text-3xl uppercase leading-[0.95] tracking-tight text-white sm:text-4xl md:text-5xl">
                                            {project.heading}
                                        </h3>
                                        <span className="font-circular-web text-xl text-white/50 md:text-2xl">
                                            ({String(i + 1).padStart(2, "0")})
                                        </span>
                                    </div>
                                    <p className="max-w-lg font-circular-web text-sm text-white/80 md:text-base">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-x-6 gap-y-3 md:mt-auto md:pt-0">
                                        {project.tags.map((tag) => (
                                            <div key={tag} className="flex flex-col items-start gap-1.5">
                                                <span className="h-0 w-0 border-x-4 border-x-transparent border-t-[6px] border-t-white/40" />
                                                <span className="font-circular-web text-xs uppercase tracking-wide text-white/80">
                                                    {tag}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        title="View Website"
                                        leftIcon={<TiLocationArrow />}
                                        containerClass="bg-white flex-center gap-1"
                                        style={{ color: project.color }}
                                    />
                                </div>

                                {/* Right: device mockup */}
                                <div className="relative mx-auto w-full max-w-[100%] shrink-0 pb-8 sm:max-w-[100%] sm:pb-10 md:mx-0 md:w-[560px] md:max-w-none md:pb-14">
                                    {/* Laptop */}
                                    <div className="relative">
                                        <div className="overflow-hidden rounded-t-[15px] border-2 border-b-0 border-white/15 bg-black shadow-2xl md:rounded-t-xl md:border-[8px]">
                                            <div className="aspect-video w-full">
                                                {isColor(project.desktop) ? (
                                                    <div
                                                        className="size-full"
                                                        style={{ backgroundColor: project.desktop }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={project.desktop}
                                                        alt={`${project.client} desktop view`}
                                                        className="size-full object-contain object-top md:object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        {/* Laptop base */}
                                        <div className="relative h-3.5 rounded-b-lg bg-white/15">
                                            <div className="absolute left-1/2 top-0 h-1.5 w-1/5 -translate-x-1/2 rounded-b-sm bg-white/25" />
                                        </div>
                                    </div>

                                    {/* Phone, overlapping the laptop's bottom-right corner */}
                                    <div className="absolute -bottom-3 right-1 w-[30%] overflow-hidden rounded-[15px] border-2 border-white/15 bg-black shadow-2xl sm:right-4 md:rounded-[1.6rem] md:border-[6px]">
                                        <div className="relative aspect-[9/19]">
                                            {isColor(project.mobile) ? (
                                                <div
                                                    className="size-full"
                                                    style={{ backgroundColor: project.mobile }}
                                                />
                                            ) : (
                                                <img
                                                    src={project.mobile}
                                                    alt={`${project.client} mobile view`}
                                                    className="size-full object-contain object-top md:object-cover"
                                                />
                                            )}
                                            <div className="absolute left-1/2 top-2 h-1.5 w-1/3 -translate-x-1/2 rounded-full bg-black/60" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Work;