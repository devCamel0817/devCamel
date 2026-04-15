import { FaGithub, FaEnvelope } from 'react-icons/fa';
import CamelLogo from '../icons/CamelLogo';

export default function Footer() {
  return (
    <footer className="border-t border-glass-border py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <CamelLogo size={24} />
              <span className="font-bold text-gradient">DevCamel</span>
            </div>
            <p className="text-sm text-surface-400 mt-2">
              정규진 — Fullstack Developer Portfolio
            </p>
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'EmailJS'].map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1 rounded-full bg-surface-800 text-surface-400 border border-glass-border"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/devCamel0817"
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-400 hover:text-white transition-colors"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="mailto:devCamel0817@gmail.com"
              className="text-surface-400 hover:text-secondary transition-colors"
            >
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-glass-border text-center text-xs text-surface-500">
          © {new Date().getFullYear()} DevCamel — 정규진. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
