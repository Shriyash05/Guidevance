import { Link } from "wouter";
import ThemeToggle from "./theme-toggle";
import { LayoutGrid, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-br from-primary-400 to-primary-600 text-white mr-3 shadow-sm">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <span className="text-xl font-semibold text-slate-800 dark:text-white">
                Guidevance
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-150">
              Home
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 bg-white dark:bg-slate-900 shadow-lg transition-all duration-200">
          <nav className="flex flex-col space-y-1">
            <Link 
              href="/" 
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a 
              href="https://github.com/google/generative-ai-js" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Gemini AI
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
