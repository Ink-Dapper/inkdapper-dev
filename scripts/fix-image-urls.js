/**
 * fix-image-urls.js
 * -----------------
 * One-time migration: replaces "http://localhost:9000" (or 127.0.0.1:9000)
 * in product image URLs stored in MongoDB with the real public MinIO URL.
 *
 * Run ONCE on the VPS after setting MINIO_PUBLIC_URL in backend/.env:
 *
 *   cd /var/www/inkdapper-dev/backend
 *   node ../scripts/fix-image-urls.js
 *
 * Safe to re-run — it only updates documents that still have localhost URLs.
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const OLD_PREFIXES = [
  'http://localhost:9000',
  'http://127.0.0.1:9000',
];

const BUCKET = process.env.MINIO_BUCKET_NAME || 'inkdapper';
const PUBLIC_URL = process.env.MINIO_PUBLIC_URL?.replace(/\/$/, '');

if (!PUBLIC_URL) {
  console.error('ERROR: MINIO_PUBLIC_URL is not set in .env. Set it first, then re-run.');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in .env.');
  process.exit(1);
}

// Minimal schemas — only the fields we need
const productSchema = new mongoose.Schema({ image: Array, reviewImage: Array }, { strict: false });
const bannerSchema  = new mongoose.Schema({ imageBanner: Array },               { strict: false });

const Product = mongoose.model('product', productSchema);
const Banner  = mongoose.model('addbanner', bannerSchema);

function fixUrl(url) {
  if (typeof url !== 'string') return url;
  for (const prefix of OLD_PREFIXES) {
    if (url.startsWith(prefix)) {
      // e.g. http://localhost:9000/inkdapper/products/... → https://storage.inkdapper.com/inkdapper/products/...
      return PUBLIC_URL + url.slice(prefix.length);
    }
  }
  return url;
}

function fixArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(fixUrl);
}

async function run() {
  console.log(`Connecting to MongoDB…`);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  // ── Products ──────────────────────────────────────────────────────────────
  const products = await Product.find({});
  let productUpdates = 0;

  for (const p of products) {
    const newImage       = fixArray(p.image);
    const newReviewImage = fixArray(p.reviewImage);

    const changed =
      JSON.stringify(newImage)       !== JSON.stringify(p.image) ||
      JSON.stringify(newReviewImage) !== JSON.stringify(p.reviewImage);

    if (changed) {
      await Product.updateOne({ _id: p._id }, { image: newImage, reviewImage: newReviewImage });
      productUpdates++;
      console.log(`  Fixed product: ${p.name || p._id}`);
    }
  }

  console.log(`\nProducts updated: ${productUpdates} / ${products.length}`);

  // ── Banners ───────────────────────────────────────────────────────────────
  const banners = await Banner.find({});
  let bannerUpdates = 0;

  for (const b of banners) {
    const newBanner = fixArray(b.imageBanner);
    if (JSON.stringify(newBanner) !== JSON.stringify(b.imageBanner)) {
      await Banner.updateOne({ _id: b._id }, { imageBanner: newBanner });
      bannerUpdates++;
      console.log(`  Fixed banner: ${b._id}`);
    }
  }

  console.log(`Banners updated : ${bannerUpdates} / ${banners.length}`);

  await mongoose.disconnect();
  console.log('\nDone. All localhost image URLs have been replaced with the public URL.');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
