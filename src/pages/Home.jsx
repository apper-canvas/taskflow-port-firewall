import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState({ name: "User" });
  
  const CheckCircleIcon = getIcon('CheckCircle');
  const LayoutDashboardIcon = getIcon('LayoutDashboard');
  const ListChecksIcon = getIcon('ListChecks');
  const BellIcon = getIcon('Bell');
  const BarChartIcon = getIcon('BarChart');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (showWelcome) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-light via-primary to-primary-dark dark:from-surface-800 dark:via-primary-dark dark:to-surface-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white p-8"
        >
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ 
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1
            }}
            className="mb-4 inline-block"
          >
            <CheckCircleIcon size={80} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">TaskFlow</h1>
          <p className="text-xl md:text-2xl opacity-90">Your personal task manager</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <header className="bg-white dark:bg-surface-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="text-primary" />
            <h1 className="text-xl font-bold">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost p-2 rounded-full">
              <BellIcon size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="hidden md:block lg:col-span-3 xl:col-span-2">
          <div className="sticky top-6 bg-white dark:bg-surface-800 rounded-xl shadow-card p-4">
            <nav>
              <ul className="space-y-2">
                <motion.li 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary dark:bg-primary/20"
                >
                  <LayoutDashboardIcon size={20} />
                  <span className="font-medium">Dashboard</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <ListChecksIcon size={20} />
                  <span>My Tasks</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <BarChartIcon size={20} />
                  <span>Analytics</span>
                </motion.li>
              </ul>
            </nav>
            
            <div className="mt-10 p-4 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-lg">
              <h4 className="font-medium mb-2">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-300">Completed</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-300">In Progress</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-300">Pending</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-9 xl:col-span-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
                <h2 className="text-2xl font-bold mb-1">Welcome back, {user.name}!</h2>
                <p className="text-surface-600 dark:text-surface-300 mb-4">
                  You have 5 tasks in progress and 3 due today
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="card-neu bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
                    <h3 className="text-lg font-medium mb-1">25</h3>
                    <p className="text-sm text-surface-600 dark:text-surface-300">Total Tasks</p>
                  </div>
                  <div className="card-neu bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10">
                    <h3 className="text-lg font-medium mb-1">12</h3>
                    <p className="text-sm text-surface-600 dark:text-surface-300">Completed</p>
                  </div>
                  <div className="card-neu bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10">
                    <h3 className="text-lg font-medium mb-1">8</h3>
                    <p className="text-sm text-surface-600 dark:text-surface-300">Due Soon</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-8">
              <MainFeature />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;