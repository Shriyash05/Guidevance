import { Section } from "@shared/schema";
import { CheckCircle, BookOpen, Lightbulb, Zap, Lock, CheckSquare, Square } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface RoadmapSectionProps {
  section: Section;
  sectionIndex: number;
}

type TopicStatus = 'not-started' | 'in-progress' | 'completed';

interface TopicProgress {
  [topicId: string]: TopicStatus;
}

export default function RoadmapSection({ section, sectionIndex }: RoadmapSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const [topicProgress, setTopicProgress] = useState<TopicProgress>({});
  const [unlocked, setUnlocked] = useState<boolean[]>([]);
  const [showProgressChart, setShowProgressChart] = useState(false);
  
  // Initialize step unlocking (first step is always unlocked)
  useEffect(() => {
    const initialUnlocked = section.steps.map((_, idx) => idx === 0);
    setUnlocked(initialUnlocked);
  }, [section]);
  
  // Calculate progress data for visualization
  const progressData = () => {
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    
    // Count topics by status
    Object.values(topicProgress).forEach(status => {
      if (status === 'completed') completed++;
      else if (status === 'in-progress') inProgress++;
      else notStarted++;
    });
    
    // If no progress recorded yet, count all as not started
    if (completed === 0 && inProgress === 0 && notStarted === 0) {
      let totalTopics = 0;
      section.steps.forEach(step => {
        totalTopics += step.topics.length;
      });
      notStarted = totalTopics;
    }
    
    return [
      { name: 'Completed', value: completed, color: '#10b981' },  // emerald-500
      { name: 'In Progress', value: inProgress, color: '#3b82f6' }, // blue-500
      { name: 'Not Started', value: notStarted, color: '#d1d5db' }  // gray-300
    ].filter(item => item.value > 0);
  };
  
  // Function to update a topic's status
  const updateTopicStatus = (stepIndex: number, topicIndex: number, status: TopicStatus) => {
    const topicId = `${stepIndex}-${topicIndex}`;
    
    setTopicProgress(prev => ({
      ...prev,
      [topicId]: status
    }));
    
    // If completing a topic, check if we should unlock the next step
    if (status === 'completed') {
      const step = section.steps[stepIndex];
      const totalCompletedInStep = step.topics.filter((_, idx) => {
        const id = `${stepIndex}-${idx}`;
        return topicProgress[id] === 'completed' || (idx === topicIndex);
      }).length;
      
      // If all topics in current step are completed, unlock next step
      if (totalCompletedInStep === step.topics.length && stepIndex < section.steps.length - 1) {
        setUnlocked(prev => {
          const updated = [...prev];
          updated[stepIndex + 1] = true;
          return updated;
        });
      }
    }
  };
  
  // Get topic status with default of 'not-started'
  const getTopicStatus = (stepIndex: number, topicIndex: number): TopicStatus => {
    const topicId = `${stepIndex}-${topicIndex}`;
    return topicProgress[topicId] || 'not-started';
  };
  
  // Calculate percentage of completed topics
  const completionPercentage = () => {
    const totalTopics = section.steps.reduce((count, step) => count + step.topics.length, 0);
    const completedTopics = Object.values(topicProgress).filter(status => status === 'completed').length;
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  };
  
  // Determine the section level based on its title or index
  const getSectionLevelInfo = (title: string, index: number) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('fundamental') || titleLower.includes('basic') || titleLower.includes('introduction') || index === 0) {
      return {
        icon: <BookOpen className="h-5 w-5 text-emerald-500" />,
        color: 'bg-emerald-100 text-emerald-700',
        borderColor: 'border-emerald-200',
        level: 'Basic',
        chartColor: '#10b981', // emerald-500
        hoverColor: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
      };
    } else if (titleLower.includes('intermediate') || titleLower.includes('building') || index === 1) {
      return {
        icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
        color: 'bg-blue-100 text-blue-700',
        borderColor: 'border-blue-200',
        level: 'Intermediate',
        chartColor: '#3b82f6', // blue-500
        hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/10'
      };
    } else {
      return {
        icon: <Zap className="h-5 w-5 text-purple-500" />,
        color: 'bg-purple-100 text-purple-700',
        borderColor: 'border-purple-200',
        level: 'Advanced',
        chartColor: '#8b5cf6', // purple-500
        hoverColor: 'hover:bg-purple-50 dark:hover:bg-purple-900/10'
      };
    }
  };
  
  const levelInfo = getSectionLevelInfo(section.title, sectionIndex);
  
  return (
    <motion.div 
      className="section border border-slate-200 dark:border-slate-700 rounded-lg mb-6 shadow-sm bg-white dark:bg-slate-800 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        {/* Progress Bar */}
        <div className="flex-1 mr-4">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{section.title}</h2>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {completionPercentage()}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-1">
            <motion.div 
              className="h-2.5 rounded-full" 
              style={{ backgroundColor: levelInfo.chartColor, width: `${completionPercentage()}%` }}
              initial={{ width: '0%' }}
              animate={{ width: `${completionPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
            {levelInfo.icon}
            <span className="ml-1">{levelInfo.level} level content</span>
          </p>
        </div>
        
        {/* Chart Toggle */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg ${showProgressChart ? 'bg-slate-100 dark:bg-slate-700' : 'bg-white dark:bg-slate-800'}`}
            onClick={() => setShowProgressChart(!showProgressChart)}
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg ${!expanded ? 'bg-slate-100 dark:bg-slate-700' : 'bg-white dark:bg-slate-800'}`}
            onClick={() => setExpanded(!expanded)}
          >
            <svg 
              className={`w-5 h-5 text-slate-600 dark:text-slate-300 transform transition-transform duration-300 ${expanded ? 'rotate-180' : 'rotate-0'}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>
      </div>
      
      {/* Progress Chart */}
      <AnimatePresence>
        {showProgressChart && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center">
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={progressData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {progressData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} topics`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ml-6">
                  <div className="mb-1 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Completed</span>
                  </div>
                  <div className="mb-1 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">In Progress</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-300 mr-2"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Not Started</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Steps Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 space-y-5 bg-white dark:bg-slate-800 overflow-hidden"
          >
            {section.steps.map((step, stepIndex) => {
              const isUnlocked = unlocked[stepIndex];
              
              return (
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stepIndex * 0.05 }}
                  className={`step p-4 rounded-lg ${isUnlocked ? 'bg-slate-50 dark:bg-slate-700/30' : 'bg-slate-100 dark:bg-slate-700/10'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-slate-800 dark:text-slate-200 flex items-center">
                      <span className={`inline-block w-6 h-6 rounded-full ${levelInfo.color} text-xs flex items-center justify-center mr-2 dark:bg-opacity-20`}>
                        {stepIndex + 1}
                      </span>
                      {step.title}
                    </h3>
                    {!isUnlocked && (
                      <div className="flex items-center text-slate-500 dark:text-slate-400">
                        <Lock className="h-4 w-4 mr-1" />
                        <span className="text-xs">Complete previous step</span>
                      </div>
                    )}
                  </div>
                  
                  <ul className="ml-8 space-y-3 text-slate-600 dark:text-slate-300">
                    {step.topics.map((topic, topicIndex) => {
                      const status = getTopicStatus(stepIndex, topicIndex);
                      
                      let statusIcon;
                      let statusClass;
                      
                      if (status === 'completed') {
                        statusIcon = <CheckSquare className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mt-0.5 mr-2 flex-shrink-0" />;
                        statusClass = "text-slate-900 dark:text-slate-100 font-medium";
                      } else if (status === 'in-progress') {
                        statusIcon = <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            backgroundColor: ['#3b82f6', '#2563eb', '#3b82f6']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                          className="h-4 w-4 rounded-sm bg-blue-500 mt-0.5 mr-2 flex-shrink-0"
                        />;
                        statusClass = "text-slate-800 dark:text-slate-200";
                      } else {
                        statusIcon = <Square className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5 mr-2 flex-shrink-0" />;
                        statusClass = "text-slate-600 dark:text-slate-400";
                      }
                      
                      return (
                        <motion.li 
                          key={topicIndex} 
                          className={`flex items-start p-2 rounded ${levelInfo.hoverColor} cursor-pointer transition-colors ${statusClass}`}
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            if (isUnlocked) {
                              const nextStatus = status === 'not-started' 
                                ? 'in-progress' 
                                : status === 'in-progress' 
                                  ? 'completed' 
                                  : 'not-started';
                              updateTopicStatus(stepIndex, topicIndex, nextStatus);
                            }
                          }}
                        >
                          {statusIcon}
                          <span>{topic}</span>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
