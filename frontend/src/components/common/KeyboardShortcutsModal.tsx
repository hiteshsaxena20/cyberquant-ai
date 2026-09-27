import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Cmd + K', action: 'Open Global Command Palette & Search' },
    { key: 'Cmd + B', action: 'Toggle Sidebar Navigation' },
    { key: 'Esc', action: 'Close Active Drawer / Modal' },
    { key: '?', action: 'Open Keyboard Shortcuts Help' },
    { key: 'Cmd + /', action: 'Toggle AI CFO Virtual Assistant' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card w-full max-w-lg p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-dark-700/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyber-500/10 text-cyber-400 border border-cyber-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-dark-400">Boost productivity with quick key combinations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-dark-800"
            >
              <span className="text-sm text-dark-200">{sc.action}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-700 text-cyber-300 font-mono text-xs font-semibold shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button onClick={onClose} className="btn-secondary w-full text-sm">
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
}
