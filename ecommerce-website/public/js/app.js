// DOM Elements
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

// Toggle Mobile Menu
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        // Implement mobile menu toggle functionality
        console.log('Mobile menu button clicked');
    });
}

// Cart Functionality
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({...product, quantity: 1});
        }
        this.updateStorage();
        this.updateCartCount();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateStorage();
        this.updateCartCount();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.updateStorage();
        }
    }

    clearCart() {
        this.items = [];
        this.updateStorage();
        this.updateCartCount();
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getTotalItems();
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline-block' : 'none';
        });
    }
}

// Initialize Cart
const cart = new Cart();

// Product Interaction
document.addEventListener('DOMContentLoaded', () => {
    // Update cart count on page load
    cart.updateCartCount();

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: productCard.dataset.id,
                name: productCard.querySelector('.product-name').textContent,
                price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
                image: productCard.querySelector('img').src
            };
            cart.addItem(product);
            
            // Show added to cart feedback
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check mr-2"></i> Added';
            button.classList.remove('bg-green-500', 'hover:bg-green-600');
            button.classList.add('bg-green-600');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.add('bg-green-500', 'hover:bg-green-600');
                button.classList.remove('bg-green-600');
            }, 2000);
        });
    });

    // Quantity controls
    document.querySelectorAll('.quantity-control').forEach(control => {
        control.addEventListener('click', (e) => {
            const input = e.target.closest('.quantity-container').querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (e.target.classList.contains('quantity-up')) {
                value++;
            } else if (e.target.classList.contains('quantity-down') && value > 1) {
                value--;
            }
            
            input.value = value;
            const productId = e.target.closest('.cart-item').dataset.id;
            cart.updateQuantity(productId, value);
        });
    });

    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('.cart-item').dataset.id;
            cart.removeItem(productId);
            e.target.closest('.cart-item').remove();
        });
    });

    // Clear cart button
    const clearCartButton = document.querySelector('.clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            cart.clearCart();
            document.querySelectorAll('.cart-item').forEach(item => item.remove());
        });
    }
});

// Form Validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });

    return isValid;
}

// Initialize all forms
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!validateForm(form)) {
            e.preventDefault();
            // Show error message
            const errorElement = form.querySelector('.form-error') || document.createElement('div');
            errorElement.className = 'form-error text-red-500 text-sm mt-2';
            errorElement.textContent = 'Please fill in all required fields.';
            form.appendChild(errorElement);
        }
    });
});