/**
 * Debug which demographic values are not mapping to tag IDs
 */

// Updated TAG_NAME_TO_ID mapping from our API server
const TAG_NAME_TO_ID = {
  // Ages
  "16 and under": "Yfxp8QQJtghr4qQPmkx8",
  "21": "3RFE8LOp5gmRFKBnq3Y7",
  "22": "Wk1k8kt8tZlALiVeW0Qq",
  "23": "SjDtv9VjoKmpzKZvfXzp",
  "24": "PIAq1kX4RW63lJ4jYZn0",
  "25": "ypAb8alCEnbvDlS5ZqLu",
  "Under 18": "cb70qB5JuW1SeTK7WmbY",
  "Over 18": "6Bj2Xtzi0uIWc8ZrTVtY",
  "Over 25": "sS3aP11L68igBoD7f0xe",

  // Genders
  "He/Him": "BGHOxtT7mL635uaWX7Wd",
  "They/Them": "D8TZCPwER6lzJV3p1fmA",
  "She/Her": "Ljk28RD3LQJHXb1OXzz7",
  "Non-binary": "D8TZCPwER6lzJV3p1fmA",
  "Transgender": "D8TZCPwER6lzJV3p1fmA",
  "Intersex": "D8TZCPwER6lzJV3p1fmA",
  "Other": "JNNkRh7GpLhmtNLhIBRZ",
  "Prefer not to say": "WMLPtNRCGSBbv7bViz1S",

  // Ethnicities
  "White or White British": "OzWIBHiSh2UmWvQAQpFd",
  "African, Caribbean or Black British": "DUK2DyQTTnvJXp83Cuuw",
  "Asian or Asian British": "RRPIGD8goCRgLEiCoTsi",
  "Mixed or Multiple Ethnic group": "dtHf8HC9oZbwuuykzRrE",
  "Other Ethnic Group": "ZBpKSjEz0oGXA7Ju6Rh1",
  "Arab": "x0WOQE0IZSuOTggNB3kE",

  // Disabilities  
  "Chronic illness": "S6BVkq9Z9rSfeAs1rR78",
  "Hearing impairment": "09Q2FEVzWlOBc5AqoypO",
  "Neurodiversity": "4Ed3aFDBvrMHL53yYN4Z",
  "Physical disability": "09Q2FEVzWlOBc5AqoypO",
  "Visual impairment": "4Ed3aFDBvrMHL53yYN4Z",

  // Socio-economic
  "20fXkU9RdlTlpfcS5K5D": "20fXkU9RdlTlpfcS5K5D",
  "V9J6aDjeQc7hIePqgsCh": "V9J6aDjeQc7hIePqgsCh"
};

// Test demographic arrays from Google Apps Script
const demographicArrays = {
  age: ['21','22','23','24','25','Over 18','Under 18','Over 25','16 and under'],
  genderSexualPreference: ['He/Him', 'She/Her', 'They/Them', 'Non-binary', 'Transgender', 'Intersex', 'Other', 'Prefer not to say'],
  ethnicity: ['White or White British', 'African, Caribbean or Black British', 'Asian or Asian British', 'Mixed or Multiple Ethnic group', 'Other Ethnic Group', 'Arab', 'Prefer not to say'],
  disability: ['Chronic illness', 'Hearing impairment', 'Neurodiversity', 'Physical disability', 'Visual impairment'],
  lowerSocioEconomicBackground: ['20fXkU9RdlTlpfcS5K5D', 'V9J6aDjeQc7hIePqgsCh']
};

console.log('🔍 Checking which demographic values map to tag IDs...\n');

let totalMapped = 0;
let totalValues = 0;

Object.keys(demographicArrays).forEach(category => {
  console.log(`📋 ${category.toUpperCase()}:`);
  
  demographicArrays[category].forEach(value => {
    totalValues++;
    const tagId = TAG_NAME_TO_ID[value];
    if (tagId) {
      console.log(`  ✅ "${value}" → ${tagId}`);
      totalMapped++;
    } else {
      console.log(`  ❌ "${value}" → NOT FOUND`);
    }
  });
  console.log('');
});

console.log(`📊 Summary: ${totalMapped}/${totalValues} values mapped to tag IDs`);
console.log(`🎯 Expected in Firebase: ${totalMapped} demographic tag IDs`);

// Check for missing mappings
const missingMappings = [];
Object.keys(demographicArrays).forEach(category => {
  demographicArrays[category].forEach(value => {
    if (!TAG_NAME_TO_ID[value]) {
      missingMappings.push(value);
    }
  });
});

if (missingMappings.length > 0) {
  console.log('\n❌ Missing mappings:');
  missingMappings.forEach(value => {
    console.log(`  - "${value}"`);
  });
}
