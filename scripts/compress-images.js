const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public/new menu');
const OUTPUT_DIR = path.join(__dirname, '../public/new menu');

// Compression settings
const QUALITY = 80; // 0-100, 80 is good balance
const MAX_WIDTH = 1200; // Max width in pixels
const MAX_HEIGHT = 1200; // Max height in pixels

async function getAllImages(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const images = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      const subImages = await getAllImages(fullPath);
      images.push(...subImages);
    } else if (/\.(png|jpg|jpeg)$/i.test(file.name)) {
      images.push(fullPath);
    }
  }

  return images;
}

async function compressImage(inputPath, outputPath) {
  try {
    const stats = await fs.stat(inputPath);
    const originalSize = stats.size;

    // Read image metadata
    const metadata = await sharp(inputPath).metadata();
    
    // Compress and resize
    await sharp(inputPath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(outputPath);

    const newStats = await fs.stat(outputPath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);

    console.log(`✓ ${path.basename(inputPath)}: ${(originalSize / 1024).toFixed(2)}KB → ${(newSize / 1024).toFixed(2)}KB (${savings}% reduction)`);
    
    return { originalSize, newSize, savings };
  } catch (error) {
    console.error(`✗ Error compressing ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🔍 Scanning for images...\n');
  
  const images = await getAllImages(INPUT_DIR);
  console.log(`Found ${images.length} images\n`);
  
  if (images.length === 0) {
    console.log('No images found to compress');
    return;
  }

  console.log('🗜️  Compressing images...\n');

  let totalOriginalSize = 0;
  let totalNewSize = 0;

  for (const imagePath of images) {
    // Change extension to .jpg
    const outputPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.jpg');
    
    // If original was PNG, delete it after conversion
    const wasPng = /\.png$/i.test(imagePath);
    
    const result = await compressImage(imagePath, outputPath);
    
    if (result) {
      totalOriginalSize += result.originalSize;
      totalNewSize += result.newSize;
      
      // Delete original PNG file after successful conversion
      if (wasPng && imagePath !== outputPath) {
        await fs.unlink(imagePath);
      }
    }
  }

  const totalSavings = ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(2);
  
  console.log('\n📊 Summary:');
  console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total new size: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${totalSavings}%`);
  console.log(`Space saved: ${((totalOriginalSize - totalNewSize) / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
