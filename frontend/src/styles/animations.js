/**
 * Fichier contenant des animations et transitions réutilisables pour l'application
 */

import { keyframes } from '@emotion/react';

// Animation de fondu à l'entrée
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Animation de glissement vers le haut
export const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Animation de glissement vers la droite
export const slideRight = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Animation de pulsation
export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Animation de rotation
export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Animation de rebond
export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

// Animation de clignotement
export const blink = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Animation d'ondulation
export const wave = keyframes`
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
`;

// Effet de brillance
export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Durées d'animation
export const durations = {
  short: '0.3s',
  medium: '0.5s',
  long: '0.8s'
};

// Délais d'animation
export const delays = {
  short: '0.1s',
  medium: '0.3s',
  long: '0.5s'
};

// Courbes d'accélération
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

// Styles d'animation prêts à l'emploi
export const animations = {
  fadeIn: {
    animation: `${fadeIn} ${durations.medium} ${easings.easeOut} forwards`
  },
  slideUp: {
    animation: `${slideUp} ${durations.medium} ${easings.easeOut} forwards`
  },
  slideRight: {
    animation: `${slideRight} ${durations.medium} ${easings.easeOut} forwards`
  },
  pulse: {
    animation: `${pulse} ${durations.long} ${easings.easeInOut} infinite`
  },
  rotate: {
    animation: `${rotate} ${durations.long} linear infinite`
  },
  bounce: {
    animation: `${bounce} ${durations.long} ${easings.bounce} infinite`
  },
  blink: {
    animation: `${blink} ${durations.long} ${easings.easeInOut} infinite`
  },
  wave: {
    animation: `${wave} ${durations.long} ${easings.easeInOut} infinite`
  },
  shimmer: {
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 2s ${easings.easeInOut} infinite`
  }
};

// Transitions communes
export const transitions = {
  hover: {
    transition: `all ${durations.short} ${easings.easeOut}`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
    }
  },
  scale: {
    transition: `all ${durations.short} ${easings.easeOut}`,
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  glow: {
    transition: `all ${durations.short} ${easings.easeOut}`,
    '&:hover': {
      boxShadow: '0 0 15px rgba(30, 136, 229, 0.6)'
    }
  },
  colorShift: {
    transition: `all ${durations.short} ${easings.easeOut}`,
    '&:hover': {
      filter: 'brightness(1.1) saturate(1.1)'
    }
  }
};

export default {
  animations,
  transitions,
  durations,
  delays,
  easings,
  fadeIn,
  slideUp,
  slideRight,
  pulse,
  rotate,
  bounce,
  blink,
  wave,
  shimmer
};
