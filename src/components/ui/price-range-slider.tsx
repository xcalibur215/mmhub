import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CURRENCIES } from '@/utils/currency';

interface PriceRangeSliderProps {
  minPrice?: number;
  maxPrice?: number;
  onPriceChange?: (min: number, max: number) => void;
  className?: string;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice = 0,
  maxPrice,
  onPriceChange,
  className = ''
}) => {
  // Use only Thai Baht currency
  const currency = CURRENCIES.THB;
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const defaultMaxPrice = maxPrice || 100000; // Default max price in THB
  
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, defaultMaxPrice]);
  const [minInput, setMinInput] = useState<string>(minPrice.toString());
  const [maxInput, setMaxInput] = useState<string>(defaultMaxPrice.toString());

  const handleRangeChange = useCallback((range: [number, number]) => {
    const [min, max] = range;
    setPriceRange([min, max]);
    setMinInput(min.toString());
    setMaxInput(max.toString());
    onPriceChange?.(min, max);
  }, [onPriceChange]);

  const handleMinInputChange = (value: string) => {
    setMinInput(value);
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue) && numValue >= 0 && numValue <= priceRange[1]) {
      const newRange: [number, number] = [numValue, priceRange[1]];
      setPriceRange(newRange);
      onPriceChange?.(newRange[0], newRange[1]);
    }
  };

  const handleMaxInputChange = (value: string) => {
    setMaxInput(value);
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue) && numValue >= priceRange[0] && numValue <= defaultMaxPrice) {
      const newRange: [number, number] = [priceRange[0], numValue];
      setPriceRange(newRange);
      onPriceChange?.(newRange[0], newRange[1]);
    }
  };

  const handleSliderChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    handleRangeChange(newRange);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Slider */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="px-3">
            <Slider
              value={priceRange}
              onValueChange={handleSliderChange}
              min={minPrice}
              max={defaultMaxPrice}
              step={Math.round(defaultMaxPrice / 100)}
              className="w-full"
            />
          </div>
          
          {/* Current Range Display */}
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </div>
            <div className="text-sm text-muted-foreground">
              per month
            </div>
          </div>
        </div>

        {/* Manual Input Fields - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-price">Minimum Price</Label>
            <Input
              id="min-price"
              type="number"
              min="0"
              max={priceRange[1]}
              value={minInput}
              onChange={(e) => handleMinInputChange(e.target.value)}
              placeholder="Min"
              className="text-base"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-price">Maximum Price</Label>
            <Input
              id="max-price"
              type="number"
              min={priceRange[0]}
              max={defaultMaxPrice}
              value={maxInput}
              onChange={(e) => handleMaxInputChange(e.target.value)}
              placeholder="Max"
              className="text-base"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceRangeSlider;