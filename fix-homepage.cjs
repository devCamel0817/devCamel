const fs = require('fs');
const content = `import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaArrowRight } from 'react-icons/fa';
import { HiCode, HiDatabase, HiServer } from 'react-icons/hi';
import { PageTransition, GlassCard } from '../components/ui';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';

const floatingOrbs = [
  { color: 'from-primary to-primary-light', size: 'w-72 h-72', pos: '-top-20 -left-20', delay: 0 },
  { color: 'from-secondary to-secondary-light', size: 'w-96 h-96', pos: '-bottom-32 -right-32', delay: 2 },
  { color: 'from-accent to-accent-light', size: 'w-64 h-64', pos: 'top-1/2 left-1/2', delay: 4 },
];

const highlights = [
  {
    icon: HiServer,
    title: '\uACB0\uC81C \u00B7 \uBB3C\uB958 \uB3C4\uBA54\uC778',
    description: 'KCP/PayPal/EximBay \uACB0\uC81C \uC5F0\uB3D9, EasyPost/CJ \uBB3C\uB958 \uC790\uB3D9\uD654 \uB4F1 \uC2E4\uC11C\uBE44\uC2A4 \uB3C4\uBA54\uC778 \uACBD\uD5D8.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: HiDatabase,
    title: '\uB300\uC6A9\uB7C9 \uB370\uC774\uD130 \uCC98\uB9AC',
    description: '\uD310\uC815 \uBC30\uCE58 \uC131\uB2A5 50% \uD5A5\uC0C1 (3h \u2192 1.5h), Oracle SQL \uD29C\uB2DD \uBC0F \uCFFC\uB9AC \uCD5C\uC801\uD654.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: HiCode,
    title: '\uB808\uAC70\uC2DC \uD604\uB300\uD654',
    description: '\uB378\uD30C\uC774 \u2192 \uC6F9 \uC804\uD658, MSA \uB3C4\uBA54\uC778 \uBD84\uC0B0 \uC124\uACC4, \uACF5\uD1B5 \uBAA8\uB4C8 \uAD6C\uCD95\uC73C\uB85C \uC0DD\uC0B0\uC131 20% \uD5A5\uC0C1.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
];

export default function HomePage() {
  return (
    <PageTransition>
      {/* ========== HERO ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {floatingOrbs.map((orb, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: orb.delay,
            }}
            className={\`absolute \${orb.pos} \${orb.size} rounded-full bg-gradient-to-br \${orb.color} opacity-10 blur-3xl pointer-events-none\`}
          />
        ))}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary-light text-sm mb-8"
            >
              3\uB144 2\uAC1C\uC6D4 \uACBD\uB825 \u00B7 Full-Stack Developer
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">\uC815\uADDC\uC9C4</span>
              <br />
              <span className="text-gradient">\uB290\uB824\uB3C4 \uB05D\uAE4C\uC9C0 \uAC00\uB294 \uAC1C\uBC1C\uC790</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Java \u00B7 Spring Boot \u00B7 Vue.js \uAE30\uBC18 \uD480\uC2A4\uD0DD \uAC1C\uBC1C\uC790.
              <br className="hidden sm:block" />
              \uACB0\uC81C/\uBB3C\uB958 \uB3C4\uBA54\uC778 \uACBD\uD5D8, \uB300\uC6A9\uB7C9 \uB370\uC774\uD130 \uCD5C\uC801\uD654, \uB808\uAC70\uC2DC \uC2DC\uC2A4\uD15C \uD604\uB300\uD654.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-base flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                  \uD504\uB85C\uC81D\uD2B8 \uB458\uB7EC\uBCF4\uAE30
                  <FaArrowRight />
                </motion.button>
              </Link>
              <a
                href="https://github.com/devCamel0817"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-surface-800 border border-glass-border text-white font-semibold text-base flex items-center gap-2 hover:bg-surface-700 transition-colors"
                >
                  <FaGithub />
                  GitHub
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-surface-500 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-surface-500" />
          </div>
        </motion.div>
      </section>

      {/* ========== HIGHLIGHTS ========== */}
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              \uD575\uC2EC <span className="text-gradient">\uAC15\uC810</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              \uC2E4\uBB34\uC5D0\uC11C \uAC80\uC99D\uB41C \uC5ED\uB7C9\uB4E4\uC785\uB2C8\uB2E4.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard className="h-full">
                  <div className={\`w-12 h-12 rounded-xl \${f.bg} flex items-center justify-center mb-4\`}>
                    <f.icon className={\`w-6 h-6 \${f.color}\`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TECH STACK BANNER ========== */}
      <section className="py-16 border-y border-glass-border overflow-hidden">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...Array(2)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex gap-12">
              {[
                'Java 17', 'Spring Boot', 'JPA', 'QueryDSL', 'MyBatis',
                'Vue3', 'Quasar', 'PostgreSQL', 'MariaDB', 'Oracle',
                'Docker', 'Kubernetes', 'Jenkins', 'Argo CD', 'MSA',
              ].map((tech) => (
                <span key={\`\${groupIdx}-\${tech}\`} className="text-2xl font-bold text-surface-700">
                  {tech}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ========== ABOUT (inline) ========== */}
      <AboutSection />

      {/* ========== CONTACT (inline) ========== */}
      <ContactSection />
    </PageTransition>
  );
}
`;
fs.writeFileSync('src/pages/HomePage.tsx', content, 'utf8');
console.log('Done');
