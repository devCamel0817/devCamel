import { FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-paper-2 border-t border-line py-10 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-end gap-1 justify-center md:justify-start">
              <span className="font-hand text-2xl text-ink leading-none">DevCamel</span>
              <span className="font-hand text-camel-deep text-xl leading-none -mb-0.5">.</span>
            </div>
            <p className="text-sm text-ink-soft mt-1">
              정규진 — fullstack developer portfolio
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'EmailJS'].map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1 rounded-full bg-paper text-ink-soft border border-line"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/devCamel0817"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft hover:text-ink transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="mailto:devCamel0817@gmail.com"
              className="text-ink-soft hover:text-camel-deep transition-colors"
              aria-label="Email"
            >
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-line text-center text-xs text-ink-mute">
          © {new Date().getFullYear()} DevCamel — 정규진. handcrafted with paper &amp; code.
        </div>
      </div>
    </footer>
  );
}
