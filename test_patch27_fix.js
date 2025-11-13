/**
 * Test PATCH27 - Arab, Disability, and Socio-Economic Fix
 */

async function testPatch27Fix() {
  console.log('🧪 Testing PATCH27 - Arab, Disability, and Socio-Economic Fix');
  
  const testData = {
    id: 'patch27-fix-test-' + Date.now(),
    opportunityType: 'Apprenticeship',
    title: 'PATCH27 FIX TEST - Arab, Disability & Socio-Economic Should All Work',
    shortSummary: 'Testing the fixes for Arab ethnicity, disability categories, and socio-economic backgrounds.',
    location: 'London, UK',
    applicationDeadline: '2025-12-31T23:59:59Z',
    link: 'https://example.com/patch27-fix-test',
    salary: '£25,000 per year',
    lengthOfApprenticeship: '18 months',
    levelOfApprenticeship: 'Level 4',
    status: 'live',
    anythingElseImportant: 'EXPECTED: Portal should show Arab ethnicity, all disability options, and all socio-economic backgrounds working.',
    demographic: {
      industry: ['Technology'],
      age: ['21','22','23','24','25','Over 18','Under 18','Over 25','16 and under'],
      genderSexualPreference: ['He/Him', 'She/Her', 'They/Them', 'Non-binary', 'Transgender', 'Intersex', 'Other', 'Prefer not to say'],
      ethnicity: ['White or White British', 'African, Caribbean or Black British', 'Asian or Asian British', 'Mixed or Multiple Ethnic group', 'Other Ethnic Group', 'Arab', 'Prefer not to say'], // ← Arab should work now
      disability: ['Chronic illness', 'Hearing impairment', 'Neurodiversity', 'Physical disability', 'Visual impairment'], // ← All disabilities should work now
      lowerSocioEconomicBackground: ['All backgrounds', 'Only those from lower socio-economic background', 'Have or had free school meals'] // ← Text names instead of IDs
    }
  };

  console.log('🔍 Testing specific fixes:');
  console.log('  🌍 Arab ethnicity mapping');
  console.log('  🦽 All disability categories');
  console.log('  💰 Socio-economic backgrounds (as text names)');
  
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
    
    if (response.ok && result.masterPortalDocId) {
      console.log('🎉 PATCH27 FIX TEST SUCCESS!');
      console.log('🔥 Firebase Document ID:', result.masterPortalDocId);
      console.log('🏷️ Tags Array Length:', result.data.tags.length);
      
      // Check for expected increases
      if (result.data.tags.length >= 28) { // Should be more tags now with proper mappings
        console.log('✅ SUCCESS: More demographic tags detected!');
        console.log('');
        console.log('🎯 EXPECTED FIXES IN PORTAL:');
        console.log('  🌍 Arab ethnicity should now appear');
        console.log('  🦽 All disability categories should appear');
        console.log('  💰 All socio-economic backgrounds should appear');
        console.log('');
        console.log('🔥 TEST THIS Firebase document in the portal:');
        console.log(`   ${result.masterPortalDocId}`);
        
        // Show the tags for debugging
        console.log('\n🏷️ All tag IDs in Firebase:');
        result.data.tags.forEach((tagId, index) => {
          console.log(`${index + 1}. ${tagId}`);
        });
        
        return { success: true, masterPortalDocId: result.masterPortalDocId, tagCount: result.data.tags.length };
      } else {
        console.log('⚠️ Got', result.data.tags.length, 'tags - may still have mapping issues');
        return { success: false, masterPortalDocId: result.masterPortalDocId, tagCount: result.data.tags.length };
      }
    } else {
      console.log('❌ PATCH27 TEST FAILED!');
      console.log('HTTP Status:', response.status);
      console.log('Response:', JSON.stringify(result, null, 2));
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return { success: false, error: error.message };
  }
}

testPatch27Fix()
  .then(result => {
    console.log('\n📊 Final Result:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 Unexpected Error:', error);
    process.exit(1);
  });
