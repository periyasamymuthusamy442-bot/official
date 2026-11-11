/**
 * STUZEN TECHNOLOGIES — Global Script & Motion Framework
 * Tagline: Learn. Build. Innovate.
 * Features:
 *  - Unique Light/Dark Theme Engine (Default: Luminous Pearl-Glacier Light)
 *  - Scroll-Driven Reading Progress Bar
 *  - Scroll-Reveal Intersection Observer (Fade Up, Slide Left/Right, Stagger)
 *  - Interactive Card Mouse-Tracking Spotlight Effect
 *  - Ambient Background Aurora Injector
 *  - Stats Counter Animation
 *  - FAQ Accordion Transitions
 *  - Stuzen AI Chatbot Assistant
 *  - Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  injectMotionContainers();
  initTheme();
  initScrollProgress();
  initScrollReveal();
  initCardMouseSpotlight();
  initMobileNav();
  initHeaderScroll();
  initCounters();
  initFaqAccordions();
  initAiAssistant();
  initButtonRipples();
  initHeroSlider();
  initBackToTop();
  initAssistantPopover();
});

/* --------------------------------------------------------------------------
   1. Dynamic Motion Elements Injector (Aurora Background & Progress Bar)
   -------------------------------------------------------------------------- */
function injectMotionContainers() {
  // 1. Reading Progress Bar
  if (!document.getElementById('scrollProgressBar')) {
    const bar = document.createElement('div');
    bar.id = 'scrollProgressBar';
    document.body.appendChild(bar);
  }

  // 2. Ambient Floating Aurora Mesh Orbs
  if (!document.querySelector('.ambient-aurora-container')) {
    const aurora = document.createElement('div');
    aurora.className = 'ambient-aurora-container';
    aurora.innerHTML = `
      <div class="aurora-orb aurora-orb-1"></div>
      <div class="aurora-orb aurora-orb-2"></div>
      <div class="aurora-orb aurora-orb-3"></div>
    `;
    document.body.prepend(aurora);
  }
}

/* --------------------------------------------------------------------------
   2. Theme Toggle (Default: Unique Luminous Light)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  // Default to light theme as requested!
  const savedTheme = localStorage.getItem('stuzen_theme') || 'light';
  
  applyTheme(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'light' ? 'Luminous Light' : 'Deep Dark'} theme`);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('stuzen_theme', theme);

  // Update brand logos
  const brandLogos = document.querySelectorAll('.brand-logo-img');
  brandLogos.forEach(img => {
    if (theme === 'light') {
      img.src = 'assets/images/stuzen-logo.png';
    } else {
      img.src = 'assets/images/stuzen-logo-dark.png';
    }
  });

  // Update toggle icons
  const themeIcons = document.querySelectorAll('.theme-toggle-btn svg');
  themeIcons.forEach(icon => {
    if (theme === 'light') {
      // Show Moon icon (to switch to dark)
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    } else {
      // Show Sun icon (to switch to light)
      icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    }
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Reading Progress Bar Indicator
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. Scroll-Driven Reveal Animations (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  // Automatically tag cards, section headers, and process steps with reveal
  const elementsToReveal = document.querySelectorAll('.card, .section-header, .process-step-card, .project-card, .pricing-card, .testimonial-card, .faq-item, .contact-card-item');

  elementsToReveal.forEach((el, index) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      // Apply subtle stagger
      const staggerIndex = (index % 4) + 1;
      el.classList.add(`stagger-${staggerIndex}`);
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Card Mouse-Tracking Spotlight Effect
   -------------------------------------------------------------------------- */
function initCardMouseSpotlight() {
  const cards = document.querySelectorAll('.card, .process-step-card, .project-card, .pricing-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   6. Button Click Ripples & Micro-interactions
   -------------------------------------------------------------------------- */
function initButtonRipples() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;

      const rect = btn.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.style.position = 'absolute';
      circle.style.borderRadius = '50%';
      circle.style.background = 'rgba(255, 255, 255, 0.35)';
      circle.style.transform = 'scale(0)';
      circle.style.animation = 'rippleEffect 0.6s linear';
      circle.style.pointerEvents = 'none';

      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  // Inject ripple keyframes if not exists
  if (!document.getElementById('rippleStyles')) {
    const style = document.createElement('style');
    style.id = 'rippleStyles';
    style.textContent = `
      @keyframes rippleEffect {
        to {
          transform: scale(2.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/* --------------------------------------------------------------------------
   7. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  backdrop.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   8. Header Scroll Glass Transition
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   9. Animated Number Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.metric-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = 40;
        const increment = Math.ceil(target / speed);

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            counter.textContent = `${prefix}${target}${suffix}`;
            clearInterval(timer);
          } else {
            counter.textContent = `${prefix}${count}${suffix}`;
          }
        }, 28);

        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* --------------------------------------------------------------------------
   10. FAQ Accordions
   -------------------------------------------------------------------------- */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    // Set initial expanded state
    if (item.classList.contains('open')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      question.setAttribute('aria-expanded', 'true');
    } else {
      answer.style.maxHeight = null;
      question.setAttribute('aria-expanded', 'false');
    }

    question.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains('open');

      // Close all other accordion items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherQuestion = other.querySelector('.faq-question');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Keep height accurate if viewport resizes or fonts finish loading
  window.addEventListener('resize', () => {
    const openItem = document.querySelector('.faq-item.open');
    if (openItem) {
      const openAns = openItem.querySelector('.faq-answer');
      if (openAns) {
        openAns.style.maxHeight = openAns.scrollHeight + 'px';
      }
    }
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      const openItem = document.querySelector('.faq-item.open');
      if (openItem) {
        const openAns = openItem.querySelector('.faq-answer');
        if (openAns) {
          openAns.style.maxHeight = openAns.scrollHeight + 'px';
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   11. Stuzen AI Assistant Chatbot
   -------------------------------------------------------------------------- */
function initAiAssistant() {
  const floatBtn = document.querySelector('.ai-assistant-float-btn');
  const chatWindow = document.querySelector('.ai-chat-window');
  const closeBtn = document.querySelector('.ai-chat-close');
  const sendBtn = document.querySelector('.ai-chat-send');
  const chatInput = document.querySelector('.ai-chat-input');
  const chatBody = document.querySelector('.ai-chat-body');
  const quickBtns = document.querySelectorAll('.chat-quick-btn');

  if (!floatBtn || !chatWindow) return;

  floatBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open') && chatInput) {
      chatInput.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });
  }

  function appendMessage(text, sender = 'bot') {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    setTimeout(() => {
      const reply = generateAiResponse(text);
      appendMessage(reply, 'bot');
    }, 550);
  }

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      if (query) {
        appendMessage(btn.textContent, 'user');
        setTimeout(() => {
          const reply = generateAiResponse(query);
          appendMessage(reply, 'bot');
        }, 450);
      }
    });
  });
}

function generateAiResponse(input) {
  const q = input.toLowerCase();

  if (q.includes('service') || q.includes('offer') || q.includes('what do you do')) {
    return `At <strong>Stuzen Technologies</strong>, our 3 core pillars are:<br>• <strong>Website Development:</strong> High-performance web apps & corporate sites.<br>• <strong>Custom Software:</strong> Enterprise platforms, CRM/ERP & APIs.<br>• <strong>AI & Automation:</strong> Agentic AI workflows, WhatsApp bots & CRM sync.<br><br><a href="services.html" class="contact-card-link">View Full Services →</a>`;
  }
  if (q.includes('price') || q.includes('cost') || q.includes('quote') || q.includes('budget')) {
    return `Projects typically range based on scope:<br>• <strong>Starter Web:</strong> from $499<br>• <strong>Growth Business Platform:</strong> from $1,499<br>• <strong>Enterprise & AI Suite:</strong> from $3,499<br><br>Complete our <a href="discovery.html" class="contact-card-link">Interactive Discovery Form</a> for an instant estimate!`;
  }
  if (q.includes('discovery') || q.includes('form') || q.includes('requirements') || q.includes('questionnaire')) {
    return `You can fill out our official <strong>Website Project Requirements Discovery Form</strong> online! It covers all 10 stages and outputs a formatted brief to send directly to WhatsApp or download as PDF.<br><br><a href="discovery.html" class="contact-card-link">Open Discovery Wizard →</a>`;
  }
  if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('whatsapp')) {
    return `You can connect with us directly via:<br>• <strong>WhatsApp:</strong> <a href="https://wa.me/919876543210?text=Hello%20Stuzen%20Technologies" target="_blank" class="contact-card-link">Click to Chat on WhatsApp</a><br>• <strong>Email:</strong> contact@stuzentechnologies.com<br>• <strong>Phone:</strong> +91 98765 43210<br><br>Or book a consultation on our <a href="contact.html" class="contact-card-link">Contact Page</a>!`;
  }
  if (q.includes('timeline') || q.includes('deadline')) {
    return `Standard websites typically launch in <strong>2 to 4 weeks</strong>. Custom software and full AI automations take <strong>4 to 8 weeks</strong>.`;
  }

  return `Thanks for asking! We specialize in <strong>Websites, Custom Software, and AI Automation</strong>. Would you like to <a href="discovery.html" class="contact-card-link">Start a Project Discovery</a>, browse our <a href="services.html" class="contact-card-link">Services</a>, or <a href="contact.html" class="contact-card-link">Speak with an Engineer</a>?`;
}

/* --------------------------------------------------------------------------
   12. Toast Manager
   -------------------------------------------------------------------------- */
function showToast(message, duration = 3200) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066f5" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}


/* --------------------------------------------------------------------------
   13. Hero Slider ("Slidebar") Controller (Microsoft-Style)
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const section = document.getElementById('heroSlider');
  const track = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('#sliderTrack .hero-slide');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const playPauseBtn = document.getElementById('sliderPlayPauseBtn');
  const indicators = document.querySelectorAll('#sliderIndicators .ms-dash-indicator');

  if (!section || !track || !slides.length) return;

  const AUTOPLAY_MS = 5000; // time each slide stays on screen
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pauseIcon = '<rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect>';
  const playIcon = '<polygon points="7 4 20 12 7 20 7 4"></polygon>';

  let current = 0;
  let userPaused = reduceMotion; // user choice (or reduced-motion preference)
  let hoverPaused = false;
  let timer = null;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    indicators.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    slides.forEach((s, i) => s.setAttribute('aria-hidden', i === current ? 'false' : 'true'));
  }

  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (userPaused || hoverPaused) return;
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }
  function setPlayIcon() {
    if (!playPauseBtn) return;
    const svg = playPauseBtn.querySelector('svg');
    if (svg) svg.innerHTML = userPaused ? playIcon : pauseIcon;
    playPauseBtn.setAttribute('aria-label', userPaused ? 'Play slide autoplay' : 'Pause slide autoplay');
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); start(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); start(); });
  indicators.forEach((d, i) => d.addEventListener('click', () => { goTo(i); start(); }));

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      userPaused = !userPaused;
      setPlayIcon();
      start();
    });
  }

  // Pause while the visitor hovers or focuses inside the slider
  section.addEventListener('mouseenter', () => { hoverPaused = true; stop(); });
  section.addEventListener('mouseleave', () => { hoverPaused = false; start(); });
  section.addEventListener('focusin', () => { hoverPaused = true; stop(); });
  section.addEventListener('focusout', () => { hoverPaused = false; start(); });

  // Swipe on touch screens
  let startX = null;
  section.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  section.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { goTo(current + (dx < 0 ? 1 : -1)); start(); }
    startX = null;
  }, { passive: true });

  // Pause when the tab is hidden
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });

  goTo(0);
  setPlayIcon();
  start();
}

/* --------------------------------------------------------------------------
   14. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   15. Assistant Popover Dialogue (Can we help you?)
   -------------------------------------------------------------------------- */
function initAssistantPopover() {
  const popover = document.getElementById('msChatPopover');
  const chatBtn = document.getElementById('popoverChatBtn');
  const dismissBtn = document.getElementById('popoverDismissBtn');
  const chatWindow = document.querySelector('.ai-chat-window');

  if (!popover) return;

  // Auto-show after 2.8 seconds
  if (!sessionStorage.getItem('stuzen_popover_dismissed')) {
    setTimeout(() => {
      popover.classList.remove('hidden');
    }, 2800);
  } else {
    popover.classList.add('hidden');
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      popover.classList.add('hidden');
      sessionStorage.setItem('stuzen_popover_dismissed', 'true');
    });
  }

  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      popover.classList.add('hidden');
      if (chatWindow) {
        chatWindow.classList.add('open');
      }
    });
  }
}
