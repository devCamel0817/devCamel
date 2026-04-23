import type { ReactNode, CSSProperties } from 'react';

interface PaperCardProps {
  children: ReactNode;
  /** 카드를 살짝 기울일 각도(deg). 기본 0. */
  rotate?: number;
  /** 상단 마스킹 테이프 표시 여부 */
  tape?: boolean | 'left' | 'right' | 'center';
  className?: string;
  style?: CSSProperties;
}

/**
 * 종이 카드 — 스크랩북에 붙여놓은 듯한 카드.
 * 옅은 그림자 + 미세한 결, 옵션으로 회전과 마스킹 테이프.
 */
export default function PaperCard({
  children,
  rotate = 0,
  tape = false,
  className = '',
  style,
}: PaperCardProps) {
  const tapePos =
    tape === 'left' ? 'left-6' :
    tape === 'right' ? 'right-6' :
    'left-1/2 -translate-x-1/2';

  return (
    <div
      className={`relative paper-card ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      {tape && (
        <span
          className={`masking-tape absolute -top-3 ${tapePos} pointer-events-none`}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}
