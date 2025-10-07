# Quick Setup Checklist for Google Reviews

## 🚀 Quick Start (5 minutes)

### Step 1: Get Google Places API Key
1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Go to "APIs & Services" → "Library"
4. Search "Google Places API" → Click "Enable"
5. Go to "APIs & Services" → "Credentials"
6. Click "Create Credentials" → "API Key"
7. Copy the API key (starts with `AIzaSy...`)

### Step 2: Get Your Business Place ID
**Option A: If you have Google My Business listing**
1. Go to [business.google.com](https://business.google.com/)
2. Find your business
3. Look at the URL - it contains your Place ID
4. Example: `https://www.google.com/maps/place/Your+Business/@40.7128,-74.0060,17z/data=!3m1!4b1!4m5!3m4!1s0x1234567890abcdef:0x1234567890abcdef!8m2!3d40.7128!4d-74.0060`
5. The Place ID is the part after `!1s` (e.g., `0x1234567890abcdef`)

**Option B: Use Place ID Finder**
1. Go to [developers.google.com/maps/documentation/places/web-service/place-id](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your business
3. Copy the Place ID

### Step 3: Add to Your .env File
Add these lines to your `backend/.env` file:

```env
GOOGLE_PLACES_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_PLACE_ID=ChIJN1t_tDeuEmsRUsoyG83frY4
```

**Replace with your actual values!**

### Step 4: Test It Works
1. Start your backend server
2. Go to your admin panel
3. Click "Sync Google Reviews"
4. Check if reviews appear

## 🔧 Troubleshooting

### "No reviews found"
- Check if your business has Google reviews
- Verify your Place ID is correct
- Make sure your business is verified on Google My Business

### "API key error"
- Check if Google Places API is enabled
- Verify your API key is correct
- Make sure you have billing enabled (even for free tier)

### "CORS error"
- Check your server.js CORS configuration
- Make sure your frontend URL is allowed

## 📞 Need Help?

1. **Check the detailed guide**: `GOOGLE_API_SETUP_GUIDE.md`
2. **Test your API key**: Use the curl command in the detailed guide
3. **Check Google Cloud Console**: Look for error messages
4. **Check your backend logs**: Look for error messages in your server

## ✅ Success Indicators

You'll know it's working when:
- [ ] API key is created and copied
- [ ] Place ID is found and copied
- [ ] Environment variables are set
- [ ] Backend server starts without errors
- [ ] "Sync Google Reviews" button works
- [ ] Reviews appear in your application

## 🎯 What You'll Get

Once set up, you'll have:
- ✅ Google reviews displayed alongside your internal reviews
- ✅ Automatic sync of new Google reviews
- ✅ Beautiful review display with ratings
- ✅ Filter by review source (All, Internal, Google)
- ✅ Admin panel to manage reviews
- ✅ Review statistics and analytics

## 🚨 Important Notes

1. **Free Tier**: 1,000 requests per day (usually enough for small businesses)
2. **Paid Tier**: $0.017 per request after free tier
3. **Security**: Never expose your API key in frontend code
4. **Rate Limits**: Don't sync too frequently (once per day is usually enough)

## 📋 Final Checklist

Before going live:
- [ ] Google Places API enabled
- [ ] API key working
- [ ] Place ID correct
- [ ] Business has Google reviews
- [ ] Environment variables set
- [ ] Backend can fetch reviews
- [ ] Frontend displays reviews
- [ ] Admin panel works
- [ ] Sync functionality works

That's it! You should now have Google Reviews integrated into your InkDapper application! 🎉
