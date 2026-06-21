document.addEventListener('DOMContentLoaded', () => {

  //Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Count-Up Animation for Hero Stats
  const countUpElements = document.querySelectorAll('[data-count]');
  if (countUpElements.length > 0) {
    const countUpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 1500;
          const startTime = performance.now();
          const decimals = (target % 1 !== 0) ? 1 : 0;

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = (eased * target).toFixed(decimals);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
          countUpObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    countUpElements.forEach(el => countUpObserver.observe(el));
  }

  //Intersection Observer for Scroll Animations
  // Dynamically assign staggered animation delays to grid elements
  document.querySelectorAll('.services-grid, .projects-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.fade-up');
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  const fadeElements = document.querySelectorAll('.fade-up');
  if (fadeElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
  }

  // Scroll Spy for Navbar
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar .link');
  let scrollSpyActive = false;

  const updateScrollSpy = () => {
    let current = '';
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    // Explicitly mark home as active when at/near top
    if (scrollPosition < 80) {
      current = 'hero';
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (scrollPosition >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
    }

    if (current) {
      let navTarget = current;
      if (current === 'experience') navTarget = 'about';
      if (current === 'certifications') navTarget = 'services';

      navLinks.forEach(link => {
        link.classList.remove('active-link');
        const href = link.getAttribute('href');
        if (href === `#${navTarget}`) {
          link.classList.add('active-link');
        }
      });
    }
  };

  window.addEventListener('scroll', () => {
    if (!scrollSpyActive) {
      scrollSpyActive = true;
      requestAnimationFrame(() => {
        updateScrollSpy();
        scrollSpyActive = false;
      });
    }
  });

  // Run once on load
  updateScrollSpy();

  // Mouse Drag & Keyboard Scrolling for Projects Grid
  const projectsGrid = document.querySelector('.projects-grid');
  if (projectsGrid) {
    let isDown = false;
    let startX;
    let scrollLeft;

    projectsGrid.style.cursor = 'grab';

    projectsGrid.addEventListener('mousedown', (e) => {
      isDown = true;
      projectsGrid.style.cursor = 'grabbing';
      projectsGrid.style.scrollSnapType = 'none';
      startX = e.pageX - projectsGrid.offsetLeft;
      scrollLeft = projectsGrid.scrollLeft;
    });

    projectsGrid.addEventListener('mouseleave', () => {
      isDown = false;
      projectsGrid.style.cursor = 'grab';
      projectsGrid.style.scrollSnapType = 'x mandatory';
    });

    projectsGrid.addEventListener('mouseup', () => {
      isDown = false;
      projectsGrid.style.cursor = 'grab';
      projectsGrid.style.scrollSnapType = 'x mandatory';
    });

    projectsGrid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - projectsGrid.offsetLeft;
      const walk = (x - startX) * 2;
      projectsGrid.scrollLeft = scrollLeft - walk;
    });

    projectsGrid.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        projectsGrid.scrollBy({ left: 280, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        projectsGrid.scrollBy({ left: -280, behavior: 'smooth' });
      }
    });
  }

  //Back to Top Smooth Scrolling
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Certificate Modal Logic
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const modalPlaceholder = document.getElementById('modalPlaceholder');
  const modalPlaceholderTitle = document.getElementById('modalPlaceholderTitle');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  let lastActiveElement = null;

  if (modal && modalClose) {
    const viewButtons = document.querySelectorAll('.cert-view-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        lastActiveElement = document.activeElement;
        
        const isProgress = btn.getAttribute('data-cert-progress') === 'true';
        if (isProgress) {
          const title = btn.getAttribute('data-cert-title') || 'Certification';
          if (modalPlaceholderTitle) {
            modalPlaceholderTitle.textContent = title;
          }
          if (modalImg) modalImg.style.display = 'none';
          if (modalPlaceholder) modalPlaceholder.style.display = 'block';
        } else {
          const imgPath = btn.getAttribute('data-cert-img');
          if (modalImg && imgPath) {
            modalImg.src = imgPath;
            modalImg.style.display = 'block';
          }
          if (modalPlaceholder) modalPlaceholder.style.display = 'none';
        }
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        modalClose.focus();
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      if (modalImg) {
        modalImg.src = '';
        modalImg.style.display = 'none';
      }
      if (modalPlaceholder) {
        modalPlaceholder.style.display = 'none';
      }
      document.body.style.overflow = '';
      if (lastActiveElement) {
        lastActiveElement.focus();
      }
    };

    modalClose.addEventListener('click', closeModal);
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', closeModal);
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }
});
