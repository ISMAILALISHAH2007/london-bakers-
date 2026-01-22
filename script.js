// ========== COMPLETE FIXED script.js ==========
let cart = JSON.parse(localStorage.getItem('sweetHeavenCart')) || [];
let currentSlide = 0;
let slideInterval;

// Global product database for modal details
const productsDatabase = [
    { 
        id: 1, 
        name: "Mille-Feuille Classique", 
        category: "pastries", 
        price: 18.00, 
        image: "https://images.pexels.com/photos/2693447/pexels-photo-2693447.jpeg?auto=compress&cs=tinysrgb&w=400", 
        description: "Layers of crispy puff pastry and rich vanilla diplomat cream.", 
        badge: "Bestseller" 
    },
    { 
        id: 2, 
        name: "Framboise Tart", 
        category: "tarts", 
        price: 16.00, 
        image: "https://images.pexels.com/photos/461431/pexels-photo-461431.jpeg?auto=compress&cs=tinysrgb&w=400", 
        description: "Fresh raspberries atop a buttery shortcrust shell.", 
        badge: "Seasonal" 
    },
    { 
        id: 3, 
        name: "Chocolate Ganache Cake", 
        category: "cakes", 
        price: 22.00, 
        image: "https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=400", 
        description: "Decadent dark chocolate layers with silk ganache." 
    }
];

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Loaded - Initializing...");
    
    initNavbar();
    initCart();
    initHeroSlider();
    initBespokeLab();
    
    // Initialize based on page
    if (document.getElementById('feedbackForm')) {
        initFeedbackForm();
    }
    
    // Update cart count on page load
    updateCartCount();
    
    // Update cart display if sidebar is visible
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar && cartSidebar.classList.contains('active')) {
        updateCartDisplay();
    }
    
    console.log("Cart items on load:", cart);
});

// ========== NAVBAR FUNCTIONS ==========
function initNavbar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ========== CART FUNCTIONS ==========
function initCart() {
    console.log("Initializing cart...");
    
    // Cart icon click
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        console.log("Cart icon found and event listener added");
    }
    
    // Close cart button
    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCart);
    }
}

function toggleCart() {
    console.log("Toggle cart called");
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
        console.log("Cart sidebar toggled, active:", cartSidebar.classList.contains('active'));
        updateCartDisplay();
    } else {
        console.error("Cart sidebar not found!");
    }
}

function addToCart(product) {
    console.log("Adding to cart:", product);
    
    if (!product || !product.name) {
        console.error("Invalid product object");
        showToast("Product information is missing!");
        return;
    }
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log("Updated existing item quantity:", existingItem);
    } else {
        // Add new item to cart
        const newItem = {
            id: product.id || Date.now(),
            name: product.name,
            price: product.price || 0,
            image: product.image || 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: product.description || '',
            quantity: 1
        };
        cart.push(newItem);
        console.log("Added new item:", newItem);
    }
    
    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart!`);
    
    // Update cart display if sidebar is open
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar && cartSidebar.classList.contains('active')) {
        updateCartDisplay();
    }
}

function updateCartItem(id, change) {
    console.log("Updating cart item:", id, change);
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
            console.log("Removed item from cart:", id);
        }
        
        saveCart();
        updateCartCount();
        updateCartDisplay();
    }
}

function removeFromCart(id) {
    console.log("Removing from cart:", id);
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        countElement.textContent = totalItems;
        console.log("Cart count updated:", totalItems);
    }
}

function updateCartDisplay() {
    console.log("Updating cart display...");
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span:last-child');
    
    if (!cartItems || !cartTotal) {
        console.error("Cart elements not found!");
        return;
    }
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #777; padding: 40px 0;">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        console.log("Cart is empty");
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">
                <div class="cart-item-details" style="flex: 1;">
                    <div class="cart-item-name" style="font-weight: 600; margin-bottom: 5px;">${item.name}</div>
                    <div class="cart-item-price" style="color: var(--gold); font-weight: 700; margin-bottom: 10px;">$${itemTotal.toFixed(2)}</div>
                    <div class="cart-item-controls" style="display: flex; align-items: center; gap: 10px;">
                        <button class="qty-btn" onclick="updateCartItem(${item.id}, -1)" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                        <span style="font-weight: 600;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartItem(${item.id}, 1)" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
                        <button onclick="removeFromCart(${item.id})" style="margin-left: auto; color: #ff6b6b; background: none; border: none; cursor: pointer; font-size: 0.8rem;">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    cartTotal.textContent = `$${total.toFixed(2)}`;
    console.log("Cart display updated with", cart.length, "items");
}

function saveCart() {
    localStorage.setItem('sweetHeavenCart', JSON.stringify(cart));
    console.log("Cart saved to localStorage:", cart);
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        checkoutModal.style.display = 'flex';
    }
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    
    // Close cart sidebar
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
    }
}

// ========== HERO SLIDER ==========
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[n].classList.add('active');
        dots[n].classList.add('active');
        currentSlide = n;
    }
    
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        showSlide(next);
    }
    
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) prev = slides.length - 1;
        showSlide(prev);
    }
    
    function goToSlide(n) {
        showSlide(n);
        resetInterval();
    }
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Start the slider
    showSlide(0);
    slideInterval = setInterval(nextSlide, 5000);
}

// ========== BESPOKE LAB ==========
function initBespokeLab() {
    const baseSelect = document.getElementById('base-select');
    const fillingSelect = document.getElementById('filling-select');
    
    if (baseSelect && fillingSelect) {
        baseSelect.addEventListener('change', calculateCustomPrice);
        fillingSelect.addEventListener('change', calculateCustomPrice);
        calculateCustomPrice();
    }
}

function calculateCustomPrice() {
    const baseSelect = document.getElementById('base-select');
    const fillingSelect = document.getElementById('filling-select');
    const customPrice = document.getElementById('custom-price');
    
    if (baseSelect && fillingSelect && customPrice) {
        const basePrice = parseInt(baseSelect.value) || 0;
        const fillingPrice = parseInt(fillingSelect.value) || 0;
        const total = basePrice + fillingPrice;
        customPrice.textContent = total;
    }
}

function addBespokeToCart() {
    const baseSelect = document.getElementById('base-select');
    const fillingSelect = document.getElementById('filling-select');
    const customPrice = document.getElementById('custom-price');
    
    if (!baseSelect || !fillingSelect || !customPrice) return;
    
    const baseName = baseSelect.options[baseSelect.selectedIndex].text.split(' - ')[0];
    const fillingName = fillingSelect.options[fillingSelect.selectedIndex].text.split(' - ')[0];
    const price = parseFloat(customPrice.textContent);
    
    const product = {
        id: Date.now(),
        name: `Bespoke Creation: ${baseName} with ${fillingName}`,
        price: price,
        image: 'https://images.pexels.com/photos/1739748/pexels-photo-1739748.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Custom creation from our Bespoke Lab'
    };
    
    addToCart(product);
}

// ========== PRODUCT DETAILS MODAL ==========
function viewProductDetails(productId) {
    const product = productsDatabase.find(p => p.id === productId);
    
    if (!product) {
        console.error("Product not found:", productId);
        return;
    }
    
    // Set modal content
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');
    const modalAddBtn = document.getElementById('modal-add-btn');
    
    if (modalImage) modalImage.src = product.image;
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalPrice) modalPrice.textContent = `$${product.price.toFixed(2)}`;
    
    if (modalAddBtn) {
        modalAddBtn.onclick = function() {
            addToCart(product);
            closeModal('product-modal');
        };
    }
    
    // Show modal
    const productModal = document.getElementById('product-modal');
    if (productModal) {
        productModal.style.display = 'flex';
    }
}

// ========== FEEDBACK FORM ==========
function initFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    const stars = document.querySelectorAll('.star-rating input');
    const starLabels = document.querySelectorAll('.star-rating label');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rating = document.querySelector('input[name="rating"]:checked');
        const email = document.getElementById('email');
        
        if (!rating || !email.value) {
            showToast('Please provide a rating and email address');
            return;
        }
        
        const thankyouModal = document.getElementById('thankyou-modal');
        if (thankyouModal) {
            thankyouModal.style.display = 'flex';
        }
        
        this.reset();
        stars.forEach(star => star.checked = false);
        starLabels.forEach(label => label.style.color = '#ddd');
    });
    
    // Star rating interactions
    starLabels.forEach(label => {
        label.addEventListener('click', function() {
            const rating = this.previousElementSibling.value;
            starLabels.forEach(l => l.style.color = '#ddd');
            
            for (let i = 1; i <= rating; i++) {
                document.querySelector(`label[for="star${i}"]`).style.color = 'var(--gold)';
            }
        });
        
        label.addEventListener('mouseover', function() {
            const rating = this.previousElementSibling.value;
            starLabels.forEach(l => l.style.color = '#ddd');
            
            for (let i = 1; i <= rating; i++) {
                document.querySelector(`label[for="star${i}"]`).style.color = 'var(--gold)';
            }
        });
    });
    
    const starRatingContainer = document.querySelector('.star-rating');
    if (starRatingContainer) {
        starRatingContainer.addEventListener('mouseleave', function() {
            const checked = document.querySelector('input[name="rating"]:checked');
            starLabels.forEach(l => l.style.color = '#ddd');
            
            if (checked) {
                for (let i = 1; i <= checked.value; i++) {
                    document.querySelector(`label[for="star${i}"]`).style.color = 'var(--gold)';
                }
            }
        });
    }
}

// ========== UTILITY FUNCTIONS ==========
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showToast(message) {
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== GLOBAL FUNCTIONS ==========
// Make functions available globally
window.addToCart = addToCart;
window.updateCartItem = updateCartItem;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.closeModal = closeModal;
window.viewProductDetails = viewProductDetails;
window.addBespokeToCart = addBespokeToCart;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide;

// Slider functions
window.prevSlide = function() {
    const slides = document.querySelectorAll('.slide');
    let prev = currentSlide - 1;
    if (prev < 0) prev = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    slides[prev].classList.add('active');
    if (document.querySelectorAll('.dot')[prev]) {
        document.querySelectorAll('.dot')[prev].classList.add('active');
    }
    
    currentSlide = prev;
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(window.nextSlide, 5000);
};

window.nextSlide = function() {
    const slides = document.querySelectorAll('.slide');
    let next = currentSlide + 1;
    if (next >= slides.length) next = 0;
    
    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    slides[next].classList.add('active');
    if (document.querySelectorAll('.dot')[next]) {
        document.querySelectorAll('.dot')[next].classList.add('active');
    }
    
    currentSlide = next;
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(window.nextSlide, 5000);
};

window.goToSlide = function(n) {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    slides[n].classList.add('active');
    if (document.querySelectorAll('.dot')[n]) {
        document.querySelectorAll('.dot')[n].classList.add('active');
    }
    
    currentSlide = n;
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(window.nextSlide, 5000);
};

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.slide')) {
        window.prevSlide = window.prevSlide;
        window.nextSlide = window.nextSlide;
        window.goToSlide = window.goToSlide;
    }
});