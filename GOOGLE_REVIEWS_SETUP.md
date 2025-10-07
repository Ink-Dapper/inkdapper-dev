# Google Reviews Integration Setup Guide

This guide will help you set up Google Reviews integration for your InkDapper application.

## Prerequisites

1. **Google Cloud Console Account**: You need a Google Cloud Console account
2. **Google Places API**: Enable the Google Places API in your Google Cloud project
3. **Business Place ID**: Your business must have a Google My Business listing

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Places API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Places API"
   - Click on it and press "Enable"

## Step 2: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to only Google Places API for security

## Step 3: Get Your Business Place ID

1. Go to [Google My Business](https://business.google.com/)
2. Find your business listing
3. Use the [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) to get your Place ID
4. Or use this URL format: `https://www.google.com/maps/place/?q=place_id:YOUR_PLACE_ID`

## Step 4: Environment Variables

Add these environment variables to your `.env` file in the backend directory:

```env
# Google Places API Configuration
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
GOOGLE_PLACE_ID=your_business_place_id_here
```

## Step 5: API Endpoints

The following endpoints are now available:

### Sync Google Reviews
```
POST /api/google-reviews/sync
```
This endpoint fetches the latest reviews from Google Places API and stores them in your database.

### Get Google Reviews
```
GET /api/google-reviews/get?limit=50&offset=0&minRating=1&maxRating=5
```

### Get Combined Reviews (Google + Internal)
```
GET /api/google-reviews/combined?productId=optional_product_id
```

### Get Google Reviews Statistics
```
GET /api/google-reviews/stats
```

## Step 6: Frontend Integration

The following components are now available:

### CombinedReviewsSection
Displays both internal and Google reviews with filtering options:
```jsx
import CombinedReviewsSection from './components/CombinedReviewsSection';

<CombinedReviewsSection 
  productId="optional_product_id" 
  showSyncButton={true} 
/>
```

### GoogleReviewsSection
Displays only Google reviews:
```jsx
import GoogleReviewsSection from './components/GoogleReviewsSection';

<GoogleReviewsSection 
  productId="optional_product_id" 
  showSyncButton={true} 
/>
```

## Step 7: Automatic Sync (Optional)

To automatically sync Google reviews, you can set up a cron job or use a service like:

1. **Vercel Cron Jobs** (if deployed on Vercel)
2. **GitHub Actions** (for scheduled sync)
3. **Node-cron** (for server-side scheduling)

Example with node-cron:
```javascript
import cron from 'node-cron';
import axios from 'axios';

// Sync every 6 hours
cron.schedule('0 */6 * * *', async () => {
  try {
    await axios.post('http://localhost:4000/api/google-reviews/sync');
    console.log('Google reviews synced successfully');
  } catch (error) {
    console.error('Error syncing Google reviews:', error);
  }
});
```

## Step 8: Testing

1. Start your backend server
2. Make a POST request to `/api/google-reviews/sync` to fetch Google reviews
3. Check the database to see if reviews are stored
4. Test the frontend components

## Troubleshooting

### Common Issues:

1. **"Google Places API error: REQUEST_DENIED"**
   - Check if your API key is correct
   - Ensure the Google Places API is enabled
   - Check if your API key has proper permissions

2. **"No Google reviews found"**
   - Verify your Place ID is correct
   - Check if your business has reviews on Google
   - Ensure your business listing is verified

3. **CORS Issues**
   - Make sure your frontend URL is added to the CORS configuration in `server.js`

### Rate Limits:

- Google Places API has rate limits
- Free tier: 1,000 requests per day
- Paid tier: Higher limits available

## Security Notes

1. **API Key Security**: Never expose your API key in frontend code
2. **Rate Limiting**: Implement rate limiting for the sync endpoint
3. **Authentication**: Consider adding authentication to the sync endpoint in production

## Features Included

✅ **Google Reviews Integration**: Fetch reviews from Google Places API
✅ **Combined Display**: Show both internal and Google reviews together
✅ **Filtering**: Filter by review source (All, Internal, Google)
✅ **Sync Functionality**: Manual and automatic sync options
✅ **Statistics**: Get review statistics and ratings
✅ **Responsive Design**: Mobile-friendly review display
✅ **Real-time Updates**: Refresh reviews without page reload

## Support

If you encounter any issues, check:
1. Google Cloud Console for API usage and errors
2. Backend logs for error messages
3. Network tab in browser for API call failures
