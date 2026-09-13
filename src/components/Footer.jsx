"use client";

import { TiLocationArrow } from "react-icons/ti";
import { FaGithub, FaLinkedin, FaXTwitter, FaEnvelope } from "react-icons/fa6";

const socialLinks = [
  { icon: <FaGithub />, href: "#", label: "GitHub" },
  { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
  { icon: <FaXTwitter />, href: "#", label: "X / Twitter" },
  { icon: <FaEnvelope />, href: "mailto:hello@example.com", label: "Email" },
];

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-black pt-24">
      <div className="container mx-auto px-5 md:px-10">


        {/* Links row */}
        <div className="flex flex-col gap-10 border-t border-white/10 py-12 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="bento-title special-font text-2xl uppercase text-white">
              RCA
            </p>
            <p className="mt-3 max-w-xs font-circular-web text-sm text-white/50">
              Full-stack developer building SaaS dashboards, mobile apps, and
              custom WordPress tooling.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-16">
            <div>
              <p className="font-circular-web text-xs uppercase tracking-wide text-white/40">
                Navigate
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-circular-web text-sm text-white/70 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-circular-web text-xs uppercase tracking-wide text-white/40">
                Connect
              </p>
              <div className="mt-4 flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                    className="flex size-10 items-center justify-center rounded-full border border-white/15 text-lg text-white/70 transition-colors duration-200 hover:border-white/40 hover:text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-circular-web">
            &copy; {year} — All rights reserved.
          </p>
          <p className="font-circular-web">
            Built with Next.js, GSAP &amp; Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;