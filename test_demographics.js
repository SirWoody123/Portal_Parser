// Simple Node.js script to test our testSimplifiedPortalStructure function
const { execSync } = require('child_process');

// The function from google_script (simplified for testing)
function testAPI() {
  const testData = {
    id: 'demographic-fix-test-' + Date.now(),
    opportunityType: 'Apprenticeship',
    title: 'Demographic Fix Test - Should Include ALL Demographics',
    shortSummary: 'Testing that the API server now properly processes all demographic arrays.',
    location: 'Manchester, UK',
    applicationDeadline: '2025-12-31T23:59:59Z',
    link: 'https://example.com/demographic-fix-test',
    salary: '£20,000 per year',
    lengthOfApprenticeship: '18 months',
    levelOfApprenticeship: 'Level 4',
    status: 'live',
    anythingElseImportant: 'EXPECTED: Should include ALL demographic tag IDs in Firebase tags array.',
    tags: {
      industry: ['Technology'],
      keywords: ['apprentice', 'coding'] // NO demographics = should default to ALL
    }
  };

  console.log('🧪 Testing API server with demographic fix...');
  console.log('Test Data:', JSON.stringify(testData, null, 2));

  // Send to API
  const https = require('https');
  const data = JSON.stringify(testData);
  
  const options = {
    hostname: 'apibridge-production.up.railway.app',
    port: 443,
    path: '/opportunities',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    let response = '';
    res.on('data', (chunk) => response += chunk);
    res.on('end', () => {
      console.log('API Response:', response);
      const result = JSON.parse(response);
      if (result.masterPortalDocId) {
        console.log('🎉 SUCCESS! Firebase Doc ID:', result.masterPortalDocId);
        console.log('📊 Check Firebase - should now contain ALL demographic tag IDs!');
      }
    });
  });

  req.on('error', (e) => console.error('Error:', e));
  req.write(data);
  req.end();
}

testAPI();
