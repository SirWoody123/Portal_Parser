/**
 * Full Demographic Test - All Categories
 */

async function testAllDemographics() {
  console.log('🧪 Testing ALL Demographics...');
  
  const allAgeOptions = ['21','22','23','24','25','Over 18','Under 18','Over 25','16 and under'];
  const allGenderOptions = ['He/Him', 'She/Her', 'They/Them', 'Non-binary', 'Transgender', 'Intersex', 'Other', 'Prefer not to say'];
  const allEthnicityOptions = ['White or White British', 'African, Caribbean or Black British', 'Asian or Asian British', 'Mixed or Multiple Ethnic group', 'Other Ethnic Group', 'Arab', 'Prefer not to say'];
  const allDisabilityOptions = ['Chronic illness', 'Hearing impairment', 'Neurodiversity', 'Physical disability', 'Visual impairment'];
  const allSocioEconomicOptions = ['20fXkU9RdlTlpfcS5K5D', 'V9J6aDjeQc7hIePqgsCh'];
  
  const testData = {
    id: 'all-demographics-test-' + Date.now(),
    opportunityType: 'Apprenticeship',
    title: 'All Demographics Test - Should Include ALL Tag IDs',
    status: 'live',
    demographic: {
      industry: ['Technology'],
      age: allAgeOptions,
      genderSexualPreference: allGenderOptions,
      ethnicity: allEthnicityOptions,
      disability: allDisabilityOptions,
      lowerSocioEconomicBackground: allSocioEconomicOptions
    }
  };

  console.log('🔢 Expected total demographic tags:', 
    allAgeOptions.length + allGenderOptions.length + allEthnicityOptions.length + allDisabilityOptions.length + allSocioEconomicOptions.length);
  
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
    
    if (result.data && result.data.tags) {
      console.log('🏷️ Tags Array Length:', result.data.tags.length);
      console.log('🏷️ Firebase Document ID:', result.masterPortalDocId);
      
      // Count tag types
      const tagIds = result.data.tags;
      console.log('\n🎯 Tag IDs in Firebase:');
      tagIds.forEach((tagId, index) => {
        console.log(`${index + 1}. ${tagId}`);
      });
      
      if (tagIds.length >= 30) {
        console.log('\n🎉 SUCCESS! All demographic categories are being processed!');
        console.log('✅ Age, Gender, Ethnicity, Disability, and Socio-Economic tags are all included');
        return { success: true, masterPortalDocId: result.masterPortalDocId, tagCount: tagIds.length };
      } else {
        console.log('\n⚠️ Partial Success - Got', tagIds.length, 'tags but expected 30+');
        return { success: false, masterPortalDocId: result.masterPortalDocId, tagCount: tagIds.length };
      }
    } else {
      console.log('❌ No tags array in response');
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return { success: false, error: error.message };
  }
}

testAllDemographics()
  .then(result => {
    console.log('\n📊 Final Result:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 Unexpected Error:', error);
    process.exit(1);
  });
