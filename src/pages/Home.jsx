import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Hero from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import Story from "../components/Story";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Work from "../components/Work";
import Services from "../components/Services";

const MOBILE_BREAKPOINT = 768; // matches Tailwind's `md` breakpoint
const MOBILE_TOUCH_MULTIPLIER = 0.6; // <1 = a swipe covers less scroll distance ("resistance"), still 1:1 responsive, just damped
const DESKTOP_TOUCH_MULTIPLIER = 1; // default Lenis feel on trackpad/desktop touch

function Home() {
    useEffect(() => {
        // Single, page-wide Lenis instance. Sections (Hero, Work, etc.)
        // should NOT create their own — two Lenis instances fight over
        // scroll position, which is what was causing sections to suddenly
        // jump mid-scroll.
        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
        const lenis = new Lenis({
            touchMultiplier: isMobile ? MOBILE_TOUCH_MULTIPLIER : DESKTOP_TOUCH_MULTIPLIER,
        });

        lenis.on("scroll", ScrollTrigger.update);

        const raf = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        let raf2;
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        });

        return () => {
            cancelAnimationFrame(raf1);
            if (raf2) cancelAnimationFrame(raf2);
            gsap.ticker.remove(raf);
            lenis.destroy();
        };
    }, []);

    return (
        <>
            <Hero />
            <About />
            <Work />
            <div className="-mt-[300px]">
                <Services />
            </div>
            <Contact />
            <Footer />
        </>
    );
}

export default Home;