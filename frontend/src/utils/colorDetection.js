// Color detection utilities for image analysis

// Predefined color palettes for T-shirt colors
const colorPalettes = {
  red: ['#dc2626', '#ef4444', '#f87171', '#fca5a5'],
  green: ['#16a34a', '#22c55e', '#4ade80', '#86efac'],
  blue: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
  'navy-blue': ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa'],
  brown: ['#b45309', '#d97706', '#f59e0b', '#fbbf24'],
  coffee: ['#92400e', '#b45309', '#d97706', '#f59e0b'],
  beige: ['#d97706', '#eab308', '#f59e0b', '#fbbf24'],
  lavender: ['#8b5cf6', '#a855f7', '#a78bfa', '#c4b5fd'],
  redwood: ['#b91c1c', '#dc2626', '#f87171', '#fca5a5'],
  teal: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'],
  black: ['#1f2937', '#374151', '#4b5563', '#6b7280'],
  white: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db']
};

// Function to get the closest color match from a hex value
export const getClosestColor = (hexColor) => {
  if (!hexColor) return 'teal';
  
  // Convert hex to RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  let minDistance = Infinity;
  let closestColor = 'teal';
  
  // Compare with each color palette
  Object.entries(colorPalettes).forEach(([colorName, palette]) => {
    palette.forEach(paletteColor => {
      const paletteHex = paletteColor.replace('#', '');
      const pr = parseInt(paletteHex.substr(0, 2), 16);
      const pg = parseInt(paletteHex.substr(2, 2), 16);
      const pb = parseInt(paletteHex.substr(4, 2), 16);
      
      // Calculate Euclidean distance
      const distance = Math.sqrt(
        Math.pow(r - pr, 2) + 
        Math.pow(g - pg, 2) + 
        Math.pow(b - pb, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = colorName;
      }
    });
  });
  
  return closestColor;
};

// Function to detect dominant color from image using canvas
export const detectDominantColor = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size (smaller for performance)
      canvas.width = 50;
      canvas.height = 50;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      try {
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Calculate average color
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        
        const avgR = Math.round(r / count);
        const avgG = Math.round(g / count);
        const avgB = Math.round(b / count);
        
        // Convert to hex
        const hexColor = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
        
        // Get closest color match
        const detectedColor = getClosestColor(hexColor);
        resolve(detectedColor);
             } catch (error) {
         resolve('teal'); // fallback
       }
    };
    
    img.onerror = () => {
      resolve('teal'); // fallback
    };
    
    img.src = imageUrl;
  });
};

// Function to get color based on image index (fallback)
export const getColorByIndex = (index) => {
  const colorScheme = [
    'red', 'green', 'blue', 'navy-blue', 'brown', 'coffee', 
    'beige', 'lavender', 'redwood', 'teal', 'black', 'white'
  ];
  
  return colorScheme[index % colorScheme.length];
};
