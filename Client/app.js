// VeggieBite Restaurant Application
class VeggieBiteApp {
  constructor() {
    this.currentView = 'client'; // 'client' or 'admin'
    this.currentPage = 'home';
    this.isAuthenticated = false;
    this.cart = [
      {
        id: 1,
        name: "Buddha Bowl",
        price: 12.99,
        quantity: 2,
        description: "Quinoa, roasted vegetables, and tahini dressing"
      },
      {
        id: 2,
        name: "Quinoa Power Salad",
        price: 10.99,
        quantity: 1,
        description: "Mixed greens, quinoa, chickpeas, and lemon vinaigrette"
      }
    ];
    this.charts = {};
    
    // Restaurant data from JSON
    this.data = {
      restaurant: {
        name: "VeggieBite",
        tagline: "Fresh Vegetarian Delights",
        contact: {
          phone: "+91 98765 43210",
          email: "hello@veggiebite.com",
          address: "123 Green Street, VCity, India"
        }
      },
      menu: [
        {
          id: 1,
          name: "Buddha Bowl",
          price: 12.99,
          category: "Bowls",
          description: "Quinoa, roasted vegetables, avocado, tahini dressing",
          tags: ["Gluten-Free", "Vegan", "High Protein"],
          nutrition: {
            calories: 420,
            protein: "15g",
            carbs: "58g",
            fat: "16g"
          }
        },
        {
          id: 2,
          name: "Quinoa Power Salad",
          price: 10.99,
          category: "Salads",
          description: "Mixed greens, quinoa, chickpeas, cucumber, lemon vinaigrette",
          tags: ["Vegan", "Gluten-Free", "High Protein"],
          nutrition: {
            calories: 380,
            protein: "14g",
            carbs: "52g",
            fat: "14g"
          }
        },
        {
          id: 3,
          name: "Plant-Based Burger",
          price: 14.99,
          category: "Burgers",
          description: "Beyond patty, lettuce, tomato, special sauce, brioche bun",
          tags: ["Vegan", "High Protein"],
          nutrition: {
            calories: 650,
            protein: "25g",
            carbs: "45g",
            fat: "35g"
          }
        },
        {
          id: 4,
          name: "Mediterranean Wrap",
          price: 11.99,
          category: "Wraps",
          description: "Hummus, grilled vegetables, olives, spinach wrap",
          tags: ["Vegan"],
          nutrition: {
            calories: 380,
            protein: "12g",
            carbs: "48g",
            fat: "18g"
          }
        }
      ],
      orders: [
        {
          id: "#ORD-001",
          customer: "Sarah Johnson",
          items: ["Buddha Bowl", "Green Smoothie"],
          total: 18.98,
          status: "preparing",
          time: "2:30 PM"
        },
        {
          id: "#ORD-002",
          customer: "Mike Chen",
          items: ["Plant-Based Burger"],
          total: 14.99,
          status: "ready",
          time: "2:15 PM"
        }
      ],
      reservations: [
        {
          id: "RES-001",
          customer: "Emma Wilson",
          date: "2025-07-28",
          time: "7:00 PM",
          party: 4,
          table: "T1",
          status: "Confirmed"
        },
        {
          id: "RES-002",
          customer: "David Brown",
          date: "2025-07-29",
          time: "6:30 PM",
          party: 2,
          table: "T3",
          status: "Pending"
        }
      ],
      customers: [
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah@email.com",
          totalOrders: 12,
          totalSpent: 247.80,
          favoriteItem: "Buddha Bowl",
          joinDate: "2024-03-15"
        },
        {
          id: 2,
          name: "Mike Chen",
          email: "mike@email.com",
          totalOrders: 8,
          totalSpent: 156.90,
          favoriteItem: "Plant-Based Burger",
          joinDate: "2024-05-22"
        }
      ],
      analytics: {
        dailyRevenue: 1247.50,
        totalOrders: 23,
        totalReservations: 8,
        popularItems: [
          {name: "Buddha Bowl", orders: 45},
          {name: "Quinoa Salad", orders: 32},
          {name: "Plant-Based Burger", orders: 28}
        ]
      }
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadClientPage('home');
    this.updateCartCount();
  }

  setupEventListeners() {
    // Client navigation - Fixed event delegation with direct click handlers
    document.addEventListener('click', (e) => {
      // Handle client navigation links with improved targeting
      const target = e.target;
      
      // Check if clicked element or its parent is a nav link
      let navLink = null;
      if (target.classList.contains('nav-link') && target.dataset.page) {
        navLink = target;
      } else if (target.closest('.nav-link[data-page]') && !target.closest('.sidebar')) {
        navLink = target.closest('.nav-link[data-page]');
      }
      
      if (navLink && !navLink.closest('.sidebar')) {
        e.preventDefault();
        const page = navLink.dataset.page;
        console.log('Client nav clicked:', page);
        this.loadClientPage(page);
        this.updateClientNavigation(page);
        return;
      }

      // Handle cart button specifically
      if (target.id === 'cartBtn' || target.closest('#cartBtn')) {
        e.preventDefault();
        this.loadClientPage('cart');
        this.updateClientNavigation('cart');
        return;
      }

      // Handle admin navigation
      const adminNavLink = target.closest('.sidebar .nav-link[data-page]');
      if (adminNavLink) {
        e.preventDefault();
        const page = adminNavLink.dataset.page;
        console.log('Admin nav clicked:', page);
        this.loadAdminPage(page);
        this.updateAdminNavigation(page);
        return;
      }

      // Handle modal close
      if (target.id === 'modalClose') {
        this.closeModal();
        return;
      }
      if (target.id === 'modalOverlay') {
        this.closeModal();
        return;
      }

      // Handle admin logout
      if (target.id === 'logoutBtn' || target.closest('#logoutBtn')) {
        e.preventDefault();
        this.handleAdminLogout();
        return;
      }

      // Handle admin sidebar toggle
      if (target.id === 'sidebarToggle') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
          sidebar.classList.toggle('open');
        }
        return;
      }

      // Handle back to client from admin login
      if (target.id === 'backToClientBtn') {
        e.preventDefault();
        this.switchToClient();
        return;
      }
    });

    // Admin link - Fixed to properly switch to admin
    const adminLinkBtn = document.getElementById('adminLinkBtn');
    if (adminLinkBtn) {
      adminLinkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Admin link clicked');
        this.switchToAdmin();
      });
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
          navMenu.classList.toggle('active');
        }
      });
    }

    // Admin login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAdminLogin();
      });
    }
  }

  // CLIENT APPLICATION METHODS
  switchToClient() {
    console.log('Switching to client view');
    const clientApp = document.getElementById('clientApp');
    const adminApp = document.getElementById('adminApp');
    
    if (clientApp) clientApp.classList.remove('hidden');
    if (adminApp) adminApp.classList.add('hidden');
    
    this.currentView = 'client';
    this.loadClientPage('home');
  }

  switchToAdmin() {
    console.log('Switching to admin view');
    const clientApp = document.getElementById('clientApp');
    const adminApp = document.getElementById('adminApp');
    const loginPage = document.getElementById('loginPage');
    const adminPanel = document.getElementById('adminPanel');
    
    if (clientApp) clientApp.classList.add('hidden');
    if (adminApp) adminApp.classList.remove('hidden');
    if (loginPage) loginPage.classList.remove('hidden');
    if (adminPanel) adminPanel.classList.add('hidden');
    
    this.currentView = 'admin';
    this.isAuthenticated = false;
  }

  updateClientNavigation(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.navbar .nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Find the correct nav link to make active
    const activeLink = document.querySelector(`.navbar .nav-link[data-page="${page}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  loadClientPage(page) {
    console.log('Loading client page:', page);
    this.currentPage = page;
    const mainContent = document.getElementById('clientMainContent');
    
    if (!mainContent) {
      console.error('Main content container not found');
      return;
    }

    // Close mobile menu if open
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
      navMenu.classList.remove('active');
    }

    let content = '';
    switch(page) {
      case 'home':
        content = this.renderHomePage();
        break;
      case 'client-menu':
        content = this.renderClientMenu();
        break;
      case 'cart':
        content = this.renderCartPage();
        break;
      case 'client-reservations':
        content = this.renderClientReservations();
        break;
      case 'client-about':
        content = this.renderClientAbout();
        break;
      case 'client-contact':
        content = this.renderClientContact();
        break;
      case 'client-profile':
        content = this.renderClientProfile();
        break;
      default:
        content = this.renderHomePage();
    }

    mainContent.innerHTML = content;

    // Setup page-specific functionality after rendering
    setTimeout(() => {
      if (page === 'client-menu') {
        this.setupMenuFilters();
      } else if (page === 'cart') {
        this.setupCartHandlers();
      } else if (page === 'client-reservations') {
        this.setupReservationForm();
      } else if (page === 'client-contact') {
        this.setupContactForm();
      }
    }, 100);
  }

  renderHomePage() {
    return `
      <section class="hero">
        <div class="hero-container">
          <h1 class="hero-title">Welcome to VeggieBite</h1>
          <p class="hero-subtitle">Fresh Vegetarian Delights Made with Love</p>
          <div class="hero-cta">
            <button class="btn btn--primary btn--lg" onclick="window.veggieBiteApp.navigateToPage('client-menu')">
              View Menu
            </button>
            <button class="btn btn--secondary btn--lg" onclick="window.veggieBiteApp.navigateToPage('client-reservations')">
              Book a Table
            </button>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="features-container">
          <h2 class="features-title">Why Choose VeggieBite?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🌱</div>
              <h3 class="feature-title">100% Vegetarian</h3>
              <p class="feature-description">All our dishes are carefully crafted with fresh, plant-based ingredients for a healthy and delicious experience.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🥗</div>
              <h3 class="feature-title">Farm Fresh</h3>
              <p class="feature-description">We source our ingredients directly from local organic farms to ensure the highest quality and freshness.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3 class="feature-title">Quick Service</h3>
              <p class="feature-description">Fast and efficient service without compromising on taste or quality. Perfect for busy lifestyles.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💚</div>
              <h3 class="feature-title">Eco-Friendly</h3>
              <p class="feature-description">Committed to sustainability with biodegradable packaging and zero-waste cooking practices.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderClientMenu() {
    const categories = [...new Set(this.data.menu.map(item => item.category))];
    
    return `
      <div class="page-container">
        <h1 class="page-title">Our Menu</h1>
        <p class="page-subtitle">Delicious vegetarian dishes made with fresh, organic ingredients</p>
        
        <div class="menu-categories">
          <button class="category-btn active" data-category="all">All</button>
          ${categories.map(category => `
            <button class="category-btn" data-category="${category.toLowerCase()}">${category}</button>
          `).join('')}
        </div>

        <div class="menu-grid" id="menuGrid">
          ${this.data.menu.map(item => `
            <div class="menu-item" data-category="${item.category.toLowerCase()}">
              <div class="menu-item-image">🥗</div>
              <div class="menu-item-content">
                <div class="menu-item-header">
                  <h3 class="menu-item-name">${item.name}</h3>
                  <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-tags">
                  ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="menu-item-actions">
                  <button class="btn btn--primary" onclick="window.veggieBiteApp.addToCart(${item.id})">
                    Add to Cart
                  </button>
                  <button class="btn btn--secondary" onclick="window.veggieBiteApp.viewItemDetails(${item.id})">
                    Details
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderCartPage() {
    if (this.cart.length === 0) {
      return `
        <div class="page-container">
          <div class="cart-header">
            <h1 class="page-title">Shopping Cart</h1>
            <p class="page-subtitle">Your cart is currently empty</p>
          </div>
          
          <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some delicious vegetarian dishes to your cart to get started!</p>
            <button class="btn btn--primary btn--lg" onclick="window.veggieBiteApp.navigateToPage('client-menu')">
              Browse Menu
            </button>
          </div>
        </div>
      `;
    }

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 3.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    return `
      <div class="page-container">
        <div class="cart-header">
          <h1 class="page-title">Shopping Cart</h1>
          <p class="page-subtitle">Review your order and proceed to checkout</p>
        </div>
        
        <div class="cart-content">
          <div class="cart-items">
            <table class="cart-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.cart.map(item => `
                  <tr>
                    <td>
                      <div class="cart-item-info">
                        <div class="cart-item-image">🥗</div>
                        <div class="cart-item-details">
                          <h4>${item.name}</h4>
                          <p>${item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                      <div class="quantity-controls">
                        <button class="quantity-btn" onclick="window.veggieBiteApp.updateCartQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="window.veggieBiteApp.updateCartQuantity(${item.id}, 1)">+</button>
                      </div>
                    </td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button class="remove-btn" onclick="window.veggieBiteApp.removeFromCart(${item.id})">
                        Remove
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="cart-summary">
            <h3 class="summary-title">Order Summary</h3>
            
            <div class="summary-row">
              <span>Subtotal</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            
            <div class="summary-row">
              <span>Delivery Fee</span>
              <span>$${deliveryFee.toFixed(2)}</span>
            </div>
            
            <div class="summary-row">
              <span>Tax (8%)</span>
              <span>$${tax.toFixed(2)}</span>
            </div>
            
            <div class="summary-row total">
              <span>Total</span>
              <span>$${total.toFixed(2)}</span>
            </div>
            
            <div class="checkout-form">
              <h4>Delivery Address</h4>
              <form id="checkoutForm">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="deliveryName" required>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Address</label>
                  <textarea class="form-control" id="deliveryAddress" rows="3" required></textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-control" id="deliveryPhone" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="deliveryEmail" required>
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Special Instructions (Optional)</label>
                  <textarea class="form-control" id="deliveryNotes" rows="2" placeholder="Any special delivery instructions..."></textarea>
                </div>
                
                <button type="submit" class="btn btn--primary btn--full-width btn--lg">
                  Proceed to Checkout - $${total.toFixed(2)}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderClientReservations() {
    return `
      <div class="page-container">
        <h1 class="page-title">Make a Reservation</h1>
        <p class="page-subtitle">Book your table at VeggieBite for a delightful dining experience</p>
        
        <div class="card" style="max-width: 600px; margin: 0 auto;">
          <div class="card-body">
            <form id="reservationForm">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="reservationName" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" id="reservationEmail" required>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div class="form-group">
                  <label class="form-label">Date</label>
                  <input type="date" class="form-control" id="reservationDate" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Time</label>
                  <select class="form-control" id="reservationTime" required>
                    <option value="">Select Time</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="8:30 PM">8:30 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div class="form-group">
                  <label class="form-label">Party Size</label>
                  <select class="form-control" id="reservationParty" required>
                    <option value="">Select Size</option>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6">6 People</option>
                    <option value="7">7+ People</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input type="tel" class="form-control" id="reservationPhone" required>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Special Requests (Optional)</label>
                <textarea class="form-control" id="reservationNotes" rows="3" placeholder="Any dietary restrictions or special occasions..."></textarea>
              </div>
              
              <button type="submit" class="btn btn--primary btn--full-width">
                Book Reservation
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  renderClientAbout() {
    return `
      <div class="page-container">
        <h1 class="page-title">About VeggieBite</h1>
        <p class="page-subtitle">Our story of bringing fresh vegetarian delights to your table</p>
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 32px; max-width: 800px; margin: 0 auto;">
          <div class="card">
            <div class="card-body">
              <h3 style="color: var(--veggie-teal); margin-bottom: 16px;">Our Mission</h3>
              <p>At VeggieBite, we believe that vegetarian food should be delicious, nutritious, and accessible to everyone. Founded in 2020, we've been dedicated to creating innovative plant-based dishes that satisfy both vegetarians and meat-lovers alike.</p>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h3 style="color: var(--veggie-teal); margin-bottom: 16px;">Our Philosophy</h3>
              <p>We source our ingredients from local organic farms, ensuring that every dish is made with the freshest produce. Our chefs are passionate about creating flavorful combinations that celebrate the natural goodness of vegetables, grains, and plant-based proteins.</p>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h3 style="color: var(--veggie-teal); margin-bottom: 16px;">Sustainability</h3>
              <p>Environmental responsibility is at the heart of everything we do. From our zero-waste kitchen practices to our biodegradable packaging, we're committed to minimizing our environmental footprint while serving delicious food.</p>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h3 style="color: var(--veggie-teal); margin-bottom: 16px;">Our Team</h3>
              <p>Led by Chef Sarah Green, our culinary team brings together years of experience in vegetarian cuisine. We're a passionate group of food lovers dedicated to changing the way people think about plant-based dining.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderClientContact() {
    return `
      <div class="page-container">
        <h1 class="page-title">Contact Us</h1>
        <p class="page-subtitle">Get in touch with VeggieBite - we'd love to hear from you!</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; max-width: 1000px; margin: 0 auto;">
          <div class="card">
            <div class="card-body">
              <h3 style="color: var(--veggie-teal); margin-bottom: 20px;">Send us a Message</h3>
              <form id="contactForm">
                <div class="form-group">
                  <label class="form-label">Your Name</label>
                  <input type="text" class="form-control" id="contactName" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-control" id="contactEmail" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Subject</label>
                  <select class="form-control" id="contactSubject" required>
                    <option value="">Select Subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="reservation">Reservation Help</option>
                    <option value="catering">Catering Services</option>
                    <option value="feedback">Feedback</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Message</label>
                  <textarea class="form-control" id="contactMessage" rows="5" required></textarea>
                </div>
                <button type="submit" class="btn btn--primary btn--full-width">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          
          <div>
            <div class="card" style="margin-bottom: 24px;">
              <div class="card-body">
                <h3 style="color: var(--veggie-teal); margin-bottom: 20px;">Contact Information</h3>
                <div style="margin-bottom: 16px;">
                  <strong>📍 Address:</strong><br>
                  ${this.data.restaurant.contact.address}
                </div>
                <div style="margin-bottom: 16px;">
                  <strong>📞 Phone:</strong><br>
                  <a href="tel:${this.data.restaurant.contact.phone}" style="color: var(--veggie-teal);">
                    ${this.data.restaurant.contact.phone}
                  </a>
                </div>
                <div style="margin-bottom: 16px;">
                  <strong>✉️ Email:</strong><br>
                  <a href="mailto:${this.data.restaurant.contact.email}" style="color: var(--veggie-teal);">
                    ${this.data.restaurant.contact.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-body">
                <h3 style="color: var(--veggie-teal); margin-bottom: 20px;">Opening Hours</h3>
                <div style="margin-bottom: 12px;">
                  <strong>Monday - Friday:</strong><br>
                  11:00 AM - 10:00 PM
                </div>
                <div style="margin-bottom: 12px;">
                  <strong>Saturday - Sunday:</strong><br>
                  9:00 AM - 11:00 PM
                </div>
                <div style="margin-top: 20px; padding: 16px; background: var(--veggie-light-green); border-radius: 8px;">
                  <strong style="color: var(--veggie-green);">Special Hours:</strong><br>
                  <small>We're open for brunch on weekends!</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderClientProfile() {
    return `
      <div class="page-container">
        <h1 class="page-title">My Profile</h1>
        <p class="page-subtitle">Manage your VeggieBite account and view your order history</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; max-width: 1000px; margin: 0 auto;">
          <div class="card">
            <div class="card-body">
              <h3 style="color: var(--veggie-teal); margin-bottom: 20px;">Profile Information</h3>
              <form>
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" value="John Doe" disabled>
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" value="john@example.com" disabled>
                </div>
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input type="tel" class="form-control" value="+91 98765 43210" disabled>
                </div>
                <div class="form-group">
                  <label class="form-label">Dietary Preferences</label>
                  <select class="form-control" disabled>
                    <option>Vegan</option>
                  </select>
                </div>
                <button type="button" class="btn btn--secondary btn--full-width">
                  Edit Profile
                </button>
              </form>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h3 style="color: var(--veggie-teal); margin-bottom: 20px;">Account Statistics</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                <div style="text-align: center; padding: 16px; background: var(--veggie-light-teal); border-radius: 8px;">
                  <div style="font-size: 24px; font-weight: bold; color: var(--veggie-teal);">15</div>
                  <div style="font-size: 14px; color: var(--color-text-secondary);">Total Orders</div>
                </div>
                <div style="text-align: center; padding: 16px; background: var(--veggie-light-green); border-radius: 8px;">
                  <div style="font-size: 24px; font-weight: bold; color: var(--veggie-green);">$298</div>
                  <div style="font-size: 14px; color: var(--color-text-secondary);">Total Spent</div>
                </div>
              </div>
              <div style="margin-bottom: 16px;">
                <strong>Favorite Dish:</strong> Buddha Bowl
              </div>
              <div style="margin-bottom: 16px;">
                <strong>Member Since:</strong> March 2024
              </div>
              <div style="margin-bottom: 16px;">
                <strong>Loyalty Points:</strong> 450 points
              </div>
            </div>
          </div>
        </div>
        
        <div class="card" style="max-width: 1000px; margin: 32px auto 0;">
          <div class="card-header">
            <h3>Recent Orders</h3>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#VB-2025-001</td>
                  <td>July 25, 2025</td>
                  <td>Buddha Bowl, Green Smoothie</td>
                  <td>$18.98</td>
                  <td><span class="status-badge status-delivered">Delivered</span></td>
                </tr>
                <tr>
                  <td>#VB-2025-002</td>
                  <td>July 22, 2025</td>
                  <td>Plant-Based Burger</td>
                  <td>$14.99</td>
                  <td><span class="status-badge status-delivered">Delivered</span></td>
                </tr>
                <tr>
                  <td>#VB-2025-003</td>
                  <td>July 20, 2025</td>
                  <td>Quinoa Power Salad</td>
                  <td>$10.99</td>
                  <td><span class="status-badge status-delivered">Delivered</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // Helper method for programmatic navigation
  navigateToPage(page) {
    console.log('Navigating to page:', page);
    this.loadClientPage(page);
    this.updateClientNavigation(page);
  }

  // Menu functionality - Fixed filtering
  setupMenuFilters() {
    console.log('Setting up menu filters');
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        console.log('Category button clicked:', e.target.dataset.category);
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter menu items
        const category = e.target.dataset.category;
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
          const itemCategory = item.dataset.category;
          if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Cart functionality
  setupCartHandlers() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCheckout();
      });
    }
  }

  addToCart(itemId) {
    console.log('Adding to cart:', itemId);
    const item = this.data.menu.find(i => i.id === itemId);
    if (item) {
      const existingItem = this.cart.find(cartItem => cartItem.id === itemId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          description: item.description
        });
      }
      this.updateCartCount();
      this.showSuccessMessage(`${item.name} added to cart!`);
    }
  }

  updateCartQuantity(itemId, change) {
    const item = this.cart.find(cartItem => cartItem.id === itemId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        this.updateCartCount();
        // Refresh the cart page if we're currently on it
        if (this.currentPage === 'cart') {
          this.loadClientPage('cart');
        }
      }
    }
  }

  removeFromCart(itemId) {
    const item = this.cart.find(cartItem => cartItem.id === itemId);
    if (item) {
      this.cart = this.cart.filter(cartItem => cartItem.id !== itemId);
      this.updateCartCount();
      this.showSuccessMessage(`${item.name} removed from cart`);
      // Refresh the cart page if we're currently on it
      if (this.currentPage === 'cart') {
        this.loadClientPage('cart');
      }
    }
  }

  updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  handleCheckout() {
    const formData = {
      name: document.getElementById('deliveryName')?.value,
      address: document.getElementById('deliveryAddress')?.value,
      phone: document.getElementById('deliveryPhone')?.value,
      email: document.getElementById('deliveryEmail')?.value,
      notes: document.getElementById('deliveryNotes')?.value
    };

    this.showSuccessMessage(`Order placed successfully! We'll deliver to ${formData.name} at ${formData.address}. Estimated delivery time: 30-45 minutes.`);
    
    // Clear cart after successful checkout
    this.cart = [];
    this.updateCartCount();
    
    // Navigate to home page
    setTimeout(() => {
      this.navigateToPage('home');
    }, 2000);
  }

  viewItemDetails(itemId) {
    const item = this.data.menu.find(i => i.id === itemId);
    if (item) {
      this.showModal('Dish Details', `
        <div style="margin-bottom: 20px;">
          <h4>${item.name}</h4>
          <p style="font-size: 18px; font-weight: bold; color: var(--veggie-teal); margin: 8px 0;">$${item.price.toFixed(2)}</p>
          <p style="margin-bottom: 16px;">${item.description}</p>
          
          <h5 style="margin-bottom: 12px;">Nutritional Info:</h5>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
            <div><strong>Calories:</strong> ${item.nutrition.calories}</div>
            <div><strong>Protein:</strong> ${item.nutrition.protein}</div>
            <div><strong>Carbs:</strong> ${item.nutrition.carbs}</div>
            <div><strong>Fat:</strong> ${item.nutrition.fat}</div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <strong>Tags:</strong><br>
            ${item.tags.map(tag => `<span class="tag" style="margin: 4px 4px 4px 0;">${tag}</span>`).join('')}
          </div>
        </div>
        
        <div style="display: flex; gap: 10px;">
          <button class="btn btn--primary" onclick="window.veggieBiteApp.addToCart(${item.id}); window.veggieBiteApp.closeModal();">
            Add to Cart
          </button>
          <button class="btn btn--secondary" onclick="window.veggieBiteApp.closeModal()">Close</button>
        </div>
      `);
    }
  }

  // Form handlers
  setupReservationForm() {
    const form = document.getElementById('reservationForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleReservationSubmit();
      });
    }
  }

  setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactSubmit();
      });
    }
  }

  handleReservationSubmit() {
    const formData = {
      name: document.getElementById('reservationName')?.value,
      email: document.getElementById('reservationEmail')?.value,
      date: document.getElementById('reservationDate')?.value,
      time: document.getElementById('reservationTime')?.value,
      party: document.getElementById('reservationParty')?.value,
      phone: document.getElementById('reservationPhone')?.value,
      notes: document.getElementById('reservationNotes')?.value
    };

    this.showSuccessMessage(`Reservation request submitted for ${formData.name} on ${formData.date} at ${formData.time}!`);
    document.getElementById('reservationForm')?.reset();
  }

  handleContactSubmit() {
    const formData = {
      name: document.getElementById('contactName')?.value,
      email: document.getElementById('contactEmail')?.value,
      subject: document.getElementById('contactSubject')?.value,
      message: document.getElementById('contactMessage')?.value
    };

    this.showSuccessMessage(`Thank you ${formData.name}! Your message has been sent. We'll get back to you soon.`);
    document.getElementById('contactForm')?.reset();
  }

  // ADMIN APPLICATION METHODS (keeping existing admin functionality)
  handleAdminLogin() {
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    // Show loading state
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = loginBtn?.querySelector('.login-btn-text');
    const loginSpinner = loginBtn?.querySelector('.login-spinner');
    
    if (loginBtn) loginBtn.disabled = true;
    if (loginBtnText) loginBtnText.classList.add('hidden');
    if (loginSpinner) loginSpinner.classList.remove('hidden');

    // Simulate API call
    setTimeout(() => {
      this.isAuthenticated = true;
      document.getElementById('loginPage')?.classList.add('hidden');
      document.getElementById('adminPanel')?.classList.remove('hidden');
      this.loadAdminPage('dashboard');
      
      // Reset form
      if (loginBtn) loginBtn.disabled = false;
      if (loginBtnText) loginBtnText.classList.remove('hidden');
      if (loginSpinner) loginSpinner.classList.add('hidden');
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
    }, 800);
  }

  handleAdminLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.isAuthenticated = false;
      document.getElementById('loginPage')?.classList.remove('hidden');
      document.getElementById('adminPanel')?.classList.add('hidden');
      
      // Destroy charts
      Object.values(this.charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
      this.charts = {};
    }
  }

  updateAdminNavigation(page) {
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
  }

  loadAdminPage(page) {
    if (!this.isAuthenticated) return;

    const mainContent = document.getElementById('adminMainContent');
    if (!mainContent) return;

    // Destroy existing charts
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts = {};

    switch(page) {
      case 'dashboard':
        mainContent.innerHTML = this.renderAdminDashboard();
        setTimeout(() => this.initDashboardCharts(), 100);
        break;
      case 'orders':
        mainContent.innerHTML = this.renderAdminOrders();
        break;
      case 'menu':
        mainContent.innerHTML = this.renderAdminMenu();
        break;
      case 'reservations':
        mainContent.innerHTML = this.renderAdminReservations();
        break;
      case 'customers':
        mainContent.innerHTML = this.renderAdminCustomers();
        break;
      case 'analytics':
        mainContent.innerHTML = this.renderAdminAnalytics();
        setTimeout(() => this.initAnalyticsCharts(), 100);
        break;
      case 'admin-about':
        mainContent.innerHTML = this.renderAdminAbout();
        break;
      case 'admin-contact':
        mainContent.innerHTML = this.renderAdminContact();
        break;
      default:
        mainContent.innerHTML = this.renderAdminDashboard();
        setTimeout(() => this.initDashboardCharts(), 100);
    }
  }

  renderAdminDashboard() {
    return `
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back! Here's what's happening at VeggieBite today.</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${this.data.analytics.totalOrders}</div>
          <div class="metric-label">Orders Today</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">$${this.data.analytics.dailyRevenue.toFixed(2)}</div>
          <div class="metric-label">Daily Revenue</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${this.data.analytics.totalReservations}</div>
          <div class="metric-label">Active Reservations</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${this.data.menu.length}</div>
          <div class="metric-label">Menu Items</div>
        </div>
      </div>

      <div class="data-grid grid-2">
        <div class="card">
          <div class="card-header">
            <h3>Recent Orders</h3>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${this.data.orders.map(order => `
                  <tr>
                    <td>${order.id}</td>
                    <td>${order.customer}</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    <td>$${order.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Daily Revenue</h3>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="revenueChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAdminOrders() {
    return `
      <div class="page-header">
        <h1 class="page-title">Orders Management</h1>
        <p class="page-subtitle">Track and manage incoming vegetarian food orders</p>
      </div>

      <div class="data-grid grid-3">
        ${this.data.orders.map(order => `
          <div class="card">
            <div class="card-body">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <strong>${order.id}</strong>
                <span class="status-badge status-${order.status}">${order.status}</span>
              </div>
              <div style="margin-bottom: 12px;">
                <strong>Customer:</strong> ${order.customer}<br>
                <strong>Time:</strong> ${order.time}
              </div>
              <div style="margin-bottom: 16px;">
                <strong>Items:</strong> ${order.items.join(', ')}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="color: var(--veggie-teal);">Total: $${order.total.toFixed(2)}</strong>
                <button class="btn btn--primary btn--sm">Update Status</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderAdminMenu() {
    return `
      <div class="page-header">
        <h1 class="page-title">Menu Management</h1>
        <p class="page-subtitle">Manage your delicious vegetarian dishes and pricing</p>
      </div>

      <div style="margin-bottom: 24px;">
        <button class="btn btn--primary">+ Add New Dish</button>
      </div>

      <div class="data-grid grid-3">
        ${this.data.menu.map(item => `
          <div class="card">
            <div class="card-body">
              <h4 style="margin-bottom: 8px;">${item.name}</h4>
              <p style="color: var(--veggie-teal); font-weight: bold; font-size: 18px; margin-bottom: 8px;">$${item.price.toFixed(2)}</p>
              <p style="margin-bottom: 12px; color: var(--color-text-secondary); font-size: 14px;">${item.description}</p>
              <div style="margin-bottom: 16px;">
                <span class="status-badge status-available">Available</span>
                <span style="margin-left: 8px; font-size: 12px; color: var(--color-text-secondary);">${item.category}</span>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn--secondary btn--sm">Edit</button>
                <button class="btn btn--secondary btn--sm">Toggle Status</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderAdminReservations() {
    return `
      <div class="page-header">
        <h1 class="page-title">Table Reservations</h1>
        <p class="page-subtitle">Manage dining reservations and table arrangements</p>
      </div>

      <div class="data-grid grid-3">
        ${this.data.reservations.map(reservation => `
          <div class="card">
            <div class="card-body">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <strong>${reservation.id}</strong>
                <span class="status-badge status-available">${reservation.status}</span>
              </div>
              <div style="margin-bottom: 16px;">
                <strong>Customer:</strong> ${reservation.customer}<br>
                <strong>Date:</strong> ${reservation.date}<br>
                <strong>Time:</strong> ${reservation.time}<br>
                <strong>Party Size:</strong> ${reservation.party} people<br>
                <strong>Table:</strong> ${reservation.table}
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn--primary btn--sm">Edit</button>
                <button class="btn btn--secondary btn--sm">Cancel</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderAdminCustomers() {
    return `
      <div class="page-header">
        <h1 class="page-title">Customer Management</h1>
        <p class="page-subtitle">Track loyal VeggieBite customers and their preferences</p>
      </div>

      <div class="data-grid grid-3">
        ${this.data.customers.map(customer => `
          <div class="card">
            <div class="card-body">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <div style="width: 48px; height: 48px; background: var(--veggie-teal); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                  ${customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <strong>${customer.name}</strong><br>
                  <small style="color: var(--color-text-secondary);">${customer.email}</small>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                <div style="text-align: center;">
                  <div style="font-weight: bold; color: var(--veggie-teal);">${customer.totalOrders}</div>
                  <div style="font-size: 12px;">Orders</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-weight: bold; color: var(--veggie-teal);">$${customer.totalSpent.toFixed(2)}</div>
                  <div style="font-size: 12px;">Spent</div>
                </div>
              </div>
              <div style="margin-bottom: 16px; font-size: 14px;">
                <strong>Favorite:</strong> ${customer.favoriteItem}
              </div>
              <button class="btn btn--primary btn--sm btn--full-width">View History</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderAdminAnalytics() {
    return `
      <div class="page-header">
        <h1 class="page-title">Business Analytics</h1>
        <p class="page-subtitle">Insights and performance metrics for VeggieBite</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">$8,947</div>
          <div class="metric-label">Monthly Revenue</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">342</div>
          <div class="metric-label">Total Orders</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">$26.17</div>
          <div class="metric-label">Avg Order Value</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">89</div>
          <div class="metric-label">New Customers</div>
        </div>
      </div>

      <div class="data-grid grid-2">
        <div class="card">
          <div class="card-header">
            <h3>Revenue Trends</h3>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="analyticsRevenueChart"></canvas>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Popular Dishes</h3>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="popularDishesChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAdminAbout() {
    return `
      <div class="page-header">
        <h1 class="page-title">About VeggieBite - Admin View</h1>
        <p class="page-subtitle">Manage restaurant information and company details</p>
      </div>

      <div class="data-grid grid-2">
        <div class="card">
          <div class="card-header">
            <h3>Restaurant Information</h3>
            <button class="btn btn--secondary btn--sm">Edit</button>
          </div>
          <div class="card-body">
            <div style="margin-bottom: 16px;">
              <strong>Name:</strong> ${this.data.restaurant.name}<br>
              <strong>Tagline:</strong> ${this.data.restaurant.tagline}
            </div>
            <div style="margin-bottom: 16px;">
              <strong>Address:</strong><br>
              ${this.data.restaurant.contact.address}
            </div>
            <div style="margin-bottom: 16px;">
              <strong>Phone:</strong> ${this.data.restaurant.contact.phone}<br>
              <strong>Email:</strong> ${this.data.restaurant.contact.email}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Business Hours</h3>
            <button class="btn btn--secondary btn--sm">Edit</button>
          </div>
          <div class="card-body">
            <div style="margin-bottom: 12px;">
              <strong>Monday - Friday:</strong><br>
              11:00 AM - 10:00 PM
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Saturday - Sunday:</strong><br>
              9:00 AM - 11:00 PM
            </div>
            <div style="padding: 12px; background: var(--veggie-light-green); border-radius: 8px; margin-top: 16px;">
              <strong>Weekend Brunch Available</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAdminContact() {
    return `
      <div class="page-header">
        <h1 class="page-title">Contact Management</h1>
        <p class="page-subtitle">Manage customer inquiries and contact information</p>
      </div>

      <div class="data-grid grid-2">
        <div class="card">
          <div class="card-header">
            <h3>Recent Messages</h3>
          </div>
          <div class="card-body">
            <div style="margin-bottom: 16px; padding: 12px; border: 1px solid var(--veggie-border); border-radius: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">John Doe - General Inquiry</div>
              <div style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 8px;">2 hours ago</div>
              <div style="font-size: 14px;">Great food! When will you open a second location?</div>
            </div>
            <div style="margin-bottom: 16px; padding: 12px; border: 1px solid var(--veggie-border); border-radius: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">Sarah Chen - Catering</div>
              <div style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 8px;">5 hours ago</div>
              <div style="font-size: 14px;">Interested in catering for corporate event...</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Contact Statistics</h3>
          </div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <div style="text-align: center; padding: 16px; background: var(--veggie-light-teal); border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: var(--veggie-teal);">15</div>
                <div style="font-size: 14px;">New Messages</div>
              </div>
              <div style="text-align: center; padding: 16px; background: var(--veggie-light-green); border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: var(--veggie-green);">8</div>
                <div style="font-size: 14px;">Pending</div>
              </div>
            </div>
            <button class="btn btn--primary btn--full-width">View All Messages</button>
          </div>
        </div>
      </div>
    `;
  }

  // Chart initialization
  initDashboardCharts() {
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
      this.charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Daily Revenue',
            data: [890, 1240, 980, 1380, 1560, 1890, 1247],
            borderColor: '#218085',
            backgroundColor: 'rgba(33, 128, 133, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value;
                }
              }
            }
          }
        }
      });
    }
  }

  initAnalyticsCharts() {
    // Revenue trends chart
    const revenueCtx = document.getElementById('analyticsRevenueChart');
    if (revenueCtx) {
      this.charts.analyticsRevenue = new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Weekly Revenue',
            data: [2100, 2800, 2200, 3200],
            borderColor: '#218085',
            backgroundColor: 'rgba(33, 128, 133, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    // Popular dishes chart
    const dishesCtx = document.getElementById('popularDishesChart');
    if (dishesCtx) {
      this.charts.popularDishes = new Chart(dishesCtx, {
        type: 'doughnut',
        data: {
          labels: ['Buddha Bowl', 'Plant-Based Burger', 'Quinoa Salad'],
          datasets: [{
            data: [45, 32, 28],
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  // Utility methods
  showModal(title, content) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalTitle && modalBody && modalOverlay) {
      modalTitle.textContent = title;
      modalBody.innerHTML = content;
      modalOverlay.classList.remove('hidden');
    }
  }

  closeModal() {
    document.getElementById('modalOverlay')?.classList.add('hidden');
  }

  showSuccessMessage(message) {
    // Simple alert for now - could be enhanced with a toast notification
    alert(message);
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.veggieBiteApp = new VeggieBiteApp();
});