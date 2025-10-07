# How to Get Google Places API Key and Place ID

## Step 1: Get Google Places API Key

### 1.1 Create Google Cloud Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. If you don't have an account, create one at [accounts.google.com](https://accounts.google.com)

### 1.2 Create or Select a Project
1. In Google Cloud Console, click the project dropdown at the top
2. Click "New Project" or select an existing project
3. If creating new:
   - Project name: "InkDapper Reviews" (or any name you prefer)
   - Click "Create"

### 1.3 Enable Google Places API
1. In the left sidebar, go to "APIs & Services" > "Library"
2. Search for "Google Places API"
3. Click on "Google Places API"
4. Click "Enable"

### 1.4 Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key (it looks like: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 1.5 (Optional) Restrict API Key for Security
1. Click on your API key to edit it
2. Under "API restrictions", select "Restrict key"
3. Choose "Google Places API" from the list
4. Click "Save"

## Step 2: Get Your Business Place ID

### Method 1: Using Google My Business (Recommended)
1. Go to [Google My Business](https://business.google.com/)
2. Sign in with your Google account
3. Find your business listing
4. Click on your business name
5. Look for the URL - it will contain your Place ID
6. Example URL: `https://www.google.com/maps/place/Your+Business+Name/@lat,lng,zoom/data=!3m1!4b1!4m5!3m4!1s0x1234567890abcdef:0x1234567890abcdef!8m2!3d40.7128!4d-74.0060`

### Method 2: Using Place ID Finder Tool
1. Go to [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your business name and address
3. Click on your business from the results
4. Copy the Place ID from the result

### Method 3: Using Google Maps
1. Go to [Google Maps](https://maps.google.com/)
2. Search for your business
3. Click on your business listing
4. Look at the URL - it will contain your Place ID
5. Example: `https://www.google.com/maps/place/Your+Business/@40.7128,-74.0060,17z/data=!3m1!4b1!4m5!3m4!1s0x1234567890abcdef:0x1234567890abcdef!8m2!3d40.7128!4d-74.0060`

### Method 4: If You Don't Have a Google My Business Listing
1. Go to [Google My Business](https://business.google.com/)
2. Click "Manage now"
3. Enter your business information
4. Verify your business (this may take a few days)
5. Once verified, follow Method 1 above

## Step 3: Add to Your Environment Variables

### 3.1 Backend .env File
Add these lines to your `backend/.env` file:

```env
# Google Places API Configuration
GOOGLE_PLACES_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_PLACE_ID=ChIJN1t_tDeuEmsRUsoyG83frY4
```

**Replace with your actual values:**
- `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` → Your actual API key
- `ChIJN1t_tDeuEmsRUsoyG83frY4` → Your actual Place ID

### 3.2 Example with Real Values
```env
GOOGLE_PLACES_API_KEY=AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz
GOOGLE_PLACE_ID=ChIJN1t_tDeuEmsRUsoyG83frY4
```

## Step 4: Test Your Setup

### 4.1 Test API Key
You can test your API key by making a request to Google Places API:

```bash
curl "https://maps.googleapis.com/maps/api/place/details/json?place_id=YOUR_PLACE_ID&fields=reviews&key=YOUR_API_KEY"
```

### 4.2 Test in Your Application
1. Start your backend server
2. Make a POST request to `/api/google-reviews/sync`
3. Check if reviews are fetched and stored

## Step 5: Common Issues and Solutions

### Issue 1: "REQUEST_DENIED" Error
**Solution:**
- Check if your API key is correct
- Ensure Google Places API is enabled
- Verify your API key has proper permissions

### Issue 2: "INVALID_REQUEST" Error
**Solution:**
- Check if your Place ID is correct
- Ensure your business has reviews on Google
- Verify your business listing is active

### Issue 3: "ZERO_RESULTS" Error
**Solution:**
- Your business might not have reviews yet
- Check if your Place ID is correct
- Ensure your business is verified on Google My Business

### Issue 4: No Reviews Found
**Possible Causes:**
- Your business doesn't have any Google reviews yet
- Your Place ID is incorrect
- Your business listing is not verified

## Step 6: Cost Information

### Google Places API Pricing
- **Free Tier**: 1,000 requests per day
- **Paid Tier**: $0.017 per request after free tier
- **Reviews**: Included in the basic request

### Cost Optimization Tips
1. **Cache Reviews**: Store reviews in your database to avoid repeated API calls
2. **Sync Periodically**: Don't sync too frequently (once per day is usually enough)
3. **Monitor Usage**: Check your API usage in Google Cloud Console

## Step 7: Security Best Practices

### 1. API Key Security
- Never expose your API key in frontend code
- Use environment variables
- Restrict your API key to specific APIs
- Consider using IP restrictions for production

### 2. Rate Limiting
- Implement rate limiting for the sync endpoint
- Don't make too many requests at once
- Use exponential backoff for retries

### 3. Error Handling
- Always handle API errors gracefully
- Log errors for debugging
- Provide user-friendly error messages

## Step 8: Verification Checklist

Before going live, verify:

- [ ] Google Places API is enabled
- [ ] API key is working (test with curl or Postman)
- [ ] Place ID is correct
- [ ] Your business has Google reviews
- [ ] Environment variables are set correctly
- [ ] Backend server can fetch reviews
- [ ] Frontend displays reviews correctly

## Step 9: Getting Help

If you encounter issues:

1. **Check Google Cloud Console**: Look for error messages in the API section
2. **Check Backend Logs**: Look for error messages in your server logs
3. **Test API Directly**: Use curl or Postman to test the API directly
4. **Google Documentation**: Check [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)

## Example API Response

When everything is set up correctly, you should see a response like this:

```json
{
  "status": "OK",
  "result": {
    "reviews": [
      {
        "author_name": "John Doe",
        "author_url": "https://www.google.com/maps/contrib/123456789",
        "profile_photo_url": "https://lh3.googleusercontent.com/...",
        "rating": 5,
        "relative_time_description": "2 months ago",
        "text": "Great service and quality products!",
        "time": 1640995200
      }
    ]
  }
}
```

This means your setup is working correctly and you can start using Google Reviews in your application!
