# Janbe Nagorik - Interactive Prototype Instructions

## Overview

This is a fully functional interactive prototype for the "Janbe Nagorik" civic empowerment web application. The prototype demonstrates the complete user journey from asking legal questions to generating actionable documents.

Scope note (CivicTech25 prototype): The content is focused on six areas of Bangladeshi law — Tenancy (Premises Rent Act), Consumer Rights (2009), Right to Information (2009), Penal Code (fraud/cheating), Family Courts (prototype), and Road Transport (prototype) — plus essential public services (passport, birth certificate, trade license).

## Project Structure

```text
├── index.html          # Main HTML file
├── styles.css          # All styling
├── app.js             # Main JavaScript application
├── data/              # JSON data files
│   ├── faq.json       # Chatbot questions and answers
│   ├── guides.json    # Service guides data
│   └── templates.json # Document templates
└── instructions.md    # This file
```

## How to Test the Prototype

### 1. Starting the Application

- Open `index.html` in any modern web browser
- The landing page shows three main modules: Gyan, Sheba, and Protirodh

### 2. Testing the Complete User Journey

**Recommended Demo Flow:**

1. Click on "Gyan" module or use the navigation
2. Ask: "Can my landlord keep my security deposit?"
3. Click the "Next: Learn how to file a complaint" button in the chatbot response
4. This takes you to the "Filing a General Diary for Financial Disputes" guide
5. Click "Generate a GD Draft" at the bottom of the guide
6. Fill out the form and generate a document

### 3. Gyan Module (Legal Chatbot) - Test Questions

**Questions the chatbot can answer (based on specific Bangladeshi laws):**

- "My landlord refuses to return my security deposit" ✅ (Premises Rent Act 1991)
- "I bought a defective product, what are my rights?" ✅ (Consumer Rights Protection Act 2009)
- "How do I get information from a government office?" ✅ (Right to Information Act 2009)
- "Someone cheated me financially, what legal action can I take?" ✅ (Penal Code 1860)
- "What are my rights as a tenant?" ✅ (Premises Rent Act 1991)
- "How do I file a complaint with consumer protection?" ✅ (Consumer Rights Protection Act 2009)
- "How do I pursue maintenance/child custody in Family Court?" ✅ (Family Courts – prototype overview)
- "I received a traffic fine — what should I do?" ✅ (Road Transport Act – prototype basics)
- "Can police refuse to file my complaint?" ✅ (Criminal Procedure Code 1898)

**How to test:**

- Type questions in the chat input or click suggested questions
- Questions are matched using keyword detection
- Unknown questions get a helpful fallback response

### 4. Sheba Module (Service Guides) - Available Guides

**Available guides:**

1. **Filing a General Diary for Financial Disputes** (Legal - Premises Rent Act)
2. **Filing a Consumer Complaint** (Consumer Rights - Consumer Protection Act 2009)
3. **Filing a Police Complaint** (Legal - Criminal Procedure)
4. **Filing an RTI Application** (Government Transparency - RTI Act 2009)
5. **Family Court Basics (Prototype)** (Family Courts – demo content)
6. **Obtaining a Birth Certificate** (Government Services)
7. **Applying for a Passport** (Government Services)
8. **Getting a Trade License** (Business Services)
9. **Road Transport Basics (Prototype)** (Road Transport – demo content)

**How to test:**

- Click any guide card to see detailed steps
- Each guide has 4-5 steps with clear instructions
- Guides with document generation have action buttons

### 5. Protirodh Module (Document Generator) - Document Types

**Available document types:**

1. **General Diary (GD)** - For filing police complaints (financial disputes, etc.)
2. **Complaint Letter** - For consumer/service complaints to authorities
3. **Government Application** - For various government services
4. **RTI Application** - For requesting government information under RTI Act 2009

**Test inputs for GD form:**

- Name: "Mohammad Rahman"
- Father's Name: "Abdul Karim"
- Address: "123 Gulshan Avenue, Dhaka-1212"
- Phone: "01712345678"
- NID: "1234567890123"
- Respondent: "ABC Property Management"
- Incident Date: Any past date
- Amount: "50000"
- Details: "My landlord is refusing to return my security deposit of 50,000 taka despite fulfilling all lease conditions."

**Test inputs for Complaint Letter:**

- Name: "Fatima Begum"
- Address: "456 Dhanmondi Road, Dhaka-1205"
- Phone: "01798765432"
- Email: "<fatima@email.com>"
- Organization: "XYZ Electronics"
- Issue Type: "Product Defect"
- Details: "Purchased a refrigerator that stopped working after 2 days"
- Resolution: "Full refund or replacement with working product"

## Technical Features Implemented

### Frontend Technologies

- **Vanilla HTML5** with semantic structure
- **CSS3** with responsive design and animations
- **JavaScript ES6+** with modern features
- **Google Fonts** (Poppins) for professional typography

### Data Management

- **JSON files** for all content (can be easily replaced with API calls)
- **Fetch API** for loading data asynchronously
- **Fallback data** if JSON files fail to load

### User Experience Features

- **Responsive design** - works on desktop and mobile
- **Smooth animations** and transitions
- **Interactive navigation** with active states
- **Form validation** for required fields
- **Copy to clipboard** functionality for generated documents
- **Cross-module navigation** (chatbot → guides → document generator)

### Design Elements

- **Brand color scheme** (Green #005C41, Gold #FFC20E, Red #86341C)
- **Clean typography** with proper hierarchy
- **Card-based layouts** for easy scanning
- **Consistent spacing** and alignment
- **Accessible color contrasts**

## Content Structure

### Chatbot Logic

- Uses keyword matching for question recognition
- Each FAQ has an answer and optional action button
- Action buttons create smooth transitions between modules

### Guide System

- Each guide has steps with titles and descriptions
- Categories help organize different types of services
- Action buttons link to relevant document generators

### Document Templates

- Uses template literals with placeholder replacement
- Handles required and optional fields
- Generates professional-looking documents
- Includes current date insertion

## Demo Tips for Judges

### Key Points to Highlight

1. **Seamless Flow**: Show how users move from question → guide → document
2. **Realistic Content**: All legal information is based on actual Bangladeshi laws
3. **Professional Output**: Generated documents look like real legal forms
4. **User-Friendly**: Simple interface that non-technical users can navigate
5. **Comprehensive**: Covers multiple legal/civic scenarios

### Common Issues to Avoid

- Don't type random text in chatbot - use the provided test questions
- Allow time for loading animations to complete
- If JSON files don't load, the app will use fallback data automatically
- Test in a modern browser (Chrome, Firefox, Safari, Edge)

## Browser Compatibility

- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: Works on iOS Safari and Android Chrome
- **Features used**: Fetch API, ES6+ JavaScript, CSS Grid/Flexbox

## File Dependencies

All files are self-contained with no external dependencies except:

- Google Fonts (loads from CDN)
- All other resources are local

This prototype successfully demonstrates the core concept of civic empowerment through an integrated legal assistance platform.
