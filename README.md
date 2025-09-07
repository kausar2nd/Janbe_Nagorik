# Janbe Nagorik - Civic Empowerment Platform

**CivicTechChallenge25 - Interactive Prototype**

## The Big Picture: What Problem Are We Solving?

170+ million Bangladeshi citizens face significant barriers when trying to:

- **Understand their legal rights** - Complex legal language makes laws inaccessible
- **Navigate government services** - Scattered information across multiple offices and websites
- **Take legal action** - No guidance on how to file complaints or generate proper documents
- **Access information in their language** - Most official resources are only in English

**The Result?** Citizens often give up on pursuing their rights, leading to widespread civic disempowerment.

## Our Solution

**Janbe Nagorik** breaks down these barriers by providing:

- **Plain-language legal explanations** powered by actual Bangladeshi laws
- **Step-by-step government service guides** with real procedures and requirements
- **Automated document generation** that creates professional legal documents from simple questions
- **Full bilingual support** making everything accessible in both English and Bengali
- **Connected user journey** that guides citizens from question to actionable solution

A comprehensive bilingual (English/Bengali) civic empowerment platform that helps Bangladeshi citizens understand their rights, navigate government services, and generate legal documents. Built with actual Bangladeshi laws and real government procedures.

## Key Features

### **Gyan (Legal Knowledge Assistant)**

- Interactive chatbot powered by actual Bangladeshi laws
- Detailed answers with legal sources and citations
- Bilingual support (English/Bengali)
- Action buttons that connect to relevant services

### **Sheba (Government Service Guides)**

- Step-by-step guides for essential services
- Crowdsourced content with community suggestions
- Real government procedures (passport, birth certificate, trade license)
- Bilingual guide content with search functionality

### **Podokkhep (Smart Document Generator)**

- Generate professional legal documents and applications
- AI-powered form filling with guided questions
- PDF download functionality
- Templates based on actual legal formats

### **Bilingual Support**

- Seamless English ↔ Bengali language switching
- Complete UI translation including all content
- Language preference persistence
- Cultural adaptation for Bangladeshi users

## **Sample Usage**

### **Sample Questions for Gyan (Legal Chatbot):**

```bash
"My landlord refuses to return my security deposit"
"I bought a defective product, what are my rights?"
"How do I get information from a government office?"
"Someone cheated me financially, what can I do?"
"What are my rights as a tenant?"
"How do I file a complaint against poor service?"
```

### **Complete Demo Journey:**

1. **Start with Legal Question**: Ask "Can my landlord keep my security deposit?"
2. **Get Detailed Answer**: See response with legal sources from Premises Rent Act
3. **Follow Action Button**: Click "Next: Learn how to file a complaint"
4. **Learn the Process**: Follow step-by-step guide for filing General Diary
5. **Generate Document**: Click "Generate a GD Draft" and fill the form
6. **Download PDF**: Get professional document ready for submission

### **Language Toggle Test:**

- Click the 🌐 button in top navigation to switch to Bengali
- See all content translate instantly
- Try asking questions in Bengali: "আমার বাড়িওয়ালা জামানত ফেরত দিচ্ছে না"

## **Target Impact**

**Problem Addressed:** 170+ million Bangladeshi citizens face barriers accessing legal information and government services due to:

- Complex legal language and procedures
- Scattered information across multiple sources  
- Language barriers (official documents mostly in English)
- Lack of step-by-step guidance

**Solution Delivered:** A comprehensive digital platform that democratizes access to legal knowledge and government services through:

- Plain language explanations of complex laws
- Guided document generation
- Bilingual accessibility
- Community-driven content improvement

## **Technical Implementation**

### **Architecture:**

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (no frameworks for maximum compatibility)
- **Data**: JSON-based content management for easy updates
- **Features**: PDF generation, local storage, progressive enhancement

### **Legal Coverage:**

- Consumer Rights Protection Act 2009
- Right to Information Act 2009  
- Premises Rent Control Act 1991
- Penal Code 1860 (relevant sections)
- Family Courts Ordinance 2023
- Road Transport Act 2018
- Government service procedures

## **Project Structure**

```bash
├── index.html              # Main application entry point
├── styles.css              # Complete styling system
├── app.js                  # Core application logic
├── data/
│   ├── faq.json           # Legal Q&A with sources
│   ├── guides.json        # Government service guides  
│   ├── templates.json     # Document generation templates
│   └── languages.json     # Bilingual translations
├── instructions.md         # Detailed usage guide
└── README.md              # This file
```

## **Quick Start**

1. **Open**: Launch `index.html` in any modern web browser
2. **Navigate**: Use top navigation or click module cards
3. **Interact**: Try sample questions or browse guides
4. **Generate**: Create documents using the Podokkhep module
5. **Switch Language**: Click 🌐 to test Bengali interface

## **Innovation Highlights**

- **Legal Source Integration**: Every answer includes specific law sections and acts
- **Action-Oriented Design**: Responses include "next steps" that guide users to solutions
- **Document Automation**: Complex legal documents simplified into guided forms
- **Community Features**: Crowdsourced improvements and suggestions
- **Accessibility**: Full bilingual support with cultural adaptation
- **Progressive Enhancement**: Works on all devices, degrades gracefully

## **Functionality**

✅ **Fully Functional**: All features work end-to-end  
✅ **Real Data**: Based on actual Bangladeshi laws and procedures  
✅ **User Testing Ready**: Clear sample interactions provided  
✅ **Technical Excellence**: Clean, maintainable, well-documented code  
✅ **Social Impact**: Addresses real civic empowerment challenges  
