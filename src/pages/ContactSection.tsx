import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaPhone, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { PageTransition } from '../components/ui';
import { PaperCard, MacWindow } from '../components/paper';

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
      <div className="bg-paper text-ink min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="font-hand text-camel-deep text-3xl mb-1">say hi</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink">
              <span className="ink-underline">Contact</span>
            </h1>
            <p className="text-ink-soft mt-3 text-sm">
              프로젝트 제안이나 질문, 가벼운 인사도 환영합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Left — 편지지 폼 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Letter form={form} setForm={setForm} loading={loading} onSubmit={handleSubmit} />
            </motion.div>

            {/* Right — 연락처 카드 묶음 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <ContactItem
                href="tel:010-9094-1426"
                icon={<FaPhone />}
                label="Phone"
                value="010-9094-1426"
                rotate={-1.5}
              />
              <ContactItem
                href="mailto:devCamel0817@gmail.com"
                icon={<FaEnvelope />}
                label="Email"
                value="devCamel0817@gmail.com"
                rotate={1}
              />
              <ContactItem
                href="https://github.com/devCamel0817"
                external
                icon={<FaGithub />}
                label="GitHub"
                value="github.com/devCamel0817"
                rotate={-0.8}
              />

              <MacWindow title="built with" bodyClassName="px-5 py-4">
                <ul className="space-y-1.5 text-[12px] font-mono text-ink-soft">
                  <li>· React + TypeScript + Tailwind</li>
                  <li>· Framer Motion · Vite · Vercel</li>
                  <li>· EmailJS</li>
                </ul>
              </MacWindow>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

/* 편지지 — 종이 카드에 줄 그어진 메모지 */
function Letter({
  form,
  setForm,
  loading,
  onSubmit,
}: {
  form: { name: string; email: string; title: string; message: string };
  setForm: (f: typeof form) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit}>
      <div
        className="paper-card p-6 sm:p-8"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0 30px, rgba(42, 36, 24, 0.06) 30px 31px)',
          backgroundColor: '#fafaf3',
        }}
      >
        <div className="font-hand text-3xl text-camel-deep mb-1">Dear DevCamel,</div>
        <div className="space-y-3 mt-4">
          <PaperField label="from" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="이름" />
          <PaperField label="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" type="email" />
          <PaperField label="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="제목" />
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-ink-mute">message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="..."
              rows={6}
              className="w-full bg-transparent border-0 border-b border-line-strong focus:border-camel focus:outline-none text-ink placeholder-ink-mute py-1 resize-none transition-colors"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="font-hand text-2xl text-ink-soft">— with care</div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-md bg-ink text-paper hover:bg-camel-deep transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-60"
          >
            <FaPaperPlane />
            {loading ? '보내는 중...' : '보내기'}
          </button>
        </div>
      </div>
    </form>
  );
}

function PaperField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-mono uppercase tracking-wider text-ink-mute">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b border-line-strong focus:border-camel focus:outline-none text-ink placeholder-ink-mute py-1 transition-colors"
      />
    </div>
  );
}

function ContactItem({
  href,
  icon,
  label,
  value,
  rotate = 0,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  rotate?: number;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="block"
    >
      <PaperCard rotate={rotate} className="px-4 py-3 flex items-center gap-3 hover:bg-paper-3 transition-colors">
        <div className="w-10 h-10 rounded-md bg-camel/15 flex items-center justify-center text-camel-deep">
          {icon}
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-mute">{label}</div>
          <div className="text-sm text-ink font-medium">{value}</div>
        </div>
      </PaperCard>
    </a>
  );
}
