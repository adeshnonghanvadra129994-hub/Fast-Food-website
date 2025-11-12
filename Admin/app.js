// VeggieBite Admin Panel Application
class VeggieBiteAdmin {
  constructor() {
    this.currentPage = 'dashboard';
    this.isAuthenticated = false;
    this.data = {
      menu_items: [
        {id: 1, name: "Buddha Bowl", price: 12.99, category: "Bowls", status: "available"},
        {id: 2, name: "Quinoa Power Salad", price: 9.99, category: "Salads", status: "available"},
        {id: 3, name: "Plant-Based Burger", price: 11.49, category: "Burgers", status: "limited"},
        {id: 4, name: "Thai Green Curry", price: 13.99, category: "Asian", status: "available"},
        {id: 5, name: "Mediterranean Wrap", price: 8.99, category: "Wraps", status: "available"}
      ],
      recent_orders: [
        {id: "ORD001", customer: "Sarah Johnson", items: "Buddha Bowl, Green Smoothie", total: 18.49, status: "preparing", time: "12:30 PM"},
        {id: "ORD002", customer: "Mike Chen", items: "Quinoa Salad, Hummus Plate", total: 14.98, status: "ready", time: "12:15 PM"},
        {id: "ORD003", customer: "Emma Wilson", items: "Plant Burger, Sweet Potato Fries", total: 16.49, status: "delivered", time: "11:45 AM"}
      ],
      reservations: [
        {id: "RES001", customer: "David Brown", date: "2025-07-27", time: "7:00 PM", party: 4, table: "Table 12"},
        {id: "RES002", customer: "Lisa Garcia", date: "2025-07-27", time: "8:30 PM", party: 2, table: "Table 8"},
        {id: "RES003", customer: "John Smith", date: "2025-07-28", time: "6:00 PM", party: 6, table: "Table 15"}
      ],
      customers: [
        {id: 1, name: "Sarah Johnson", email: "sarah@email.com", orders: 12, total_spent: 248.50, favorite: "Buddha Bowl"},
        {id: 2, name: "Mike Chen", email: "mike@email.com", orders: 8, total_spent: 156.80, favorite: "Quinoa Salad"},
        {id: 3, name: "Emma Wilson", email: "emma@email.com", orders: 15, total_spent: 312.75, favorite: "Plant Burger"}
      ],
      metrics: {
        daily_revenue: 1247.50,
        orders_today: 23,
        reservations_today: 8,
        popular_item: "Buddha Bowl"
      }
    };
    
    this.charts = {};
    this.init();
  }

  init() {
    // Always start on login page
    this.isAuthenticated = false;
    this.checkAuthState();
    this.setupEventListeners();
  }

  checkAuthState() {
    const loginPage = document.getElementById('loginPage');
    const adminPanel = document.getElementById('adminPanel');
    
    if (this.isAuthenticated) {
      if (loginPage) loginPage.classList.add('hidden');
      if (adminPanel) adminPanel.classList.remove('hidden');
      this.loadPage('dashboard');
    } else {
      if (loginPage) loginPage.classList.remove('hidden');
      if (adminPanel) adminPanel.classList.add('hidden');
    }
  }

  setupEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        this.handleLogin();
      });
    }

    // Alternative: Direct button click
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Login button clicked');
        this.handleLogin();
      });
    }

    // Logout button - use event delegation
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'logoutBtn') {
        e.preventDefault();
        this.handleLogout();
      }
    });

    // Sidebar toggle - use event delegation
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'sidebarToggle') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
          sidebar.classList.toggle('open');
        }
      }
    });

    // Navigation links - use event delegation
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-link[data-page]') || e.target.closest('.nav-link[data-page]')) {
        e.preventDefault();
        const link = e.target.matches('.nav-link[data-page]') ? e.target : e.target.closest('.nav-link[data-page]');
        const page = link.dataset.page;
        this.loadPage(page);
        
        // Update active state
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Close mobile sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
          sidebar.classList.remove('open');
        }
      }
    });

    // Modal controls - use event delegation
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'modalClose') {
        this.closeModal();
      }
      if (e.target && e.target.id === 'modalOverlay') {
        this.closeModal();
      }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('sidebar');
      const sidebarToggle = document.getElementById('sidebarToggle');
      
      if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && (!sidebarToggle || !sidebarToggle.contains(e.target))) {
          sidebar.classList.remove('open');
        }
      }
    });
  }

  async handleLogin() {
    console.log('handleLogin called');
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!emailInput || !passwordInput || !loginBtn) {
      console.error('Login form elements not found');
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    console.log('Email:', email, 'Password:', password);

    // Basic validation
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    // Show loading state
    const loginBtnText = loginBtn.querySelector('.login-btn-text');
    const loginSpinner = loginBtn.querySelector('.login-spinner');
    
    loginBtn.disabled = true;
    if (loginBtnText) loginBtnText.classList.add('hidden');
    if (loginSpinner) loginSpinner.classList.remove('hidden');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Accept any non-empty email and password for demo purposes
      console.log('Authenticating user...');
      this.isAuthenticated = true;
      this.showAdminPanel();
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    } finally {
      // Reset button state
      loginBtn.disabled = false;
      if (loginBtnText) loginBtnText.classList.remove('hidden');
      if (loginSpinner) loginSpinner.classList.add('hidden');
    }
  }

  handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.isAuthenticated = false;
      this.showLoginPage();
      
      // Clear any sensitive data
      Object.values(this.charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
      this.charts = {};
      this.currentPage = 'dashboard';
      
      // Reset navigation state
      setTimeout(() => {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.dataset.page === 'dashboard') {
            link.classList.add('active');
          }
        });
      }, 100);
    }
  }

  showLoginPage() {
    const loginPage = document.getElementById('loginPage');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginPage && adminPanel) {
      loginPage.classList.remove('hidden');
      adminPanel.classList.add('hidden');
      
      // Clear form
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
    }
  }

  showAdminPanel() {
    console.log('Showing admin panel');
    const loginPage = document.getElementById('loginPage');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginPage && adminPanel) {
      loginPage.classList.add('hidden');
      adminPanel.classList.remove('hidden');
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        this.loadPage('dashboard');
      }, 100);
    }
  }

  loadPage(page) {
    if (!this.isAuthenticated) {
      return;
    }

    this.currentPage = page;
    const mainContent = document.getElementById('mainContent');
    
    if (!mainContent) {
      console.error('Main content container not found');
      return;
    }
    
    // Destroy existing charts to prevent memory leaks
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts = {};
    
    switch(page) {
      case 'dashboard':
        mainContent.innerHTML = this.renderDashboard();
        setTimeout(() => this.initDashboardCharts(), 100);
        break;
      case 'orders':
        mainContent.innerHTML = this.renderOrders();
        setTimeout(() => this.setupOrdersEventListeners(), 100);
        break;
      case 'menu':
        mainContent.innerHTML = this.renderMenu();
        setTimeout(() => this.setupMenuEventListeners(), 100);
        break;
      case 'reservations':
        mainContent.innerHTML = this.renderReservations();
        break;
      case 'customers':
        mainContent.innerHTML = this.renderCustomers();
        setTimeout(() => this.setupCustomersEventListeners(), 100);
        break;
      case 'analytics':
        mainContent.innerHTML = this.renderAnalytics();
        setTimeout(() => this.initAnalyticsCharts(), 100);
        break;
      default:
        mainContent.innerHTML = this.renderDashboard();
        setTimeout(() => this.initDashboardCharts(), 100);
    }
  }

  renderDashboard() {
    return `
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back! Here's what's happening at VeggieBite today.</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${this.data.metrics.orders_today}</div>
          <div class="metric-label">Orders Today</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">$${this.data.metrics.daily_revenue.toFixed(2)}</div>
          <div class="metric-label">Daily Revenue</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${this.data.metrics.reservations_today}</div>
          <div class="metric-label">Active Reservations</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${this.data.menu_items.length}</div>
          <div class="metric-label">Menu Items</div>
        </div>
      </div>

      <div class="data-grid grid-2">
        <div class="card">
          <div class="card-header">
            <h3>Recent Orders</h3>
            <button class="btn btn--secondary btn--sm" onclick="window.veggieBiteApp.loadPage('orders')">View All</button>
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
                ${this.data.recent_orders.map(order => `
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

      <div class="data-grid grid-2">
        <div class="card">
          <div class="card-header">
            <h3>Popular Items</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${this.data.menu_items.slice(0, 5).map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--veggie-light-green); border-radius: 8px;">
                  <div>
                    <div style="font-weight: 500;">${item.name}</div>
                    <div style="font-size: 12px; color: var(--color-text-secondary);">${item.category}</div>
                  </div>
                  <div style="font-weight: bold; color: var(--veggie-teal);">$${item.price.toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <button class="btn btn--primary" onclick="window.veggieBiteApp.loadPage('orders')">📝 Manage Orders</button>
              <button class="btn btn--primary" onclick="window.veggieBiteApp.loadPage('menu')">🍽️ Update Menu</button>
              <button class="btn btn--primary" onclick="window.veggieBiteApp.loadPage('reservations')">📅 View Reservations</button>
              <button class="btn btn--secondary" onclick="window.veggieBiteApp.loadPage('analytics')">📈 View Analytics</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderOrders() {
    return `
      <div class="page-header">
        <h1 class="page-title">Orders Management</h1>
        <p class="page-subtitle">Track and manage incoming vegetarian food orders</p>
      </div>

      <div class="filter-controls">
        <div class="filter-group">
          <button class="btn btn--primary btn--sm order-filter active" data-status="all">All Orders</button>
          <button class="btn btn--secondary btn--sm order-filter" data-status="pending">Pending</button>
          <button class="btn btn--secondary btn--sm order-filter" data-status="preparing">Preparing</button>
          <button class="btn btn--secondary btn--sm order-filter" data-status="ready">Ready</button>
          <button class="btn btn--secondary btn--sm order-filter" data-status="delivered">Delivered</button>
        </div>
        <input type="text" class="form-control" placeholder="Search orders..." style="max-width: 300px;" id="orderSearch">
      </div>

      <div class="data-grid grid-3" id="ordersGrid">
        ${this.data.recent_orders.map(order => `
          <div class="order-card" data-status="${order.status}">
            <div class="order-header">
              <div>
                <div class="order-id">${order.id}</div>
                <div class="order-customer">${order.customer}</div>
                <div style="font-size: 12px; color: var(--color-text-secondary);">${order.time}</div>
              </div>
              <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
            <div class="order-items">
              <div class="order-item">🌱 ${order.items}</div>
            </div>
            <div class="order-footer">
              <div class="order-total">$${order.total.toFixed(2)}</div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn--primary btn--sm" onclick="window.veggieBiteApp.viewOrderDetails('${order.id}')">Details</button>
                <button class="btn btn--secondary btn--sm" onclick="window.veggieBiteApp.updateOrderStatus('${order.id}')">Update</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderMenu() {
    return `
      <div class="page-header">
        <h1 class="page-title">Menu Management</h1>
        <p class="page-subtitle">Manage your delicious vegetarian dishes and pricing</p>
      </div>

      <div class="filter-controls">
        <button class="btn btn--primary" onclick="window.veggieBiteApp.showAddMenuItemModal()">+ Add New Dish</button>
        <div class="filter-group">
          <button class="btn btn--secondary btn--sm menu-filter active" data-category="all">All Categories</button>
          <button class="btn btn--secondary btn--sm menu-filter" data-category="bowls">Bowls</button>
          <button class="btn btn--secondary btn--sm menu-filter" data-category="salads">Salads</button>
          <button class="btn btn--secondary btn--sm menu-filter" data-category="burgers">Burgers</button>
          <button class="btn btn--secondary btn--sm menu-filter" data-category="asian">Asian</button>
          <button class="btn btn--secondary btn--sm menu-filter" data-category="wraps">Wraps</button>
        </div>
      </div>

      <div class="data-grid grid-3" id="menuGrid">
        ${this.data.menu_items.map(item => `
          <div class="menu-item-card" data-category="${item.category.toLowerCase()}">
            <div class="menu-item-image">
              🥗 ${item.name} Photo
            </div>
            <div class="menu-item-info">
              <div class="menu-item-name">${item.name}</div>
              <div class="menu-item-price">$${item.price.toFixed(2)}</div>
              <div class="menu-item-category">${item.category}</div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                <span class="status-badge status-${item.status}">${item.status}</span>
                <div style="display: flex; gap: 8px;">
                  <button class="btn btn--secondary btn--sm" onclick="window.veggieBiteApp.editMenuItem(${item.id})">Edit</button>
                  <button class="btn btn--secondary btn--sm" onclick="window.veggieBiteApp.toggleItemStatus(${item.id})">Toggle</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderReservations() {
    return `
      <div class="page-header">
        <h1 class="page-title">Table Reservations</h1>
        <p class="page-subtitle">Manage dining reservations and table arrangements</p>
      </div>

      <div class="filter-controls">
        <input type="date" class="form-control" value="2025-07-27" style="max-width: 200px;">
        <div class="filter-group">
          <button class="btn btn--primary">+ New Reservation</button>
          <button class="btn btn--secondary btn--sm">Today</button>
          <button class="btn btn--secondary btn--sm">Tomorrow</button>
        </div>
      </div>

      <div class="reservation-layout">
        <div class="table-floor-plan">
          🏪 VeggieBite Floor Plan<br>
          <small>Interactive table layout - ${this.data.reservations.length} reservations today</small>
        </div>
        
        <div class="reservation-list">
          <h3 style="margin-bottom: 16px;">Today's Reservations</h3>
          ${this.data.reservations.map(reservation => `
            <div class="reservation-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                  <div style="font-weight: 600; color: var(--color-text);">${reservation.customer}</div>
                  <div style="font-size: 14px; color: var(--color-text-secondary);">${reservation.time} • ${reservation.party} guests</div>
                </div>
                <span class="status-badge status-available">Confirmed</span>
              </div>
              <div style="font-size: 14px; margin-bottom: 12px;">
                📍 ${reservation.table}<br>
                📅 ${reservation.date}
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn--primary btn--sm" onclick="window.veggieBiteApp.editReservation('${reservation.id}')">Edit</button>
                <button class="btn btn--secondary btn--sm" onclick="window.veggieBiteApp.cancelReservation('${reservation.id}')">Cancel</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderCustomers() {
    return `
      <div class="page-header">
        <h1 class="page-title">Customer Management</h1>
        <p class="page-subtitle">Track loyal VeggieBite customers and their preferences</p>
      </div>

      <div class="filter-controls">
        <input type="text" class="form-control" placeholder="Search customers..." style="max-width: 300px;" id="customerSearch">
        <div class="filter-group">
          <button class="btn btn--secondary btn--sm">All Customers</button>
          <button class="btn btn--secondary btn--sm">VIP Members</button>
          <button class="btn btn--secondary btn--sm">Recent Orders</button>
        </div>
      </div>

      <div class="data-grid grid-3" id="customersGrid">
        ${this.data.customers.map(customer => `
          <div class="customer-card">
            <div class="customer-header">
              <div class="customer-avatar">${customer.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <div class="customer-name">${customer.name}</div>
                <div class="customer-email">${customer.email}</div>
              </div>
            </div>
            <div class="customer-stats">
              <div class="customer-stat">
                <div class="stat-value">${customer.orders}</div>
                <div class="stat-label">Orders</div>
              </div>
              <div class="customer-stat">
                <div class="stat-value">$${customer.total_spent.toFixed(2)}</div>
                <div class="stat-label">Total Spent</div>
              </div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 8px;">
                💚 Favorite: ${customer.favorite}
              </div>
              <span class="status-badge status-available">Active Customer</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn--primary btn--sm" onclick="window.veggieBiteApp.viewCustomerHistory(${customer.id})">History</button>
              <button class="btn btn--secondary btn--sm" onclick="window.veggieBiteApp.contactCustomer(${customer.id})">Contact</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderAnalytics() {
    return `
      <div class="page-header">
        <h1 class="page-title">Business Analytics</h1>
        <p class="page-subtitle">Insights and performance metrics for VeggieBite</p>
      </div>

      <div class="filter-controls">
        <select class="form-control" style="max-width: 200px;">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Month</option>
          <option>Last 3 Months</option>
        </select>
        <button class="btn btn--primary">📊 Export Report</button>
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

      <div class="data-grid grid-2">
        <div class="card">
          <div class="card-header">
            <h3>Top Performing Items</h3>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Buddha Bowl</td><td>47</td><td>$704.53</td><td>⭐ 4.8</td></tr>
                <tr><td>Plant-Based Burger</td><td>32</td><td>$511.68</td><td>⭐ 4.7</td></tr>
                <tr><td>Quinoa Power Salad</td><td>28</td><td>$363.72</td><td>⭐ 4.6</td></tr>
                <tr><td>Thai Green Curry</td><td>25</td><td>$349.75</td><td>⭐ 4.9</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Customer Satisfaction</h3>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="satisfactionChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupOrdersEventListeners() {
    // Order filter buttons
    document.querySelectorAll('.order-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update button states
        document.querySelectorAll('.order-filter').forEach(b => {
          b.classList.remove('btn--primary');
          b.classList.add('btn--secondary');
          b.classList.remove('active');
        });
        e.target.classList.remove('btn--secondary');
        e.target.classList.add('btn--primary');
        e.target.classList.add('active');
        
        const status = e.target.dataset.status;
        this.filterOrders(status);
      });
    });

    // Order search
    const searchInput = document.getElementById('orderSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchOrders(e.target.value);
      });
    }
  }

  setupMenuEventListeners() {
    // Menu category filters
    document.querySelectorAll('.menu-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update button states
        document.querySelectorAll('.menu-filter').forEach(b => {
          b.classList.remove('btn--primary');
          b.classList.add('btn--secondary');
          b.classList.remove('active');
        });
        e.target.classList.remove('btn--secondary');  
        e.target.classList.add('btn--primary');
        e.target.classList.add('active');
        
        const category = e.target.dataset.category;
        this.filterMenu(category);
      });
    });
  }

  setupCustomersEventListeners() {
    // Customer search
    const searchInput = document.getElementById('customerSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchCustomers(e.target.value);
      });
    }
  }

  filterOrders(status) {
    const orders = document.querySelectorAll('.order-card');
    orders.forEach(order => {
      if (status === 'all' || order.dataset.status === status) {
        order.style.display = 'block';
      } else {
        order.style.display = 'none';
      }
    });
  }

  searchOrders(query) {
    const orders = document.querySelectorAll('.order-card');
    orders.forEach(order => {
      const text = order.textContent.toLowerCase();
      if (text.includes(query.toLowerCase())) {
        order.style.display = 'block';
      } else {
        order.style.display = 'none';
      }
    });
  }

  filterMenu(category) {
    const items = document.querySelectorAll('.menu-item-card');
    items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  searchCustomers(query) {
    const customers = document.querySelectorAll('.customer-card');
    customers.forEach(customer => {
      const text = customer.textContent.toLowerCase();
      if (text.includes(query.toLowerCase())) {
        customer.style.display = 'block';
      } else {
        customer.style.display = 'none';
      }
    });
  }

  // Modal and interaction methods
  viewOrderDetails(orderId) {
    const order = this.data.recent_orders.find(o => o.id === orderId);
    if (order) {
      this.showModal('Order Details', `
        <div style="margin-bottom: 20px;">
          <h4>${order.id}</h4>
          <p><strong>Customer:</strong> ${order.customer}</p>
          <p><strong>Items:</strong> ${order.items}</p>
          <p><strong>Time:</strong> ${order.time}</p>
          <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn--primary" onclick="window.veggieBiteApp.closeModal()">Close</button>
          <button class="btn btn--secondary">Print Receipt</button>
        </div>
      `);
    }
  }

  updateOrderStatus(orderId) {
    this.showModal('Update Order Status', `
      <div class="form-group">
        <label class="form-label">Select New Status</label>
        <select class="form-control" id="newStatus">
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn btn--secondary" onclick="window.veggieBiteApp.closeModal()">Cancel</button>
        <button class="btn btn--primary" onclick="window.veggieBiteApp.confirmStatusUpdate('${orderId}')">Update Status</button>
      </div>
    `);
  }

  confirmStatusUpdate(orderId) {
    const newStatusElement = document.getElementById('newStatus');
    if (newStatusElement) {
      const newStatus = newStatusElement.value;
      // Update the order status in data
      const order = this.data.recent_orders.find(o => o.id === orderId);
      if (order) {
        order.status = newStatus;
      }
      this.closeModal();
      this.loadPage('orders');
    }
  }

  showAddMenuItemModal() {
    this.showModal('Add New Menu Item', `
      <form>
        <div class="form-group">
          <label class="form-label">Dish Name</label>
          <input type="text" class="form-control" placeholder="Enter dish name" id="itemName">
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-control" id="itemCategory">
            <option>Bowls</option>
            <option>Salads</option>
            <option>Burgers</option>
            <option>Asian</option>
            <option>Wraps</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Price ($)</label>
          <input type="number" class="form-control" placeholder="0.00" step="0.01" id="itemPrice">
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button type="button" class="btn btn--secondary" onclick="window.veggieBiteApp.closeModal()">Cancel</button>
          <button type="button" class="btn btn--primary" onclick="window.veggieBiteApp.addMenuItem()">Add Item</button>
        </div>
      </form>
    `);
  }

  addMenuItem() {
    const name = document.getElementById('itemName')?.value;
    const category = document.getElementById('itemCategory')?.value;
    const price = parseFloat(document.getElementById('itemPrice')?.value);
    
    if (name && category && price) {
      const newItem = {
        id: this.data.menu_items.length + 1,
        name: name,
        category: category,
        price: price,
        status: 'available'
      };
      this.data.menu_items.push(newItem);
    }
    
    this.closeModal();
    this.loadPage('menu');
  }

  editMenuItem(itemId) {
    const item = this.data.menu_items.find(i => i.id === itemId);
    if (item) {
      console.log(`Editing menu item: ${item.name}`);
    }
  }

  toggleItemStatus(itemId) {
    const item = this.data.menu_items.find(i => i.id === itemId);
    if (item) {
      item.status = item.status === 'available' ? 'limited' : 'available';
      this.loadPage('menu');
    }
  }

  viewCustomerHistory(customerId) {
    const customer = this.data.customers.find(c => c.id === customerId);
    if (customer) {
      this.showModal('Customer History', `
        <div style="margin-bottom: 20px;">
          <h4>${customer.name}</h4>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Total Orders:</strong> ${customer.orders}</p>
          <p><strong>Total Spent:</strong> $${customer.total_spent.toFixed(2)}</p>
          <p><strong>Favorite Dish:</strong> ${customer.favorite}</p>
        </div>
        <button class="btn btn--primary" onclick="window.veggieBiteApp.closeModal()">Close</button>
      `);
    }
  }

  contactCustomer(customerId) {
    console.log(`Contacting customer ID: ${customerId}`);
  }

  editReservation(reservationId) {
    console.log(`Editing reservation: ${reservationId}`);
  }

  cancelReservation(reservationId) {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      console.log(`Cancelling reservation: ${reservationId}`);
      this.loadPage('reservations');
    }
  }

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
          labels: ['Buddha Bowl', 'Plant-Based Burger', 'Quinoa Salad', 'Thai Green Curry', 'Med Wrap'],
          datasets: [{
            data: [47, 32, 28, 25, 20],
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    // Customer satisfaction chart
    const satisfactionCtx = document.getElementById('satisfactionChart');
    if (satisfactionCtx) {
      this.charts.satisfaction = new Chart(satisfactionCtx, {
        type: 'bar',
        data: {
          labels: ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star'],
          datasets: [{
            label: 'Reviews',
            data: [156, 89, 23, 5, 2],
            backgroundColor: ['#218085', '#7FA650', '#FFC185', '#B4413C', '#DB4545']
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
  }

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
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
      modalOverlay.classList.add('hidden');
    }
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - Initializing VeggieBite Admin');
  window.veggieBiteApp = new VeggieBiteAdmin();
});