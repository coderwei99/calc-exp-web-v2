"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap } from 'lucide-react';

interface ConversionRateCardProps {
  staminaToExpRatio: string;
  onStaminaToExpRatioChange: (value: string) => void;
}

export function ConversionRateCard({ staminaToExpRatio, onStaminaToExpRatioChange }: ConversionRateCardProps) {
  const ratio = Number(staminaToExpRatio) || 0;
  
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>转换比例</span>
        </CardTitle>
        <CardDescription>
          体力与经验的转换比例
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="stamina-exp-ratio">
            1点体力 = {ratio > 0 ? ratio : '?'} 经验
          </Label>
          <Input
            id="stamina-exp-ratio"
            type="number"
            placeholder="例：10"
            value={staminaToExpRatio}
            onChange={(e) => onStaminaToExpRatioChange(e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-yellow-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
          />
        </div>
      </CardContent>
    </Card>
  );
}