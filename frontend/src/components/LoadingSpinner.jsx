import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = "Analyzing your document..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative">
        <motion.div
          className="w-20 h-20 border-4 border-primary-100 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-0 left-0 w-20 h-20 border-4 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-lg font-medium text-gray-600 animate-pulse"
      >
        {message}
      </motion.p>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary-500 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
