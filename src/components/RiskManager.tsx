import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Shield, AlertTriangle, TrendingDown, Target, DollarSign, Percent } from 'lucide-react';

interface RiskRule {
  id: string;
  name: string;
  type: 'position_size' | 'stop_loss' | 'daily_loss' | 'concentration';
  value: number;
  enabled: boolean;
  description: string;
}

export const RiskManager: React.FC = () => {
  const [riskRules, setRiskRules] = useState<RiskRule[]>([
    {
      id: 'max_position',
      name: 'Max Position Size',
      type: 'position_size',
      value: 10,
      enabled: true,
      description: 'Maximum percentage of portfolio per position'
    },
    {
      id: 'stop_loss',
      name: 'Stop Loss',
      type: 'stop_loss',
      value: 2,
      enabled: true,
      description: 'Maximum loss per trade as percentage'
    },
    {
      id: 'daily_loss',
      name: 'Daily Loss Limit',
      type: 'daily_loss',
      value: 5,
      enabled: true,
      description: 'Maximum daily portfolio loss percentage'
    },
    {
      id: 'concentration',
      name: 'Sector Concentration',
      type: 'concentration',
      value: 25,
      enabled: false,
      description: 'Maximum allocation to single sector'
    }
  ]);

  const [portfolioMetrics] = useState({
    totalValue: 50000,
    var95: 2850,
    sharpeRatio: 1.42,
    maxDrawdown: 8.5,
    beta: 1.15,
    volatility: 18.3
  });

  const portfolioAllocation = [
    { name: 'Technology', value: 35, color: '#3b82f6' },
    { name: 'Healthcare', value: 20, color: '#10b981' },
    { name: 'Financials', value: 15, color: '#f59e0b' },
    { name: 'Consumer', value: 15, color: '#ef4444' },
    { name: 'Energy', value: 10, color: '#8b5cf6' },
    { name: 'Cash', value: 5, color: '#6b7280' }
  ];

  const riskByAsset = [
    { asset: 'AAPL', risk: 12.5, allocation: 15 },
    { asset: 'MSFT', risk: 10.2, allocation: 12 },
    { asset: 'GOOGL', risk: 15.8, allocation: 10 },
    { asset: 'TSLA', risk: 25.3, allocation: 8 },
    { asset: 'SPY', risk: 8.7, allocation: 20 }
  ];

  const updateRiskRule = (id: string, field: keyof RiskRule, value: any) => {
    setRiskRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const calculatePositionSize = (portfolioValue: number, riskPerTrade: number, stopLoss: number) => {
    return Math.floor((portfolioValue * riskPerTrade / 100) / (stopLoss / 100));
  };

  const getRiskLevel = (value: number, type: string) => {
    switch (type) {
      case 'var95':
        if (value > 5000) return { level: 'High', color: 'text-red-600' };
        if (value > 2000) return { level: 'Medium', color: 'text-yellow-600' };
        return { level: 'Low', color: 'text-green-600' };
      case 'drawdown':
        if (value > 15) return { level: 'High', color: 'text-red-600' };
        if (value > 8) return { level: 'Medium', color: 'text-yellow-600' };
        return { level: 'Low', color: 'text-green-600' };
      default:
        return { level: 'Medium', color: 'text-yellow-600' };
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Management Center
          </CardTitle>
          <CardDescription>
            Monitor and control portfolio risk with automated rules and real-time metrics
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Risk Alerts */}
      <div className="space-y-3">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> TSLA position exceeds recommended volatility threshold (25.3% vs 20% limit)
          </AlertDescription>
        </Alert>
        
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Good:</strong> Portfolio diversification meets target allocation requirements
          </AlertDescription>
        </Alert>
      </div>

      {/* Portfolio Risk Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-sm text-muted-foreground">Portfolio Value</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              ${portfolioMetrics.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              <span className="text-sm text-muted-foreground">VaR (95%)</span>
            </div>
            <div className={`text-xl font-bold ${getRiskLevel(portfolioMetrics.var95, 'var95').color}`}>
              ${portfolioMetrics.var95.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              {portfolioMetrics.sharpeRatio}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              <span className="text-sm text-muted-foreground">Max Drawdown</span>
            </div>
            <div className={`text-xl font-bold ${getRiskLevel(portfolioMetrics.maxDrawdown, 'drawdown').color}`}>
              {portfolioMetrics.maxDrawdown}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Percent className="w-4 h-4 text-purple-600 mr-1" />
              <span className="text-sm text-muted-foreground">Beta</span>
            </div>
            <div className="text-xl font-bold text-purple-600">
              {portfolioMetrics.beta}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-4 h-4 text-orange-600 mr-1" />
              <span className="text-sm text-muted-foreground">Volatility</span>
            </div>
            <div className="text-xl font-bold text-orange-600">
              {portfolioMetrics.volatility}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Rules Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Rules</CardTitle>
            <CardDescription>Configure automated risk management rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {riskRules.map((rule) => (
              <div key={rule.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => updateRiskRule(rule.id, 'enabled', checked)}
                  />
                </div>
                
                {rule.enabled && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[rule.value]}
                        onValueChange={(value) => updateRiskRule(rule.id, 'value', value[0])}
                        max={rule.type === 'concentration' ? 50 : rule.type === 'position_size' ? 20 : 10}
                        min={1}
                        step={0.5}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={rule.value}
                        onChange={(e) => updateRiskRule(rule.id, 'value', parseFloat(e.target.value))}
                        className="w-20"
                        min="0.5"
                        max="50"
                        step="0.5"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <Button className="w-full">
              Save Risk Rules
            </Button>
          </CardContent>
        </Card>

        {/* Portfolio Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Current sector and asset allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={portfolioAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {portfolioAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {portfolioAllocation.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk by Asset */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Analysis by Asset</CardTitle>
          <CardDescription>Individual asset risk contribution to portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskByAsset}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="asset" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${value}%`, name === 'risk' ? 'Risk' : 'Allocation']} />
              <Bar dataKey="risk" fill="#ef4444" name="Risk %" />
              <Bar dataKey="allocation" fill="#3b82f6" name="Allocation %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Position Size Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Position Size Calculator</CardTitle>
          <CardDescription>Calculate optimal position size based on risk parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Portfolio Value</label>
              <Input type="number" defaultValue="50000" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Per Trade (%)</label>
              <Input type="number" defaultValue="2" step="0.1" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Stop Loss (%)</label>
              <Input type="number" defaultValue="3" step="0.1" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Recommended Position</label>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-center">
                <span className="font-bold text-blue-600">$3,333</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
