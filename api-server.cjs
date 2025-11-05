// Tag name to unique ID mapping for tags
const TAG_NAME_TO_ID = {
  "Advertising": "JcM1sqyxbJeyZsvXislN",
  "Marketing": "7zcvW4rUaiE9OCqGAf8f",
  "PR": "TwbKLH1maPxUpOMgo7av",
  "All industries": "IG7yzsOdsZcE1IttKMe8",
  "Arts": "NoUufyQpwT3qGsVQ7eKC",
  "Museums": "B00NlXT3BgZEcteyEBiQ",
  "Craft": "mVeikPlrGkeqUaNB3RUc",
  "Visual art": "D1lmqQmbFCGTby8HNHuK",
  "Culture": "ieHxxs2T7J0RTWQyDqBJ",
  "Graphic Design": "X2dTLDagIIrEBa40pwBL",
  "Design": "d25TFMPGin2nn2HUQ2ZS",
  "UX/UI Design": "XDeiUF1tpazrs6j8nJnt",
  "Fashion": "BSAM73pkE5akPm0aAWEi",
  "Film": "TQP5sTYaSao3hzKyHoqX",
  "Directing": "Ar0PFRfo2BizErhHzOB1", // Note: two codes for Directing
  "TV": "VluuJp7ikBDJvOZkCtMI",
  "Presenting": "eTJVhmAyjFVgLM1xobKQ",
  "Acting": "8EnwP2QmxphKt3xMydIv",
  "Production": "5HaU8j0qhkr55nMhkjD2",
  "Gaming": "gEODfWliFcVDPzPsaURG",
  "E-sport": "LnCw0jhbobNNgU9ndhil",
  "Animation": "jtwd6Also1z1gnxf7cCR",
  "Social Media": "2Bhal1Eyn4bfN719dFdM",
  "Content creation": "ajxlsmbwodNP5FfVPbvf",
  "Digital Media": "MyNQqi1cxSKxDzTFIUD1",
  "Media": "2Bhal1Eyn4bfN719dFdM",
  "Digitial": "MyNQqi1cxSKxDzTFIUD1",
  "Music": "H9gLcUeM65AkTEjk8IzH",
  "Podcasting": "nHy5ygseyuQtNDUVxn0J",
  "Radio": "VxeP5CwyZNoKYK3hF8eC",
  "Audio": "Uq7j4jOln0DVzS5VQZIl",
  "Photography": "bloZiCkPp97FWIUFqKcI",
  "Videography": "GjC6ilPu74QiVYRvRvgg",
  "Publishing": "ybNc8iJxaoo7TjoJyl71",
  "Writing": "OWX5xMlENH8zEqL6ZJzI",
  "Journalism": "ggclbk2GjvOUbFZUH4ym",
  "Theatre": "CG68CfUNdPkL8nJFzAih",
  "Performing Arts": "zxLgYbKNdPL4QwJecnIw",
  "Comedy": "gvTLKWX76UhDquYF9UuL",
  "Dance": "CV02t8BX1lZ1teVZQpdM",
  "VFX": "OKucTagUEJ5OSftS6DjH",
  "CVs & Portfolios": "Cfm3Qi6fKuYCnkrzNdqz",
  "money&finance": "Fsupenr6EtZuhFXCUGAY",
  "advice": "2OKsPtBRoqvFJQEkA9XU",
  "mentoring": "XYrofvp4aWJUN8q0kqbA",
  "interviews": "HH7ZuqesVJkUEgyYa9nL",
  "networking": "Vy6sKZydj6wJIj9DTETW"
  // ...add all other mappings as needed
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
    tags: Array.isArray(data.tags)
      ? data.tags.map(tag => TAG_NAME_TO_ID[tag] || tag)
      : [],
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
