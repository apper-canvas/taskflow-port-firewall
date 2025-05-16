import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const FrownIcon = getIcon('Frown');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface-50 dark:bg-surface-900">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-lg mx-auto"
      >
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-accent mx-auto mb-6 inline-block"
        >
          <FrownIcon size={80} />
        </motion.div>
        
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-surface-700 dark:text-surface-200">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 dark:text-surface-300 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center gap-2 btn btn-primary px-6 py-3 text-lg"
        >
          <ArrowLeftIcon size={20} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;