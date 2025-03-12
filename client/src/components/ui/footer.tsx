import { LayoutGrid } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-primary-400 to-primary-600 text-white mr-2 shadow-sm">
              <LayoutGrid className="h-4 w-4" />
            </div>
            <span className="text-lg font-medium text-slate-700 dark:text-slate-300">Guidevance</span>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Guidevance.
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
