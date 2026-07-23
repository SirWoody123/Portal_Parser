// Fixed version of the key parts in your normalizeOpportunityData function
// Replace lines 271-370 in your google_script file with this:

function normalizeOpportunityData(data) {
  // ... keep all your existing helper functions (arr, str, bool, etc.) ...
  
  // Extract keywords from data.tags.keywords or data.keywords
  var keywordsArr = [];
  if (data.tags && Array.isArray(data.tags.keywords)) {
    keywordsArr = data.tags.keywords.map(function(k) { return String(k); });
  } else if (Array.isArray(data.keywords)) {
    keywordsArr = data.keywords.map(function(k) { return String(k); });
  }
  if (!keywordsArr) keywordsArr = [];

  // Extract industry tags from data.tags.industry or data.industry
  var industryTags = [];
  if (data.tags && Array.isArray(data.tags.industry)) {
    industryTags = normalizeIndustries(data.tags.industry);
  } else if (Array.isArray(data.industry)) {
    industryTags = normalizeIndustries(data.industry);
  }
  if (!industryTags) industryTags = [];

  // *** FIX: Build tagsArr to include ALL tags (industry + keywords + demographics) ***
  var tagsArr = [];
  
  // Add industry tags
  tagsArr = tagsArr.concat(industryTags);
  
  // Add keyword tags
  tagsArr = tagsArr.concat(keywordsArr);
  
  // Add demographic values as tags too
  var allowedAges = ['21','22','23','24','25','Over 18','Under 18','Over 25','16 and under'];
  var allowedGenders = ['All genders & preferences', 'Male', 'Female', 'Non-binary', 'Transgender', 'Intersex', 'Other', 'Prefer not to say'];
  var allowedEthnicities = ['All ethnicities', 'White', 'Black', 'Asian', 'Mixed', 'Other', 'Prefer not to say'];
  var allowedDisabilities = ['All disability', 'Chronic illness', 'Mental health', 'Neurodiversity', 'Physical disability'];
  var allowedSocioEconomic = ['20fXkU9RdlTlpfcS5K5D', 'V9J6aDjeQc7hIePqgsCh'];

  // Extract demographic values and add them to tagsArr
  var ageString = '';
  var genderString = 'All genders & preferences';
  var ethnicityString = 'All ethnicities';
  var disabilityString = '';
  var lowerSocioEconomicBackgroundString = '';

  // Find age in keywords
  for (var i = 0; i < keywordsArr.length; i++) {
    if (allowedAges.includes(keywordsArr[i])) {
      ageString = keywordsArr[i];
      tagsArr.push(ageString);
      break;
    }
  }

  // Find gender in keywords
  for (var j = 0; j < keywordsArr.length; j++) {
    if (allowedGenders.includes(keywordsArr[j])) {
      genderString = keywordsArr[j];
      tagsArr.push(genderString);
      break;
    }
  }

  // Find ethnicity in keywords
  for (var k = 0; k < keywordsArr.length; k++) {
    if (allowedEthnicities.includes(keywordsArr[k])) {
      ethnicityString = keywordsArr[k];
      tagsArr.push(ethnicityString);
      break;
    }
  }

  // Find disability in keywords
  for (var d = 0; d < keywordsArr.length; d++) {
    if (allowedDisabilities.includes(keywordsArr[d])) {
      disabilityString = keywordsArr[d];
      tagsArr.push(disabilityString);
      break;
    }
  }

  // Find socioeconomic in keywords
  for (var l = 0; l < keywordsArr.length; l++) {
    if (allowedSocioEconomic.includes(keywordsArr[l])) {
      lowerSocioEconomicBackgroundString = keywordsArr[l];
      tagsArr.push(lowerSocioEconomicBackgroundString);
      break;
    }
  }

  // *** FIX: Create the demographic object structure that matches our working sample ***
  var demographicObj = {
    industry: industryTags, // Keep as array for demographic.industry
    age: [], // Keep as empty arrays as shown in your logs
    genderSexualPreference: [],
    ethnicity: [],
    disability: [],
    lowerSocioEconomicBackground: []
  };

  return {
    // ... keep all your other fields unchanged ...
    tags: {
      tags: tagsArr, // This now includes industry + keywords + demographic values
      demographic: {
        age: ageString,
        genderSexualPreference: genderString,
        ethnicity: ethnicityString,
        disability: disabilityString,
        lowerSocioEconomicBackground: lowerSocioEconomicBackgroundString,
        keywords: keywordsArr
      }
    },
    demographic: demographicObj,
    // ... rest of your fields ...
  };
}
