## Packages
framer-motion | Complex animations and 3D transitions
lucide-react | Iconography
clsx | Class name utility (already in base but good to be explicit)
tailwind-merge | Class merging (already in base)

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
  mono: ["var(--font-mono)"],
}

Tailwind Config - extend colors:
colors: {
  brand: {
    blue: "hsl(var(--brand-blue))",
    orange: "hsl(var(--brand-orange))",
    dark: "hsl(var(--brand-dark))",
  }
}
