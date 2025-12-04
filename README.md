<div align="center">

# 🌌 Astronos

### A Beautiful Cross-Platform Time Tracking Application

[![Expo](https://img.shields.io/badge/Expo-52.0-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61dafb.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-4.1-38bdf8.svg)](https://www.nativewind.dev/)

[Features](#-features) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

**Astronos** is a modern, elegant time tracking application built with React Native and Expo. Track your activities, monitor your productivity, and gain insights into how you spend your time—all with a beautiful, intuitive interface that works seamlessly across iOS, Android, and web platforms.

Whether you're tracking work sessions, study time, workouts, or personal projects, Astronos makes it effortless to start, stop, and analyze your activities with precision timing and comprehensive statistics.

---

## ✨ Features

### 🎯 Core Functionality
- **Activity Management** - Create, edit, and delete custom activities with titles and descriptions
- **Precision Timing** - Track time with millisecond accuracy using an elegant timer interface
- **Smart Statistics** - Automatic calculation of average time per activity across all sessions
- **Event History** - Complete history of all tracked events stored locally with SQLite
- **Double-Tap Actions** - Quick access to activity details with intuitive gesture controls
- **Long-Press Delete** - Hold any activity to quickly remove it from your list

### 🎨 Design & UX
- **Dark & Light Modes** - Seamless theme switching with persistent preferences
- **Native Feel** - Platform-specific optimizations for iOS and Android
- **Smooth Animations** - Powered by Reanimated for buttery-smooth transitions
- **Responsive Layout** - Optimized for phones, tablets, and web browsers
- **Haptic Feedback** - Tactile responses for key interactions (mobile only)
- **Modern UI Components** - Built with shadcn-inspired primitives and NativeWind

### 💾 Data & Storage
- **Local-First Architecture** - All data stored securely on-device with SQLite
- **Export & Import** - Backup and restore your activity data (coming soon)
- **No Account Required** - Complete privacy with no cloud sync or tracking
- **Fast Performance** - Optimized queries and state management with Zustand

---

## 📱 Screenshots

<div align="center">

### Home Screen
![Astronos Home Screen](/pics/example1.jpeg)

### Create Activity
![Astronos Create Activity](/pics/example2.jpeg)

### Active Timer Session
![Astronos Active Timer](/pics/example3.jpeg)

### Activity Statistics
![Astronos Activity Statistics](/pics/example4.jpeg)

</div>

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Expo CLI** (installed automatically)
- **iOS Simulator** (macOS only) or **Android Studio** for mobile development
- **Git** for version control

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/astronos.git
cd astronos

# Install dependencies
npm install

# Start the development server
npm run dev

# Run on specific platforms
npm run ios        # iOS Simulator
npm run android    # Android Emulator
npm run web        # Web Browser
```

### Platform-Specific Setup

#### iOS Development
```bash
# Install CocoaPods dependencies (macOS only)
cd ios && pod install && cd ..

# Run on iOS
npm run ios
```

#### Android Development
```bash
# Ensure Android Studio and SDK are installed
# Set ANDROID_HOME environment variable

# Run on Android
npm run android
```

#### Web Development
```bash
# Run in browser (no additional setup required)
npm run web
```

---

## 💡 Usage

### Creating an Activity
1. Tap the **+** button in the top-right corner
2. Enter an activity title (e.g., "Study Session", "Morning Workout")
3. Optionally add a description
4. Tap **Create** to save

### Starting a Timer
1. **Single tap** an activity from the list
2. Confirm you want to start the activity
3. The timer begins immediately with a visual progress indicator
4. Tap **Stop Activity** when finished (requires confirmation)

### Viewing Activity Details
1. **Double-tap** any activity to view detailed statistics
2. See complete event history with timestamps
3. Analyze patterns and trends over time

### Deleting an Activity
1. **Long-press** (hold) any activity for 1 second
2. Confirm deletion in the dialog
3. All associated events will also be removed

### Switching Themes
1. Navigate to **Settings** (tap "Astronos" header)
2. Toggle between light and dark modes
3. Preference is saved automatically

---

## 🛠 Tech Stack

### Core Framework
- **[React Native](https://reactnative.dev/)** 0.76 - Cross-platform mobile framework
- **[Expo](https://expo.dev/)** 52.0 - Development platform and tooling
- **[TypeScript](https://www.typescriptlang.org/)** 5.3 - Type-safe JavaScript

### UI & Styling
- **[NativeWind](https://www.nativewind.dev/)** 4.1 - Tailwind CSS for React Native
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** 3.16 - Smooth animations
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** 2.20 - Touch interactions
- **[Lucide React Native](https://lucide.dev/)** - Beautiful icon library
- **[@shopify/react-native-skia](https://shopify.github.io/react-native-skia/)** - High-performance graphics

### Navigation & Routing
- **[Expo Router](https://docs.expo.dev/router/introduction/)** 4.0 - File-based routing
- **[React Navigation](https://reactnavigation.org/)** 7.0 - Navigation primitives

### State & Data
- **[Zustand](https://zustand-demo.pmnd.rs/)** 4.4 - Lightweight state management
- **[Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)** 15.1 - Local database
- **[React Native Graph](https://github.com/margelo/react-native-graph)** - Data visualization

### UI Components
- **[@rn-primitives](https://rn-primitives.com/)** - Headless UI components
  - Avatar, Dialog, Portal, Progress, Table, Tooltip
- **[class-variance-authority](https://cva.style/)** - Component variants
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Utility class merging

### Development Tools
- **[Babel](https://babeljs.io/)** - JavaScript compiler
- **[Metro](https://metrobundler.dev/)** - React Native bundler
- **[EAS](https://expo.dev/eas)** - Build and deployment services

---

## 📂 Project Structure

```
astronos/
├── app/                          # Expo Router pages
│   ├── index.tsx                # Activity dashboard (home)
│   ├── settings.tsx             # Settings & preferences
│   ├── timer/                   # Timer screens
│   │   └── [activityId]/[startTime].tsx
│   └── info/                    # Activity details
│       └── [activityId].tsx
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI primitives
│   └── ui-blocks/               # Composed components
├── lib/                         # Utilities & helpers
│   ├── icons/                   # Custom icon components
│   ├── utils.ts                 # Utility functions
│   └── useColorScheme.tsx       # Theme management
├── util/                        # Business logic
│   └── db/                      # SQLite operations
│       ├── activities/          # Activity CRUD
│       └── events/              # Event CRUD
├── types/                       # TypeScript definitions
├── assets/                      # Images & static files
└── global.css                   # Global styles
```

---

## 🎨 Customization

### Changing the Accent Color
Edit `assets/static-states/accent-color.ts`:
```typescript
export const accentColor = (isDark: boolean) => {
  return isDark ? '#your-dark-color' : '#your-light-color';
};
```

### Modifying Theme Colors
Update `tailwind.config.js` to customize the color palette:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      secondary: { /* your colors */ },
      // ... more customization
    }
  }
}
```

### Adding New Activities
Activities are stored in SQLite. The schema includes:
- `id` (UUID)
- `title` (string)
- `description` (string)
- `averageTimeMS` (number)
- `totalEvents` (number)

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with cache clear |
| `npm run dev:web` | Start web development server |
| `npm run dev:android` | Start Android development server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm run clean` | Remove `.expo` and `node_modules` |

---

## 📊 Database Schema

### Activities Table
```sql
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  averageTimeMS INTEGER DEFAULT 0,
  totalEvents INTEGER DEFAULT 0
);
```

### Events Table
```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  activityId TEXT NOT NULL,
  startTime INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  FOREIGN KEY (activityId) REFERENCES activities(id)
);
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[React Native Reusables](https://github.com/mrzachnugent/react-native-reusables)** - UI component inspiration
- **[shadcn/ui](https://ui.shadcn.com/)** - Design system principles
- **[Expo Team](https://expo.dev/)** - Amazing development platform
- **[NativeWind](https://www.nativewind.dev/)** - Tailwind CSS integration

---

## 📞 Support

Having issues? Here are some resources:

- 📚 [Expo Documentation](https://docs.expo.dev/)
- 💬 [React Native Community](https://reactnative.dev/community/overview)
- 🐛 [Report a Bug](https://github.com/yourusername/astronos/issues)
- 💡 [Request a Feature](https://github.com/yourusername/astronos/issues/new)

---

<div align="center">

**Built with ❤️ using React Native & Expo**

⭐ Star this repo if you find it helpful!

</div>
