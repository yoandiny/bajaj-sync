import { Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-yellow-500 p-1.5 rounded-lg mr-2">
                <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BajajSync</span>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-400">
            <span>© {new Date().getFullYear()} BajajSync.</span>
            <span className="hidden md:inline">|</span>
            <span>Powered by <span className="text-yellow-500 font-semibold">YoTech</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
