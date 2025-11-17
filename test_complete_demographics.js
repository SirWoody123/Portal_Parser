/**
 * 🎯 FINAL COMPREHENSIVE DEMOGRAPHICS TEST - PATCH26 COMPATIBLE
 * 
 * This test creates an opportunity using the correct demographic structure
 * that will display in the portal:
 * - Age: "All ages" 
 * - Gender & Sexual Preference: "All genders & preferences"
 * - Ethnicity: "All ethnicities"
 * - Disability: "All disability"
 * - Lower Socio Economic Background: "All backgrounds"
 * 
 * Uses the correct data.demographic structure that PATCH26 expects!
 */
function testAllDemographicsComplete() {
  Logger.log('🎯 FINAL TEST - Complete Demographics with PATCH26 Structure');
  
  // Define all demographic options to trigger "All" display in portal
  var allAgeOptions = ['21','22','23','24','25','Over 18','Under 18','Over 25','16 and under', '18+ only'];
  var allGenderOptions = ['He/Him', 'She/Her', 'They/Them', 'Non-binary', 'Transgender', 'Intersex', 'Other', 'Prefer not to say'];
  var allEthnicityOptions = ['White or White British', 'African, Caribbean or Black British', 'Asian or Asian British', 'Mixed or Multiple Ethnic group', 'Other Ethnic Group', 'Arab', 'Prefer not to say'];
  var allDisabilityOptions = ['Chronic illness', 'Hearing impairment', 'Neurodiversity', 'Physical disability', 'Visual impairment', 'Mental health'];
  var allSocioEconomicOptions = ['All backgrounds', 'Only those from lower socio-economic background', 'Have or had free school meals', 'Lower socio-economic background'];
  
  var testData = {
    id: 'final-all-demographics-test-' + Date.now(),
    opportunityType: 'Apprenticeship',
    title: 'FINAL TEST - All Demographics Should Display Correctly',
    shortSummary: 'Final comprehensive test using PATCH26 structure to verify all demographic categories display as expected.',
    location: 'London, UK',
    applicationDeadline: '2025-12-31T23:59:59Z',
    link: 'https://example.com/final-all-demographics-test',
    salary: '£30,000 per year',
    lengthOfApprenticeship: '24 months',
    levelOfApprenticeship: 'Level 4',
    status: 'live',
    anythingElseImportant: 'FINAL PATCH26 TEST: Should populate tags array with 50+ tag IDs and show all demographic categories selected in portal.',
    
    // 🔥 THIS IS THE CRITICAL STRUCTURE THAT PATCH26 EXPECTS 🔥
    demographic: {
      industry: ['Technology', 'Gaming'], 
      age: allAgeOptions,
      genderSexualPreference: allGenderOptions,
      ethnicity: allEthnicityOptions,
      disability: allDisabilityOptions,
      lowerSocioEconomicBackground: allSocioEconomicOptions
    }
  };

  Logger.log('🔥 PATCH26 Compatible Structure:');
  Logger.log('- Industry count: ' + testData.demographic.industry.length);
  Logger.log('- Age options: ' + testData.demographic.age.length);
  Logger.log('- Gender options: ' + testData.demographic.genderSexualPreference.length);
  Logger.log('- Ethnicity options: ' + testData.demographic.ethnicity.length);
  Logger.log('- Disability options: ' + testData.demographic.disability.length);
  Logger.log('- Socio-economic options: ' + testData.demographic.lowerSocioEconomicBackground.length);
  Logger.log('🎯 Expected: Portal shows ALL categories selected + Firebase tags array with 50+ tag IDs');
  
  // Send to API Bridge using PATCH26 compatible structure
  var result = sendToApiBridge(testData);
  
  if (result && result.success) {
    Logger.log('🎉 FINAL DEMOGRAPHICS TEST SUCCESS!');
    Logger.log('🔥 Master Portal Doc ID: ' + result.masterPortalDocId);
    Logger.log('📋 PORTAL CHECK - SHOULD DISPLAY:');
    Logger.log('🎯 Age: "All ages"');
    Logger.log('🎯 Gender & Sexual Preference: "All genders & preferences"');
    Logger.log('🎯 Ethnicity: "All ethnicities"');
    Logger.log('🎯 Disability: "All disability"');
    Logger.log('🎯 Lower Socio Economic: "All backgrounds"');
    Logger.log('💫 Firebase tags array should contain 50+ tag IDs');
    
    return {
      success: true,
      masterPortalDocId: result.masterPortalDocId,
      message: 'All demographics final test completed successfully'
    };
  } else {
    Logger.log('❌ FINAL DEMOGRAPHICS TEST FAILED!');
    Logger.log('Error: ' + (result ? result.error : 'Unknown error'));
    
    return {
      success: false,
      error: result ? result.error : 'Unknown error'
    };
  }
}
    Logger.log('🎯 Lower Socio Economic Background: "All backgrounds"');
    Logger.log('🎯 Industries: Gaming, Theatre');
    Logger.log('');
    Logger.log('🔥 EXPECTED FIREBASE TAGS: 15+ tag IDs covering all demographics');
    
    return {
      success: true,
      masterPortalDocId: result.masterPortalDocId,
      message: 'Complete demographics test - should show ALL categories as "All" in portal'
    };
  } else {
    Logger.log('❌ COMPLETE DEMOGRAPHICS TEST FAILED!');
    Logger.log('Error: ' + (result ? result.error : 'Unknown error'));
    
    return {
      success: false,
      error: result ? result.error : 'Unknown error'
    };
  }
}

/**
 * 🚀 QUICK TEST RUNNER - Run this for the complete test
 */
function runCompleteTest() {
  Logger.log('🚀 Running Complete Demographics Test...');
  Logger.log('');
  
  var result = testAllDemographicsComplete();
  
  if (result.success) {
    Logger.log('');
    Logger.log('✅ SUCCESS! Check Firebase document: ' + result.masterPortalDocId);
    Logger.log('✅ Check Portal UI - should show ALL demographic categories as "All"');
    Logger.log('');
    Logger.log('🎯 Expected Portal Display:');
    Logger.log('   Age: All ages');
    Logger.log('   Gender: All genders & preferences');
    Logger.log('   Ethnicity: All ethnicities'); 
    Logger.log('   Disability: All disability');
    Logger.log('   Socio-Economic: All backgrounds');
  } else {
    Logger.log('❌ Test failed: ' + result.error);
  }
  
  return result;
}

/**
 * 📤 Send data to API Bridge (your deployed service)
 * NOTE: Make sure CONFIG.API_BRIDGE_URL is set correctly
 */
function sendToApiBridge(opportunityData) {
  var CONFIG = {
    API_BRIDGE_URL: 'https://apibridge-production.up.railway.app/opportunities'
  };
  
  Logger.log('📤 Sending to API Bridge: ' + opportunityData.title);
  
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(opportunityData),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(CONFIG.API_BRIDGE_URL, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();

    Logger.log('📡 API Bridge Response Code: ' + responseCode);

    if (responseCode === 200) {
      var result = JSON.parse(responseBody);
      Logger.log('✅ API Bridge Success: ' + JSON.stringify(result, null, 2));
      return {
        success: true,
        masterPortalDocId: result.masterPortalDocId,
        collectionPath: result.collectionPath,
        data: result.data
      };
    } else {
      Logger.log('❌ API Bridge Error: ' + responseBody);
      return {
        success: false,
        error: 'HTTP ' + responseCode + ': ' + responseBody
      };
    }
  } catch (error) {
    Logger.log('❌ Network Error: ' + error.toString());
    return {
      success: false,
      error: 'Network Error: ' + error.toString()
    };
  }
}

/**
 * 🎯 QUICK SINGLE DEMOGRAPHICS TEST
 * Test specific demographic combinations for targeted verification
 */
function testSingleDemographics() {
  Logger.log('🎯 Quick Single Demographics Test');
  
  var testData = {
    id: 'single-demographics-test-' + Date.now(),
    opportunityType: 'Apprenticeship',
    title: 'Single Demographics Test - Targeted Values',
    shortSummary: 'Testing specific demographic combinations for targeted verification.',
    location: 'Birmingham, UK',
    applicationDeadline: '2025-12-31T23:59:59Z',
    link: 'https://example.com/single-demographics-test',
    salary: '£22,000 per year',
    lengthOfApprenticeship: '18 months',
    levelOfApprenticeship: 'Level 3',
    status: 'live',
    anythingElseImportant: 'SINGLE TEST: Testing specific demographic values with PATCH26 structure.',
    
    demographic: {
      industry: ['Technology'],
      age: ['Over 18', '21'],
      genderSexualPreference: ['He/Him', 'She/Her'],
      ethnicity: ['Asian or Asian British'],
      disability: ['Physical disability', 'Neurodiversity'],
      lowerSocioEconomicBackground: ['All backgrounds']
    }
  };

  Logger.log('🔍 Testing specific values:');
  Logger.log('- Age: ' + JSON.stringify(testData.demographic.age));
  Logger.log('- Gender: ' + JSON.stringify(testData.demographic.genderSexualPreference));
  Logger.log('- Ethnicity: ' + JSON.stringify(testData.demographic.ethnicity));
  Logger.log('- Disability: ' + JSON.stringify(testData.demographic.disability));
  Logger.log('- Socio-economic: ' + JSON.stringify(testData.demographic.lowerSocioEconomicBackground));
  
  var result = sendToApiBridge(testData);
  
  if (result && result.success) {
    Logger.log('🎉 SINGLE DEMOGRAPHICS TEST SUCCESS!');
    Logger.log('🔥 Master Portal Doc ID: ' + result.masterPortalDocId);
    Logger.log('📋 Expected Portal Display:');
    Logger.log('🎯 Age: Shows selected ages');
    Logger.log('🎯 Gender: Shows selected genders');
    Logger.log('🎯 Ethnicity: Shows selected ethnicity');
    Logger.log('🎯 Disability: Shows Physical disability + Neurodiversity');
    Logger.log('🎯 Socio-economic: Shows All backgrounds');
    
    return {
      success: true,
      masterPortalDocId: result.masterPortalDocId,
      message: 'Single demographics test completed successfully'
    };
  } else {
    Logger.log('❌ SINGLE DEMOGRAPHICS TEST FAILED!');
    Logger.log('Error: ' + (result ? result.error : 'Unknown error'));
    
    return {
      success: false,
      error: result ? result.error : 'Unknown error'
    };
  }
}
