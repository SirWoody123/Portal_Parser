/**
 * Final Test - PATCH26 with Updated Mappings
 */

async function finalTestPatch26() {
  console.log('🎉 Final Test - PATCH26 Updated Mappings');
  
  const testData = {
    id: 'final-patch26-test-' + Date.now(),
    opportunityType: 'Apprenticeship',
    title: 'FINAL PATCH26 TEST - All Demographics Should Work',
    shortSummary: 'Testing the complete fix with updated tag mappings from Tags987.csv',
    location: 'London, UK',
    applicationDeadline: '2025-12-31T23:59:59Z',
    link: 'https://example.com/final-patch26-test',
    salary: '£25,000 per year',
    lengthOfApprenticeship: '18 months',
    levelOfApprenticeship: 'Level 4',
    status: 'live',
    anythingElseImportant: 'EXPECTED: Portal should show ALL demographics selected - ages, genders, ethnicities, disabilities, and socio-economic backgrounds.',
    demographic: {
      industry: ['Technology'],
      age: ['21','22','23','24','25','Over 18','Under 18','Over 25','16 and under'],
      genderSexualPreference: ['He/Him', 'She/Her', 'They/Them', 'Non-binary', 'Transgender', 'Intersex', 'Other', 'Prefer not to say'],
      ethnicity: ['White or White British', 'African, Caribbean or Black British', 'Asian or Asian British', 'Mixed or Multiple Ethnic group', 'Other Ethnic Group', 'Arab', 'Prefer not to say'],
      disability: ['Chronic illness', 'Hearing impairment', 'Neurodiversity', 'Physical disability', 'Visual impairment'],
      lowerSocioEconomicBackground: ['20fXkU9RdlTlpfcS5K5D', 'V9J6aDjeQc7hIePqgsCh']
    }
  };

  console.log('🔢 Expected unique tag IDs: 26 (25 demographic + 1 industry)');
  
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
      console.log('🎉 FINAL PATCH26 TEST SUCCESS!');
      console.log('🔥 Firebase Document ID:', result.masterPortalDocId);
      console.log('🏷️ Tags Array Length:', result.data.tags.length);
      
      if (result.data.tags.length >= 25) {
        console.log('✅ SUCCESS: All demographic categories are now included!');
        console.log('📋 Portal should show:');
        console.log('  ✅ All age options selected');
        console.log('  ✅ All gender options selected');
        console.log('  ✅ All ethnicity options selected');
        console.log('  ✅ All disability options selected');
        console.log('  ✅ All socio-economic options selected');
        console.log('');
        console.log('🎯 TEST THIS Firebase document in the portal:');
        console.log(`   ${result.masterPortalDocId}`);
        
        return { success: true, masterPortalDocId: result.masterPortalDocId, tagCount: result.data.tags.length };
      } else {
        console.log('⚠️ Partial Success - Got', result.data.tags.length, 'tags but expected 25+');
        return { success: false, masterPortalDocId: result.masterPortalDocId, tagCount: result.data.tags.length };
      }
    } else {
      console.log('❌ PATCH26 TEST FAILED!');
      console.log('HTTP Status:', response.status);
      console.log('Error:', result ? result.error : 'Unknown error');
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return { success: false, error: error.message };
  }
}

finalTestPatch26()
  .then(result => {
    console.log('\n📊 Final Result:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 Unexpected Error:', error);
    process.exit(1);
  });
