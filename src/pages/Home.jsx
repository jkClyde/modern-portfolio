import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";

import Hero from "../components/Hero";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Work from "../components/Work";
import Services from "../components/Services";

const MOBILE_BREAKPOINT = 768;
const MOBILE_TOUCH_MULTIPLIER = 0.6;
const DESKTOP_TOUCH_MULTIPLIER = 1;

function LenisGsapSync() {
    const lenis = useLenis(() => {
        ScrollTrigger.update();
    });

    useEffect(() => {
        if (!lenis) return;

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
        };
    }, [lenis]);

    return null;
}

function Home() {
    const [lenisOptions] = useState(() => ({
        touchMultiplier:
            window.innerWidth < MOBILE_BREAKPOINT
                ? MOBILE_TOUCH_MULTIPLIER
                : DESKTOP_TOUCH_MULTIPLIER,
    }));

    return (
        <ReactLenis root options={{ ...lenisOptions, autoRaf: false }}>
            <LenisGsapSync />

            <Hero />
            <About />
            <Work />
            <div className="-mt-[300px]">
                <Services />
            </div>
            <Contact />
            <Footer />
        </ReactLenis>
    );
}

export default Home;