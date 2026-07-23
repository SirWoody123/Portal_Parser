/**
 * Comprehensive test for unclear deadline functionality
 * Tests both parsing and normalization phases
 */
const fs = require('fs');
global.Logger = { log: function(msg) { 
  if (msg.includes('Added "Unclear Deadline"') || msg.includes('ERROR') || msg.includes('FAIL')) {
    console.log(msg); 
  }
}};

const googleScriptCode = fs.readFileSync('google_script', 'utf-8');
eval(googleScriptCode);

console.log('🎯 COMPREHENSIVE UNCLEAR DEADLINE TEST SUITE');
console.log('===========================================');

const testCases = [
  { 
    name: 'Explicit "Unclear"',
    deadline: 'Unclear',
    expected: true 
  },
  {
    name: 'To be confirmed', 
    deadline: 'To be confirmed',
    expected: true
  },
  {
    name: 'TBC abbreviation',
    deadline: 'TBC',
    expected: true
  },
  {
    name: 'Not specified',
    deadline: 'Not specified',
    expected: true
  },
  {
    name: 'Rolling deadline',
    deadline: 'Rolling deadline',
    expected: true
  },
  {
    name: 'Ongoing applications',
    deadline: 'Ongoing',
    expected: true
  },
  {
    name: 'N/A deadline',
    deadline: 'N/A',
    expected: true
  },
  {
    name: 'Clear date (should NOT be unclear)',
    deadline: '15 December 2025',
    expected: false
  }
];

let passCount = 0;
let totalCount = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`\n📄 TEST ${index + 1}: ${testCase.name}`);
  console.log('='.repeat(40));
  
  // Create test content
  const testContent = `Application deadline: ${testCase.deadline}
Event date: 15 January 2026
Location: London Test Centre
Industry: Creative Arts
Age: All ages
Gender & Sexual Preference: All genders & preferences
Ethnicity: All ethnicities
Disability: All disability
Economic Background: All backgrounds
Remote: No
UK Wide: No
Region: London`;

  const result = parseTextFileInGoogleScript(testContent);
  
  const hasUnclearMarker = result.title.includes('[Unclear Deadline]');
  const passed = hasUnclearMarker === testCase.expected;
  
  console.log(`✅ Title: ${result.title}`);
  console.log(`✅ Deadline: ${result.applicationDeadline}`);
  console.log(`✅ Has unclear marker: ${hasUnclearMarker ? 'YES' : 'NO'}`);
  console.log(`✅ Expected unclear: ${testCase.expected ? 'YES' : 'NO'}`);
  console.log(`✅ Test result: ${passed ? '✓ PASS' : '❌ FAIL'}`);
  
  if (passed) passCount++;
});

console.log('\n🎉 COMPREHENSIVE TEST RESULTS');
console.log('============================');
console.log(`✅ Passed: ${passCount}/${totalCount} tests`);
console.log(`✅ Success rate: ${Math.round((passCount/totalCount)*100)}%`);

if (passCount === totalCount) {
  console.log('🚀 ALL TESTS PASSED! Unclear deadline detection is working perfectly!');
} else {
  console.log('❌ Some tests failed. Please review the logic.');
}
