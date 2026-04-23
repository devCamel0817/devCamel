export interface FloatingOrb {
  color: string;
  size: string;
  pos: string;
  delay: number;
}

export const floatingOrbs: FloatingOrb[] = [
  { color: 'from-primary to-primary-light', size: 'w-72 h-72', pos: '-top-20 -left-20', delay: 0 },
  { color: 'from-secondary to-secondary-light', size: 'w-96 h-96', pos: '-bottom-32 -right-32', delay: 2 },
  { color: 'from-accent to-accent-light', size: 'w-64 h-64', pos: 'top-1/2 left-1/2', delay: 4 },
];
