// ===== RESPONSIVE NAVIGATION MENU =====
// Get elements
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navLinks = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-links a');

// Toggle menu on hamburger click
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== FEATURED DEALS - AJAX + DOM MANIPULATION =====
$(document).ready(function() {
    // Fetch products from API
    $.ajax({
        url: 'https://fakestoreapi.com/products?limit=4',
        method: 'GET',
        success: function(products) {
            // Clear loading message
            $('#dealsGrid').empty();
            
            // Create and inject cards for each product
            products.forEach(function(product) {
                const card = `
                    <div class="deal-card">
                        <img src="${product.image}" alt="${product.title}">
                        <h4>${product.title.substring(0, 50)}${product.title.length > 50 ? '...' : ''}</h4>
                        <p class="price">$${product.price.toFixed(2)}</p>
                        <button class="quick-view-btn" 
                                data-title="${product.title}"
                                data-image="${product.image}"
                                data-price="${product.price}"
                                data-description="${product.description}"
                                data-rating="${product.rating.rate}">
                            Quick View
                        </button>
                    </div>
                `;
                $('#dealsGrid').append(card);
            });
            
            // Add click event to Quick View buttons
            $('.quick-view-btn').click(function() {
                // Get data from button attributes
                const title = $(this).data('title');
                const image = $(this).data('image');
                const price = $(this).data('price');
                const description = $(this).data('description');
                const rating = $(this).data('rating');
                
                // Fill modal with product data
                $('#modalTitle').text(title);
                $('#modalImage').attr('src', image);
                $('#modalPrice').text('$' + price.toFixed(2));
                $('#modalDescription').text(description);
                $('#modalRating').text('Rating: ' + rating + '/5');
                
                // Show modal
                $('#productModal').fadeIn();
            });
        },
        error: function() {
            $('#dealsGrid').html('<p class="loading">Failed to load deals. Please try again.</p>');
        }
    });
    
    // Close modal when X is clicked
    $('#modalClose').click(function() {
        $('#productModal').fadeOut();
    });
    
    // Close modal when clicking outside content
    $(window).click(function(event) {
        if ($(event.target).is('#productModal')) {
            $('#productModal').fadeOut();
        }
    });
});