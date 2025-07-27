import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Download, Filter, PieChart as PieChartIcon } from 'lucide-react';
import { faker } from '@faker-js/faker';

interface PerformanceMetric {
  name: string;
  value: string;
  change: number;
  period: string;
}

export const PerformanceAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1Y');
  const [selectedStrategy, setSelectedStrategy] = useState('all');

  const performanceMetrics: PerformanceMetric[] = [
    { name: 'Total Return', value: '23.45%', change: 2.3, period: 'YTD' },
    { name: 'Sharpe Ratio', value: '1.42', change: 0.15, period: 'YTD' },
    { name: 'Max Drawdown', value: '-8.32%', change: -1.2, period: 'YTD' },
    { name: 'Win Rate', value: '58.7%', change: 3.1, period: 'YTD' },
    { name: 'Profit Factor', value: '1.73', change: 0.08, period: 'YTD' },
    { name: 'Calmar Ratio', value: '2.82', change: 0.21, period: 'YTD' }
  ];

  // Generate sample data
  const generatePerformanceData = (days: number) => {
    const data = [];
    let portfolioValue = 10000;
    let benchmarkValue = 10000;
    
    for (let i = 0; i < days; i++) {
      const portfolioChange = faker.number.float({ min: -0.03, max: 0.04 });
      const benchmarkChange = faker.number.float({ min: -0.02, max: 0.03 });
      
      portfolioValue *= (1 + portfolioChange);
      benchmarkValue *= (1 + benchmarkChange);
      
      data.push({
        date: faker.date.recent({ days: days - i }).toISOString().split('T')[0],
        portfolio: portfolioValue.toFixed(2),
        benchmark: benchmarkValue.toFixed(2),
        returns: (portfolioChange * 100).toFixed(2),
        drawdown: faker.number.float({ min: -15, max: 0 }).toFixed(2)
      });
    }
    
    return data.reverse();
  };

  const [performanceData] = useState(generatePerformanceData(252));

  const monthlyReturns = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
    portfolio: faker.number.float({ min: -8, max: 12 }).toFixed(2),
    benchmark: faker.number.float({ min: -5, max: 8 }).toFixed(2)
  }));

  const riskReturnData = [
    { strategy: 'Mean Reversion', risk: 12.5, return: 15.2 },
    { strategy: 'Momentum', risk: 18.3, return: 22.1 },
    { strategy: 'Trend Following', risk: 15.7, return: 18.9 },
    { strategy: 'Arbitrage', risk: 8.2, return: 9.1 },
    { strategy: 'Benchmark', risk: 14.1, return: 12.3 }
  ];

  const drawdownPeriods = [
    { period: 'Mar 2024', duration: '12 days', magnitude: '-5.2%', recovery: 'Complete' },
    { period: 'Jul 2024', duration: '8 days', magnitude: '-3.1%', recovery: 'Complete' },
    { period: 'Oct 2024', duration: '15 days', magnitude: '-8.3%', recovery: 'Ongoing' }
  ];

  const exportData = (format: string) => {
    alert(`Exporting data in ${format.toUpperCase()} format...`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Performance Analytics
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your trading performance and strategy effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Timeframe:</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="ALL">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Strategy:</label>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="sma">SMA Crossover</SelectItem>
                  <SelectItem value="rsi">RSI Mean Reversion</SelectItem>
                  <SelectItem value="momentum">Momentum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" variant="outline" onClick={() => exportData('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">{metric.name}</div>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className={`text-xs flex items-center justify-center gap-1 ${
                metric.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}% {metric.period}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Performance vs Benchmark</CardTitle>
              <CardDescription>Portfolio performance compared to S&P 500</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="portfolio" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Portfolio"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="S&P 500"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="portfolio" fill="#3b82f6" name="Portfolio" />
                    <Bar dataKey="benchmark" fill="#ef4444" name="Benchmark" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rolling Returns Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="returns" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3}
                      name="Daily Returns %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk-Return Analysis</CardTitle>
                <CardDescription>Strategy comparison by risk and return</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={riskReturnData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="risk" name="Risk %" />
                    <YAxis dataKey="return" name="Return %" />
                    <Tooltip formatter={(value, name) => [`${value}%`, name === 'risk' ? 'Risk' : 'Return']} />
                    <Scatter dataKey="return" fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance Ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskReturnData
                    .sort((a, b) => b.return - a.return)
                    .map((strategy, index) => (
                    <div key={strategy.strategy} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{strategy.strategy}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          +{strategy.return}% return
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {strategy.risk}% risk
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drawdown">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Drawdown Analysis</CardTitle>
                <CardDescription>Portfolio drawdown over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="drawdown" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.3}
                      name="Drawdown %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Major Drawdown Periods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drawdownPeriods.map((period, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{period.period}</span>
                        <Badge variant={period.recovery === 'Complete' ? 'default' : 'destructive'}>
                          {period.recovery}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration: </span>
                          <span className="font-medium">{period.duration}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Magnitude: </span>
                          <span className="font-medium text-red-600">{period.magnitude}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
