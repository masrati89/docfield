# EAS (Expo Application Services) Setup Guide

This document explains how to configure EAS for building and submitting inField to the Apple App Store and Google Play Store.

## Prerequisites

1. **Expo Account** — Sign up at https://expo.dev
2. **EAS CLI** — Install with: `npm install -g eas-cli`
3. **Xcode** (for iOS) — macOS only
4. **Android SDK** (for Android) — For local builds

## Configuration

### 1. Initialize EAS (if needed)

```bash
eas build:configure
```

The `eas.json` file in the root directory already contains the basic configuration for development, preview, and production builds.

---

## iOS Submission Setup

### Step 1: Get Apple Developer Account Details

You need:

- **Apple Team ID** (from Apple Developer account)
- **iTunes Connect Team ID** (numeric ID from App Store Connect)
- **App Store Connect App ID** (created in App Store Connect)
- **Apple ID email** (the email managing the app)

### Step 2: Update eas.json

Replace placeholders in `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "1234567890",
        "appleId": "your.email@example.com",
        "appleTeamId": "ABCDEF12GH",
        "itcTeamId": "123456789"
      }
    }
  }
}
```

### Step 3: Build for Production

```bash
eas build --platform ios --auto-submit
```

Or without auto-submit:

```bash
eas build --platform ios
```

Then manually submit:

```bash
eas submit --platform ios
```

---

## Android Submission Setup

### Step 1: Create Google Play Service Account

1. Go to https://play.google.com/console
2. Navigate to **Settings** → **API access**
3. Create a new service account:
   - Click **Create Service Account**
   - Download the JSON key file
   - Save it as `service-account.json` (keep secure, don't commit to git)

### Step 2: Update eas.json

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccount": "path/to/service-account.json",
        "track": "internal"
      }
    }
  }
}
```

**Tracks explained:**

- `internal` — Internal testing (for team members)
- `alpha` — Alpha testing (limited users)
- `beta` — Beta testing (wider audience)
- `production` — Public release

For initial submission, use `internal` or `alpha` for testing.

### Step 3: Build for Production

```bash
eas build --platform android --auto-submit
```

Or without auto-submit:

```bash
eas build --platform android
```

Then manually submit:

```bash
eas submit --platform android
```

---

## Building Both Platforms

```bash
# Build both iOS and Android (for production)
eas build --platform all

# With auto-submit to stores
eas build --platform all --auto-submit
```

---

## Build Profiles

### Development (Local Device)

```bash
eas build --profile development
```

Creates a development client for testing on your phone.

### Preview (Internal Testing)

```bash
eas build --profile preview
```

Creates an APK (Android) or IPA (iOS) for internal testing. Can be shared via TestFlight or Google Play internal testing.

### Production (Store Release)

```bash
eas build --profile production
```

Optimized build for release to app stores.

---

## Common Issues

### "Could not determine iOS version"

Ensure `version` is set correctly in `app.json` (currently: `1.0.0`)

### "Bundle identifier mismatch"

Ensure `bundleIdentifier` in `app.json` matches what's configured in Apple App Store Connect and Google Play Console.

### "Missing Android signing key"

EAS automatically manages signing keys. If you see an error:

```bash
eas build --platform android --clear-credentials
```

Then rebuild. This will generate new signing credentials.

### "AppStore Connect API key error"

Make sure your Apple Team ID and iTunes Connect Team ID are correct (they're different values).

---

## Security

⚠️ **Important Security Notes:**

1. **service-account.json** — Never commit this to git. Add to `.gitignore` (already done).
2. **Credentials** — Keep all credentials in environment variables or `.env.local` (never in code).
3. **app.json** — ios.teamId is public, but keep actual credentials secure.

---

## Credentials Checklist

Before submission:

- [ ] **app.json** — version, ios.teamId, bundleIdentifier, package name are correct
- [ ] **iOS**: Apple Team ID, iTunes Connect Team ID, App Store Connect App ID
- [ ] **Android**: service-account.json downloaded and path updated in eas.json
- [ ] **app.json** — apps.json ios.buildNumber and android.versionCode are incremented from previous release
- [ ] **eas.json** — All [CHANGE_ME] placeholders are filled in

---

## Release Workflow

1. **Bump version** in `package.json` and `app.json`
2. **Increment build numbers**:
   - iOS: `buildNumber` (e.g., "1" → "2")
   - Android: `versionCode` (e.g., 1 → 2)
3. **Commit** with message: `chore: version bump x.x.x`
4. **Build**:
   ```bash
   eas build --platform all
   ```
5. **Test** on devices (TestFlight for iOS, Google Play internal for Android)
6. **Submit to production**:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```
7. **Monitor** App Store Connect and Google Play Console for approval

---

## Links

- **EAS Documentation**: https://docs.expo.dev/eas
- **EAS Submit**: https://docs.expo.dev/eas/submit
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console
