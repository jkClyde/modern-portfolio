"use client";

import { useRef } from "react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/all";

import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------------
// Each service is one full-height panel. `capabilities` is the top
// row (marked with a small triangle, like the reference slider) and
// `stack` is the plain second row — the tools/tech behind it.
// Swap the hex colors for your real palette whenever you're ready.
// --------------------------------------------------

const services = [
    {
        name: "WordPress Development",
        color: "#2D5F8A",
        image: "https://picsum.photos/seed/wordpress-dev/900/700",
        capabilities: [
            "Custom Themes",
            "Plugin Development",
            "Elementor & Bricks Builds",
            "Site Migrations",
        ],
        stack: ["WordPress", "Elementor", "Bricks", "WooCommerce"],
    },
    {
        name: "Web Applications",
        color: "#5B4FD6",
        image: "https://picsum.photos/seed/web-apps/900/700",
        capabilities: [
            "SaaS Dashboards",
            "Server Actions & APIs",
            "Auth & Payments",
            "Design Systems",
        ],
        stack: ["React", "Next.js", "Laravel", "Supabase"],
    },
    {
        name: "GoHighLevel Automation",
        color: "#1F8A6E",
        image: "https://picsum.photos/seed/ghl-automation/900/700",
        capabilities: [
            "Funnel Builds",
            "CRM Pipelines",
            "Workflow Automation",
            "Custom Integrations",
        ],
        stack: ["GoHighLevel", "Zapier", "Webhooks", "Twilio"],
    },
    {
        name: "Mobile Apps",
        color: "#FF7A21",
        image: "https://picsum.photos/seed/mobile-apps/900/700",
        capabilities: [
            "Cross-Platform Builds",
            "Offline-First Sync",
            "Push Notifications",
            "App Store Releases",
        ],
        stack: ["React Native", "Expo", "Supabase", "EAS"],
    },
    {
        name: "Systems Engineering",
        color: "#45566B",
        image: "https://picsum.photos/seed/systems-eng/900/700",
        capabilities: [
            "IoT Integrations",
            "Backend Architecture",
            "Database Design",
            "Role-Based Access",
        ],
        stack: ["Node.js", "PostgreSQL", "ESP32", "REST / GraphQL"],
    },
    {
        name: "AI Solutions",
        color: "#C9297A",
        image: "https://picsum.photos/seed/ai-solutions/900/700",
        capabilities: [
            "LLM Integrations",
            "Custom Chatbots",
            "Workflow Automation",
            "Data Pipelines",
        ],
        stack: ["OpenAI", "Claude", "LangChain", "Vector DBs"],
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
            // NOTE: if Lenis is already initialized elsewhere in your app
            // (e.g. a root layout provider), remove this block and rely on
            // that instance instead — two Lenis instances fight each other.
            const lenis = new Lenis();

            lenis.on("scroll", ScrollTrigger.update);

            const raf = (time) => lenis.raf(time * 1000);

            gsap.ticker.add(raf);
            gsap.ticker.lagSmoothing(0);

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
                gsap.ticker.remove(raf);
                lenis.destroy();
                window.removeEventListener("load", handleLoad);
            };
        },
        { scope: sectionRef, dependencies: [] },
    );

    return (
        <section id="services" ref={sectionRef} className="relative bg-black">
            <div
                ref={headingRef}
                className="container relative z-10 mx-auto px-5 pt-24 md:px-10"
            >
                <p className="font-circular-web text-lg text-blue-50">
                    Services
                </p>
                <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
                    Six disciplines, one team — from a WordPress rebuild to a
                    system that talks to hardware.
                </p>
            </div>

            <div className="relative mt-12 h-[78vh] min-h-[560px] max-h-[820px] w-full overflow-hidden md:mt-16 md:h-[75vh] md:min-h-[600px] md:max-h-[860px]">
                <div
                    ref={trackRef}
                    className="flex h-full w-max will-change-transform"
                >
                    {services.map((service, i) => (
                        <div
                            key={service.name}
                            style={{ backgroundColor: service.color }}
                            className="service-panel relative flex h-full w-[88vw] shrink-0 flex-col overflow-hidden px-6 py-8 sm:w-[70vw] sm:px-10 sm:py-10 md:w-[58vw] md:px-14 md:py-12 lg:w-[46vw]"
                        >
                            <div>
                                <p className="font-circular-web text-sm uppercase tracking-wide text-black/60">
                                    Service
                                </p>
                                <h3 className="bento-title special-font mt-2 max-w-xl text-4xl uppercase leading-[0.95] tracking-tight text-black sm:text-5xl md:text-6xl">
                                    {service.name}
                                </h3>
                            </div>

                            <div className="relative mt-6 min-h-0 flex-1 overflow-hidden rounded-xl">
                                <img
                                    src={service.image}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            </div>

                            <div className="mt-6 flex flex-col shrink-0">
                                <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-black/70 pb-4">
                                    {service.capabilities.map((item) => (
                                        <div
                                            key={item}
                                            className="flex flex-col items-start gap-1.5"
                                        >
                                            <span className="h-0 w-0 border-x-4 border-x-transparent border-t-[6px] border-t-black/60" />
                                            <span className="font-circular-web text-xs uppercase tracking-wide text-black/80 sm:text-sm">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-4">
                                    {service.stack.map((item) => (
                                        <span
                                            key={item}
                                            className="font-circular-web text-sm font-medium text-black sm:text-base"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                    <span className="ml-auto font-circular-web text-xs text-black/50 sm:text-sm">
                                        {String(i + 1).padStart(2, "0")} /{" "}
                                        {String(services.length).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* End-of-track cue: signals the horizontal ride is
                        over and normal vertical scrolling is about to take
                        back over. Bundled into the track itself so it's
                        included in the scrollWidth the pin distance is
                        based on. */}
                    <div className="flex h-full w-[60vw] shrink-0 flex-col items-center justify-center gap-4 bg-black sm:w-[45vw] md:w-[32vw] lg:w-[24vw]">
                        <svg
                            viewBox="0 0 100 140"
                            className="h-16 w-16 animate-bounce sm:h-20 sm:w-20 md:h-24 md:w-24"
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
                        <p className="font-circular-web text-xs uppercase tracking-wide text-white/50 sm:text-sm">
                            Keep scrolling
                        </p>
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
                    <div
                        ref={progressRef}
                        className="h-full w-full origin-left bg-white/70"
                        style={{ transform: "scaleX(0)" }}
                    />
                </div>
            </div>
        </section>
    );
};

export default Services;