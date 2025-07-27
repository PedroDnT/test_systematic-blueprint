import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Circle, Clock, Trophy, BookOpen, Lock } from 'lucide-react';
import { ModuleDetailSheet } from './ModuleDetailSheet';
import { syllabusData, ModuleContent } from '@/lib/syllabusData';

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completed: boolean;
  locked: boolean;
  topics: string[];
  practicalExercise: string;
}

interface LearningModulesProps {
  userProgress: any;
  setUserProgress: (progress: any) => void;
}

export const LearningModules: React.FC<LearningModulesProps> = ({ userProgress, setUserProgress }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedModuleContent, setSelectedModuleContent] = useState<ModuleContent | null>(null);

  const modules: Module[] = [
    {
      id: 'foundations',
      title: 'Foundations of Systematic Trading',
      description: 'Understand the core workflow, components, and principles of systematic trading.',
      difficulty: 'Beginner',
      duration: '2 hours',
      completed: true,
      locked: false,
      topics: ['Systematic Trading Workflow', 'Key System Components', 'Idea Generation', 'Market Pattern Analysis'],
      practicalExercise: 'Analyze historical market data to identify potential trend and mean-reversion patterns.'
    },
    {
      id: 'data-management',
      title: 'Data Acquisition and Management',
      description: 'Master the sourcing, cleaning, and storage of market, fundamental, and alternative data.',
      difficulty: 'Beginner',
      duration: '3 hours',
      completed: true,
      locked: false,
      topics: ['Market & Fundamental Data', 'Alternative Data Sources', 'Data Cleaning & Preprocessing', 'Data Storage Solutions'],
      practicalExercise: 'Set up a data pipeline to download, clean, and store historical stock data.'
    },
    {
      id: 'strategy-design',
      title: 'Strategy Design and Development',
      description: 'Learn to formulate, code, and refine trading strategies from trend-following to ML-based models.',
      difficulty: 'Intermediate',
      duration: '5 hours',
      completed: true,
      locked: false,
      topics: ['Hypothesis Formulation', 'Trend, Mean-Reversion & Breakout', 'Advanced Concepts (VWAP/TWAP)', 'Intro to ML in Trading'],
      practicalExercise: 'Develop and code a simple moving average crossover strategy in Python.'
    },
    {
      id: 'backtesting',
      title: 'Backtesting and Performance Evaluation',
      description: 'Rigorously test strategies, evaluate performance metrics, and avoid common pitfalls like overfitting.',
      difficulty: 'Intermediate',
      duration: '4 hours',
      completed: false,
      locked: false,
      topics: ['Backtesting Frameworks', 'Key Performance Metrics', 'Robustness Testing', 'Walk-Forward Optimization'],
      practicalExercise: 'Implement a backtest, calculate key metrics, and perform basic robustness checks.'
    },
    {
      id: 'risk-management',
      title: 'Risk Management and Portfolio Optimization',
      description: 'Implement crucial risk controls and learn advanced techniques for portfolio construction.',
      difficulty: 'Advanced',
      duration: '4 hours',
      completed: false,
      locked: false,
      topics: ['Stop-Loss & Position Sizing', 'Diversification & Hedging', 'Mean-Variance Optimization', 'Risk Parity'],
      practicalExercise: 'Integrate dynamic stop-loss and position sizing rules into your backtesting script.'
    },
    {
      id: 'live-trading',
      title: 'Implementation and Live Trading',
      description: 'Transition from backtesting to live deployment, focusing on execution, latency, and monitoring.',
      difficulty: 'Advanced',
      duration: '3 hours',
      completed: false,
      locked: true,
      topics: ['Execution Systems & Brokers', 'Latency Considerations', 'Deployment Strategies', 'Live Monitoring & Error Handling'],
      practicalExercise: 'Set up a paper trading account and deploy your strategy for forward testing.'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleModuleClick = (moduleId: string) => {
    const content = syllabusData[moduleId];
    if (content) {
      setSelectedModuleContent(content);
      setIsSheetOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learning Path Overview
            </CardTitle>
            <CardDescription>
              Structured curriculum to master systematic trading from basics to advanced concepts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{userProgress.completedModules}</div>
                <div className="text-sm text-muted-foreground">Completed Modules</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userProgress.totalModules - userProgress.completedModules}</div>
                <div className="text-sm text-muted-foreground">Remaining Modules</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{Math.round((userProgress.completedModules / userProgress.totalModules) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className={`transition-all duration-200 ${module.locked ? 'opacity-60' : 'hover:shadow-lg'}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {module.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : module.locked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-blue-600" />
                    )}
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                    {module.completed && <Trophy className="w-4 h-4 text-yellow-500" />}
                  </div>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {module.duration}
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="topics">
                      <AccordionTrigger>Course Topics</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1">
                          {module.topics.map((topic, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="exercise">
                      <AccordionTrigger>Practical Exercise</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          {module.practicalExercise}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Button 
                    onClick={() => handleModuleClick(module.id)}
                    disabled={module.locked}
                    className="w-full"
                    variant={module.completed ? "outline" : "default"}
                  >
                    {module.completed ? 'Review Module' : module.locked ? 'Locked' : 'Start Module'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <ModuleDetailSheet 
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        moduleContent={selectedModuleContent}
      />
    </>
  );
};
