const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Directory containing the videos to optimize
const directory = './videos';

// Function to optimize a single video
function optimizeVideo(filePath) {
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const outputDir = path.join(fileDir, 'optimized');
  const outputFile = path.join(outputDir, fileName);

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // ffmpeg command to optimize the video
  const ffmpegCommand = `ffmpeg -i "${filePath}" -codec:v libx264 -crf 23 -preset medium -codec:a copy "${outputFile}"`;

  exec(ffmpegCommand, (error) => {
    if (error) {
      console.error(`Error optimizing video: ${filePath}`, error);
    } else {
      console.log(`Optimized video: ${outputFile}`);
    }
  });
}

// Function to optimize all videos in the directory
function optimizeVideosInDirectory(directory) {
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
        // If it's a directory, recursively optimize videos inside it
        optimizeVideosInDirectory(filePath);
      } else {
        // If it's a file, optimize the video
        optimizeVideo(filePath);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

// Start optimizing videos in the specified directory
optimizeVideosInDirectory(directory);
