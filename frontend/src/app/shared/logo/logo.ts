import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AgroLact"
    >
      <rect width="40" height="40" rx="10" fill="url(#agrolact-badge)" />
      <path
        d="M20 9.5c-3.6 3.85-6.6 8.16-6.6 11.83a6.6 6.6 0 0 0 13.2 0c0-3.67-3-7.98-6.6-11.83Z"
        fill="white"
      />
      <path
        d="M16.9 21.9a3.4 3.4 0 0 0 2.9 3.36"
        stroke="#2f6d3a"
        stroke-width="1.4"
        stroke-linecap="round"
        fill="none"
      />
      <defs>
        <linearGradient id="agrolact-badge" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3a8a47" />
          <stop offset="1" stop-color="#1f4620" />
        </linearGradient>
      </defs>
    </svg>
  `,
})
export class Logo {
  readonly size = input(40);
}
