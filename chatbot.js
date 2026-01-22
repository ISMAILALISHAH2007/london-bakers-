class SweetHeavenChatbot {
    constructor() {
        this.responses = {
            greetings: [
                "Hello! Welcome to Sweet Heaven. How can I assist you today? 🍰",
                "Hi there! Ready to explore our heavenly treats? 🎂",
                "Greetings! I'm here to help with your patisserie journey. 🧁"
            ],
            menu: [
                "We offer a wide range of artisanal pastries, cakes, and bespoke creations. Check our Boutique section for the full collection!",
                "Our menu includes signature cakes, tarts, macarons, and freshly baked bread. What are you craving today?",
                "From Mille-Feuille to bespoke wedding cakes, we have something for every occasion. Visit our products page to see everything!"
            ],
            hours: [
                "We're open daily from 7 AM to 9 PM. Weekend hours are 8 AM to 10 PM.",
                "Our atelier welcomes you from dawn till dusk: 7 AM - 9 PM on weekdays, 8 AM - 10 PM on weekends.",
                "Sweet Heaven operates 7 AM to 9 PM Monday through Friday, and 8 AM to 10 PM on Saturday and Sunday."
            ],
            delivery: [
                "We offer delivery within the city. Orders placed before 3 PM are delivered same day!",
                "Delivery is available for orders over $50. Same-day delivery for orders placed before 3 PM.",
                "Yes! We deliver. Free delivery for orders over $100. Otherwise, it's a flat $10 fee."
            ],
            custom: [
                "Our Bespoke Lab can create custom cakes for any occasion. Minimum 48 hours notice required.",
                "Absolutely! We specialize in custom creations. Visit our Bespoke Lab section to design your dream cake.",
                "Custom orders are our specialty! We need at least 2 days notice for bespoke creations."
            ],
            ingredients: [
                "We use only the finest ingredients: French butter, Belgian chocolate, and organic fruits.",
                "All our products are made with premium, locally-sourced ingredients and European imports.",
                "Quality is our priority: organic flour, free-range eggs, and seasonal fruits in every creation."
            ],
            pricing: [
                "Our prices range from $6 for individual pastries to $200+ for custom cakes. Check our products for specific pricing.",
                "Prices vary by item. Individual treats start at $6, while custom creations begin at $75.",
                "You'll find detailed pricing on each product page. Most individual items are $6-$25."
            ],
            events: [
                "We cater events! From intimate gatherings to weddings, our pastry chefs create memorable spreads.",
                "Yes, we provide catering for events. Minimum order of $300 for event catering.",
                "Our event catering starts at $25 per person. Contact us for a customized quote!"
            ],
            location: [
                "📍 We're located at 75 Rue du Faubourg Saint-Honoré, Paris, France 75008",
                "Find us in Paris at 75 Rue du Faubourg Saint-Honoré. We're in the heart of the city!",
                "Our atelier is at 75 Rue du Faubourg Saint-Honoré, Paris. Come visit us!"
            ],
            contact: [
                "📞 Call us at +33 1 23 45 67 89\n✉️ Email: hello@sweetheaven.com",
                "Reach us at +33 1 23 45 67 89 or email hello@sweetheaven.com",
                "Contact: +33 1 23 45 67 89 | hello@sweetheaven.com"
            ],
            fallback: [
                "I'm not sure about that. Would you like to speak with our human concierge?",
                "That's a great question! Let me connect you with our team for a detailed answer.",
                "Hmm, I need to check on that. In the meantime, browse our collection or contact our team directly."
            ]
        };
        
        this.init();
    }
    
    init() {
        this.chatbotWidget = document.getElementById('chatbotWidget');
        this.chatbotMessages = document.getElementById('chatbotMessages');
        this.chatbotInput = document.getElementById('chatbotInput');
        
        // Auto-open after 10 seconds
        setTimeout(() => {
            if (!localStorage.getItem('chatbotOpened')) {
                this.toggleChatbot();
                localStorage.setItem('chatbotOpened', 'true');
            }
        }, 10000);
        
        // Initial greeting after 2 seconds
        setTimeout(() => {
            this.addBotMessage(this.getRandomResponse('greetings'));
        }, 2000);
        
        // Enter key support
        if (this.chatbotInput) {
            this.chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatbotMessage();
                }
            });
        }
    }
    
    toggleChatbot() {
        if (this.chatbotWidget) {
            this.chatbotWidget.classList.toggle('active');
        }
    }
    
    sendChatbotMessage() {
        const message = this.chatbotInput.value.trim();
        
        if (message) {
            this.addUserMessage(message);
            this.chatbotInput.value = '';
            
            this.showTyping();
            
            setTimeout(() => {
                this.hideTyping();
                this.processMessage(message);
            }, 1000 + Math.random() * 1000);
        }
    }
    
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let responseType = 'fallback';
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            responseType = 'greetings';
        } else if (lowerMessage.includes('menu') || lowerMessage.includes('what do you have') || lowerMessage.includes('offer') || lowerMessage.includes('product')) {
            responseType = 'menu';
        } else if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
            responseType = 'hours';
        } else if (lowerMessage.includes('deliver') || lowerMessage.includes('shipping') || lowerMessage.includes('ship')) {
            responseType = 'delivery';
        } else if (lowerMessage.includes('custom') || lowerMessage.includes('bespoke') || lowerMessage.includes('special order')) {
            responseType = 'custom';
        } else if (lowerMessage.includes('ingredient') || lowerMessage.includes('organic') || lowerMessage.includes('fresh')) {
            responseType = 'ingredients';
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
            responseType = 'pricing';
        } else if (lowerMessage.includes('event') || lowerMessage.includes('cater') || lowerMessage.includes('wedding')) {
            responseType = 'events';
        } else if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('address')) {
            responseType = 'location';
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
            responseType = 'contact';
        }
        
        const response = this.getRandomResponse(responseType);
        this.addBotMessage(response);
    }
    
    getRandomResponse(type) {
        const responses = this.responses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.textContent = message;
        this.chatbotMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot';
        messageElement.textContent = message;
        this.chatbotMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-typing active';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        this.chatbotMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        if (this.chatbotMessages) {
            this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.chatbot = new SweetHeavenChatbot();
});

// Global functions for chatbot widget
window.toggleChatbot = function() {
    if (window.chatbot) {
        window.chatbot.toggleChatbot();
    }
};

window.sendChatbotMessage = function() {
    if (window.chatbot) {
        window.chatbot.sendChatbotMessage();
    }
};