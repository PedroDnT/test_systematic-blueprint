import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Play, Save, Settings, TrendingUp, AlertTriangle } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'arbitrage' | 'momentum';
  parameters: Record<string, any>;
  code: string;
  status: 'draft' | 'testing' | 'live';
}

interface StrategyBuilderProps {
  activeStrategy: string;
  setActiveStrategy: (strategy: string) => void;
}

export const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ activeStrategy, setActiveStrategy }) => {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: 'sma-crossover',
      name: 'SMA Crossover',
      description: 'Simple moving average crossover strategy',
      type: 'trend-following',
      parameters: {
        fastPeriod: 10,
        slowPeriod: 20,
        stopLoss: 2,
        takeProfit: 4
      },
      code: `// Simple Moving Average Crossover Strategy
function smaStrategy(data, fastPeriod = 10, slowPeriod = 20) {
  const fastSMA = calculateSMA(data, fastPeriod);
  const slowSMA = calculateSMA(data, slowPeriod);
  
  const signals = [];
  
  for (let i = 1; i < data.length; i++) {
    const prevFast = fastSMA[i-1];
    const prevSlow = slowSMA[i-1];
    const currFast = fastSMA[i];
    const currSlow = slowSMA[i];
    
    if (prevFast <= prevSlow && currFast > currSlow) {
      signals.push({ type: 'BUY', index: i, price: data[i].close });
    } else if (prevFast >= prevSlow && currFast < currSlow) {
      signals.push({ type: 'SELL', index: i, price: data[i].close });
    }
  }
  
  return signals;
}`,
      status: 'testing'
    },
    {
      id: 'rsi-mean-reversion',
      name: 'RSI Mean Reversion',
      description: 'Buy oversold, sell overbought using RSI',
      type: 'mean-reversion',
      parameters: {
        rsiPeriod: 14,
        oversoldThreshold: 30,
        overboughtThreshold: 70,
        stopLoss: 1.5
      },
      code: `// RSI Mean Reversion Strategy
function rsiStrategy(data, period = 14, oversold = 30, overbought = 70) {
  const rsi = calculateRSI(data, period);
  const signals = [];
  
  for (let i = 1; i < data.length; i++) {
    const currentRSI = rsi[i];
    const prevRSI = rsi[i-1];
    
    if (prevRSI > oversold && currentRSI <= oversold) {
      signals.push({ type: 'BUY', index: i, price: data[i].close });
    } else if (prevRSI < overbought && currentRSI >= overbought) {
      signals.push({ type: 'SELL', index: i, price: data[i].close });
    }
  }
  
  return signals;
}`,
      status: 'draft'
    }
  ]);

  const [newStrategy, setNewStrategy] = useState<Partial<Strategy>>({
    name: '',
    description: '',
    type: 'trend-following',
    parameters: {},
    code: ''
  });

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(strategies[0]);

  const strategyTypes = [
    { value: 'trend-following', label: 'Trend Following', color: 'bg-green-100 text-green-800' },
    { value: 'mean-reversion', label: 'Mean Reversion', color: 'bg-blue-100 text-blue-800' },
    { value: 'arbitrage', label: 'Arbitrage', color: 'bg-purple-100 text-purple-800' },
    { value: 'momentum', label: 'Momentum', color: 'bg-orange-100 text-orange-800' }
  ];

  const handleParameterChange = (key: string, value: any) => {
    if (selectedStrategy) {
      const updatedStrategy = {
        ...selectedStrategy,
        parameters: { ...selectedStrategy.parameters, [key]: value }
      };
      setSelectedStrategy(updatedStrategy);
      
      // Update in strategies array
      setStrategies(prev => prev.map(s => 
        s.id === selectedStrategy.id ? updatedStrategy : s
      ));
    }
  };

  const saveStrategy = () => {
    if (selectedStrategy) {
      setStrategies(prev => prev.map(s => 
        s.id === selectedStrategy.id ? selectedStrategy : s
      ));
      alert('Strategy saved successfully!');
    }
  };

  const testStrategy = () => {
    if (selectedStrategy) {
      alert(`Testing strategy: ${selectedStrategy.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Strategy Builder
          </CardTitle>
          <CardDescription>
            Build, test, and optimize your trading strategies with our visual editor
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Strategies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedStrategy?.id === strategy.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedStrategy(strategy)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{strategy.name}</h4>
                  <Badge 
                    variant="outline"
                    className={strategyTypes.find(t => t.value === strategy.type)?.color}
                  >
                    {strategy.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{strategy.description}</p>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              + New Strategy
            </Button>
          </CardContent>
        </Card>

        {/* Strategy Editor */}
        <div className="lg:col-span-2">
          {selectedStrategy && (
            <Tabs defaultValue="parameters" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="code">Code Editor</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="parameters">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedStrategy.name} - Parameters</span>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveStrategy}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={testStrategy}>
                          <Play className="w-4 h-4 mr-2" />
                          Test
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedStrategy.parameters).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm font-medium capitalize mb-2 block">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <Input
                            type="number"
                            value={value}
                            onChange={(e) => handleParameterChange(key, parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Parameter Guidelines</span>
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Test parameters on historical data before live trading</li>
                        <li>• Avoid over-optimization to prevent curve fitting</li>
                        <li>• Consider transaction costs in your strategy parameters</li>
                        <li>• Use appropriate risk management settings</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code">
                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Code</CardTitle>
                    <CardDescription>
                      Edit your strategy logic using JavaScript
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={selectedStrategy.code}
                      onChange={(e) => setSelectedStrategy({
                        ...selectedStrategy,
                        code: e.target.value
                      })}
                      className="font-mono text-sm min-h-[400px]"
                      placeholder="Enter your strategy code here..."
                    />
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <Button>
                        <Play className="w-4 h-4 mr-2" />
                        Run Code
                      </Button>
                      <Button variant="outline">
                        <Code className="w-4 h-4 mr-2" />
                        Validate Syntax
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Strategy Name</label>
                      <Input
                        value={selectedStrategy.name}
                        onChange={(e) => setSelectedStrategy({
                          ...selectedStrategy,
                          name: e.target.value
                        })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={selectedStrategy.description}
                        onChange={(e) => setSelectedStrategy({
                          ...selectedStrategy,
                          description: e.target.value
                        })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Strategy Type</label>
                      <Select
                        value={selectedStrategy.type}
                        onValueChange={(value: any) => setSelectedStrategy({
                          ...selectedStrategy,
                          type: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {strategyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};
