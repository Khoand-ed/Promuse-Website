// Small line icons drawn for Promuse. All are decorative: the control around them carries the label.

interface IconProps {
  className?: string;
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path d="M3 12h17M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ArrowUp({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path d="M12 21V4M5 11l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ChevronDown({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" width="0.7em" height="0.7em" aria-hidden="true">
      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path d="M4 4l16 16M20 4L4 20" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function XLogo({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path
        d="M4 3h4.6l4.1 5.8L17.6 3H20l-6.2 7.4L20.5 21h-4.6l-4.4-6.3L6.1 21H3.7l6.7-7.9z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FacebookLogo({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path
        d="M12 2a10 10 0 0 0-1.6 19.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 12 2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MusicNote({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <ellipse
        cx="9.6"
        cy="17.4"
        rx="3.6"
        ry="2.8"
        transform="rotate(-20 9.6 17.4)"
        fill="currentColor"
      />
      <path
        d="M12 3h1.6c.3 2.3 2 3.4 3.6 4.6 1.7 1.3 2 3.4 1.1 5 .1-2-1.7-3-4.7-3.7v8.5H12z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Google's "G" mark, as its sign-in branding guidelines ask for next to "Sign in with Google". */
export function GoogleG({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" width="1em" height="1em" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
