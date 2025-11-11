  // --- NORMALIZATION FUNCTION ---
  function normalizeOpportunityData(data) {
    // Helper functions
    function arr(val) { return Array.isArray(val) ? val : (val ? [val] : []); }
    function str(val) { return typeof val === 'string' ? val : ''; }
    function bool(val) { return typeof val === 'boolean' ? val : false; }
    function strOrNull(val) { return val === null ? null : str(val); }
    function id(val) { return typeof val === 'string' ? val : (val ? String(val) : ''); }

    // Allowed categories: label and value (frontend expects value)
    var allowedCategories = [
      { label: 'Apprenticeship', name: 'apprenticeship' },
      { label: 'Competition/Grant', name: 'competition-grant' },
      { label: 'Course', name: 'course' },
      { label: 'Freelance role', name: 'freelance-role' },
      { label: 'Internship', name: 'internship' },
      { label: 'Junior full-time role', name: 'junior-full-time-role' },
      { label: 'Junior part-time role', name: 'junior-part-time-role' },
      { label: 'Mentoring', name: 'mentoring' },
      { label: 'Opportunity', name: 'opportunity' },
      { label: 'Runner role', name: 'runner-role' },
      { label: 'Training scheme', name: 'training-scheme' },
      { label: 'Work experience', name: 'work-experience' }
    ];

    // Find best match for category (label or value)
    function mapCategory(val) {
      var v = str(val).trim();
      if (!v) return '';
      // Try label match (case-insensitive)
      var found = allowedCategories.find(function(opt) { return opt.label.toLowerCase() === v.toLowerCase(); });
      if (found) return found.name;
      // Try value match (case-insensitive)
      found = allowedCategories.find(function(opt) { return opt.name.toLowerCase() === v.toLowerCase(); });
      if (found) return found.name;
      return '';
    }

    var rawCat = str(data.category) || str(data.opportunityType);
    var mappedCat = mapCategory(rawCat);
    
    // Only if not matched, try to infer from filename or tags
    if (!mappedCat) {
      var title = str(data.title).toLowerCase();
      var idVal = str(data.id).toLowerCase();
      var keywords = [];
      if (Array.isArray(data.tags)) {
        data.tags.forEach(function(tagObj) {
          if (tagObj && Array.isArray(tagObj.keywords)) {
            keywords = keywords.concat(tagObj.keywords.map(function(k){return String(k).toLowerCase();}));
          }
        });
      }
      if (title.includes('apprentice') || idVal.includes('apprentice') || keywords.includes('apprentice')) mappedCat = 'apprenticeship';
      else if (title.includes('intern') || idVal.includes('intern') || keywords.includes('intern')) mappedCat = 'internship';
      else if (title.includes('course') || idVal.includes('course') || keywords.includes('course')) mappedCat = 'course';
      else if (title.includes('training') || idVal.includes('training') || keywords.includes('training')) mappedCat = 'training-scheme';
      else if (title.includes('runner') || idVal.includes('runner') || keywords.includes('runner')) mappedCat = 'runner-role';
      else if (title.includes('freelance') || idVal.includes('freelance') || keywords.includes('freelance')) mappedCat = 'freelance-role';
      else if (title.includes('competition') || idVal.includes('competition') || keywords.includes('competition') || title.includes('grant') || idVal.includes('grant') || keywords.includes('grant')) mappedCat = 'competition-grant';
      else if (title.includes('junior') && title.includes('full') && title.includes('time')) mappedCat = 'junior-full-time-role';
      else if (title.includes('junior') && title.includes('part') && title.includes('time')) mappedCat = 'junior-part-time-role';
      else if (title.includes('mentor') || idVal.includes('mentor') || keywords.includes('mentor')) mappedCat = 'mentoring';
      else if (title.includes('work experience') || idVal.includes('work experience') || keywords.includes('work experience')) mappedCat = 'work-experience';
      else if (title.includes('job') || idVal.includes('job') || keywords.includes('job')) mappedCat = 'junior-full-time-role';
      else mappedCat = 'opportunity';
    }

    // Allowed industries (case-insensitive match)
    var allowedIndustries = [
      'All Creative Industries', 'Acting', 'Advertising', 'Animation', 'Architecture', 'Arts', 'Audio', 'Comedy', 'Content Creation', 'Craft', 'Culture', 'Dance', 'Design', 'Digital', 'Directing', 'E-Sport', 'Fashion', 'Film', 'Gaming', 'Graphic Design', 'Heritage', 'Journalism', 'Marketing', 'Media', 'Museum', 'Music', 'Performing Arts', 'Photography', 'Podcasting', 'PR', 'Presenting', 'Publishing', 'Radio', 'Social Media', 'Theatre', 'TV', 'UX/UI Design', 'VFX', 'Videography', 'Visual Art', 'Writing'
    ];

    // Normalize industry tags: always array, only allowed values, case-insensitive
    function normalizeIndustries(input) {
      var arrInput = Array.isArray(input) ? input : (input ? [input] : []);
      return arrInput
        .map(function(val) { return String(val).trim(); })
        .filter(function(val) {
          return allowedIndustries.some(function(ai) { return ai.toLowerCase() === val.toLowerCase(); });
        })
        .map(function(val) {
          // Return the canonical casing from allowedIndustries
          var found = allowedIndustries.find(function(ai) { return ai.toLowerCase() === val.toLowerCase(); });
          return found || val;
        });
    }

    // Extract industry tags from data.tags.industry or data.industry
    var industryTags = [];
    if (data.tags && Array.isArray(data.tags.industry)) {
      industryTags = normalizeIndustries(data.tags.industry);
    } else if (Array.isArray(data.industry)) {
      industryTags = normalizeIndustries(data.industry);
    }
    if (!industryTags) industryTags = [];

    // Extract keywords from data.tags.keywords or data.keywords
    var keywordsArr = [];
    if (data.tags && Array.isArray(data.tags.keywords)) {
      keywordsArr = data.tags.keywords.map(function(k) { return String(k); });
    } else if (Array.isArray(data.keywords)) {
      keywordsArr = data.keywords.map(function(k) { return String(k); });
    }
    if (!keywordsArr) keywordsArr = [];

    // *** FIX: Build tagsArr to include ALL tags (industry + keywords + demographic values) ***
    var tagsArr = [];
    
    // Add industry tags
    tagsArr = tagsArr.concat(industryTags);
    
    // Add keyword tags
    tagsArr = tagsArr.concat(keywordsArr);

    // Define allowed demographic values
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

    // Find age in keywords and add to tagsArr
    for (var i = 0; i < keywordsArr.length; i++) {
      if (allowedAges.includes(keywordsArr[i])) {
        ageString = keywordsArr[i];
        if (tagsArr.indexOf(ageString) === -1) tagsArr.push(ageString);
        break;
      }
    }

    // Find gender in keywords and add to tagsArr
    for (var j = 0; j < keywordsArr.length; j++) {
      if (allowedGenders.includes(keywordsArr[j])) {
        genderString = keywordsArr[j];
        if (tagsArr.indexOf(genderString) === -1) tagsArr.push(genderString);
        break;
      }
    }

    // Find ethnicity in keywords and add to tagsArr
    for (var k = 0; k < keywordsArr.length; k++) {
      if (allowedEthnicities.includes(keywordsArr[k])) {
        ethnicityString = keywordsArr[k];
        if (tagsArr.indexOf(ethnicityString) === -1) tagsArr.push(ethnicityString);
        break;
      }
    }

    // Find disability in keywords and add to tagsArr
    for (var d = 0; d < keywordsArr.length; d++) {
      if (allowedDisabilities.includes(keywordsArr[d])) {
        disabilityString = keywordsArr[d];
        if (tagsArr.indexOf(disabilityString) === -1) tagsArr.push(disabilityString);
        break;
      }
    }

    // Find socioeconomic in keywords and add to tagsArr
    for (var l = 0; l < keywordsArr.length; l++) {
      if (allowedSocioEconomic.includes(keywordsArr[l])) {
        lowerSocioEconomicBackgroundString = keywordsArr[l];
        if (tagsArr.indexOf(lowerSocioEconomicBackgroundString) === -1) tagsArr.push(lowerSocioEconomicBackgroundString);
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
      anythingElseImportant: str(data.anythingElseImportant),
      applicationDeadline: str(data.applicationDeadline),
      approvalFirst: bool(data.approvalFirst),
      author: str(data.author),
      bannerPic: str(data.bannerPic),
      bespokeOnly: bool(data.bespokeOnly),
      opportunityType: mappedCat,
      category: mappedCat,
      categoryTitle: str(data.categoryTitle),
      companyID: str(data.companyID) || 'S7IvlojyomcTNsUXlrqC',
      companyVerify: bool(data.companyVerify) || true,
      courseLocation: str(data.courseLocation),
      created: str(data.created) || 'S7IvlojyomcTNsUXlrqC',
      createdAt: str(data.createdAt),
      description: str(data.description),
      editedAt: str(data.editedAt),
      editor: str(data.editor) || 'scheduler',
      eventDate: str(data.eventDate),
      eventName: str(data.eventName),
      eventTime: str(data.eventTime),
      eventTimeEnd: str(data.eventTimeEnd),
      expiredDate: str(data.expiredDate),
      id: id(data.id),
      keywords: arr(data.keywords),
      lengthOfCourse: str(data.lengthOfCourse),
      link: str(data.link),
      location: str(data.location),
      locationName: str(data.locationName),
      notificated: bool(data.notificated),
      paidOrFreeCourses: str(data.paidOrFreeCourses),
      publishedAt: str(data.publishedAt),
      regionLocation: data.regionLocation === null ? null : str(data.regionLocation),
      remote: bool(data.remote),
      republish: bool(data.republish),
      schedulePost: str(data.schedulePost),
      status: str(data.status),
      supportSettings: arr(data.supportSettings),
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
      title: str(data.title),
      type: str(data.type) || 'announcements',
      ukWide: bool(data.ukWide),
      userClaps: arr(data.userClaps),
      userContentView: arr(data.userContentView),
      userLinkClick: arr(data.userLinkClick),
      usersFavouriteContent: arr(data.usersFavouriteContent),
      demographic: demographicObj,
      audienceLocation: str(data.audienceLocation)
    };
  }
