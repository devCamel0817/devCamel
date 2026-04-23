import type { ReactNode } from 'react';
import MacWindow from './MacWindow';

export interface TerminalLine {
  /** prompt 라인이면 명령어 텍스트, 출력이면 undefined */
  cmd?: string;
  /** 출력 텍스트(또는 ReactNode) */
  out?: ReactNode;
}

interface TerminalProps {
  lines: TerminalLine[];
  title?: string;
  className?: string;
  rotate?: number;
  /** 프롬프트 기호. 기본 '$' */
  prompt?: string;
}

/**
 * MacWindow 위에 동작하는 가벼운 터미널 표시 컴포넌트.
 * 각 줄은 cmd(프롬프트 + 명령어) 또는 out(출력) 중 하나.
 */
export default function Terminal({
  lines,
  title = 'devcamel — zsh',
  className = '',
  rotate = 0,
  prompt = '$',
}: TerminalProps) {
  return (
    <MacWindow
      title={title}
      className={className}
      rotate={rotate}
      bodyClassName="px-4 py-3 font-mono text-[13px] leading-6 text-ink"
    >
      {lines.map((l, i) =>
        l.cmd !== undefined ? (
          <div key={i} className="flex gap-2">
            <span className="text-camel-deep select-none">{prompt}</span>
            <span>{l.cmd}</span>
          </div>
        ) : (
          <div key={i} className="text-ink-soft pl-4">{l.out}</div>
        ),
      )}
    </MacWindow>
  );
}
