import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import Story from "../components/Story";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Work from "../components/Work";

function Home() {
    useEffect(() => {
        // Runs after every child section has mounted and created its own
        // ScrollTrigger/pin. The double rAF waits two full paint cycles,
        // so it's resilient even if a child's effect timing shifts things
        // slightly after the initial commit (e.g. a late layout write).
        let raf2;
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        });
        return () => {
            cancelAnimationFrame(raf1);
            if (raf2) cancelAnimationFrame(raf2);
        };
    }, []);

    return (
        <>
            <Hero />
            <About />
            <Work />
            <div className="-mt-[300px]">
                <Features />
            </div>
            <Story />
            <Contact />
            <Footer />
        </>
    );
}

export default Home;