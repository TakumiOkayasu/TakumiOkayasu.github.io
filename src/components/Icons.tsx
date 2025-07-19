import type React from 'react';

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src="/sun.svg" className={`${className}`}/>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src="/moon.svg" className={`${className}`} />
);

export const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className || 'w-6 h-6'}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="Envelope icon"
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export const GitHubIcon: React.FC<{ className?: string }> = ({ }) => (
  <img src="/github-icon.svg" />
);
