import AnimatedTitle from "./AnimatedTitle";
import ZoomParallax from "./Zoom";

const About = () => {
  return (
    <div id="about" className="min-h-screen w-screen mb-[-2px]">
      <div className="relative -mb-16 md:mb-8 mt-36 flex flex-col items-center gap-5 -0">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to my Portfolio
        </p>

        <AnimatedTitle
          title="Building clean code <br /> and seamless experiences"
          containerClass="mt-5 !text-black text-center"
        />

        {/* <div className="about-subtext">
          <p>Every project starts with a problem worth solving</p>
          <p className="text-gray-500">
            From WordPress sites to full-stack apps, I turn ideas into
            working products across the entire stack
          </p>
        </div> */}
      </div>

      {/* <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div> */}
      <ZoomParallax />
    </div>
  );
};

export default About;