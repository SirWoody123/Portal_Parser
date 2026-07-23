// Test the date parsing function
function parseApplicationDeadline(dateString) {
  if (!dateString || dateString.trim() === '') {
    return '';
  }
  
  const cleanDate = dateString.trim();
  
  try {
    // Handle common patterns
    let date = null;
    
    // Pattern 1: "5th December 2025", "1st January 2024", etc.
    const ordinalPattern = /(\d{1,2})(st|nd|rd|th)\s+(\w+)\s+(\d{4})/i;
    const ordinalMatch = cleanDate.match(ordinalPattern);
    if (ordinalMatch) {
      const day = parseInt(ordinalMatch[1]);
      const monthName = ordinalMatch[3];
      const year = parseInt(ordinalMatch[4]);
      
      const months = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
        'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
      };
      
      const monthIndex = months[monthName.toLowerCase()];
      if (monthIndex !== undefined) {
        date = new Date(year, monthIndex, day, 23, 59, 59);
      }
    }
    
    // Pattern 2: Try standard JavaScript Date parsing
    if (!date) {
      date = new Date(cleanDate);
      if (isNaN(date.getTime())) {
        date = null;
      }
    }
    
    // Pattern 3: Try with added time if no time specified
    if (!date && !cleanDate.includes('T') && !cleanDate.includes(':')) {
      date = new Date(cleanDate + ' 23:59:59');
      if (isNaN(date.getTime())) {
        date = null;
      }
    }
    
    if (date && !isNaN(date.getTime())) {
      // Set to end of day (23:59:59) for deadlines
      date.setHours(23, 59, 59, 999);
      return date.toISOString();
    }
    
    // If all parsing fails, return the original string
    console.log('⚠️ Could not parse date:', dateString, ', returning original');
    return dateString;
    
  } catch (e) {
    console.log('⚠️ Date parsing error for "' + dateString + '":', e.toString());
    return dateString;
  }
}

// Test various date formats
console.log('🧪 TESTING DATE PARSING...\n');

const testDates = [
  '5th December 2025',
  '1st January 2024',
  '31st March 2025',
  '5/12/25',
  '2025-12-05',
  'December 5, 2025',
  'Invalid date format'
];

testDates.forEach(testDate => {
  const result = parseApplicationDeadline(testDate);
  console.log(`Input: "${testDate}" → Output: "${result}"`);
});

console.log('\n✅ DATE PARSING TEST COMPLETE!');
