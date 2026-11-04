import { notFound } from 'next/navigation';
import { MotionLab } from './MotionLab';

/** Every motion primitive with motion on and off (doc/PHASES.md, P4 task 3). 404 in production. */
export default function MotionPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <MotionLab />;
}
