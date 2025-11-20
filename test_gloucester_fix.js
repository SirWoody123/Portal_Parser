/**
 * Test function to verify Gloucester geocoding fix
 * Tests the specific location that was failing in the execution log
 */
function testGloucesterGeocodingFix() {
  Logger.log('🎯 TESTING GLOUCESTER GEOCODING FIX');
  Logger.log('==================================');
  
  // Test the exact location from the execution log that was failing
  var testLocation = "The Music Works, Gloucester";
  Logger.log('🔍 Testing geocoding for: "' + testLocation + '"');
  
  var result = getLocationCoordinates(testLocation);
  
  if (result) {
    Logger.log('✅ SUCCESS! Found coordinates for "' + testLocation + '"');
    Logger.log('   Latitude: ' + result.lat);
    Logger.log('   Longitude: ' + result.lng);
    
    // Verify it's Gloucester coordinates (approximately)
    var isGloucester = result.lat > 51.8 && result.lat < 51.9 && result.lng > -2.3 && result.lng < -2.2;
    Logger.log('✅ Coordinates match Gloucester area: ' + (isGloucester ? 'YES' : 'NO'));
    
    if (isGloucester) {
      Logger.log('🎉 GLOUCESTER GEOCODING FIX: WORKING CORRECTLY!');
      return true;
    } else {
      Logger.log('❌ GLOUCESTER GEOCODING FIX: Coordinates don\'t match expected area');
      return false;
    }
  } else {
    Logger.log('❌ FAILED! Could not geocode "' + testLocation + '"');
    Logger.log('❌ GLOUCESTER GEOCODING FIX: NOT WORKING');
    return false;
  }
}

/**
 * Test function to verify comprehensive UK locations database
 * Tests a variety of locations from different regions
 */
function testComprehensiveUkLocations() {
  Logger.log('🎯 TESTING COMPREHENSIVE UK LOCATIONS DATABASE');
  Logger.log('==============================================');
  
  // Test locations from different regions and categories
  var testLocations = [
    // Major cities
    'London', 'Manchester', 'Birmingham', 'Glasgow', 'Edinburgh',
    // Gloucestershire (the main fix)
    'Gloucester', 'Cheltenham', 'Stroud',
    // English towns/cities from the user's list
    'Congleton', 'Wolverhampton', 'Altrincham', 'Doncaster', 'York',
    'Ashbourne', 'Belfast', 'Durham', 'Hastings', 'Leicester', 'Norwich',
    'Banbury', 'Brighton', 'Cardiff',
    // Scottish locations
    'Stirling', 'Dumfries', 'Anstruther', 'Milngavie',
    // Welsh locations  
    'Swansea', 'Newport',
    // Northern Ireland
    'Armagh', 'Londonderry',
    // Counties/regions
    'Oxfordshire', 'Suffolk', 'Greater Manchester', 'West Midlands'
  ];
  
  var successCount = 0;
  var totalCount = testLocations.length;
  
  Logger.log('🔍 Testing ' + totalCount + ' locations from comprehensive database:');
  
  for (var i = 0; i < testLocations.length; i++) {
    var location = testLocations[i];
    var coords = getLocationCoordinates(location);
    
    if (coords) {
      Logger.log('✅ ' + location + ': lat=' + coords.lat + ', lng=' + coords.lng);
      successCount++;
    } else {
      Logger.log('❌ ' + location + ': No coordinates found');
    }
  }
  
  var successRate = Math.round((successCount / totalCount) * 100);
  Logger.log('');
  Logger.log('🎉 COMPREHENSIVE DATABASE TEST RESULTS:');
  Logger.log('========================================');
  Logger.log('✅ Successfully geocoded: ' + successCount + '/' + totalCount + ' locations (' + successRate + '%)');
  
  if (successRate >= 95) {
    Logger.log('🚀 UK locations database is comprehensive and ready for production!');
    return true;
  } else {
    Logger.log('⚠️ UK locations database needs more entries for better coverage');
    return false;
  }
}
