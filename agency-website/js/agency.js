/**
 * APEXDIGITAL SOLUTIONS - INTERACTIVE AGENCY ENGINE
 * Scope Estimator • Portfolio Filters • FAQ Accordion • Lead Capture
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    // Close when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // 2. Interactive Project Scope & Cost Estimator
  const estimatorState = {
    service: 'web', // 'web', 'erp', 'seo', 'marketing'
    scale: 'growth', // 'starter', 'growth', 'enterprise'
    addon: 'ai'      // 'none', 'ai', 'cloud'
  };

  const pricingData = {
    web: {
      title: 'Custom Website & E-Commerce Platform',
      starter: { price: '$1,800 - $3,200', timeline: '2 - 3 Weeks', deliverables: ['Bespoke Responsive Design', 'SEO-Optimized Code', 'CMS Integration', 'Mobile Optimization'] },
      growth: { price: '$3,500 - $6,500', timeline: '4 - 6 Weeks', deliverables: ['Custom E-Commerce Storefront', 'Payment Gateway & Cart', 'Advanced Speed Optimization', 'Analytics & Sales Tracking'] },
      enterprise: { price: '$7,000 - $14,000+', timeline: '6 - 10 Weeks', deliverables: ['Headless High-Load Architecture', 'Custom API Integrations', 'Multi-region CDN', 'Full Brand Identity Kit'] }
    },
    erp: {
      title: 'Custom ERP & CRM Software Solution',
      starter: { price: '$4,500 - $7,800', timeline: '4 - 6 Weeks', deliverables: ['Custom CRM Lead Pipeline', 'Client Portal & Invoicing', 'Role-Based Access Control', 'Database Setup'] },
      growth: { price: '$8,500 - $15,000', timeline: '6 - 10 Weeks', deliverables: ['Full ERP Operations Hub', 'Inventory & Workflow Automation', 'API & Third-party Integrations', 'Real-time Reporting Dashboards'] },
      enterprise: { price: '$16,000 - $30,000+', timeline: '10 - 16 Weeks', deliverables: ['Enterprise Multi-Entity ERP', 'Custom Microservices Architecture', 'Dedicated CI/CD & SLA Support', 'Legacy Data Migration'] }
    },
    seo: {
      title: 'Advanced SEO, AEO & Local Optimization',
      starter: { price: '$900 / mo', timeline: 'Ongoing (3-mo min)', deliverables: ['Google Business Profile Optimization', 'Technical Site Audit & Fixes', 'Targeted Local Keyword Tracking', 'Monthly Performance Report'] },
      growth: { price: '$1,800 / mo', timeline: 'Ongoing', deliverables: ['AI-Driven Search & AEO Strategy', 'E-Commerce Keyword Optimization', 'High-Authority Backlink Acquisition', 'Conversion Rate Optimization'] },
      enterprise: { price: '$3,400 / mo', timeline: 'Custom Retainer', deliverables: ['National/Global Geo-Targeted Campaigns', 'AI Search Engine Citations (SGE)', 'Competitive Gap Domination', 'Weekly Executive Briefings'] }
    },
    marketing: {
      title: 'AI-Powered Digital Marketing & Automation',
      starter: { price: '$1,200 / mo', timeline: 'Monthly Sprint', deliverables: ['Social Media Growth Strategy', 'Automated Lead Nurturing Emails', 'Ad Campaign Setup & A/B Tests', 'Digital Presence Audit'] },
      growth: { price: '$2,400 / mo', timeline: 'Quarterly Growth', deliverables: ['Multi-Channel Automated Funnel', 'AI Copy & Creative Automation', 'Geo-Targeted PPC Advertising', 'Marketing CRM Integration'] },
      enterprise: { price: '$4,800 / mo', timeline: 'Strategic Partner', deliverables: ['Full Omni-Channel Scale', 'Predictive AI Lead Scoring', 'Custom Video Production', 'Dedicated Growth Strategist'] }
    }
  };

  function updateEstimatorUI() {
    const current = pricingData[estimatorState.service][estimatorState.scale];
    const serviceNameEl = document.getElementById('estServiceName');
    const priceEl = document.getElementById('estPrice');
    const timelineEl = document.getElementById('estTimeline');
    const deliverablesList = document.getElementById('estDeliverables');

    if (serviceNameEl) serviceNameEl.textContent = pricingData[estimatorState.service].title;
    if (priceEl) priceEl.textContent = current.price;
    if (timelineEl) timelineEl.textContent = current.timeline;

    if (deliverablesList) {
      deliverablesList.innerHTML = '';
      current.deliverables.forEach(item => {
        const li = document.createElement('li');
        li.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; color: #cbd5e1;';
        li.innerHTML = '<span style="color: var(--accent-emerald);">✔</span> ' + item;
        deliverablesList.appendChild(li);
      });
    }
  }

  // Setup pill click listeners
  document.querySelectorAll('.pill-option').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const type = pill.getAttribute('data-type');
      const value = pill.getAttribute('data-value');

      if (type && value) {
        estimatorState[type] = value;
        // Update active class on siblings
        pill.parentElement.querySelectorAll('.pill-option').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        updateEstimatorUI();
      }
    });
  });

  // Initial estimator populate
  updateEstimatorUI();

  // 3. Portfolio Category Filtering
  const filterBtns = document.querySelectorAll('.tab-btn');
  const portfolioCards = document.querySelectorAll('.case-card');

  if (filterBtns.length > 0 && portfolioCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        portfolioCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      const wasActive = parent.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));

      // Toggle current
      if (!wasActive) {
        parent.classList.add('active');
      }
    });
  });

  // 5. Interactive Consultation Form Handler
  const proposalForm = document.getElementById('proposalForm');
  const formAlert = document.getElementById('formAlert');

  if (proposalForm) {
    proposalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value || '';
      const email = document.getElementById('clientEmail')?.value || '';
      const service = document.getElementById('selectedService')?.value || 'Custom Solution';

      if (formAlert) {
        formAlert.className = 'form-alert success';
        formAlert.style.display = 'block';
        formAlert.innerHTML = `
          <strong>Thank you, ${name}!</strong><br>
          Your project proposal request for <strong>${service}</strong> has been received. Our senior technical architect will review your specifications and contact you at <strong>${email}</strong> within 24 hours with a custom roadmap and proposal.
        `;
        proposalForm.reset();
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});
