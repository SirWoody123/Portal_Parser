// Tag name to unique ID mapping for tags
const TAG_NAME_TO_ID = {
  // --- KEYWORDS (from test data & script) ---
  "apprentice": "keyword_apprentice",
  "coding": "keyword_coding",
  "test": "keyword_test",
  "google-apps-script": "keyword_google_apps_script",
  "railway": "keyword_railway",
  "deployment": "keyword_deployment",
  "integration": "keyword_integration",
  "bootcamp": "keyword_bootcamp",
  "javascript": "keyword_javascript",
  "react": "keyword_react",
  "nodejs": "keyword_nodejs",
  "full-stack": "keyword_full_stack",
  "web": "keyword_web",
  "design": "keyword_design",
  "student": "keyword_student",
  "developer": "keyword_developer",
  "junior": "keyword_junior",
  "job": "keyword_job",
  "document": "keyword_document",
  "opportunity": "keyword_opportunity",
  "Software Development": "industry_software_development",
  "Technology": "industry_technology",
  "Web Development": "industry_web_development",
  "Education": "industry_education",
  "General": "industry_general",
  // --- INDUSTRIES ---
  "All Creative Industries": "industry_all_creative",
  "Acting": "industry_acting",
  "Advertising": "industry_advertising",
  "Animation": "industry_animation",
  "Architecture": "industry_architecture",
  "Arts": "industry_arts",
  "Audio": "industry_audio",
  "Comedy": "industry_comedy",
  "Content Creation": "industry_content_creation",
  "Craft": "industry_craft",
  "Culture": "industry_culture",
  "Dance": "industry_dance",
  "Design": "industry_design",
  "Digital": "industry_digital",
  "Directing": "industry_directing",
  "E-Sport": "industry_esport",
  "Fashion": "industry_fashion",
  "Film": "industry_film",
  "Gaming": "industry_gaming",
  "Graphic Design": "industry_graphic_design",
  "Heritage": "industry_heritage",
  "Journalism": "industry_journalism",
  "Marketing": "industry_marketing",
  "Media": "industry_media",
  "Museum": "industry_museum",
  "Music": "industry_music",
  "Performing Arts": "industry_performing_arts",
  "Photography": "industry_photography",
  "Podcasting": "industry_podcasting",
  "PR": "industry_pr",
  "Presenting": "industry_presenting",
  "Publishing": "industry_publishing",
  "Radio": "industry_radio",
  "Social Media": "industry_social_media",
  "Theatre": "industry_theatre",
  "TV": "industry_tv",
  "UX/UI Design": "industry_ux_ui_design",
  "VFX": "industry_vfx",
  "Videography": "industry_videography",
  "Visual Art": "industry_visual_art",
  "Writing": "industry_writing",

  // --- CATEGORIES ---
  "Apprenticeship": "category_apprenticeship",
  "Competition/Grant": "category_competition_grant",
  "Course": "category_course",
  "Freelance role": "category_freelance_role",
  "Internship": "category_internship",
  "Junior full-time role": "category_junior_full_time_role",
  "Junior part-time role": "category_junior_part_time_role",
  "Mentoring": "category_mentoring",
  "Opportunity": "category_opportunity",
  "Runner role": "category_runner_role",
  "Training scheme": "category_training_scheme",
  "Work experience": "category_work_experience",

  // --- AGES ---
  "21": "age_21",
  "22": "age_22",
  "23": "age_23",
  "24": "age_24",
  "25": "age_25",
  "Over 18": "age_over_18",
  "Under 18": "age_under_18",
  "Over 25": "age_over_25",
  "16 and under": "age_16_and_under",

  // --- GENDERS ---
  "All genders & preferences": "gender_all",
  "Male": "gender_male",
  "Female": "gender_female",
  "Non-binary": "gender_non_binary",
  "Transgender": "gender_transgender",
  "Intersex": "gender_intersex",
  "Other": "gender_other",
  "Prefer not to say": "gender_prefer_not_to_say",

  // --- ETHNICITIES ---
  "All ethnicities": "ethnicity_all",
  "White": "ethnicity_white",
  "Black": "ethnicity_black",
  "Asian": "ethnicity_asian",
  "Mixed": "ethnicity_mixed",
  "Other": "ethnicity_other",
  "Prefer not to say": "ethnicity_prefer_not_to_say",

  // --- DISABILITIES ---
  "All disability": "disability_all",
  "Chronic illness": "disability_chronic_illness",
  "Mental health": "disability_mental_health",
  "Neurodiversity": "disability_neurodiversity",
  "Physical disability": "disability_physical",

  // --- SOCIO-ECONOMIC BACKGROUNDS ---
  "20fXkU9RdlTlpfcS5K5D": "socio_all_backgrounds",
  "V9J6aDjeQc7hIePqgsCh": "socio_lower_socio_economic",
};
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { readFileSync } = require('fs');
const { join } = require('path');

console.log('Script start');

// Configuration
const config = {
  port: process.env.PORT || 8080,
  firebaseProjectUrl: process.env.FIREBASE_DATABASE_URL || 'https://eric-staging-portal.firebaseio.com',
  serviceAccountPath: process.env.SERVICE_ACCOUNT_PATH || 'serviceAccountKey.json'
};


// Build service account object from environment variables
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebaseProjectUrl,
  });
  console.log(`Firebase initialized with project: ${config.firebaseProjectUrl}`);
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Transforms data from the standalone parser format to the master portal format.
 * @param {Object} data The data from the standalone parser.
 * @returns {Object} The transformed data for the master portal.
 */
const transformData = (data) => {
  // Always use this companyID and created value
  const fixedCompanyID = 'S7IvlojyomcTNsUXlrqC';
  // --- TAGS LOGIC ---
  function getTagCode(tag) {
    return TAG_NAME_TO_ID[tag] || `UNMAPPED_${String(tag)}`;
  }
  let tags = [];
  // Collect tags from tags array or tags.tags
  if (Array.isArray(data.tags)) {
    tags = data.tags.map(getTagCode);
  } else if (data.tags && typeof data.tags === 'object' && Array.isArray(data.tags.tags)) {
    tags = data.tags.tags.map(getTagCode);
  }

  // --- DEMOGRAPHIC FIELDS AS TAGS ---
  // Helper to add a value if not empty/undefined/null
  function addTagValue(val) {
    if (Array.isArray(val)) {
      val.forEach(v => { if (v) tags.push(getTagCode(v)); });
    } else if (val) {
      tags.push(getTagCode(val));
    }
  }
  // Try to get demographic fields from tags.demographic or demographic
  const demo = (data.tags && data.tags.demographic) ? data.tags.demographic : (data.demographic || {});
  addTagValue(demo.age);
  addTagValue(demo.genderSexualPreference);
  addTagValue(demo.ethnicity);
  addTagValue(demo.disability);
  addTagValue(demo.lowerSocioEconomicBackground);

  // Deduplicate tags array
  tags = Array.from(new Set(tags));

  return {
    // Required fields from actual portal format
    anythingElseImportant: data.anythingElseImportant ?? '',
    applicationDeadline: data.applicationDeadline || '',
    author: data.author || '',
    bannerPic: data.bannerPic || '',
    category: data.category || '',
    categoryTitle: data.categoryTitle || '',
    opportunityType: data.opportunityType || '',
    companyID: fixedCompanyID,
    companyVerify: data.companyVerify ?? true,
    courseLocation: data.courseLocation || '',
    created: fixedCompanyID,
    createdAt: data.createdAt || '',
    description: data.description || '',
    editedAt: data.editedAt || '',
    editor: data.editor || 'scheduler',
    id: data.id || '',
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    lengthOfCourse: data.lengthOfCourse || '',
    link: data.link || '',
    paidOrFreeCourses: data.paidOrFreeCourses || '',
    publishedAt: data.publishedAt || '',
    schedulePost: data.schedulePost || '',
    status: data.status || 'expired',
    tags: tags,
    demographic: (typeof data.tags === 'object' && data.tags.demographic)
      ? data.tags.demographic
      : (data.demographic || {}),
    title: data.title || '',
    type: data.type || 'announcements',
    userClaps: Array.isArray(data.userClaps) ? data.userClaps : [],
    userContentView: Array.isArray(data.userContentView) ? data.userContentView : [],
    // Optional/extra fields for compatibility
    approvalFirst: data.approvalFirst ?? false,
    bespokeOnly: data.bespokeOnly ?? false,
    eventDate: data.eventDate || '',
    eventName: data.eventName || '',
    eventTime: data.eventTime || '',
    eventTimeEnd: data.eventTimeEnd || '',
    expiredDate: data.expiredDate || '',
    location: data.location || '',
    locationName: data.locationName || '',
    notificated: data.notificated ?? false,
    regionLocation: data.regionLocation ?? null,
    remote: data.remote ?? false,
    republish: data.republish ?? false,
    supportSettings: Array.isArray(data.supportSettings) ? data.supportSettings : [],
    ukWide: data.ukWide ?? false,
    userLinkClick: Array.isArray(data.userLinkClick) ? data.userLinkClick : [],
    usersFavouriteContent: Array.isArray(data.usersFavouriteContent) ? data.usersFavouriteContent : [],
  };
};

/**
 * Endpoint to receive opportunity data from the standalone parser.
 */
app.post('/opportunities', async (req, res) => {
  try {
    const opportunityData = req.body;
    console.log('Received opportunity data:', {
      id: opportunityData.id,
      type: opportunityData.opportunityType,
      title: opportunityData.title
    });

    // 1. Transform the data
    const transformedData = transformData(opportunityData);

    // 2. Save to master portal's Firebase in the new structure
    // announcements_2 (collection) > list (collection) > {id} (document)
    const docId = transformedData.id || undefined;
    let docRef;
    if (docId) {
      docRef = await db.collection('announcements_2').doc('list').collection('list').doc(docId).set(transformedData);
    } else {
      // fallback: auto-generate ID if not present
      docRef = await db.collection('announcements_2').doc('list').collection('list').add(transformedData);
    }

    console.log(`✅ Successfully saved to master portal: announcements_2/list/list/${docId || '[auto-id]'}`);
    console.log('Transformed data:', transformedData);

    res.status(200).json({
      message: 'Data received and processed successfully.',
      masterPortalDocId: docId || '[auto-id]',
      collectionPath: 'announcements_2/list/list',
      data: transformedData,
    });
  } catch (error) {
    console.error('❌ Error processing opportunity:', error);
    res.status(500).json({
      error: 'Error processing request.',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    config: {
      port: config.port,
      firebaseProject: config.firebaseProjectUrl
    }
  });
});

console.log('Starting server...');
app.listen(config.port, () => {
  console.log(`🚀 API Bridge server listening at http://localhost:${config.port}`);
  console.log(`📊 Health check available at http://localhost:${config.port}/health`);
  console.log(`🔗 Master portal Firebase: ${config.firebaseProjectUrl}`);
});
