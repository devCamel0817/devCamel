import type { CSSProperties } from 'react';

interface PolaroidProps {
  src: string;
  alt: string;
  caption?: string;
  rotate?: number;
  className?: string;
  /** 사진 영역 크기 (정사각). 기본 220px */
  size?: number;
  style?: CSSProperties;
}

/**
 * 폴라로이드 사진 프레임.
 * 흰 두꺼운 하단 여백 + 손글씨 캡션.
 */
export default function Polaroid({
  src,
  alt,
  caption,
  rotate = 0,
  className = '',
  size = 220,
  style,
}: PolaroidProps) {
  return (
    <div
      className={`inline-block bg-white p-3 pb-5 shadow-[0_4px_16px_-6px_rgba(42,36,24,0.25)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <div
        className="bg-paper-3 overflow-hidden"
        style={{ width: size, height: size }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      {caption && (
        <div
          className="font-hand text-ink-soft text-center mt-2"
          style={{ width: size, fontSize: 22, lineHeight: 1.1 }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
