const fs = require('fs');
const path = require('path');

// Copy the parseTextFile function from api-server.cjs for testing
const parseTextFile = (textContent) => {
  console.log('🔍 TEXT PARSER: Starting text file parsing...');
  
  const rawLines = textContent.split('\n');
  const lines = rawLines.map(line => line.trim());
  const result = {
    title: '',
    description: '',
    link: '',
    applicationDeadline: '',
    location: '',
    remote: false,
    ukWide: false,
    opportunityType: 'Opportunity',
    // Enhanced event-specific fields
    eventDate: '',
    eventTime: '',
    eventTimeEnd: '',
    eventName: '',
    anythingElseImportant: '',
    // Additional event details for comprehensive support
    eventDetails: {
      eventTitle: '',
      eventDescription: '',
      eventStartTime: '',
      eventEndTime: '',
      eventDuration: '',
      venueDetails: '',
      organizer: '',
      eventFormat: '',
      ticketPrice: '',
      bookingRegistration: '',
      capacity: '',
      targetAudience: '',
      eventType: '',
      refundPolicy: '',
      contactInformation: '',
      specialRequirements: ''
    },
    demographic: {
      industry: [],
      age: [],
      genderSexualPreference: [],
      ethnicity: [],
      disability: [],
      lowerSocioEconomicBackground: []
    }
  };

  // Iterate by index so we can gather multi-line values (lines until next key with ':')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes(':')) continue;

    const [key, ...valueParts] = line.split(':');
    let value = valueParts.join(':').trim();

    // Collect continuation lines (no colon) as part of the current value
    let j = i + 1;
    while (j < lines.length && !lines[j].includes(':')) {
      // Use rawLines to preserve original spacing/characters
      const cont = rawLines[j].trim();
      if (cont) value += '\n' + cont;
      j++;
    }
    // advance the outer loop to the last consumed line
    i = j - 1;

    console.log(`🔍 TEXT PARSER: Processing "${key.trim()}" = "${value}"`);
    
    switch (key.trim()) {
      case 'Application Deadline':
      case 'Application deadline':
        result.applicationDeadline = value;
        break;
        
      case 'Location':
        result.location = value;
        break;
        
      case 'Important Details':
        result.description = value;
        // Extract a meaningful title from the description
        if (!result.title && value) {
          // Look for company/role patterns in the text
          const companyMatch = value.match(/positions? at ([^®\.]+)/i);
          const roleMatch = value.match(/(Design|Developer|Engineer|Manager|Intern|Graduate|Apprentice)[^\.]*positions?/i);
          
          if (companyMatch) {
            const company = companyMatch[1].trim();
            const industry = result.demographic?.industry?.[0] || 'Role';
            result.title = `${industry} Opportunity at ${company}`;
          } else if (roleMatch) {
            result.title = roleMatch[0].trim();
          } else {
            // Fallback to first meaningful sentence
            const sentences = value.split('.');
            let titleSentence = sentences.find(s => 
              s.length > 20 && s.length < 100 && 
              !s.toLowerCase().includes('this opportunity')
            );
            
            if (titleSentence) {
              result.title = titleSentence.trim();
            } else {
              result.title = value.substring(0, 60) + '...';
            }
          }
        }
        break;
        
      case 'Remote':
        result.remote = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
        break;
        
      case 'UK Wide':
        result.ukWide = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
        break;
        
      case 'Industry':
        // Split comma-separated values and clean them
        result.demographic.industry = value.split(',')
          .map(item => item.trim())
          .filter(item => item);
        console.log(`🔍 TEXT PARSER: Parsed industries:`, result.demographic.industry);
        break;
        
      case 'Age':
        // Handle "All ages" or specific age ranges
        if (value.toLowerCase() === 'all ages') {
          result.demographic.age = ['All ages'];
        } else {
          result.demographic.age = value.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
        console.log(`🔍 TEXT PARSER: Parsed ages:`, result.demographic.age);
        break;
        
      case 'Gender & Sexual Preference':
        if (value.toLowerCase() === 'all genders & preferences') {
          result.demographic.genderSexualPreference = ['All genders & preferences'];
        } else {
          result.demographic.genderSexualPreference = value.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
        console.log(`🔍 TEXT PARSER: Parsed gender & sexual preference:`, result.demographic.genderSexualPreference);
        break;
        
      case 'Ethnicity':
        if (value.toLowerCase() === 'all ethnicities') {
          result.demographic.ethnicity = ['All ethnicities'];
        } else {
          result.demographic.ethnicity = value.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
        console.log(`🔍 TEXT PARSER: Parsed ethnicities:`, result.demographic.ethnicity);
        break;
        
      case 'Opportunity Type':
        result.opportunityType = value;
        break;
        
      case 'Disability':
        if (value.toLowerCase() === 'all disability') {
          result.demographic.disability = ['All disability'];
        } else {
          result.demographic.disability = value.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
        console.log(`🔍 TEXT PARSER: Parsed disability:`, result.demographic.disability);
        break;
        
      case 'Economic Background':
        if (value.toLowerCase() === 'all backgrounds') {
          result.demographic.lowerSocioEconomicBackground = ['All backgrounds'];
        } else {
          result.demographic.lowerSocioEconomicBackground = value.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
        console.log(`🔍 TEXT PARSER: Parsed economic background:`, result.demographic.lowerSocioEconomicBackground);
        break;
        
      case 'Region':
        // Add region to location if not already set
        if (!result.location) {
          result.location = value;
        }
        break;
        
      case 'Link':
        result.link = value;
        break;
        
      // === EVENT-SPECIFIC FIELDS ===
      case 'Event Title':
        result.eventDetails.eventTitle = value;
        // Use event title as main title if not already set
        if (!result.title) {
          result.title = value;
        }
        console.log(`🔍 TEXT PARSER: Set event title: ${value}`);
        break;
        
      case 'Event Description':
        result.eventDetails.eventDescription = value;
        // Also add to main description for compatibility
        if (!result.description) {
          result.description = value;
        }
        console.log(`🔍 TEXT PARSER: Set event description`);
        break;
        
      case 'Event Date':
        result.eventDate = value;
        // Store for potential use as deadline fallback
        console.log(`🔍 TEXT PARSER: Set event date: ${value}`);
        break;
        
      case 'Event Start Time':
        result.eventTime = value;
        result.eventDetails.eventStartTime = value;
        console.log(`🔍 TEXT PARSER: Set event start time: ${value}`);
        break;
        
      case 'Event End Time':
        result.eventTimeEnd = value;
        result.eventDetails.eventEndTime = value;
        console.log(`🔍 TEXT PARSER: Set event end time: ${value}`);
        break;
        
      case 'Event Duration':
        result.eventDetails.eventDuration = value;
        // Add to important details
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Duration: ${value}`;
        console.log(`🔍 TEXT PARSER: Set event duration: ${value}`);
        break;
        
      case 'Venue Details':
        result.eventDetails.venueDetails = value;
        // Add to important details for accessibility info
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Venue Details: ${value}`;
        console.log(`🔍 TEXT PARSER: Set venue details`);
        break;
        
      case 'Organizer':
        result.eventDetails.organizer = value;
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Organized by: ${value}`;
        console.log(`🔍 TEXT PARSER: Set organizer: ${value}`);
        break;
        
      case 'Event Format':
        result.eventDetails.eventFormat = value;
        // Set remote based on format
        if (value.toLowerCase().includes('online')) {
          result.remote = true;
        }
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Format: ${value}`;
        console.log(`🔍 TEXT PARSER: Set event format: ${value}`);
        break;
        
      case 'Ticket Price':
        result.eventDetails.ticketPrice = value;
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Price: ${value}`;
        console.log(`🔍 TEXT PARSER: Set ticket price: ${value}`);
        break;
        
      case 'Booking/Registration':
      case 'Booking':
      case 'Registration':
        result.eventDetails.bookingRegistration = value;
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Booking: ${value}`;
        console.log(`🔍 TEXT PARSER: Set booking/registration info`);
        break;
        
      case 'Capacity':
        result.eventDetails.capacity = value;
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Capacity: ${value}`;
        console.log(`🔍 TEXT PARSER: Set capacity: ${value}`);
        break;
        
      case 'Target Audience':
        result.eventDetails.targetAudience = value;
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Target Audience: ${value}`;
        console.log(`🔍 TEXT PARSER: Set target audience: ${value}`);
        break;
        
      case 'Event Type':
        result.eventDetails.eventType = value;
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Event Type: ${value}`;
        console.log(`🔍 TEXT PARSER: Set event type: ${value}`);
        break;
        
      case 'Refund Policy':
        result.eventDetails.refundPolicy = value;
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Refund Policy: ${value}`;
        console.log(`🔍 TEXT PARSER: Set refund policy`);
        break;
        
      case 'Contact Information':
        result.eventDetails.contactInformation = value;
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Contact: ${value}`;
        console.log(`🔍 TEXT PARSER: Set contact information`);
        break;
        
      case 'Special Requirements':
        result.eventDetails.specialRequirements = value;
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + `Requirements: ${value}`;
        console.log(`🔍 TEXT PARSER: Set special requirements`);
        break;
        
      case 'Anything else important':
      case 'Additional Information':
        // Append to existing important details
        result.anythingElseImportant += (result.anythingElseImportant ? '\n' : '') + value;
        console.log(`🔍 TEXT PARSER: Added additional important information`);
        break;
        
      default:
        console.log(`🔍 TEXT PARSER: Unhandled field "${key.trim()}" = "${value}"`);
        break;
    }
  }

  // Enhanced title generation for events
  if (!result.title) {
    if (result.eventDetails.eventTitle) {
      result.title = result.eventDetails.eventTitle;
    } else if (result.eventDetails.eventType && result.demographic.industry.length > 0) {
      result.title = `${result.demographic.industry[0]} ${result.eventDetails.eventType}`;
    } else if (result.eventDetails.eventType) {
      result.title = result.eventDetails.eventType;
    } else {
      result.title = result.opportunityType === 'Event' ? 'Creative Event' : 'Opportunity';
    }
  }

  // Use event date as application deadline if no specific deadline provided
  if (!result.applicationDeadline && result.eventDate) {
    result.applicationDeadline = result.eventDate;
    console.log(`🔍 TEXT PARSER: Using event date as deadline: ${result.applicationDeadline}`);
  }

  console.log('🔍 TEXT PARSER: Final parsed result:', JSON.stringify(result, null, 2));
  return result;
};

// Test the parser
console.log('=== TESTING ENHANCED EVENT PARSING ===\n');

const testFilePath = path.join(__dirname, 'test-comprehensive-event.txt');
const testContent = fs.readFileSync(testFilePath, 'utf8');

console.log('📁 Loading test file:', testFilePath);
console.log('📄 File content length:', testContent.length, 'characters\n');

const result = parseTextFile(testContent);

console.log('\n=== PARSING RESULTS ===');
console.log('Title:', result.title);
console.log('Opportunity Type:', result.opportunityType);
console.log('Event Date:', result.eventDate);
console.log('Event Times:', result.eventTime, '-', result.eventTimeEnd);
console.log('Location:', result.location);
console.log('Application Deadline:', result.applicationDeadline);
console.log('Demographics:', JSON.stringify(result.demographic, null, 2));
console.log('\n=== EVENT DETAILS ===');
console.log('Event Title:', result.eventDetails.eventTitle);
console.log('Event Type:', result.eventDetails.eventType);
console.log('Organizer:', result.eventDetails.organizer);
console.log('Ticket Price:', result.eventDetails.ticketPrice);
console.log('Capacity:', result.eventDetails.capacity);
console.log('Target Audience:', result.eventDetails.targetAudience);
console.log('\n=== ADDITIONAL INFO ===');
console.log('Anything Else Important:');
console.log(result.anythingElseImportant);

console.log('\n✅ Test completed successfully!');
