// Application State
let currentSection = 'home';
let currentGuide = null;
let selectedDocumentType = null;

// Data Storage
let faqData = [];
let guidesData = [];
let documentTemplates = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    loadData();
    setupEventListeners();
    showSection('home');
});

// Load all data
async function loadData() {
    try {
        const [faqResponse, guidesResponse, templatesResponse] = await Promise.all([
            fetch('./data/faq.json'),
            fetch('./data/guides.json'),
            fetch('./data/templates.json')
        ]);

        faqData = await faqResponse.json();
        guidesData = await guidesResponse.json();
        documentTemplates = await templatesResponse.json();

        console.log('Data loaded successfully');
        renderGuides();
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to hardcoded data if JSON files fail to load
        loadFallbackData();
    }
}

// Fallback data if JSON files are not available
function loadFallbackData() {
    faqData = [
        {
            id: 1,
            question: "Can my landlord keep my security deposit?",
            answer: "According to the Premises Rent Act of Bangladesh, your landlord cannot arbitrarily keep your security deposit. The deposit must be returned when you vacate the premises, minus any legitimate deductions for damages beyond normal wear and tear. If your landlord refuses to return the deposit without valid reasons, you have the right to file a complaint.",
            actionText: "Next: Learn how to file a complaint",
            actionTarget: "gd-financial-dispute"
        },
        {
            id: 2,
            question: "What are my consumer rights?",
            answer: "Under the Consumer Rights Protection Act 2009, you have the right to: 1) Receive goods and services as promised, 2) Get accurate information about products, 3) Fair pricing without deceptive practices, 4) Safe products that won't harm you, 5) Compensation for defective products or poor services. You can file complaints with the Department of Consumer Affairs or local magistrates.",
            actionText: "Next: Learn how to file a consumer complaint",
            actionTarget: "consumer-complaint"
        },
        {
            id: 3,
            question: "How do I file a police complaint?",
            answer: "You can file a police complaint (General Diary or FIR) at any police station. For cognizable offenses (serious crimes), police must register an FIR immediately. For non-cognizable offenses, they will file a General Diary. You have the right to get a copy of your complaint and a receipt with a case number.",
            actionText: "Next: See the step-by-step guide",
            actionTarget: "police-complaint"
        }
    ];

    guidesData = [
        {
            id: "gd-financial-dispute",
            title: "Filing a General Diary for Financial Disputes",
            description: "Step-by-step guide to file a GD when someone owes you money or refuses to return your deposit",
            category: "Legal",
            steps: [
                {
                    title: "Gather Required Documents",
                    description: "Collect your rental agreement, deposit receipt, any written communication with landlord, and your National ID card."
                },
                {
                    title: "Visit the Police Station",
                    description: "Go to the police station in the area where the dispute occurred. You can file a GD at any time during office hours."
                },
                {
                    title: "Request GD Form",
                    description: "Ask the duty officer for a General Diary form. Explain that you want to file a complaint about a financial dispute."
                },
                {
                    title: "Fill Out the Form",
                    description: "Provide complete details: your information, landlord's information, incident details, amount involved, and timeline of events."
                },
                {
                    title: "Submit and Get Receipt",
                    description: "Submit the form and ensure you get a copy with the GD number and official stamp. Keep this safe as proof of filing."
                }
            ],
            actionText: "Generate a GD Draft",
            actionTarget: "gd"
        },
        {
            id: "consumer-complaint",
            title: "Filing a Consumer Complaint",
            description: "How to file a complaint for defective products or poor services",
            category: "Consumer Rights",
            steps: [
                {
                    title: "Collect Evidence",
                    description: "Gather purchase receipts, product photos, warranty cards, and any communication with the seller."
                },
                {
                    title: "Contact the Seller First",
                    description: "Try to resolve the issue directly with the seller or service provider. Keep records of these attempts."
                },
                {
                    title: "Visit Consumer Affairs Office",
                    description: "If direct contact fails, visit your local Consumer Affairs office or the National Consumer Rights Protection office."
                },
                {
                    title: "File Written Complaint",
                    description: "Submit a written complaint with all supporting documents. Include timeline, financial loss, and desired resolution."
                }
            ],
            actionText: "Generate a Complaint Letter",
            actionTarget: "complaint"
        },
        {
            id: "police-complaint",
            title: "Filing a Police Complaint",
            description: "General guide for filing police complaints and FIRs",
            category: "Legal",
            steps: [
                {
                    title: "Determine Complaint Type",
                    description: "Decide if your issue requires an FIR (for serious crimes) or a General Diary (for other issues)."
                },
                {
                    title: "Prepare Your Statement",
                    description: "Write down all details: what happened, when, where, who was involved, and any witnesses."
                },
                {
                    title: "Visit Police Station",
                    description: "Go to the police station with jurisdiction over the area where the incident occurred."
                },
                {
                    title: "File the Complaint",
                    description: "Provide your statement to the duty officer. For FIRs, police must register immediately for cognizable offenses."
                },
                {
                    title: "Get Documentation",
                    description: "Ensure you receive a copy of your complaint with case/GD number and officer's signature."
                }
            ],
            actionText: "Generate a Complaint Draft",
            actionTarget: "complaint"
        }
    ];

    documentTemplates = {
        gd: {
            title: "General Diary Application",
            fields: [
                { name: "applicantName", label: "Your Full Name", type: "text", required: true },
                { name: "fatherName", label: "Father's Name", type: "text", required: true },
                { name: "address", label: "Your Address", type: "textarea", required: true },
                { name: "phone", label: "Phone Number", type: "tel", required: true },
                { name: "nid", label: "National ID Number", type: "text", required: true },
                { name: "respondentName", label: "Name of Person/Organization You're Complaining About", type: "text", required: true },
                { name: "respondentAddress", label: "Their Address (if known)", type: "textarea", required: false },
                { name: "incidentDate", label: "Date of Incident", type: "date", required: true },
                { name: "amount", label: "Amount Involved (if applicable)", type: "number", required: false },
                { name: "details", label: "Detailed Description of the Issue", type: "textarea", required: true }
            ],
            template: `To,
The Officer-in-Charge
{stationName} Police Station

Subject: Application for General Diary

Sir,

I, {applicantName}, son/daughter of {fatherName}, residing at {address}, would like to file a General Diary regarding the following matter:

Complainant Details:
Name: {applicantName}
Father's Name: {fatherName}
Address: {address}
Phone: {phone}
National ID: {nid}

Respondent Details:
Name: {respondentName}
Address: {respondentAddress}

Incident Details:
Date of Incident: {incidentDate}
Amount Involved: {amount} Taka (if applicable)

Description of the Matter:
{details}

I request you to kindly register this application as a General Diary and provide me with a copy for my records.

Thank you for your cooperation.

Yours faithfully,

{applicantName}
Date: {currentDate}
Phone: {phone}`
        },
        complaint: {
            title: "Complaint Letter",
            fields: [
                { name: "applicantName", label: "Your Full Name", type: "text", required: true },
                { name: "address", label: "Your Address", type: "textarea", required: true },
                { name: "phone", label: "Phone Number", type: "tel", required: true },
                { name: "email", label: "Email Address", type: "email", required: false },
                { name: "organizationName", label: "Organization/Person You're Complaining Against", type: "text", required: true },
                { name: "organizationAddress", label: "Their Address", type: "textarea", required: false },
                { name: "issueType", label: "Type of Issue", type: "select", options: ["Product Defect", "Poor Service", "Financial Dispute", "Other"], required: true },
                { name: "incidentDate", label: "Date of Incident/Purchase", type: "date", required: true },
                { name: "amount", label: "Financial Loss Amount", type: "number", required: false },
                { name: "details", label: "Detailed Description of the Problem", type: "textarea", required: true },
                { name: "resolution", label: "What Resolution Do You Want?", type: "textarea", required: true }
            ],
            template: `To,
The Concerned Authority
{organizationName}
{organizationAddress}

Subject: Formal Complaint Regarding {issueType}

Dear Sir/Madam,

I am writing to formally lodge a complaint regarding the following matter:

Complainant Information:
Name: {applicantName}
Address: {address}
Phone: {phone}
Email: {email}

Complaint Details:
Type of Issue: {issueType}
Date of Incident/Purchase: {incidentDate}
Financial Loss: {amount} Taka (if applicable)

Description of the Problem:
{details}

Requested Resolution:
{resolution}

I have attempted to resolve this matter directly but have not received a satisfactory response. I request your immediate attention to this matter and a prompt resolution.

I look forward to your response within 15 working days of receiving this complaint.

Thank you for your cooperation.

Yours sincerely,

{applicantName}
Date: {currentDate}
Phone: {phone}
Email: {email}`
        },
        application: {
            title: "Government Service Application",
            fields: [
                { name: "applicantName", label: "Your Full Name", type: "text", required: true },
                { name: "fatherName", label: "Father's Name", type: "text", required: true },
                { name: "address", label: "Your Address", type: "textarea", required: true },
                { name: "phone", label: "Phone Number", type: "tel", required: true },
                { name: "nid", label: "National ID Number", type: "text", required: true },
                { name: "serviceType", label: "Type of Service Requested", type: "select", options: ["Birth Certificate", "Death Certificate", "Trade License", "Passport", "Other"], required: true },
                { name: "purpose", label: "Purpose of Application", type: "textarea", required: true },
                { name: "urgency", label: "Urgency Level", type: "select", options: ["Normal", "Urgent", "Emergency"], required: true }
            ],
            template: `To,
The {officeName}
{officeAddress}

Subject: Application for {serviceType}

Sir/Madam,

I respectfully submit this application for {serviceType} with the following details:

Applicant Information:
Name: {applicantName}
Father's Name: {fatherName}
Address: {address}
Phone: {phone}
National ID: {nid}

Service Details:
Type of Service: {serviceType}
Purpose: {purpose}
Urgency: {urgency}

I have attached all required documents as per your guidelines. I request you to kindly process my application and issue the requested {serviceType} at your earliest convenience.

Thank you for your cooperation.

Yours faithfully,

{applicantName}
Date: {currentDate}
Phone: {phone}
NID: {nid}`
        }
    };

    renderGuides();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Navigation functions
function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');

    currentSection = sectionName;

    // Special handling for different sections
    if (sectionName === 'gyan') {
        // Reset chat if needed
    } else if (sectionName === 'sheba') {
        showGuidesList();
    } else if (sectionName === 'protirodh') {
        resetDocumentGenerator();
    }
}

// Chatbot functions
function askQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const question = input.value.trim();

    if (!question) return;

    // Add user message
    addMessage(question, 'user');
    input.value = '';

    // Find answer
    setTimeout(() => {
        const response = findAnswer(question);
        addMessage(response.answer, 'bot', response.action);
    }, 1000);
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addMessage(content, sender, action = null) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message fade-in`;

    let actionButton = '';
    if (action) {
        actionButton = `<button class="action-button" onclick="handleChatAction('${action.target}')">${action.text}</button>`;
    }

    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${content}</p>
            ${actionButton}
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function findAnswer(question) {
    const lowerQuestion = question.toLowerCase();

    for (const faq of faqData) {
        if (lowerQuestion.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' '))) {
            return {
                answer: faq.answer,
                action: faq.actionText ? {
                    text: faq.actionText,
                    target: faq.actionTarget
                } : null
            };
        }
    }

    return {
        answer: "I understand your question, but I don't have specific information about that topic in my current knowledge base. Please try asking about tenant rights, consumer protection, or police complaints. You can also browse our Service Guides section for step-by-step instructions on various legal procedures.",
        action: null
    };
}

function handleChatAction(target) {
    if (target.includes('gd') || target.includes('complaint')) {
        showSection('sheba');
        setTimeout(() => {
            showGuideDetail(target);
        }, 100);
    }
}

// Guides functions
function renderGuides() {
    const container = document.getElementById('guidesContainer');
    container.innerHTML = '';

    guidesData.forEach(guide => {
        const guideCard = document.createElement('div');
        guideCard.className = 'guide-card fade-in';
        guideCard.onclick = () => showGuideDetail(guide.id);

        guideCard.innerHTML = `
            <h3>${guide.title}</h3>
            <p class="guide-category">${guide.category}</p>
            <p>${guide.description}</p>
        `;

        container.appendChild(guideCard);
    });
}

function showGuideDetail(guideId) {
    const guide = guidesData.find(g => g.id === guideId);
    if (!guide) return;

    currentGuide = guide;

    const container = document.getElementById('guidesContainer');
    const detail = document.getElementById('guideDetail');

    container.style.display = 'none';
    detail.style.display = 'block';

    let stepsHtml = '';
    guide.steps.forEach((step, index) => {
        stepsHtml += `
            <div class="step">
                <h4>Step ${index + 1}: ${step.title}</h4>
                <p>${step.description}</p>
            </div>
        `;
    });

    let actionButton = '';
    if (guide.actionText && guide.actionTarget) {
        actionButton = `<button class="action-button" onclick="handleGuideAction('${guide.actionTarget}')">${guide.actionText}</button>`;
    }

    detail.innerHTML = `
        <button class="back-btn" onclick="showGuidesList()">← Back to Guides</button>
        <h3>${guide.title}</h3>
        <p>${guide.description}</p>
        <div class="guide-steps">
            ${stepsHtml}
        </div>
        <div class="text-center">
            ${actionButton}
        </div>
    `;
}

function showGuidesList() {
    document.getElementById('guidesContainer').style.display = 'grid';
    document.getElementById('guideDetail').style.display = 'none';
    currentGuide = null;
}

function handleGuideAction(target) {
    showSection('protirodh');
    setTimeout(() => {
        selectDocumentType(target);
    }, 100);
}

// Document generator functions
function resetDocumentGenerator() {
    document.getElementById('generatorOptions').style.display = 'block';
    document.getElementById('documentForm').style.display = 'none';
    document.getElementById('generatedDocument').style.display = 'none';
    selectedDocumentType = null;
}

function selectDocumentType(type) {
    selectedDocumentType = type;
    const template = documentTemplates[type];

    if (!template) {
        alert('Document template not found');
        return;
    }

    document.getElementById('generatorOptions').style.display = 'none';

    renderDocumentForm(template);

    document.getElementById('documentForm').style.display = 'block';
}

function renderDocumentForm(template) {
    const formContainer = document.getElementById('documentForm');

    let fieldsHtml = '';
    template.fields.forEach(field => {
        let inputHtml = '';

        if (field.type === 'textarea') {
            inputHtml = `<textarea id="${field.name}" ${field.required ? 'required' : ''}></textarea>`;
        } else if (field.type === 'select') {
            let optionsHtml = '<option value="">Select an option</option>';
            field.options.forEach(option => {
                optionsHtml += `<option value="${option}">${option}</option>`;
            });
            inputHtml = `<select id="${field.name}" ${field.required ? 'required' : ''}>${optionsHtml}</select>`;
        } else {
            inputHtml = `<input type="${field.type}" id="${field.name}" ${field.required ? 'required' : ''}>`;
        }

        fieldsHtml += `
            <div class="form-group">
                <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                ${inputHtml}
            </div>
        `;
    });

    formContainer.innerHTML = `
        <h3>${template.title}</h3>
        <form id="documentFormElement">
            ${fieldsHtml}
            <button type="submit" class="generate-btn">Generate Document</button>
        </form>
    `;

    document.getElementById('documentFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        generateDocument();
    });
}

function generateDocument() {
    const template = documentTemplates[selectedDocumentType];
    const formData = new FormData(document.getElementById('documentFormElement'));

    let documentContent = template.template;

    // Replace placeholders with form data
    template.fields.forEach(field => {
        const value = document.getElementById(field.name).value || 'Not provided';
        const placeholder = `{${field.name}}`;
        documentContent = documentContent.replace(new RegExp(placeholder, 'g'), value);
    });

    // Replace special placeholders
    const currentDate = new Date().toLocaleDateString('en-BD');
    documentContent = documentContent.replace(/{currentDate}/g, currentDate);
    documentContent = documentContent.replace(/{stationName}/g, '[Police Station Name]');
    documentContent = documentContent.replace(/{officeName}/g, '[Office Name]');
    documentContent = documentContent.replace(/{officeAddress}/g, '[Office Address]');

    showGeneratedDocument(documentContent, template.title);
}

function showGeneratedDocument(content, title) {
    document.getElementById('documentForm').style.display = 'none';

    const container = document.getElementById('generatedDocument');
    container.innerHTML = `
        <h3>Generated ${title}</h3>
        <div class="document-content">${content}</div>
        <div class="text-center">
            <button class="copy-btn" onclick="copyDocument()">Copy to Clipboard</button>
            <button class="new-document-btn" onclick="resetDocumentGenerator()">Create New Document</button>
        </div>
    `;

    container.style.display = 'block';
}

function copyDocument() {
    const content = document.querySelector('.document-content').textContent;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(content).then(() => {
            alert('Document copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Document copied to clipboard!');
    }
}
