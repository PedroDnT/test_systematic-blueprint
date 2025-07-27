import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { faker } from '@faker-js/faker';

interface Trade {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  quantity: number;
  price: number;
  timestamp: Date;
  pnl?: number;
}

interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
}

export const MarketSimulator: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [initialBalance] = useState(10000);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [quantity, setQuantity] = useState(10);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({
    AAPL: 150.25,
    MSFT: 305.80,
    GOOGL: 2450.50,
    TSLA: 185.30,
    SPY: 425.75
  });

  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'SPY'];

  // Simulate real-time price updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSimulating) {
      interval = setInterval(() => {
        setCurrentPrices(prev => {
          const updated = { ...prev };
          symbols.forEach(symbol => {
            const change = faker.number.float({ min: -0.02, max: 0.02 });
            updated[symbol] = Math.max(0.01, updated[symbol] * (1 + change));
          });
          return updated;
        });

        // Update price history
        setPriceHistory(prev => {
          const newPoint = {
            time: new Date().toLocaleTimeString(),
            [selectedSymbol]: currentPrices[selectedSymbol]
          };
          return [...prev.slice(-49), newPoint];
        });

        // Update positions PnL
        setPositions(prev => prev.map(pos => ({
          ...pos,
          currentPrice: currentPrices[pos.symbol],
          pnl: (currentPrices[pos.symbol] - pos.avgPrice) * pos.quantity
        })));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, selectedSymbol, currentPrices]);

  const executeTrade = (type: 'BUY' | 'SELL') => {
    const price = currentPrices[selectedSymbol];
    const cost = price * quantity;

    if (type === 'BUY') {
      if (balance < cost) {
        alert('Insufficient balance!');
        return;
      }
      setBalance(prev => prev - cost);
    } else {
      setBalance(prev => prev + cost);
    }

    const newTrade: Trade = {
      id: faker.string.uuid(),
      type,
      symbol: selectedSymbol,
      quantity,
      price,
      timestamp: new Date()
    };

    setTrades(prev => [newTrade, ...prev]);

    // Update positions
    setPositions(prev => {
      const existingPos = prev.find(p => p.symbol === selectedSymbol);
      
      if (existingPos) {
        const newQuantity = type === 'BUY' 
          ? existingPos.quantity + quantity 
          : existingPos.quantity - quantity;
        
        if (newQuantity === 0) {
          return prev.filter(p => p.symbol !== selectedSymbol);
        }
        
        const newAvgPrice = type === 'BUY'
          ? (existingPos.avgPrice * existingPos.quantity + price * quantity) / newQuantity
          : existingPos.avgPrice;

        return prev.map(p => 
          p.symbol === selectedSymbol 
            ? { ...p, quantity: newQuantity, avgPrice: newAvgPrice }
            : p
        );
      } else if (type === 'BUY') {
        return [...prev, {
          symbol: selectedSymbol,
          quantity,
          avgPrice: price,
          currentPrice: price,
          pnl: 0
        }];
      }
      
      return prev;
    });
  };

  const resetSimulation = () => {
    setBalance(initialBalance);
    setTrades([]);
    setPositions([]);
    setPriceHistory([]);
    setIsSimulating(false);
  };

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalReturn = ((balance + totalPnL - initialBalance) / initialBalance) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Market Simulator
          </CardTitle>
          <CardDescription>
            Practice trading in a risk-free environment with real-time price simulation
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Cash Balance</div>
            <div className="text-2xl font-bold text-green-600">
              ${balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Unrealized P&L</div>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalPnL.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Total Return</div>
            <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Total Trades</div>
            <div className="text-2xl font-bold text-blue-600">
              {trades.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Panel</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setIsSimulating(!isSimulating)}
                variant={isSimulating ? "destructive" : "default"}
              >
                {isSimulating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isSimulating ? 'Pause' : 'Start'}
              </Button>
              <Button size="sm" variant="outline" onClick={resetSimulation}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Symbol</label>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {symbols.map(symbol => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol} - ${currentPrices[symbol].toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Estimated Cost: ${(currentPrices[selectedSymbol] * quantity).toFixed(2)}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => executeTrade('BUY')}
                disabled={!isSimulating || balance < (currentPrices[selectedSymbol] * quantity)}
                className="bg-green-600 hover:bg-green-700"
              >
                Buy
              </Button>
              <Button
                onClick={() => executeTrade('SELL')}
                disabled={!isSimulating}
                className="bg-red-600 hover:bg-red-700"
              >
                Sell
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Price Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{selectedSymbol} - Live Price</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">${currentPrices[selectedSymbol].toFixed(2)}</span>
              <Badge variant={isSimulating ? "default" : "secondary"}>
                {isSimulating ? 'LIVE' : 'PAUSED'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey={selectedSymbol} 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Positions */}
        <Card>
          <CardHeader>
            <CardTitle>Current Positions</CardTitle>
          </CardHeader>
          <CardContent>
            {positions.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No positions open
              </div>
            ) : (
              <div className="space-y-3">
                {positions.map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{position.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {position.quantity} shares @ ${position.avgPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${position.pnl.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${position.currentPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            {trades.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No trades executed
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {trades.slice(0, 10).map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'}>
                        {trade.type}
                      </Badge>
                      <span className="font-medium">{trade.symbol}</span>
                    </div>
                    <div className="text-right text-sm">
                      <div>{trade.quantity} @ ${trade.price.toFixed(2)}</div>
                      <div className="text-muted-foreground">
                        {trade.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
