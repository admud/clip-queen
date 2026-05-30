@import "tailwindcss";

:root {
  --background: #07080b;
  --foreground: #edeef3;
  --card: rgba(255, 255, 255, 0.03);
  --card-strong: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.1);
  --lime: #b6ff3b;
  --pink: #ff2daa;
  --blue: #3b82f6;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-body);
  --font-mono: var(--font-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-body);
}
