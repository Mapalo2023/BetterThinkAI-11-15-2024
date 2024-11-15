import React from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '../../store/themeStore';

export default function PreferenceSettings() {
  const { theme, setTheme } = useThemeStore();
  const [preferences, setPreferences] = React.useState({
    notifications: {
      email: true,
      push: true,
      updates: true,
      newsletter: false
    },
    autoSave: true,
    compactView: false
  });

  const handleNotificationChange = (field: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Preferences updated successfully');
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Theme</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-lg border ${
                theme === 'light'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-accent'
              }`}
            >
              <Sun className={`w-6 h-6 ${
                theme === 'light' ? 'text-primary' : 'text-muted-foreground'
              } mx-auto mb-2`} />
              <span className={`block text-sm font-medium ${
                theme === 'light' ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Light Mode
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-accent'
              }`}
            >
              <Moon className={`w-6 h-6 ${
                theme === 'dark' ? 'text-primary' : 'text-muted-foreground'
              } mx-auto mb-2`} />
              <span className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Dark Mode
              </span>
            </button>
          </div>
        </div>

        {/* Rest of the preferences form remains the same */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { id: 'email', label: 'Email Notifications' },
              { id: 'push', label: 'Push Notifications' },
              { id: 'updates', label: 'Product Updates' },
              { id: 'newsletter', label: 'Newsletter' }
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center justify-between">
                <span>{label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={preferences.notifications[id as keyof typeof preferences.notifications]}
                    onChange={(e) => handleNotificationChange(id, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}