import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface GameShellProps {
  title: string;
  icon?: string;
  IconComponent?: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  onBackToHome: () => void;
  actions?: ReactNode;
  glassHeader?: boolean;
}

export default function GameShell({
  title,
  icon,
  IconComponent,
  children,
  onBackToHome,
  actions,
  glassHeader = false,
}: GameShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className={`border-b sticky top-0 z-50 ${
        glassHeader 
          ? 'border-white/20 backdrop-blur-md bg-white/10' 
          : 'border-border/50 backdrop-blur-sm bg-background/95'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBackToHome}
                className={`rounded-full ${glassHeader ? 'text-white hover:bg-white/20' : ''}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              {icon && (
                <img src={icon} alt={title} className="w-8 h-8 rounded-lg" />
              )}
              {IconComponent && <IconComponent className={`w-8 h-8 ${glassHeader ? 'text-white' : 'text-primary'}`} />}
              <h1 className={`text-xl font-bold ${glassHeader ? 'text-white' : ''}`}>{title}</h1>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
