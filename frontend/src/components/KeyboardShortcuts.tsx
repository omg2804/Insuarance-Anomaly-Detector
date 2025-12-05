import { Card } from './ui/card';
import { Keyboard, Command } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'R', description: 'Run pipeline', modifier: 'Ctrl' },
    { key: 'E', description: 'Export data', modifier: 'Ctrl' },
    { key: 'F', description: 'Search claims', modifier: 'Ctrl' },
    { key: 'T', description: 'Switch tabs', modifier: 'Ctrl' },
    { key: '/', description: 'Focus search', modifier: '' },
    { key: 'ESC', description: 'Close inspector', modifier: '' },
  ];

  return (
    <>
      {/* Floating shortcut button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 group"
      >
        <Keyboard className="size-5" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs size-5 rounded-full flex items-center justify-center animate-pulse">
          ?
        </span>
      </button>

      {/* Shortcuts panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={() => setIsOpen(false)}>
          <Card className="p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Command className="size-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Keyboard Shortcuts</h3>
                  <p className="text-xs text-slate-500">Quick navigation and actions</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm text-slate-700">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.modifier && (
                      <>
                        <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-700 shadow-sm">
                          {shortcut.modifier}
                        </kbd>
                        <span className="text-slate-400">+</span>
                      </>
                    )}
                    <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-700 shadow-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                💡 Press <kbd className="px-1 py-0.5 bg-white border border-blue-300 rounded text-xs">?</kbd> anytime to view shortcuts
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
