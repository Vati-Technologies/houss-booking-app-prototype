# EstateLife Tenant App

EstateLife is a premium, AI-powered lifestyle and estate management application designed specifically for tenants. Built with React Native and Expo, EstateLife offers a polished, intuitive, and high-end concierge experience right from your mobile device. 

The app simplifies daily estate living by allowing tenants to seamlessly book and manage shared amenities, report and track maintenance issues, utilize a dynamic access QR code for securely entering the premises, and access a comprehensive safety command center in times of need. 

## Key Features

- **Intelligent Booking System:** Book shared amenities effortlessly. The embedded AI layer gracefully assists with scheduling, detects potential conflicts natively, and provides smart, personalized recommendations without feeling intrusive.
- **My Bookings Dashboard:** An interactive, premium native timeline for managing all past and upcoming amenity reservations with visually clear status indicators and drill-down detail views.
- **Safety Command Center:** A structured, calm, and authoritative security section for immediate emergency unit dispatch, incident reporting, and active alert tracking.
- **Amenity Maintenance Tracker:** Shift from simple unit plumbing reports to comprehensive shared-amenity issue logging. Features include a maintenance lifecycle tracker, issue filtering, and an amenity health indicator.
- **Seamless Access Integration:** A sophisticated QR code display tailored for quick scans at entry points and access gates.
- **Feedback & Ratings:** Complete the booking lifecycle by providing star ratings and structured feedback for amenities used.

## Tech Stack

- **Framework:** [React Native](https://reactnative.dev)
- **Toolchain:** [Expo](https://expo.dev) 
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A package manager: npm, yarn, pnpm, or bun.
- The **Expo Go** app installed on your physical mobile device (available on the App Store and Google Play), or ideally an iOS Simulator (macOS only) / Android Emulator set up on your machine.

## Setup & Installation

1. **Clone the repository** (if you haven't already) and navigate into the project directory:
   ```bash
   cd "booking app new"
   ```

2. **Install dependencies:**
   Using npm:
   ```bash
   npm install
   ```
   *Alternatively, using yarn: `yarn install` or pnpm: `pnpm install`*

## Running the App

Once dependencies are installed, you can start the Expo development server:

```bash
npx expo start
```
*Or using the npm script: `npm start`*

This will start the Metro bundler and display a terminal QR code. 

**To open the app:**
- **On a physical device:** Open the **Expo Go** app and scan the QR code displayed in your terminal (or camera app if using iOS).
- **On an iOS Simulator:** Press <kbd>i</kbd> in the terminal. (Requires Xcode to be installed).
- **On an Android Emulator:** Press <kbd>a</kbd> in the terminal. (Requires Android Studio and an AVD to be running).
- **On the Web:** Press <kbd>w</kbd> in the terminal to launch the app in your default web browser.

### Available Scripts

- `npm start`: Starts the Expo Metro bundler.
- `npm run android`: Starts the bundler and attempts to open the app on a connected Android device or emulator.
- `npm run ios`: Starts the bundler and attempts to open the app in the iOS Simulator.
- `npm run web`: Starts the bundler and opens the web version of the application.

## Troubleshooting

- **`react-router-dom` missing error / Routing Issues:** Ensure that you are relying on `expo-router` for all navigation and routing functionalities, as file-based routing inherently replaces `react-router-dom` in modern Expo projects. 
- **Watchman Warning:** If you encounter a Watchman warning or "Request timed out" when starting the server, try clearing the bundler cache: `npx expo start --clear`.

---
*EstateLife - Elevating your estate living experience.*
