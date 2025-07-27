import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LearningModules } from './components/LearningModules';
import { StrategyBuilder } from './components/StrategyBuilder';
import { BacktestEngine } from './components/BacktestEngine';
import { MarketSimulator } from './components/MarketSimulator';
import { RiskManager } from './components/RiskManager';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { TradingProgress } from './components/TradingProgress';
import { BookOpen, Code, TrendingUp, BarChart3, Shield, PieChart, Target } from 'lucide-react';
import './App.css';

interface UserProgress {
  completedModules: number;
  totalModules: number;
  strategiesBuilt: number;
  backtestsRun: number;
  currentLevel: string;
}

function App() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedModules: 3,
    totalModules: 6,
    strategiesBuilt: 2,
    backtestsRun: 5,
    currentLevel: 'Intermediate'
  });

  const [activeStrategy, setActiveStrategy] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Systematic Trading Academy
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Master algorithmic trading from theory to live implementation
          </p>
          
          <div className="flex justify-center items-center gap-4 mb-6">
            <Badge variant="secondary" className="px-4 py-2">
              Level: {userProgress.currentLevel}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Overall Progress:</span>
              <Progress value={(userProgress.completedModules / userProgress.totalModules) * 100} className="w-32" />
              <span className="text-sm font-medium">{Math.round((userProgress.completedModules / userProgress.totalModules) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="learning" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Build
            </TabsTrigger>
            <TabsTrigger value="backtest" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Backtest
            </TabsTrigger>
            <TabsTrigger value="simulator" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Simulate
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Risk
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="space-y-6">
            <LearningModules userProgress={userProgress} setUserProgress={setUserProgress} />
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6">
            <StrategyBuilder activeStrategy={activeStrategy} setActiveStrategy={setActiveStrategy} />
          </TabsContent>

          <TabsContent value="backtest" className="space-y-6">
            <BacktestEngine activeStrategy={activeStrategy} />
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <MarketSimulator />
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <RiskManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <PerformanceAnalytics />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <TradingProgress userProgress={userProgress} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
