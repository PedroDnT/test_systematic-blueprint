import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, BookOpen, Code, TrendingUp, Star, Clock, CheckCircle } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedDate?: string;
  category: 'learning' | 'trading' | 'strategy' | 'milestone';
}

interface TradingProgressProps {
  userProgress: any;
}

export const TradingProgress: React.FC<TradingProgressProps> = ({ userProgress }) => {
  const achievements: Achievement[] = [
    {
      id: 'first_module',
      title: 'First Steps',
      description: 'Complete your first learning module',
      icon: <BookOpen className="w-5 h-5" />,
      unlocked: true,
      unlockedDate: '2024-01-15',
      category: 'learning'
    },
    {
      id: 'first_strategy',
      title: 'Strategy Builder',
      description: 'Create your first trading strategy',
      icon: <Code className="w-5 h-5" />,
      unlocked: true,
      unlockedDate: '2024-01-20',
      category: 'strategy'
    },
    {
      id: 'first_backtest',
      title: 'Time Traveler',
      description: 'Run your first backtest',
      icon: <TrendingUp className="w-5 h-5" />,
      unlocked: true,
      unlockedDate: '2024-01-22',
      category: 'strategy'
    },
    {
      id: 'profitable_month',
      title: 'Monthly Winner',
      description: 'Achieve positive returns for a full month',
      icon: <Trophy className="w-5 h-5" />,
      unlocked: false,
      category: 'trading'
    },
    {
      id: 'risk_master',
      title: 'Risk Master',
      description: 'Complete advanced risk management module',
      icon: <Target className="w-5 h-5" />,
      unlocked: false,
      category: 'learning'
    },
    {
      id: 'hundred_trades',
      title: 'Century Club',
      description: 'Execute 100 trades',
      icon: <Star className="w-5 h-5" />,
      unlocked: false,
      category: 'trading'
    },
    {
      id: 'sharp_shooter',
      title: 'Sharp Shooter',
      description: 'Achieve Sharpe ratio above 2.0',
      icon: <Target className="w-5 h-5" />,
      unlocked: false,
      category: 'milestone'
    },
    {
      id: 'streak_master',
      title: 'Consistency King',
      description: '10 consecutive profitable weeks',
      icon: <Trophy className="w-5 h-5" />,
      unlocked: false,
      category: 'trading'
    }
  ];

  const learningPath = [
    {
      stage: 'Beginner',
      modules: ['Trading Fundamentals', 'Technical Analysis', 'Order Types'],
      progress: 100,
      unlocked: true
    },
    {
      stage: 'Intermediate',
      modules: ['Algorithmic Trading', 'Risk Management', 'Backtesting'],
      progress: 67,
      unlocked: true
    },
    {
      stage: 'Advanced',
      modules: ['Portfolio Theory', 'Market Microstructure', 'Machine Learning'],
      progress: 0,
      unlocked: false
    },
    {
      stage: 'Expert',
      modules: ['High-Frequency Trading', 'Alternative Data', 'Quantitative Research'],
      progress: 0,
      unlocked: false
    }
  ];

  const tradingStats = {
    totalTrades: 127,
    winRate: 58.7,
    avgReturn: 2.3,
    bestStrategy: 'SMA Crossover',
    timeSpent: 45,
    modulesCompleted: userProgress.completedModules
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'trading': return 'bg-green-100 text-green-800 border-green-200';
      case 'strategy': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'milestone': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Trading Progress Overview
          </CardTitle>
          <CardDescription>
            Track your learning journey and trading achievements
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Modules Completed</div>
            <div className="text-2xl font-bold text-blue-600">
              {tradingStats.modulesCompleted}/12
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Total Trades</div>
            <div className="text-2xl font-bold text-green-600">
              {tradingStats.totalTrades}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-purple-600">
              {tradingStats.winRate}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Avg Return</div>
            <div className="text-2xl font-bold text-orange-600">
              {tradingStats.avgReturn}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Best Strategy</div>
            <div className="text-sm font-bold text-indigo-600">
              {tradingStats.bestStrategy}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Hours Spent</div>
            <div className="text-2xl font-bold text-red-600">
              {tradingStats.timeSpent}h
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Path Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Path Progress</CardTitle>
            <CardDescription>Your journey through trading mastery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {learningPath.map((stage, index) => (
              <div key={stage.stage} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {stage.unlocked ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    )}
                    <div>
                      <h4 className="font-medium">{stage.stage}</h4>
                      <p className="text-sm text-muted-foreground">
                        {stage.modules.join(', ')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={stage.unlocked ? "default" : "secondary"}>
                    {stage.progress}%
                  </Badge>
                </div>
                
                <Progress value={stage.progress} className="w-full" />
                
                {index < learningPath.length - 1 && (
                  <div className="ml-2.5 h-6 w-px bg-border" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Unlock rewards as you progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 border rounded-lg transition-all ${
                    achievement.unlocked 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {achievement.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline"
                            className={getCategoryColor(achievement.category)}
                          >
                            {achievement.category}
                          </Badge>
                          {achievement.unlocked && (
                            <Trophy className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      
                      {achievement.unlocked && achievement.unlockedDate && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Clock className="w-3 h-3" />
                          Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
          <CardDescription>Focus on these areas to accelerate your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium">Complete Risk Management</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Learn advanced position sizing and portfolio risk controls
              </p>
              <Button size="sm" className="w-full">
                Start Module
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-medium">Run More Backtests</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Test your strategies on different market conditions
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Go to Backtester
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium">Build New Strategy</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Try implementing a mean reversion strategy
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Strategy Builder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
