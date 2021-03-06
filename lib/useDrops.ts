import { useCallback, useEffect, useRef } from 'react';

interface Particle {
  element: HTMLElement;
  size: number;
  speedHorz: number;
  speedUp: number;
  spinVal: number;
  spinSpeed: number;
  top: number;
  left: number;
  direction: number;
}

export function useDrops(
  container: HTMLElement,
  options: { variants: string[]; limit?: number; sizes?: number[]; tick?: number },
  enabled = false,
) {
  const limit = useRef<number>(35);
  if (options.limit) limit.current = options.limit;

  const variants = useRef<string[]>([]);
  if (options.variants) variants.current = options.variants;

  const sizes = useRef<number[]>([15, 20, 25, 35, 45]);
  if (options.sizes) sizes.current = options.sizes;

  const tick = useRef(100);
  if (options.tick) tick.current = options.tick;

  const particles = useRef<Particle[]>([]);
  const lastTime = useRef<number>();

  const create = useCallback(() => {
    const size = sizes.current[Math.floor(Math.random() * sizes.current.length)];
    const speedHorz = Math.random() * 10;
    const speedUp = Math.random() * 0;
    const spinVal = Math.random() * 360;
    const spinSpeed = Math.random() * 10 * (Math.random() <= 0.5 ? -1 : 1);
    const top = 0 - size;
    const left = Math.random() * container.clientWidth;
    const direction = Math.random() <= 0.5 ? -1 : 1;

    const particle = document.createElement('span');
    particle.classList.add('particle');
    particle.innerHTML = variants.current[Math.floor(Math.random() * variants.current.length)];

    container.appendChild(particle);

    particles.current.push({
      element: particle,
      size,
      speedHorz: 0,
      speedUp,
      spinVal,
      spinSpeed,
      top,
      left,
      direction,
    });
  }, [container]);

  const update = useCallback(() => {
    particles.current.forEach((p) => {
      p.left = p.left - p.speedHorz * p.direction;
      p.top = p.top - p.speedUp;
      p.speedUp = Math.min(p.size, p.speedUp - 0.1);
      p.spinVal = p.spinVal + p.spinSpeed;

      if (p.top >= container.clientHeight + p.size) {
        particles.current = particles.current.filter((o) => o !== p);
        p.element.remove();
      }

      p.element.setAttribute(
        'style',
        `
        top: ${p.top}px;
        left: ${p.left}px;
        font-size: ${p.size}px;
        transform:rotate(${p.spinVal}deg);
      `,
      );
    });
  }, [container]);

  const loop: FrameRequestCallback = useCallback(
    (now) => {
      if (!lastTime.current || now - lastTime.current >= tick.current) {
        lastTime.current = now;

        if (particles.current.length < limit.current) {
          create();
        }
      }

      update();

      requestAnimationFrame(loop);
    },
    [create, update],
  );

  useEffect(() => {
    loop(0);
  }, [loop]);
}
