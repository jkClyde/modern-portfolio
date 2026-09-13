"use client";

import { useRef } from "react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/all";

import Lenis from "lenis";

import { TiLocationArrow } from "react-icons/ti";

gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------------
// Swap `desktop`/`mobile` for real screenshots when you have them —
// each can be an image URL (rendered as <img>) or a hex color
// (rendered as a placeholder block) so the layout works today.
// --------------------------------------------------

const isColor = (value) => value.startsWith("#");

const projects = [
    {
        client: "ProjectHub",
        heading: "Full-stack project management, built to actually ship work.",
        description:
            "A Next.js 15 SaaS dashboard with Prisma and Supabase Auth underneath. Kanban boards with drag-and-drop task views, threaded comments per task, and every mutation running through Server Actions instead of a separate API layer.",
        tags: ["Next.js 15", "Prisma", "Supabase", "NextAuth"],
        color: "#4B3FD1",
        link: "#",
        desktop: "https://placehold.co/1280x800/3A2FB8/ffffff?text=ProjectHub+%E2%80%94+Desktop",
        mobile: "https://placehold.co/450x974/6E63EA/ffffff?text=ProjectHub+%E2%80%94+Mobile",
    },
    {
        client: "CalaTrace",
        heading: "Farm-to-shelf traceability for calamansi citrus.",
        description:
            "React Native/Expo app on Supabase covering the full harvest-to-retail journey — role-aware forms for farmers, intermediaries, transporters, and retailers, QR-based batch tracking, and live IoT sensor monitoring via an ESP32 gateway network.",
        tags: ["React Native", "Expo", "IoT", "Supabase"],
        color: "#FF7A21",
        link: "#",
        desktop: "https://placehold.co/1280x800/E5670F/ffffff?text=CalaTrace+%E2%80%94+Desktop",
        mobile: "https://placehold.co/450x974/FF9750/ffffff?text=CalaTrace+%E2%80%94+Mobile",
    },
    {
        client: "Animation Addon",
        heading: "Pro animation controls for Elementor, no code required.",
        description:
            "A WordPress plugin that brings GSAP's timeline and ScrollTrigger power into Elementor as plain widget settings — scroll-pinned sections, stagger presets, and scrub-based reveals page builders don't offer out of the box.",
        tags: ["GSAP", "ScrollTrigger", "WordPress Plugin"],
        color: "#E5342C",
        link: "#",
        desktop: "https://placehold.co/1280x800/C22921/ffffff?text=Animation+Addon+%E2%80%94+Desktop",
        mobile: "https://placehold.co/450x974/F0564E/ffffff?text=Animation+Addon+%E2%80%94+Mobile",
    },
];

// --------------------------------------------------
// Stack tuning — mirrors the reference implementation:
// cards sit centered (xPercent/yPercent -50/-50), waiting cards are
// nudged down + scaled down per layer, and the active card animates
// straight up and tilts back on exit as the next one takes over.
// --------------------------------------------------

const CARD_Y_OFFSET = 5;        // % vertical offset per waiting layer
const CARD_SCALE_STEP = 0.075;  // scale reduction per waiting layer
const EXIT_Y_PERCENT = -200;    // where the active card ends up on exit
const EXIT_ROTATION_X = 35;     // degrees it tilts back on exit
const SCROLL_LENGTH_MULTIPLIER = 0.5; // viewport-heights of scroll per card — this directly sets the size of the reserved pin-spacer gap before the next section

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
        // NOTE: if Lenis is already initialized elsewhere in your app (e.g.
        // a root layout provider), remove this block and just rely on that
        // instance — running two Lenis instances at once will fight each
        // other over scroll position.
        const lenis = new Lenis();

        lenis.on("scroll", ScrollTrigger.update);

        const raf = (time) => lenis.raf(time * 1000);

        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        const cards = projects.map((_, i) => cardRefs.current[i]).filter(Boolean);
        const totalCards = cards.length;
        const segmentSize = 1 / totalCards;

        cards.forEach((card, i) => {
            gsap.set(card, {
                xPercent: -50,
                yPercent: -50 + i * CARD_Y_OFFSET,
                scale: 1 - i * CARD_SCALE_STEP,
            });
        });

        // The cards are position:absolute so the container's height doesn't
        // auto-size to them — it was previously a fixed h-[85vh] guess,
        // taller than the actual content, leaving dead space below the
        // card. Measure the real rendered height instead and size the
        // container to match, recalculating on resize since content wraps
        // differently across breakpoints.
        const syncStackHeight = () => {
            if (!stackRef.current || cards.length === 0) return;
            const maxCardHeight = Math.max(...cards.map((c) => c.offsetHeight));
            stackRef.current.style.height = `${maxCardHeight}px`;
        };

        syncStackHeight();
        window.addEventListener("resize", syncStackHeight);

        const st = ScrollTrigger.create({
            trigger: stackRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * totalCards * SCROLL_LENGTH_MULTIPLIER}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
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
                            rotationX: EXIT_ROTATION_X,
                            scale: 1,
                        });
                    } else if (i === activeIndex) {
                        // Currently flipping/sliding away.
                        gsap.set(card, {
                            yPercent: gsap.utils.interpolate(-50, EXIT_Y_PERCENT, segProgress),
                            rotationX: gsap.utils.interpolate(0, EXIT_ROTATION_X, segProgress),
                            scale: 1,
                        });
                    } else {
                        // Still waiting, stacked behind.
                        const distanceFromActive = i - activeIndex;
                        gsap.set(card, {
                            yPercent: -50 + distanceFromActive * CARD_Y_OFFSET,
                            rotationX: 0,
                            scale: 1 - distanceFromActive * CARD_SCALE_STEP,
                        });
                    }
                });
            },
        });

        // If content above this section (e.g. Hero/About video or images)
        // finishes loading and changes height after this ScrollTrigger was
        // created, the cached start/end positions go stale and the pinned
        // stack can appear to overlap the section above. Refresh once
        // everything has loaded to resync positions with the real layout.
        const handleLoad = () => {
            syncStackHeight();
            ScrollTrigger.refresh();
        };
        window.addEventListener("load", handleLoad);

        return () => {
            st.kill();
            gsap.ticker.remove(raf);
            lenis.destroy();
            window.removeEventListener("load", handleLoad);
            window.removeEventListener("resize", syncStackHeight);
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
                    className="relative mx-auto min-h-[400px] w-full max-w-[1400px] [perspective:1600px]"
                >
                    {projects.map((project, i) => (
                        <div
                            key={project.client}
                            ref={(el) => (cardRefs.current[i] = el)}
                            style={{ zIndex: total - i, backgroundColor: project.color }}
                            className="absolute left-1/2 top-1/2 flex w-full flex-col overflow-hidden rounded-2xl p-8 will-change-transform sm:p-10 md:p-14"
                        >
                            <div className="flex items-start justify-between gap-6">
                                <h3 className="bento-title special-font max-w-xl text-3xl uppercase leading-[0.95] tracking-tight text-white sm:text-4xl md:text-5xl">
                                    {project.heading}
                                </h3>
                                <span className="font-circular-web text-xl text-white/50 md:text-2xl">
                                    ({String(i + 1).padStart(2, "0")})
                                </span>
                            </div>
                            <p className="mt-6 max-w-lg font-circular-web text-sm text-white/70 md:text-base">
                                {project.description}
                            </p>
                            <div className="mt-auto flex flex-col gap-8 pt-10 md:flex-row md:items-end md:justify-between">
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                                        {project.tags.map((tag) => (
                                            <div key={tag} className="flex flex-col items-start gap-1.5">
                                                <span className="h-0 w-0 border-x-4 border-x-transparent border-t-[6px] border-t-white/40" />
                                                <span className="font-circular-web text-xs uppercase tracking-wide text-white/80">
                                                    {tag}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative mx-auto w-full max-w-[460px] pb-12 sm:pb-14 md:mx-0 md:w-[660px]">
                                    {/* Laptop */}
                                    <div className="relative">
                                        <div className="overflow-hidden rounded-t-xl border-[8px] border-b-0 border-white/15 bg-black shadow-2xl">
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
                                                        className="size-full object-cover"
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
                                    <div className="absolute -bottom-3 right-1 w-[30%] overflow-hidden rounded-[1.6rem] border-[6px] border-white/15 bg-black shadow-2xl sm:right-4">
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
                                                    className="size-full object-cover"
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