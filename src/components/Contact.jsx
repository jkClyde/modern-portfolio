"use client";

import AnimatedTitle from "./AnimatedTitle";
import { TiLocationArrow } from "react-icons/ti";

const images = {
  codeOnScreen: "https://picsum.photos/seed/contact-code/500/650",
  workspace: "https://picsum.photos/seed/contact-workspace/500/650",
};

import Button from "./Button";

const ImageCard = ({ src, alt, className = "" }) => (
  <div
    className={`overflow-hidden rounded-2xl border border-white/10 shadow-2xl ${className}`}
  >
    <img src={src} alt={alt} className="size-full object-cover" />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="my-20 min-h-96 w-screen px-5 md:px-10">
      <div className="relative overflow-hidden rounded-lg bg-black py-24 text-blue-50">
        {/* Left: stacked image cards */}
        <div className="absolute -left-16 top-10 hidden w-56 -rotate-3 sm:block lg:left-16 lg:w-72">
          <ImageCard
            src={images.codeOnScreen}
            alt="Code editor on a laptop screen"
            className="aspect-[3/4] translate-y-0"
          />
        </div>
        <div className="absolute -left-6 top-56 hidden w-44 rotate-6 sm:block lg:left-40 lg:top-72 lg:w-60">
          <ImageCard
            src={images.workspace}
            alt="Developer workspace with multiple monitors"
            className="aspect-[3/4]"
          />
        </div>

        {/* Right: mirrored image cards for balance on larger screens */}
        <div className="absolute -right-16 top-10 hidden w-56 rotate-3 md:right-10 lg:block lg:w-72">
          <ImageCard
            src="/img/abstract/abs1.jpg"
            alt="Developer workspace with multiple monitors"
            className="aspect-[3/4]"
          />
        </div>

        <div className="relative flex flex-col items-center px-6 text-center">
          <p className="mb-6 font-circular-web text-xs uppercase tracking-wide text-blue-50/60">
            Let's Connect
          </p>

          <AnimatedTitle
            title="let&#39;s build <br /> your next <br /> project together."
            className="bento-title special-font w-full !text-4xl !font-black uppercase !leading-[0.95] sm:!text-5xl md:!text-6xl"
          />

          <p className="mt-6 max-w-md font-circular-web text-sm text-blue-50/70 md:text-base">
            Have an idea, a role, or a problem worth solving? I'm always open
            to hearing about new projects and opportunities.
          </p>



          <Button

            title="Send a Message"
            leftIcon={<TiLocationArrow />}
            containerClass="bg-[#4B3FD1] flex-center gap-1 text-[white] mt-[20px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;