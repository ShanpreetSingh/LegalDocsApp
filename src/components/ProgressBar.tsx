import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                {isCompleted ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <Circle className={`h-8 w-8 ${isCurrent ? 'text-blue-500' : 'text-slate-300'}`} />
                )}
                <span className={`text-xs mt-2 ${isCurrent ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}>
                  {label}
                </span>
              </div>
              {index < stepLabels.length - 1 && (
                <div className={`h-0.5 w-16 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}