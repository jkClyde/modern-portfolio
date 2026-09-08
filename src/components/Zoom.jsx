import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
};

const ZoomParallax = () => {
    const container = useRef(null);
    const imageRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scaleTargets = [4, 5, 6, 5, 6, 8, 9];

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: "+=1200",
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
                    { scale: scaleTargets[index], ease: "none" },
                    0
                );
            });
        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={container} className="relative h-[100vh] overflow-hidden" id="gallery">
            <div
                ref={(el) => (imageRefs.current[0] = el)}
                className="flex justify-center items-center"
                style={overlayStyle}
            >
                <div
                    className="contentContainer md:w-[25vw] h-[23vh] md:h-[25vh] relative overflow-auto  shadow flex flex-col justify-center"
                    style={{
                        backgroundImage: `url(img/image.png)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background to-transparent w-full pointer-events-none z-10"></div>
                    <div className="p-4 bg-black bg-opacity-70 h-full w-full flex justify-center items-center flex-col">
                        <div className="flex flex-col items-center mt-6 mb-8">
                            <p className="text-white text-[12px] sm:text-sm mb-2 opacity-80">
                                Scroll Down
                            </p>

                            <div className="relative w-3 sm:w-5 h-6 sm:h-8 rounded-full flex items-center justify-center">
                                <div className="scroll-dot w-1 h-1 bg-white rounded-full" />
                            </div>

                            <div className="scroll-arrow mt-2">
                                <svg
                                    width="16"
                                    height="8"
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                ref={(el) => (imageRefs.current[1] = el)}
                className="flex justify-center items-center"
                style={overlayStyle}
            >
                <div className="imageContainer relative w-[50vw] h-[10vh] md:h-[30vh] -top-[18vh] md:-top-[28vh] md:-top-[29.5vh] left-[3.5vw] overflow-hidden">
                    <img
                        src="/img/w3.png"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-top"
                    />

                    <div className="absolute inset-0 z-10 bg-black/5"></div>
                </div>
            </div>

            <div
                ref={(el) => (imageRefs.current[2] = el)}
                className="flex justify-center items-center"
                style={overlayStyle}
            >
                <div
                    className="imageContainer relative w-[50vw] h-[10vh] md:w-[28vw] md:h-[30vh] -top-[5vh] md:-top-[8vh] md:-top-[10vh] -left-[40vw] md:-left-[32vw] md:-left-[27.5vw] overflow-hidden bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/img/w2.png')" }}
                >
                    <div className="absolute inset-0 z-10 bg-black/30"></div>
                </div>
            </div>

            <div
                ref={(el) => (imageRefs.current[3] = el)}
                className="flex justify-center items-center"
                style={overlayStyle}
            >
                <div className="imageContainer w-[50vw] md:w-[25vw] h-[12vh] md:h-[25vh] relative left-[40vw] md:left-[26vw] -top-[5vh] md:top-0">
                    <img
                        src="img/w1.png"
                        alt="image"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                    />

                    <div className="absolute inset-0 bg-black/5 z-10"></div>
                </div>
            </div>

            <div
                ref={(el) => (imageRefs.current[4] = el)}
                className="flex justify-center items-center"
                style={overlayStyle}
            >
                <div
                    className="imageContainer w-[50vw] md:w-[27vw] h-[10vh] relative top-[20vh] md:top-[27.5vh] left-[10.5vw] bg-cover bg-center bg-no-repeat bg-top"
                    style={{ backgroundImage: "url('/img/w4.png')" }}
                ></div>
            </div>

            <div
                ref={(el) => (imageRefs.current[5] = el)}
                className="flex justify-center items-center"
                style={overlayStyle}
            >
                <div
                    className="imageContainer w-[50vw] h-[12vh] relative top-[7.5vh] md:top-[24vh] md:top-[21vh] -left-[45.5vw] md:-left-[25.5vw] bg-cover bg-center bg-no-repeat bg-top"
                    style={{ backgroundImage: "url('/img/w5.png')" }}
                >
                    <div className="absolute inset-0 bg-black/30 z-10"></div>
                </div>
            </div>

            <div
                ref={(el) => (imageRefs.current[6] = el)}
                className="flex justify-center items-center"
                style={overlayStyle}
            >
                <div
                    className="imageContainer w-[50vw] md:w-[20vw] h-[10vh] relative top-[8vh] md:top-[24vh] left-[45vw] md:left-[26vw] bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/img/w6.png')" }}
                >
                    <div className="absolute inset-0 bg-black/50 z-10"></div>
                </div>
            </div>
        </div>
    );
};

export default ZoomParallax;