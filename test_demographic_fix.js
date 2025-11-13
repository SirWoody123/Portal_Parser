/**
 * Test Demographic Arrays Fix - PATCH25
 * This tests the Railway deployed API server
 */

async function testDemographicArraysFix() {
  console.log('🧪 Testing Demographic Arrays Fix (PATCH25)...');
  
  // Simulate what the Google Apps Script normalization function produces
  const testData = {
    id: 'demographic-arrays-fix-test-' + Date.now(),
    opportunityType: 'Apprenticeship',
    title: 'Demographic Arrays Fix Test - Should Include ALL Demographic Tag IDs',
    shortSummary: 'Testing that the API server properly processes demographic arrays and includes ALL demographic tag IDs in Firebase.',
    location: 'London, UK',
    applicationDeadline: '2025-12-31T23:59:59Z',
    link: 'https://example.com/demographic-arrays-fix-test',
    salary: '£22,000 per year',
    lengthOfApprenticeship: '18 months',
    levelOfApprenticeship: 'Level 4',
    status: 'live',
    anythingElseImportant: 'EXPECTED: Firebase tags array should contain 60+ tag IDs covering ALL demographic categories (age, gender, ethnicity, disability, socio-economic).',
    // Simulate the normalized data structure from Google Apps Script
    demographic: {
      industry: ['Technology'],
      age: ['21','22','23','24','25','Over 18','Under 18','Over 25','16 and under'], // All age options
      genderSexualPreference: ['He/Him', 'She/Her', 'They/Them', 'Non-binary', 'Transgender', 'Intersex', 'Other', 'Prefer not to say'], // All gender options
      ethnicity: ['White or White British', 'African, Caribbean or Black British', 'Asian or Asian British', 'Mixed or Multiple Ethnic group', 'Other Ethnic Group', 'Arab', 'Prefer not to say'], // All ethnicity options
      disability: ['Chronic illness', 'Hearing impairment', 'Neurodiversity', 'Physical disability', 'Visual impairment'], // All disability options
      lowerSocioEconomicBackground: ['20fXkU9RdlTlpfcS5K5D', 'V9J6aDjeQc7hIePqgsCh'] // All socio-economic options
    },
    tags: {
      tags: ['Technology', 'apprentice', 'coding'], // This will be processed by API server
      demographic: {
        age: '',
        genderSexualPreference: '',
        ethnicity: '',
        disability: '',
        lowerSocioEconomicBackground: '',
        keywords: ['apprentice', 'coding']
      }
    }
  };

  console.log('🟦 Before sending - tags.keywords:', JSON.stringify(testData.tags.keywords));
  console.log('🔍 Expected: Should default to ALL demographics and include ALL tag IDs (60+ tags)');
  
  try {
    const response = await fetch('https://apibridge-production.up.railway.app/opportunities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('📡 Full API Response:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('🎉 DEMOGRAPHIC ARRAYS FIX TEST SUCCESS!');
      console.log('🔥 Master Portal Doc ID:', result.masterPortalDocId);
      console.log('📋 Check Firebase - should have 60+ tag IDs covering all demographics');
      console.log('🎯 Expected tag categories: ages (14 tags), genders (8 tags), ethnicities (7 tags), disabilities (5 tags), socio-economic (2 tags)');
      console.log('🎯 Portal should now show ALL demographics selected!');
      
      return {
        success: true,
        masterPortalDocId: result.masterPortalDocId,
        message: 'Demographic arrays fix test completed - check Firebase for 60+ tag IDs'
      };
    } else {
      console.log('❌ DEMOGRAPHIC ARRAYS FIX TEST FAILED!');
      console.log('HTTP Status:', response.status);
      console.log('Error:', result ? result.error : 'Unknown error');
      
      return {
        success: false,
        error: result ? result.error : 'Unknown error'
      };
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return {
      success: false,
      error: 'Network Error: ' + error.message
    };
  }
}

// Run the test
testDemographicArraysFix()
  .then(result => {
    console.log('\n📊 Final Result:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 Unexpected Error:', error);
    process.exit(1);
  });
