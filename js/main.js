/* ==========================================
   RUMAH ULOS — main.js (Shared JavaScript)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-revealer-ready');

  // --------------------------------------------------
  // 1. Navbar: scroll glass-morphism + shrink
  // --------------------------------------------------
  const navbar = document.getElementById('navbar');
  const isIndexPage = ['', 'index.html', '/'].includes(window.location.pathname.split('/').pop());

  if (navbar) {
    // On index page, add nav-hero class initially for transparent glass
    if (isIndexPage) {
      navbar.classList.add('nav-hero');
    }

    const handleScroll = () => {
      if (window.scrollY > 80) {
        navbar.classList.add('nav-scrolled');
        navbar.classList.remove('nav-hero');
      } else {
        navbar.classList.remove('nav-scrolled');
        if (isIndexPage) navbar.classList.add('nav-hero');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load
  }

  // --------------------------------------------------
  // 2. Mobile Menu Toggle
  // --------------------------------------------------
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    const menuIcon = menuBtn.querySelector('.icon-open');
    const closeIcon = menuBtn.querySelector('.icon-close');

    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      if (menuIcon) menuIcon.classList.toggle('hidden', isOpen);
      if (closeIcon) closeIcon.classList.toggle('hidden', !isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        if (menuIcon) menuIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
      });
    });
  }

  // --------------------------------------------------
  // 3. Active Nav Link (highlight current page)
  // --------------------------------------------------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('text-red-700', '!text-red-700');
      link.classList.remove('text-white', 'text-gray-300');
    }
  });

  // --------------------------------------------------
  // 4. Intersection Observer — Scroll Reveal
  // --------------------------------------------------
  const revealTargets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------
  // 5. Progress Bars (animate on scroll)
  // --------------------------------------------------
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  if (progressBars.length) {
    const barObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.width;
          entry.target.style.width = target;
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    progressBars.forEach(bar => barObserver.observe(bar));
  }

  // --------------------------------------------------
  // 6. Counter Animation (for traction numbers)
  // --------------------------------------------------
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current.toLocaleString('id-ID') + suffix;
            if (current >= target) clearInterval(timer);
          }, 16);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // --------------------------------------------------
  // 7. Gallery Filter (products page / gallery page)
  // --------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('[data-category]');

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // --------------------------------------------------
  // 8. Lightbox
  // --------------------------------------------------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let galleryArray = [];
  let currentLightboxIndex = 0;

  if (lightbox && lightboxImg) {
    galleryArray = [...document.querySelectorAll('[data-lightbox]')];

    const openLightbox = (index) => {
      currentLightboxIndex = index;
      const el = galleryArray[index];
      lightboxImg.src = el.dataset.lightbox;
      lightboxImg.alt = el.dataset.caption || '';
      if (lightboxCaption) lightboxCaption.textContent = el.dataset.caption || '';
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    };

    galleryArray.forEach((el, i) => {
      el.addEventListener('click', () => openLightbox(i));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
      openLightbox((currentLightboxIndex - 1 + galleryArray.length) % galleryArray.length);
    });
    if (lightboxNext) lightboxNext.addEventListener('click', () => {
      openLightbox((currentLightboxIndex + 1) % galleryArray.length);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev?.click();
      if (e.key === 'ArrowRight') lightboxNext?.click();
    });
  }

  // --------------------------------------------------
  // 9. Smooth Tab switching (business page)
  // --------------------------------------------------
  const tabBtns = document.querySelectorAll('[data-tab-btn]');
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.tabBtn;
        tabBtns.forEach(b => {
          b.classList.remove('border-b-2', 'border-red-800', 'text-red-800');
          b.classList.add('text-gray-500');
        });
        btn.classList.add('border-b-2', 'border-red-800', 'text-red-800');
        btn.classList.remove('text-gray-500');

        document.querySelectorAll('[data-tab]').forEach(panel => {
          panel.classList.add('hidden');
        });
        document.getElementById(targetId)?.classList.remove('hidden');
      });
    });
    // Activate first tab
    tabBtns[0]?.click();
  }

  // --------------------------------------------------
  // 10. Hero Mouse Parallax
  // --------------------------------------------------
  const hero = document.getElementById('hero');
  const parallaxLayers = document.querySelectorAll('.hero-parallax-layer');
  const motifElements = document.querySelectorAll('.hero-motif-element');

  if (hero && (parallaxLayers.length || motifElements.length)) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const moveX = (clientX - innerWidth / 2) / innerWidth;
      const moveY = (clientY - innerHeight / 2) / innerHeight;

      parallaxLayers.forEach(layer => {
        const speed = layer.dataset.speed || 0.05;
        const x = moveX * speed * 100;
        const y = moveY * speed * 100;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.1)`;
      });

      motifElements.forEach((motif, index) => {
        const speed = 0.03 + (index * 0.02);
        const x = moveX * speed * 150;
        const y = moveY * speed * 150;
        motif.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${x * 0.1}deg)`;
      });
    });
  }

});

