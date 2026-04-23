import type { ReactNode, CSSProperties } from 'react';

interface MacWindowProps {
  children: ReactNode;
  /** 타이틀바 가운데에 표시될 경로/제목 */
  title?: string;
  className?: string;
  /** 본문 영역 클래스 (패딩/배경 커스터마이즈용) */
  bodyClassName?: string;
  rotate?: number;
  style?: CSSProperties;
}

/**
 * macOS 스타일 윈도우 프레임.
 * 좌측 traffic light(빨강/노랑/초록) + 가운데 타이틀.
 */
export default function MacWindow({
  children,
  title,
  className = '',
  bodyClassName = '',
  rotate = 0,
  style,
}: MacWindowProps) {
  return (
    <div
      className={`paper-card overflow-hidden ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      {/* Title bar */}
      <div className="relative flex items-center h-9 px-3 border-b border-line bg-paper-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-mac-red" aria-hidden />
          <span className="w-3 h-3 rounded-full bg-mac-yellow" aria-hidden />
          <span className="w-3 h-3 rounded-full bg-mac-green" aria-hidden />
        </div>
        {title && (
          <span className="absolute left-1/2 -translate-x-1/2 text-xs text-ink-soft font-mono truncate max-w-[60%]">
            {title}
          </span>
        )}
      </div>
      {/* Body */}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
