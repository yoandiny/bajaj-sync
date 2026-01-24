import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  imageSrc: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon, imageSrc, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col md:flex-row h-full"
    >
      <div className="p-8 md:w-1/2 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-yellow-100 rounded-full opacity-50 blur-3xl"></div>
        
        <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 text-yellow-600">
          <Icon size={28} strokeWidth={2.5} />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-lg">
          {description}
        </p>
      </div>
      
      <div className="md:w-1/2 bg-gray-50 relative group overflow-hidden flex items-center justify-center p-6">
        <div className="relative w-48 h-auto transform group-hover:scale-105 transition-transform duration-500">
            {/* Mockup Phone Frame */}
            <div className="border-gray-800 bg-gray-800 border-[8px] rounded-[2.5rem] h-[380px] w-full shadow-xl overflow-hidden relative">
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[11px] top-[72px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[11px] top-[124px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[11px] top-[178px] rounded-s-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[11px] top-[142px] rounded-e-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                    <img 
                        src={imageSrc} 
                        alt={title} 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
