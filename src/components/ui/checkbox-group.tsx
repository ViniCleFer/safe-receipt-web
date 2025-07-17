'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  options?: CheckboxOption[];
  children?: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
}

interface CheckboxProps {
  value: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxGroup({
  value,
  onChange,
  options,
  children,
  className = '',
  orientation = 'vertical',
  disabled = false,
}: CheckboxGroupProps) {
  const handleCheckboxChange = (checkboxValue: string, checked: boolean) => {
    if (checked) {
      // Add value if checked
      onChange([...value, checkboxValue]);
    } else {
      // Remove value if unchecked
      onChange(value.filter(v => v !== checkboxValue));
    }
  };

  const containerClass = `space-${
    orientation === 'horizontal' ? 'x' : 'y'
  }-3 ${className}`;
  const flexClass =
    orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-3';

  // If children are provided, use them instead of options
  if (children) {
    return (
      <div className={containerClass}>
        <div className={flexClass}>
          {React.Children.map(children, child => {
            if (
              React.isValidElement<CheckboxProps>(child) &&
              child.type === Checkbox
            ) {
              const checkboxValue = child.props.value;
              const isChecked = value.includes(checkboxValue);

              return React.cloneElement(child, {
                checked: isChecked,
                onCheckedChange: (checked: boolean) =>
                  handleCheckboxChange(checkboxValue, checked),
                disabled: disabled || child.props.disabled,
              });
            }
            return child;
          })}
        </div>
      </div>
    );
  }

  // Use options if no children provided
  if (!options) {
    return null;
  }

  return (
    <div className={containerClass}>
      <div className={flexClass}>
        {options.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={option.value}
              checked={value.includes(option.value)}
              onCheckedChange={checked =>
                handleCheckboxChange(option.value, checked as boolean)
              }
              disabled={disabled || option.disabled}
            />
            <Label
              htmlFor={option.value}
              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                disabled || option.disabled ? 'opacity-70' : 'cursor-pointer'
              }`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
