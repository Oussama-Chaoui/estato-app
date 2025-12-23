# Website Focus Feature

This module implements a dynamic website focus system that allows admins to control how the website appears to visitors based on the business model.

## Features

- **4 Website Focus Types**: Daily Rent, Rent, Selling, All
- **Dynamic Content**: Landing page content changes based on focus
- **Admin Control**: Easy-to-use admin interface to change focus
- **Type Safety**: Full TypeScript support with enums
- **Context Provider**: Global state management for website focus

## Usage

### In Components

```tsx
import { useSettingsContext } from "@/common/contexts/SettingsContext";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";

const MyComponent = () => {
  const { websiteFocus, isLoading } = useSettingsContext();
  
  if (isLoading) return <div>Loading...</div>;
  
  switch (websiteFocus) {
    case WEBSITE_FOCUS.DAILY_RENT:
      return <div>Vacation rentals content</div>;
    case WEBSITE_FOCUS.RENT:
      return <div>Rental properties content</div>;
    // ... etc
  }
};
```

### Using Content Utility

```tsx
import { getWebsiteFocusContent } from "@/modules/settings/utils/websiteFocusContent";

const content = getWebsiteFocusContent(websiteFocus);
// content.tagline, content.title, content.ctaText, etc.
```

### Admin Interface

Visit `/dashboard/settings` to change the website focus.

## API Endpoints

- `GET /api/settings/website-focus` - Get current website focus (public)
- `GET /api/settings` - Get all settings (admin)
- `POST /api/settings` - Create setting (admin)
- `PUT /api/settings/{id}` - Update setting (admin)

## Database

The setting is stored in the `settings` table with:
- `key`: "website_focus"
- `value`: One of "DAILY_RENT", "RENT", "SELLING", "ALL"

## Default Value

The system defaults to `ALL` if no setting is found. 