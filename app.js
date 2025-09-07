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
    initializeChatbot();
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

    // Logo click to go home
    document.querySelector('.nav-brand').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
    });
}

// Navigation functions
function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Get current active section for exit animation
    const currentActiveSection = document.querySelector('.section.active');

    // Update sections with animations
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    const newSection = document.getElementById(sectionName);

    // Always scroll to top when changing sections
    try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
        // Fallback for older browsers
        window.scrollTo(0, 0);
    }

    // Add entrance animation to new section
    newSection.style.animation = 'slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    newSection.classList.add('active');

    // Animate content elements within the section
    setTimeout(() => {
        const moduleCards = newSection.querySelectorAll('.module-card');
        const guideCards = newSection.querySelectorAll('.guide-card');
        const docButtons = newSection.querySelectorAll('.doc-type-btn');

        // Stagger animation for module cards
        moduleCards.forEach((card, index) => {
            card.style.animation = `slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Stagger animation for guide cards
        guideCards.forEach((card, index) => {
            card.style.animation = `slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            card.style.animationDelay = `${index * 0.08}s`;
        });

        // Stagger animation for document buttons
        docButtons.forEach((btn, index) => {
            btn.style.animation = `scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            btn.style.animationDelay = `${index * 0.05}s`;
        });

        // Animate chat interface if in gyan section
        if (sectionName === 'gyan') {
            const chatInterface = newSection.querySelector('.chat-interface');
            if (chatInterface) {
                chatInterface.style.animation = 'slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                chatInterface.style.animationDelay = '0.3s';
            }
        }

        // Animate forms if in protirodh section
        if (sectionName === 'protirodh') {
            // First reset the document generator to ensure clean state
            resetDocumentGenerator();

            // Then animate the document type buttons
            const docButtons = newSection.querySelectorAll('.doc-type-btn');
            docButtons.forEach((btn, index) => {
                btn.style.opacity = '0';
                btn.style.animation = `scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
                btn.style.animationDelay = `${index * 0.05}s`;
            });

            const forms = newSection.querySelectorAll('.generator-form, .template-form');
            forms.forEach((form, index) => {
                form.style.animation = 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                form.style.animationDelay = `${index * 0.1}s`;
            });
        }
    }, 200);

    currentSection = sectionName;

    // Special handling for different sections
    if (sectionName === 'gyan') {
        // Reset chat if needed
    } else if (sectionName === 'sheba') {
        showGuidesList();
    } else if (sectionName === 'protirodh') {
        // Reset is now handled in the animation block above
    }
}

// Chatbot functions
function initializeChatbot() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages && chatMessages.children.length === 0) {
        // Add initial bot message
        const initialMessage = `Hello! I'm your legal assistant powered by actual Bangladeshi laws. Ask me about your rights and I'll provide simple, sourced answers.

<b>Legal Coverage:</b> Consumer Rights Protection Act 2009, Right to Information Act 2009, Penal Code 1860, Premises Rent Control Act 1991, Family Courts Ordinance 2023, and Road Transport Act 2018 — plus essential public services (passport, birth certificate, trade license).

<div class="suggested-questions">
    <p><strong>Try asking about common issues:</strong></p>
    <button class="suggestion-btn" onclick="askQuestion('My landlord refuses to return my security deposit')">
        My landlord won't return my security deposit
    </button>
    <button class="suggestion-btn" onclick="askQuestion('I bought a defective product, what are my rights?')">
        I bought a defective product, what are my rights?
    </button>
    <button class="suggestion-btn" onclick="askQuestion('How do I get information from a government office?')">
        How do I get information from a government office?
    </button>
    <button class="suggestion-btn" onclick="askQuestion('How do I request information under the Right to Information Act 2009?')">
        How to request information under RTI 2009
    </button>
    <button class="suggestion-btn" onclick="askQuestion('We have a family dispute—what court hears maintenance or custody matters?')">
        Which court hears family disputes?
    </button>
</div>`;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot-message';
        messageDiv.innerHTML = `<div class="message-content">${initialMessage}</div>`;
        chatMessages.appendChild(messageDiv);
    }
}

function toggleChatbotFullscreen() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const fullscreenIcon = document.querySelector('.fullscreen-icon');
    const isFullscreen = chatbotContainer.classList.contains('fullscreen');

    console.log('Toggle fullscreen called, current state:', isFullscreen);

    if (isFullscreen) {
        // Exit fullscreen
        console.log('Exiting fullscreen mode');
        chatbotContainer.classList.remove('fullscreen');
        fullscreenIcon.textContent = '⛶';
        fullscreenIcon.parentElement.title = 'Enter Fullscreen';
        document.body.classList.remove('chatbot-fullscreen-active');
        document.documentElement.classList.remove('chatbot-fullscreen-active');

        // Reset any inline styles that might interfere
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.position = '';
        document.body.style.width = '';
    } else {
        // Enter fullscreen
        console.log('Entering fullscreen mode');
        chatbotContainer.classList.add('fullscreen');
        fullscreenIcon.textContent = '✕';
        fullscreenIcon.parentElement.title = 'Exit Fullscreen';
        document.body.classList.add('chatbot-fullscreen-active');
        document.documentElement.classList.add('chatbot-fullscreen-active');

        // Ensure the chat messages scroll to bottom
        setTimeout(() => {
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, 100);
    }
}
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
        addMessage(response.answer, 'bot', response.action, response.sources);
    }, 1000);
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addMessage(content, sender, action = null, sources = null) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message fade-in`;

    let actionButton = '';
    if (action) {
        actionButton = `<button class="action-button" onclick="handleChatAction('${action.target}')">${action.text}</button>`;
    }

    let sourcesHtml = '';
    if (sources && sources.length > 0) {
        const sourcesId = `sources-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sourcesHtml = `
            <div class="sources-toggle">
                <button class="toggle-sources-btn" onclick="toggleSources('${sourcesId}')">
                    <span class="toggle-icon">📖</span> Sources Used
                    <span class="toggle-arrow">▼</span>
                </button>
                <div class="sources-content" id="${sourcesId}" style="display: none;">
                    <ul class="sources-list">
                        ${sources.map(source => `<li>${source}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${content}</p>
            ${sourcesHtml}
            ${actionButton}
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function toggleSources(sourcesId) {
    const sourcesContent = document.getElementById(sourcesId);
    const toggleBtn = sourcesContent.previousElementSibling;
    const arrow = toggleBtn.querySelector('.toggle-arrow');

    if (sourcesContent.style.display === 'none') {
        sourcesContent.style.display = 'block';
        sourcesContent.style.animation = 'slideUp 0.3s ease-out forwards';
        arrow.textContent = '▲';
        arrow.style.transform = 'rotate(180deg)';
    } else {
        sourcesContent.style.animation = 'fadeOut 0.2s ease-out forwards';
        arrow.textContent = '▼';
        arrow.style.transform = 'rotate(0deg)';
        setTimeout(() => {
            sourcesContent.style.display = 'none';
        }, 200);
    }
}

function findAnswer(question) {
    const lowerQuestion = question.toLowerCase();

    // Check for exact or partial matches with the FAQ database
    for (const faq of faqData) {
        const faqKeywords = faq.question.toLowerCase();

        // Direct match check
        if (lowerQuestion.includes(faqKeywords.substring(0, 20)) ||
            faqKeywords.includes(lowerQuestion.substring(0, 20))) {
            return {
                answer: faq.answer,
                sources: faq.sources || [],
                action: faq.actionText ? {
                    text: faq.actionText,
                    target: faq.actionTarget
                } : null
            };
        }

        // Keyword-based matching for better coverage
        const questionWords = lowerQuestion.split(' ');
        const faqWords = faqKeywords.split(' ');
        let matchCount = 0;

        for (const word of questionWords) {
            if (word.length > 3 && faqWords.some(faqWord => faqWord.includes(word) || word.includes(faqWord))) {
                matchCount++;
            }
        }

        // If we have enough matching keywords, consider it a match
        if (matchCount >= 2) {
            return {
                answer: faq.answer,
                sources: faq.sources || [],
                action: faq.actionText ? {
                    text: faq.actionText,
                    target: faq.actionTarget
                } : null
            };
        }
    }

    return {
        answer: "I understand your question, but I don't have specific information about that topic in my current knowledge base. I can help with: Consumer Rights Protection Act 2009, Right to Information Act 2009, Penal Code 1860, Premises Rent Control Act 1991, Family Courts Ordinance 2023, and Road Transport Act 2018. Try asking about consumer rights, tenant issues, requesting information, basic criminal matters, family court basics, or road transport essentials. You can also browse our Service Guides for step-by-step instructions.",
        sources: [],
        action: null
    };
} function handleChatAction(target) {
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

    // Add "Suggest New Guide" section at the bottom
    const suggestNewSection = document.createElement('div');
    suggestNewSection.className = 'suggest-new-guide-section';
    suggestNewSection.innerHTML = `
        <div class="suggest-new-guide-card">
            <h3>Missing a Service Guide?</h3>
            <p>Help us expand our knowledge base by suggesting new guides for government services or legal processes.</p>
            <button class="suggest-new-btn" onclick="showNewGuideSuggestionForm()">
                Suggest a New Guide
            </button>
        </div>
    `;
    container.appendChild(suggestNewSection);
}

function showGuideDetail(guideId) {
    const guide = guidesData.find(g => g.id === guideId);
    if (!guide) return;

    currentGuide = guide;

    const container = document.getElementById('guidesContainer');
    const detail = document.getElementById('guideDetail');

    // Add fade out animation to container
    container.style.animation = 'fadeOut 0.3s ease-out forwards';

    setTimeout(() => {
        container.style.display = 'none';
        detail.style.display = 'block';
        detail.style.animation = 'slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';

        let stepsHtml = '';
        guide.steps.forEach((step, index) => {
            stepsHtml += `
                <div class="step" style="opacity: 0;">
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
            <div class="crowdsource-section">
                <div class="crowdsource-info">
                    <h4>📝 Help Improve This Guide</h4>
                    <p>Found something missing or incorrect? Help make this guide better for everyone!</p>
                </div>
                <button class="suggest-edit-btn" onclick="showSuggestionForm('${guide.id}')">
                    ✏️ Suggest an Edit
                </button>
            </div>
        `;

        // Animate steps with stagger
        setTimeout(() => {
            const steps = detail.querySelectorAll('.step');
            steps.forEach((step, index) => {
                step.style.animation = 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                step.style.animationDelay = `${index * 0.1}s`;
            });

            // Animate crowdsource section
            const crowdsourceSection = detail.querySelector('.crowdsource-section');
            if (crowdsourceSection) {
                crowdsourceSection.style.opacity = '0';
                crowdsourceSection.style.animation = 'slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                crowdsourceSection.style.animationDelay = `${steps.length * 0.1 + 0.2}s`;
            }
        }, 200);
    }, 300);
}

function showGuidesList() {
    const container = document.getElementById('guidesContainer');
    const detail = document.getElementById('guideDetail');

    // Add animation to go back to list
    detail.style.animation = 'fadeOut 0.3s ease-out forwards';

    setTimeout(() => {
        container.style.display = 'grid';
        container.style.animation = 'slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        detail.style.display = 'none';
        currentGuide = null;

        // Animate guide cards with stagger
        setTimeout(() => {
            const guideCards = container.querySelectorAll('.guide-card');
            guideCards.forEach((card, index) => {
                card.style.animation = 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                card.style.animationDelay = `${index * 0.05}s`;
            });
        }, 100);
    }, 300);
}

// Crowdsourcing functionality
function showSuggestionForm(guideId) {
    const modal = document.createElement('div');
    modal.className = 'suggestion-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🤝 Suggest Improvements</h3>
                <button class="close-modal" onclick="closeSuggestionModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Help make this guide better! Your suggestions will be reviewed by our regulatory body before being published.</p>
                
                <form class="suggestion-form">
                    <div class="form-group">
                        <label for="suggestionType">Type of Suggestion:</label>
                        <select id="suggestionType" required>
                            <option value="">Select type...</option>
                            <option value="add-step">Add a new step</option>
                            <option value="modify-step">Modify existing step</option>
                            <option value="remove-step">Remove a step</option>
                            <option value="update-info">Update information</option>
                            <option value="fix-error">Fix an error</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="stepNumber">Step Number (if applicable):</label>
                        <input type="number" id="stepNumber" min="1" placeholder="e.g., 3">
                    </div>
                    
                    <div class="form-group">
                        <label for="suggestionText">Your Suggestion:</label>
                        <textarea id="suggestionText" rows="6" required 
                                placeholder="Describe what you'd like to add, change, or remove. Be specific and provide reasons if possible."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="userEmail">Your Email (optional):</label>
                        <input type="email" id="userEmail" placeholder="your.email@example.com">
                        <small>We may contact you for clarification. Your email won't be shared publicly.</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="userExperience">Your Experience:</label>
                        <textarea id="userExperience" rows="3" 
                                placeholder="Briefly describe your experience with this process (optional but helpful)"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="closeSuggestionModal()">Cancel</button>
                <button class="submit-suggestion-btn" onclick="submitSuggestion('${guideId}')">
                    📤 Submit Suggestion
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.animation = 'fadeIn 0.3s ease-out forwards';

    // Animate modal content
    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    }, 100);
}

function closeSuggestionModal() {
    const modal = document.querySelector('.suggestion-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function submitSuggestion(guideId) {
    const suggestionType = document.getElementById('suggestionType').value;
    const stepNumber = document.getElementById('stepNumber').value;
    const suggestionText = document.getElementById('suggestionText').value;
    const userEmail = document.getElementById('userEmail').value;
    const userExperience = document.getElementById('userExperience').value;

    if (!suggestionType || !suggestionText.trim()) {
        alert('Please fill in the required fields (Type and Suggestion).');
        return;
    }

    // Submit suggestion to server
    const suggestionData = {
        guideId: guideId,
        type: suggestionType,
        stepNumber: stepNumber,
        suggestion: suggestionText,
        email: userEmail,
        experience: userExperience,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    console.log('Suggestion submitted:', suggestionData);

    // Show success message
    const modal = document.querySelector('.suggestion-modal');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = `
        <div class="success-message">
            <div class="success-icon">✅</div>
            <h4>Thank You!</h4>
            <p>Your suggestion has been submitted to our regulatory body for review.</p>
            <div class="suggestion-details">
                <p><strong>Submission ID:</strong> SUG-${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p><strong>Status:</strong> Pending Review</p>
                <p><strong>Estimated Review Time:</strong> 3-5 business days</p>
            </div>
            <p class="note">You'll receive an email notification once your suggestion is reviewed.</p>
        </div>
    `;

    const modalFooter = modal.querySelector('.modal-footer');
    modalFooter.innerHTML = `
        <button class="close-btn" onclick="closeSuggestionModal()">Close</button>
    `;

    setTimeout(() => {
        closeSuggestionModal();
    }, 5000); // Auto close after 5 seconds
}

function showNewGuideSuggestionForm() {
    const modal = document.createElement('div');
    modal.className = 'suggestion-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>💡 Suggest a New Guide</h3>
                <button class="close-modal" onclick="closeSuggestionModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Help expand our knowledge base! Suggest a new guide for a government service or legal process that we haven't covered yet.</p>
                
                <form class="suggestion-form">
                    <div class="form-group">
                        <label for="newGuideTitle">Guide Title:</label>
                        <input type="text" id="newGuideTitle" required 
                               placeholder="e.g., How to Get a Student Visa, Filing a Noise Complaint">
                    </div>
                    
                    <div class="form-group">
                        <label for="newGuideCategory">Category:</label>
                        <select id="newGuideCategory" required>
                            <option value="">Select category...</option>
                            <option value="Government Services">Government Services</option>
                            <option value="Legal">Legal</option>
                            <option value="Consumer Rights">Consumer Rights</option>
                            <option value="Business">Business</option>
                            <option value="Family Courts">Family Courts</option>
                            <option value="Road Safety">Road Safety</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="newGuideDescription">Brief Description:</label>
                        <textarea id="newGuideDescription" rows="3" required 
                                placeholder="Briefly describe what this guide would help people accomplish"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="newGuideReason">Why is this guide needed?</label>
                        <textarea id="newGuideReason" rows="4" required 
                                placeholder="Explain why this guide would be valuable. Have you or others struggled with this process?"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="newGuideSteps">Basic Steps (if you know them):</label>
                        <textarea id="newGuideSteps" rows="6" 
                                placeholder="If you're familiar with the process, list the basic steps (optional but helpful)"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="suggesterEmail">Your Email (optional):</label>
                        <input type="email" id="suggesterEmail" placeholder="your.email@example.com">
                        <small>We may contact you for more information. Your email won't be shared publicly.</small>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="closeSuggestionModal()">Cancel</button>
                <button class="submit-suggestion-btn" onclick="submitNewGuideSuggestion()">
                    🚀 Submit New Guide Suggestion
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.animation = 'fadeIn 0.3s ease-out forwards';

    // Animate modal content
    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    }, 100);
}

function submitNewGuideSuggestion() {
    const title = document.getElementById('newGuideTitle').value;
    const category = document.getElementById('newGuideCategory').value;
    const description = document.getElementById('newGuideDescription').value;
    const reason = document.getElementById('newGuideReason').value;
    const steps = document.getElementById('newGuideSteps').value;
    const email = document.getElementById('suggesterEmail').value;

    if (!title.trim() || !category || !description.trim() || !reason.trim()) {
        alert('Please fill in all required fields (Title, Category, Description, and Reason).');
        return;
    }

    // Submit new guide suggestion to server
    const newGuideData = {
        type: 'new-guide',
        title: title,
        category: category,
        description: description,
        reason: reason,
        suggestedSteps: steps,
        email: email,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    console.log('New guide suggestion submitted:', newGuideData);

    // Show success message
    const modal = document.querySelector('.suggestion-modal');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = `
        <div class="success-message">
            <div class="success-icon">🎉</div>
            <h4>Excellent Idea!</h4>
            <p>Your new guide suggestion has been submitted to our content team for evaluation.</p>
            <div class="suggestion-details">
                <p><strong>Guide Title:</strong> ${title}</p>
                <p><strong>Submission ID:</strong> NG-${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p><strong>Status:</strong> Under Review</p>
                <p><strong>Estimated Review Time:</strong> 1-2 weeks</p>
            </div>
            <p class="note">If approved, we'll research and create this guide. You'll be notified when it's published!</p>
        </div>
    `;

    const modalFooter = modal.querySelector('.modal-footer');
    modalFooter.innerHTML = `
        <button class="close-btn" onclick="closeSuggestionModal()">Close</button>
    `;

    setTimeout(() => {
        closeSuggestionModal();
    }, 6000); // Auto close after 6 seconds
}

function handleGuideAction(target) {
    showSection('protirodh');
    setTimeout(() => {
        selectDocumentType(target);
    }, 100);
}

// Document generator functions
function resetDocumentGenerator() {
    const generatorOptions = document.getElementById('generatorOptions');
    const documentForm = document.getElementById('documentForm');
    const generatedDocument = document.getElementById('generatedDocument');

    // Reset display states
    generatorOptions.style.display = 'block';
    documentForm.style.display = 'none';
    generatedDocument.style.display = 'none';

    // Clear any inline animation styles
    generatorOptions.style.animation = '';
    generatorOptions.style.opacity = '';
    generatorOptions.style.transform = '';

    documentForm.style.animation = '';
    documentForm.style.opacity = '';
    documentForm.style.transform = '';

    generatedDocument.style.animation = '';
    generatedDocument.style.opacity = '';
    generatedDocument.style.transform = '';

    // Reset document type buttons animation states
    const docButtons = generatorOptions.querySelectorAll('.doc-type-btn');
    docButtons.forEach(btn => {
        btn.style.animation = '';
        btn.style.opacity = '';
        btn.style.transform = '';
        btn.style.animationDelay = '';
    });

    // Reset form groups if they exist
    const formGroups = documentForm.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.style.animation = '';
        group.style.opacity = '';
        group.style.transform = '';
        group.style.animationDelay = '';
    });

    selectedDocumentType = null;
}

function backToDocumentTypes() {
    const optionsDiv = document.getElementById('generatorOptions');
    const formDiv = document.getElementById('documentForm');
    const generatedDiv = document.getElementById('generatedDocument');

    // Add fade out animation to current form
    formDiv.style.animation = 'fadeOut 0.3s ease-out forwards';
    generatedDiv.style.animation = 'fadeOut 0.3s ease-out forwards';

    setTimeout(() => {
        // Hide form and generated document
        formDiv.style.display = 'none';
        generatedDiv.style.display = 'none';

        // Show and animate document type options
        optionsDiv.style.display = 'block';
        optionsDiv.style.animation = 'slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';

        // Animate document type buttons with stagger
        setTimeout(() => {
            const docButtons = optionsDiv.querySelectorAll('.doc-type-btn');
            docButtons.forEach((btn, index) => {
                btn.style.opacity = '0';
                btn.style.animation = 'scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                btn.style.animationDelay = `${index * 0.05}s`;
            });
        }, 200);

        // Clear selected document type
        selectedDocumentType = null;
    }, 300);
}

function selectDocumentType(type) {
    selectedDocumentType = type;
    const template = documentTemplates[type];

    if (!template) {
        alert('Document template not found');
        return;
    }

    // Add fade out animation to options
    const optionsDiv = document.getElementById('generatorOptions');
    optionsDiv.style.animation = 'fadeOut 0.3s ease-out forwards';

    setTimeout(() => {
        optionsDiv.style.display = 'none';
        renderDocumentForm(template);

        const formDiv = document.getElementById('documentForm');
        formDiv.style.display = 'block';
        formDiv.style.animation = 'slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';

        // Animate form elements with stagger
        setTimeout(() => {
            const formElements = formDiv.querySelectorAll('.form-group');
            formElements.forEach((element, index) => {
                element.style.animation = 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                element.style.animationDelay = `${index * 0.1}s`;
                element.style.opacity = '0';
            });
        }, 100);
    }, 300);
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
        <button class="back-btn" onclick="backToDocumentTypes()">← Back to Document Types</button>
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
    try {
        const template = documentTemplates[selectedDocumentType];

        if (!template) {
            console.error('Template not found for:', selectedDocumentType);
            alert('Error: Template not found. Please try again.');
            return;
        }

        console.log('Generating document for type:', selectedDocumentType);
        console.log('Template:', template);

        const formData = new FormData(document.getElementById('documentFormElement'));
        let documentContent = template.template;

        console.log('Original template content:', documentContent);

        // Replace placeholders with form data
        template.fields.forEach(field => {
            const element = document.getElementById(field.name);
            const value = element ? (element.value || 'Not provided') : 'Not provided';
            const placeholder = `{${field.name}}`;

            console.log(`Replacing ${placeholder} with: ${value}`);
            documentContent = documentContent.replace(new RegExp(placeholder, 'g'), value);
        });

        // Replace special placeholders
        const currentDate = new Date().toLocaleDateString('en-BD');
        documentContent = documentContent.replace(/{currentDate}/g, currentDate);
        documentContent = documentContent.replace(/{stationName}/g, '[Police Station Name]');
        documentContent = documentContent.replace(/{officeName}/g, '[Office Name]');
        documentContent = documentContent.replace(/{officeAddress}/g, '[Office Address]');

        console.log('Final document content:', documentContent);

        if (!documentContent || documentContent.trim() === '') {
            console.error('Document content is empty after processing');
            alert('Error: Generated document is empty. Please check your inputs and try again.');
            return;
        }

        showGeneratedDocument(documentContent, template.title);
    } catch (error) {
        console.error('Error generating document:', error);
        alert('Error generating document: ' + error.message);
    }
}

function showGeneratedDocument(content, title) {
    try {
        console.log('Showing generated document:', title);
        console.log('Content length:', content.length);

        document.getElementById('documentForm').style.display = 'none';

        const container = document.getElementById('generatedDocument');

        if (!container) {
            console.error('Generated document container not found');
            alert('Error: Document container not found. Please refresh the page and try again.');
            return;
        }

        // Escape any potentially problematic characters in the title for onclick handlers
        const safeTitle = title.replace(/'/g, "\\'").replace(/"/g, '\\"');

        // Ensure content is properly formatted for display
        const formattedContent = content.replace(/\\n/g, '\n'); // Convert escaped newlines to actual newlines

        container.innerHTML = `
            <h3>Generated ${title}</h3>
            <div class="document-content">${formattedContent}</div>
            <div class="document-actions">
                <button class="download-pdf-btn" onclick="downloadDocumentPDF('${safeTitle}')">
                    📄 Download PDF
                </button>
                <button class="copy-btn" onclick="copyDocument()">
                    📋 Copy to Clipboard
                </button>
                <button class="new-document-btn" onclick="resetDocumentGenerator()">
                    ➕ Create New Document
                </button>
            </div>
        `;

        container.style.display = 'block';

        console.log('Document displayed successfully');

        // Scroll to the generated document
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        console.error('Error showing generated document:', error);
        alert('Error displaying document: ' + error.message);
    }
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

function downloadDocumentPDF(title) {
    try {
        // Get the document content
        const content = document.querySelector('.document-content').textContent;

        // Create new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // Set up document styling
        doc.setFont('helvetica');
        doc.setFontSize(12);

        // Add title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 20, 20);

        // Add a line under title
        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25);

        // Reset font for content
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        // Split content into lines and add to PDF
        const lines = doc.splitTextToSize(content, 170); // 170mm width for margins
        let yPosition = 35;
        const lineHeight = 6;
        const pageHeight = 280; // A4 height minus margins

        lines.forEach((line, index) => {
            // Check if we need a new page
            if (yPosition > pageHeight) {
                doc.addPage();
                yPosition = 20;
            }

            doc.text(line, 20, yPosition);
            yPosition += lineHeight;
        });

        // Add footer with generation info
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            doc.text(`Generated by Janbe Nagorik - ${new Date().toLocaleDateString()}`, 20, 290);
            doc.text(`Page ${i} of ${pageCount}`, 170, 290);
        }

        // Generate filename
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `${title.replace(/\s+/g, '_')}_${timestamp}.pdf`;

        // Download the PDF
        doc.save(filename);

        // Show success message
        const downloadBtn = document.querySelector('.download-pdf-btn');
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = '✅ Downloaded!';
        downloadBtn.style.background = '#28a745';

        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.style.background = '';
        }, 2000);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try copying the text instead.');
    }
}
