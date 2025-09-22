import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface AdvancedPriceSliderProps {
  min?: number;
  max?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  className?: string;
  showInputs?: boolean;
}

const AdvancedPriceSlider: React.FC<AdvancedPriceSliderProps> = ({
  min = 1000,
  max = 50000,
  value,
  onValueChange,
  className = '',
  showInputs = false
}) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const [minInput, setMinInput] = useState<string>(value[0].toString());
  const [maxInput, setMaxInput] = useState<string>(value[1].toString());

  // Price ranges and their respective step sizes
  const getPriceSteps = () => {
    const steps: { min: number; max: number; step: number; }[] = [];
    
    // 1000 to 20000: step of 1000
    for (let i = 1000; i <= 20000; i += 1000) {
      steps.push({ min: i, max: i, step: 1000 });
    }
    
    // 20000 to 30000: step of 2000
    for (let i = 22000; i <= 30000; i += 2000) {
      steps.push({ min: i, max: i, step: 2000 });
    }
    
    // 30000 to 50000: step of 5000
    for (let i = 35000; i <= 50000; i += 5000) {
      steps.push({ min: i, max: i, step: 5000 });
    }
    
    return steps.map(s => s.min);
  };

  const priceSteps = getPriceSteps();

  // Convert price to slider index
  const priceToIndex = (price: number): number => {
    if (price <= 1000) return 0;
    if (price >= 50000) return priceSteps.length - 1;
    
    // Find closest step
    let closestIndex = 0;
    let minDiff = Math.abs(priceSteps[0] - price);
    
    for (let i = 1; i < priceSteps.length; i++) {
      const diff = Math.abs(priceSteps[i] - price);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  };

  // Convert slider index to price
  const indexToPrice = (index: number): number => {
    if (index >= priceSteps.length) return 50000;
    if (index < 0) return 1000;
    return priceSteps[index];
  };

  // Snap price to nearest valid step
  const snapToStep = (price: number): number => {
    if (price <= 1000) return 1000;
    if (price >= 50000) return 50000;
    
    if (price <= 20000) {
      return Math.round(price / 1000) * 1000;
    } else if (price <= 30000) {
      return Math.round(price / 2000) * 2000;
    } else {
      return Math.round(price / 5000) * 5000;
    }
  };

  useEffect(() => {
    setLocalValue(value);
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  }, [value]);

  const handleSliderChange = (sliderValues: number[]) => {
    const minPrice = indexToPrice(sliderValues[0]);
    const maxPrice = indexToPrice(sliderValues[1]);
    const newValue: [number, number] = [minPrice, maxPrice];
    
    setLocalValue(newValue);
    setMinInput(minPrice.toString());
    setMaxInput(maxPrice.toString());
    onValueChange(newValue);
  };

  const handleMinInputChange = (inputValue: string) => {
    setMinInput(inputValue);
    const numValue = parseInt(inputValue);
    
    if (!isNaN(numValue) && numValue >= min && numValue <= localValue[1]) {
      const snappedValue = snapToStep(numValue);
      const newValue: [number, number] = [snappedValue, localValue[1]];
      setLocalValue(newValue);
      onValueChange(newValue);
    }
  };

  const handleMaxInputChange = (inputValue: string) => {
    setMaxInput(inputValue);
    let numValue = parseInt(inputValue);
    
    if (!isNaN(numValue)) {
      // Handle 50000+ case
      if (numValue >= 50000) {
        numValue = 50000;
        setMaxInput("50000+");
      }
      
      if (numValue >= localValue[0] && numValue <= max) {
        const snappedValue = snapToStep(numValue);
        const newValue: [number, number] = [localValue[0], snappedValue];
        setLocalValue(newValue);
        onValueChange(newValue);
      }
    }
  };

  const formatPrice = (price: number): string => {
    if (price >= 50000) {
      return `฿${price.toLocaleString()}+`;
    }
    return `฿${price.toLocaleString()}`;
  };

  const sliderMin = priceToIndex(localValue[0]);
  const sliderMax = priceToIndex(localValue[1]);

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="text-center">
          <label className="block text-sm font-medium text-foreground mb-2">
            Monthly Rent: {formatPrice(localValue[0])} - {formatPrice(localValue[1])}
          </label>
        </div>
        
        <Slider
          min={0}
          max={priceSteps.length - 1}
          step={1}
          value={[sliderMin, sliderMax]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>฿1,000</span>
          <span>฿50,000+</span>
        </div>

        {showInputs && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Min Price
              </label>
              <Input
                type="number"
                min={min}
                max={localValue[1]}
                value={minInput}
                onChange={(e) => handleMinInputChange(e.target.value)}
                onBlur={() => setMinInput(localValue[0].toString())}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Max Price
              </label>
              <Input
                type="text"
                value={maxInput}
                onChange={(e) => handleMaxInputChange(e.target.value)}
                onBlur={() => setMaxInput(localValue[1] >= 50000 ? "50000+" : localValue[1].toString())}
                className="text-sm"
                placeholder="50000+"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedPriceSlider;