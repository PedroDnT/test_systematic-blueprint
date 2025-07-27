import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Play, TrendingUp, TrendingDown, DollarSign, Calendar, Target } from 'lucide-react';
import { faker } from '@faker-js/faker';

interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
}

interface BacktestEngineProps {
  activeStrategy: string;
}

export const BacktestEngine: React.FC<BacktestEngineProps> = ({ activeStrategy }) => {
  const [backtestConfig, setBacktestConfig] = useState({
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    initialCapital: 10000,
    symbol: 'AAPL',
    timeframe: '1D'
  });

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>({
    totalReturn: 23.45,
    sharpeRatio: 1.42,
    maxDrawdown: -8.32,
    winRate: 58.7,
    totalTrades: 127,
    profitFactor: 1.73
  });

  // Generate sample backtest data
  const generateBacktestData = () => {
    const data = [];
    let portfolioValue = backtestConfig.initialCapital;
    
    for (let i = 0; i < 250; i++) {
      const change = faker.number.float({ min: -0.03, max: 0.03 });
      portfolioValue *= (1 + change);
      
      data.push({
        date: faker.date.between({ from: '2023-01-01', to: '2024-12-31' }).toLocaleDateString(),
        portfolioValue: portfolioValue.toFixed(2),
        returns: (change * 100).toFixed(2),
        drawdown: faker.number.float({ min: -15, max: 0 }).toFixed(2)
      });
    }
    
    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const [equityCurve] = useState(generateBacktestData());

  const runBacktest = async () => {
    setIsRunning(true);
    
    // Simulate backtest running
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random results
    setResults({
      totalReturn: faker.number.float({ min: -20, max: 50 }),
      sharpeRatio: faker.number.float({ min: 0.5, max: 2.5 }),
      maxDrawdown: faker.number.float({ min: -25, max: -2 }),
      winRate: faker.number.float({ min: 45, max: 75 }),
      totalTrades: faker.number.int({ min: 50, max: 300 }),
      profitFactor: faker.number.float({ min: 0.8, max: 2.2 })
    });
    
    setIsRunning(false);
  };

  const monthlyReturns = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
    returns: faker.number.float({ min: -5, max: 8 }).toFixed(2)
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Backtesting Engine
          </CardTitle>
          <CardDescription>
            Test your strategies on historical data to evaluate performance
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Backtest Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Backtest Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Symbol</label>
              <Select value={backtestConfig.symbol} onValueChange={(value) => 
                setBacktestConfig({...backtestConfig, symbol: value})
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AAPL">AAPL</SelectItem>
                  <SelectItem value="MSFT">MSFT</SelectItem>
                  <SelectItem value="GOOGL">GOOGL</SelectItem>
                  <SelectItem value="TSLA">TSLA</SelectItem>
                  <SelectItem value="SPY">SPY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Timeframe</label>
              <Select value={backtestConfig.timeframe} onValueChange={(value) => 
                setBacktestConfig({...backtestConfig, timeframe: value})
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="1D">1 Day</SelectItem>
                  <SelectItem value="1W">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Input
                type="date"
                value={backtestConfig.startDate}
                onChange={(e) => setBacktestConfig({...backtestConfig, startDate: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="date"
                value={backtestConfig.endDate}
                onChange={(e) => setBacktestConfig({...backtestConfig, endDate: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Initial Capital</label>
              <Input
                type="number"
                value={backtestConfig.initialCapital}
                onChange={(e) => setBacktestConfig({...backtestConfig, initialCapital: parseInt(e.target.value)})}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={runBacktest} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running...
                  </div>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Backtest
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <>
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-muted-foreground">Total Return</span>
                </div>
                <div className={`text-2xl font-bold ${results.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.totalReturn >= 0 ? '+' : ''}{results.totalReturn.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {results.sharpeRatio.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-sm text-muted-foreground">Max Drawdown</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {results.maxDrawdown.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {results.winRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-sm text-muted-foreground">Total Trades</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {results.totalTrades}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 mr-1" />
                  <span className="text-sm text-muted-foreground">Profit Factor</span>
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {results.profitFactor.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
                <CardDescription>Portfolio value over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={equityCurve}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="portfolioValue" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
                <CardDescription>Monthly performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="returns" 
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
