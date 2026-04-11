# Viewport Testing Matrix

## When to Read This File
Load when setting up Playwright viewports for screenshots or audit runs. Do NOT load during diagnosis or fix phases.

## Strategy

### Step 1: Sweep First
Run `npm run audit:sweep` to capture screenshots at every 50px increment from 320-1920px. This reveals the exact breakpoint where layout breaks before narrowing to device validation.

### Step 2: Device Validation
Run `npm run audit:responsive` to validate against 14 real-world viewports representing the actual Colombian audience device distribution.

## Responsive Preset Table (14 Devices)

| Priority | Device | Width | Height | Why |
|----------|--------|-------|--------|-----|
| Critical | galaxy-s24 | 360 | 780 | Dominant mid-range Android in Colombia |
| Critical | galaxy-s24-plus | 384 | 832 | Colombia #4 device by traffic share |
| Critical | iphone-14 | 390 | 664 | Colombia #3 device by traffic share |
| Critical | iphone-14-pro | 393 | 660 | Pixel 7/8 width match; Colombia #2 |
| Critical | iphone-xr | 414 | 896 | Colombia #1 at 7.38% of mobile traffic |
| Critical | iphone-14-pro-max | 430 | 740 | Plus/Pro Max segment |
| High | galaxy-a55 | 480 | 1040 | Mid-range Android, huge in Colombia |
| High | ipad-mini | 768 | 1024 | Entry tablet breakpoint |
| High | ipad-pro-11 | 834 | 1194 | Mid tablet breakpoint |
| High | desktop-chrome | 1280 | 720 | Standard desktop baseline |
| Standard | macbook-air-11 | 1366 | 768 | Colombian laptop baseline |
| Standard | macbook-air-13 | 1440 | 900 | Common Colombian design/office laptop |
| Standard | windows-laptop-fhd | 1920 | 1080 | Full HD Windows laptop |
| Edge | iphone-se | 320 | 568 | Smallest active viewport in the wild |
| Edge | wcag-zoom-200 | 720 | 450 | Simulates 200% browser zoom for WCAG |
| Edge | desktop-zoomed-133 | 1444 | 720 | 1080p at 133% zoom with browser chrome. Catches `max-height` media queries that collapse heroes on zoomed desktops. |

## Width Bands

| Band | Range | Notes |
|------|-------|-------|
| Ultra-narrow | 320-359 | iPhone SE; rare but must not break |
| Small mobile | 360-414 | Core Colombian audience; highest priority |
| Large mobile | 415-480 | Galaxy A55, larger Android phones |
| Small tablet | 481-767 | Landscape phones, small tablets |
| Tablet | 768-1023 | iPad Mini through iPad Pro 11 |
| Small desktop | 1024-1365 | Older laptops, small monitors |
| Desktop | 1366-1920 | Core laptop and monitor range |
| Wide | 1921+ | Large monitors; test at 2560 edge case |
| Short desktop | any width, < 768 height | Zoomed browsers, browser with bookmarks/devtools. Catches `max-height` queries. |

## Commands

| Command | Description |
|---------|-------------|
| `npm run audit:responsive` | Run all 14 viewport presets |
| `npm run audit:sweep` | Capture every 50px from 320-1920px |
| `npm run audit:andrea` | Run the 3 founder devices (iphone-xr, ipad-mini, desktop-chrome) |
| `npm run screenshot -- --viewport=galaxy-s24` | Single viewport screenshot |
| `npm run screenshot -- --label=before-fix` | Named label for baseline capture |
| `npm run screenshot:diff -- --before=baseline --after=post-fix` | Visual diff between two captures |
