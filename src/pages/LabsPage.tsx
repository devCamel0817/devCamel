import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSortAmountDown, FaRoute, FaCircleNotch, FaFeatherAlt } from 'react-icons/fa';
import { PageTransition, GlassCard } from '../components/ui';

const labs = [
  {
    to: '/labs/sorting',
    icon: FaSortAmountDown,
    title: 'Sorting Algorithms',
    desc: 'Bubble, Selection, Insertion, Quick, Merge Sort 시각화',
    color: 'text-accent',
  },
  {
    to: '/labs/pathfinding',
    icon: FaRoute,
    title: 'Pathfinding Algorithms',
    desc: 'BFS, DFS, Dijkstra, A* 경로 탐색 시각화',
    color: 'text-secondary',
  },
  {
    to: '/labs/boids',
    icon: FaFeatherAlt,
    title: 'Boids Simulation',
    desc: '3가지 규칙만으로 만들어지는 군집 행동 시뮬레이션',
    color: 'text-yellow-400',
  },
  {
    to: '/labs/fourier',
    icon: FaCircleNotch,
    title: 'Fourier Transform',
    desc: '그림을 그리면 회전하는 원들이 그대로 따라 그립니다',
    color: 'text-primary',
  },
];

export default function LabsPage() {
  return (
    <PageTransition>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gradient"
        >
          Labs
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-surface-400 mt-2"
        >
          알고리즘을 눈으로 보고 이해하세요
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-6 mt-12">
          {labs.map((lab, i) => (
            <motion.div
              key={lab.to}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link to={lab.to}>
                <GlassCard className="p-8 hover:border-primary/50 transition-all group cursor-pointer h-full">
                  <lab.icon className={`text-4xl ${lab.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h2 className="text-xl font-bold text-white mb-2">{lab.title}</h2>
                  <p className="text-surface-400 text-sm">{lab.desc}</p>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
