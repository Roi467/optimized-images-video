const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directory containing the images to optimize
const directory = './images';

// Function to optimize a single image
async function optimizeImage(filePath) {
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const outputDir = path.join(fileDir, 'optimized');
  const outputFile = path.join(outputDir, fileName);

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  try {
    // Read the image using sharp
    const image = sharp(filePath);

    // Reset the EXIF orientation
    image.rotate();

    // Optimize the image by setting desired parameters
    const optimizedImage = image
      .jpeg({ quality: 80 }) // Set your desired JPEG quality here
      .png({ compressionLevel: 8 }) // Set your desired PNG compression level here
      .webp({ quality: 80 }) // Set your desired WebP quality here
      .toFile(outputFile);

    // Await the optimization process to complete
    await optimizedImage;

    console.log(`Optimized image: ${outputFile}`);
  } catch (error) {
    console.error(`Error optimizing image: ${filePath}`, error);
  }
}

// Function to optimize all images in the directory
async function optimizeImagesInDirectory(directory) {
  try {
    const files = fs.readdirSync(directory);

    // Iterate through each file in the directory
    for (const file of files) {
      const filePath = path.join(directory, file);

      // Check if the current file is a directory
      if (fs.statSync(filePath).isDirectory()) {
        if(filePath.includes("optimized")) {
          continue;
        }
        // If it's a directory, recursively optimize images inside it
        await optimizeImagesInDirectory(filePath);
      } else {
        // If it's a file, optimize the image
        await optimizeImage(filePath);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

// Start optimizing images in the specified directory
optimizeImagesInDirectory(directory);
