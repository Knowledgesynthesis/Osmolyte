import { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Toggle = ({
  label,
  checked,
  onCheckedChange,
  className,
  ...props
}: ToggleProps) => {
  return (
    <label className={clsx('flex items-center space-x-3 cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="sr-only peer"
          {...props}
        />
        <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 transition-colors"></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  );
};
