"use client";

import { IconSunMoon } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      <IconSunMoon className="h-4 w-4" stroke={1.8} />
    </Button>
  );
}
