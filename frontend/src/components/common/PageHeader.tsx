import React from 'react';
import Breadcrumbs from './Breadcrumbs';

interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: ActionButton[];
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  badge,
  actions = [],
  children,
}: PageHeaderProps) {
  return (
    <div className="space-y-3 mb-6">
      <Breadcrumbs />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-white to-dark-300 bg-clip-text text-transparent">
              {title}
            </h1>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyber-500/15 text-cyber-400 border border-cyber-500/30">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-dark-400 mt-1 max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {actions.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            {actions.map((act, idx) => {
              const Icon = act.icon;
              const variantClass =
                act.variant === 'primary'
                  ? 'btn-primary'
                  : act.variant === 'danger'
                  ? 'px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-all'
                  : act.variant === 'ghost'
                  ? 'btn-ghost'
                  : 'btn-secondary text-sm py-2.5 px-4';

              return (
                <button
                  key={idx}
                  onClick={act.onClick}
                  className={`flex items-center gap-2 ${variantClass}`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{act.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}
