// Test Gloucester geocoding fix
const fs = require('fs');

// Mock the Google Apps Script Logger
global.Logger = {
  log: console.log
};

// Load and evaluate the Google Apps Script functions
const googleScriptCode = fs.readFileSync('google_script', 'utf-8');
eval(googleScriptCode);

console.log('🎯 TESTING GLOUCESTER GEOCODING FIX');
console.log('==================================');

// Test the specific location that failed
const testLocation = "The Music Works, Gloucester";
console.log(`\n🔍 Testing geocoding for: "${testLocation}"`);

const result = getLocationCoordinates(testLocation);

if (result) {
  console.log(`✅ SUCCESS! Found coordinates for "${testLocation}"`);
  console.log(`   Latitude: ${result.lat}`);
  console.log(`   Longitude: ${result.lng}`);
  
  // Verify it's Gloucester coordinates (approximately)
  const isGloucester = result.lat > 51.8 && result.lat < 51.9 && result.lng > -2.3 && result.lng < -2.2;
  console.log(`✅ Coordinates match Gloucester area: ${isGloucester ? 'YES' : 'NO'}`);
} else {
  console.log(`❌ FAILED! Could not geocode "${testLocation}"`);
}

// Test a few more Gloucestershire locations
const testLocations = [
  "Gloucester",
  "Cheltenham",
  "Stroud",
  "Event in Gloucester",
  "Workshop, Cheltenham",
  "Venue in Gloucestershire"
];

console.log('\n🔍 Testing additional Gloucestershire locations:');
testLocations.forEach(location => {
  const coords = getLocationCoordinates(location);
  if (coords) {
    console.log(`✅ ${location}: lat=${coords.lat}, lng=${coords.lng}`);
  } else {
    console.log(`❌ ${location}: No coordinates found`);
  }
});

console.log('\n🎉 Gloucestershire geocoding test complete!');
