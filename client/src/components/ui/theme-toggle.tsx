import { useState, useEffect } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ThemeType = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeType>("system");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system
    const savedTheme = localStorage.getItem("theme") as ThemeType | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to system
      setTheme("system");
      applyTheme("system");
    }

    // Set up listener for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const applyTheme = (selectedTheme: ThemeType) => {
    const isDark = 
      selectedTheme === "dark" || 
      (selectedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    document.documentElement.classList.toggle("dark", isDark);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#1e293b" : "#ffffff");
    }
  };

  const setThemeValue = (value: ThemeType) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    applyTheme(value);
    setIsOpen(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark": return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case "light": return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case "system": return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        >
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <div className="grid grid-cols-1 gap-1 p-1">
          <Button 
            variant={theme === "light" ? "default" : "ghost"} 
            className="flex items-center justify-start gap-2 rounded-md px-3 py-2"
            onClick={() => setThemeValue("light")}
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </Button>
          
          <Button 
            variant={theme === "dark" ? "default" : "ghost"} 
            className="flex items-center justify-start gap-2 rounded-md px-3 py-2"
            onClick={() => setThemeValue("dark")}
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </Button>
          
          <Button 
            variant={theme === "system" ? "default" : "ghost"} 
            className="flex items-center justify-start gap-2 rounded-md px-3 py-2"
            onClick={() => setThemeValue("system")}
          >
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
