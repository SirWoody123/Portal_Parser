/**
 * Debug Demographic Processing - Test what the API server receives
 */

async function debugDemographicProcessing() {
  console.log('🔍 Debug: Testing what API server receives...');
  
  // Test with minimal data first
  const testData = {
    id: 'debug-test-' + Date.now(),
    opportunityType: 'Apprenticeship',
    title: 'Debug Test',
    demographic: {
      age: ['21', '22'], // Just 2 age values to test
      genderSexualPreference: ['He/Him'], // Just 1 gender value to test
      ethnicity: ['White or White British'], // Just 1 ethnicity value to test
      disability: ['Neurodiversity'], // Just 1 disability value to test
      lowerSocioEconomicBackground: ['V9J6aDjeQc7hIePqgsCh'] // Just 1 socio-economic value to test
    }
  };

  console.log('📤 Sending test data:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch('https://apibridge-production.up.railway.app/opportunities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response Data:', JSON.stringify(result, null, 2));
    
    if (result.data && result.data.tags) {
      console.log('🏷️ Tags Array Length:', result.data.tags.length);
      console.log('🏷️ Tags Array:', result.data.tags);
    }
    
    return result;
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return null;
  }
}

// Run the debug test
debugDemographicProcessing()
  .then(result => {
    console.log('\n📊 Debug Complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Unexpected Error:', error);
    process.exit(1);
  });
