'use client';

import React from 'react';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Permission } from '@/types/user';

interface PermissionCheckboxGroupProps {
  value: Permission[];
  onChange: (value: Permission[]) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function PermissionCheckboxGroup({
  value,
  onChange,
  disabled = false,
  orientation = 'vertical',
  className,
}: PermissionCheckboxGroupProps) {
  const permissionOptions = [
    {
      value: Permission.WEB,
      label: 'Web',
      disabled: false,
    },
    {
      value: Permission.MOBILE,
      label: 'Mobile',
      disabled: false,
    },
  ];

  const handleChange = (newValue: string[]) => {
    onChange(newValue as Permission[]);
  };

  return (
    <CheckboxGroup
      value={value}
      onChange={handleChange}
      options={permissionOptions}
      disabled={disabled}
      orientation={orientation}
      className={className}
    />
  );
}
