import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaPhone } from 'react-icons/fa';
import { PageTransition, GlassCard, Button, Input } from '../components/ui';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';

// EmailJS 설정
const EMAILJS_SERVICE_ID = 'service_mlvzqtt';
const EMAILJS_TEMPLATE_ID = 'template_z5qezhj';
const EMAILJS_PUBLIC_KEY = '8xidlu068rN4QU3du';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', title: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.title.trim() || !form.message.trim()) {
      toast.error('모든 항목을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          title: form.title,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      toast.success('메시지가 전송되었습니다!');
      setForm({ name: '', email: '', title: '', message: '' });
    } catch {
      toast.error('전송에 실패했습니다. 직접 메일로 연락해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              <span className="text-gradient">Contact</span>
            </h2>
            <p className="text-surface-400">프로젝트 제안이나 질문이 있으시면 메시지를 남겨주세요.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
            >
              <GlassCard hover={false}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="이름"
                    placeholder="홍길동"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="이메일"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <Input
                    label="제목"
                    placeholder="문의 제목"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-400">
                      메시지
                    </label>
                    <textarea
                      placeholder="프로젝트 관련 문의, 협업 제안, 피드백 등..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-glass-border text-white placeholder-surface-500 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <Button type="submit" loading={loading} className="w-full" size="lg">
                    <FaEnvelope />
                    메시지 보내기
                  </Button>
                </form>
              </GlassCard>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              className="space-y-6"
            >
              <GlassCard hover={false}>
                <h3 className="text-lg font-semibold text-white mb-4">연락처</h3>
                <div className="space-y-4">
                  <a
                    href="tel:010-9094-1426"
                    className="flex items-center gap-3 text-surface-400 hover:text-white transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FaPhone className="text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Phone</div>
                      <div className="text-xs text-surface-500">010-9094-1426</div>
                    </div>
                  </a>

                  <a
                    href="mailto:devCamel0817@gmail.com"
                    className="flex items-center gap-3 text-surface-400 hover:text-white transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FaEnvelope className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Email</div>
                      <div className="text-xs text-surface-500">devCamel0817@gmail.com</div>
                    </div>
                  </a>

                  <a
                    href="https://github.com/devCamel0817"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-surface-400 hover:text-white transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center">
                      <FaGithub className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">GitHub</div>
                      <div className="text-xs text-surface-500">github.com/devCamel0817</div>
                    </div>
                  </a>
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="text-lg font-semibold text-white mb-3">이 사이트의 기술 스택</h3>
                <div className="text-xs text-surface-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Frontend: React + TypeScript + Tailwind CSS
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    Animation: Framer Motion
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Build: Vite + Vercel
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    Email: EmailJS
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
