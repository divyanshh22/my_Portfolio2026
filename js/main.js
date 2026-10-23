(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const THEME_KEY = 'portfolio-theme';

  const ThemeModule = {
    button: null,
    meta: null,

    init() {
      this.button = document.getElementById('themeToggle');
      this.meta = document.getElementById('themeColorMeta');
      this.apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);

      if (this.button) {
        this.button.addEventListener('click', () => {
          const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
          this.apply(nextTheme, true);
        });
      }
    },

    apply(theme, persist) {
      root.setAttribute('data-theme', theme);
      root.setAttribute('data-bs-theme', theme);

      if (this.meta) {
        this.meta.setAttribute('content', theme === 'light' ? '#f6faf8' : '#070c11');
      }

      if (this.button) {
        const isLight = theme === 'light';
        const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
        this.button.setAttribute('aria-label', label);
        this.button.setAttribute('title', label);
        this.button.setAttribute('aria-pressed', String(isLight));
      }

      if (persist) {
        try {
          localStorage.setItem(THEME_KEY, theme);
        } catch {}
      }

      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
  };

  const TypingModule = {
    element: null,
    words: ['Python Developer', 'Backend Developer', 'Software Developer', 'Django Developer'],
    wordIndex: 0,
    charIndex: 0,
    deleting: false,
    timer: null,

    init() {
      this.element = document.getElementById('typingText');
      if (!this.element) {
        return;
      }

      if (reduceMotion.matches) {
        this.element.textContent = this.words[0];
        return;
      }

      this.element.textContent = '';
      this.timer = window.setTimeout(() => this.tick(), 450);
    },

    tick() {
      const word = this.words[this.wordIndex];

      if (this.deleting) {
        this.charIndex -= 1;
        this.element.textContent = word.slice(0, this.charIndex);

        if (this.charIndex === 0) {
          this.deleting = false;
          this.wordIndex = (this.wordIndex + 1) % this.words.length;
          this.timer = window.setTimeout(() => this.tick(), 350);
          return;
        }

        this.timer = window.setTimeout(() => this.tick(), 42);
        return;
      }

      this.charIndex += 1;
      this.element.textContent = word.slice(0, this.charIndex);

      if (this.charIndex === word.length) {
        this.deleting = true;
        this.timer = window.setTimeout(() => this.tick(), 1500);
        return;
      }

      this.timer = window.setTimeout(() => this.tick(), 82);
    }
  };

  const RevealModule = {
    init() {
      const items = Array.from(document.querySelectorAll('.reveal'));

      items.forEach((item) => {
        const delay = item.getAttribute('data-reveal-delay');
        if (delay) {
          item.style.setProperty('--reveal-delay', `${delay}ms`);
        }
      });

      if (!items.length) {
        return;
      }

      if (reduceMotion.matches || !('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('is-visible'));
        return;
      }

      const observer = new IntersectionObserver((entries, revealObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
      });

      items.forEach((item) => observer.observe(item));
    }
  };

  const NavigationModule = {
    navbar: null,
    navMenu: null,
    collapse: null,
    links: [],
    sections: [],
    activeId: '',

    init() {
      this.navbar = document.getElementById('mainNav');
      this.navMenu = document.getElementById('navMenu');
      this.links = Array.from(document.querySelectorAll('.navbar .nav-link[href^="#"]'));

      this.sections = this.links
        .map((link) => ({
          link,
          section: document.querySelector(link.getAttribute('href'))
        }))
        .filter((item) => item.section);

      if (!this.sections.length) {
        return;
      }

      if (this.navMenu && window.bootstrap && window.bootstrap.Collapse) {
        this.collapse = window.bootstrap.Collapse.getOrCreateInstance(this.navMenu, {
          toggle: false
        });
      }

      this.bindLinks();
      this.bindScrollSpy();
      this.updateActive();
    },

    navOffset() {
      return (this.navbar ? this.navbar.offsetHeight : 0) + 16;
    },

    scrollTo(section) {
      const top = Math.max(
        0,
        section.getBoundingClientRect().top + window.scrollY - this.navOffset()
      );

      window.scrollTo({
        top,
        behavior: reduceMotion.matches ? 'auto' : 'smooth'
      });
    },

    bindLinks() {
      document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || link.classList.contains('skip-link')) {
          return;
        }

        const hash = link.getAttribute('href');
        if (!hash || hash === '#') {
          return;
        }

        const section = document.querySelector(hash);
        if (!section) {
          return;
        }

        event.preventDefault();
        const isMobileMenuOpen = this.navMenu && this.navMenu.classList.contains('show');

        const finishNavigation = () => {
          this.scrollTo(section);
          this.setActive(section.id);
          try {
            history.replaceState(null, '', hash);
          } catch (error) {
            return;
          }
        };

        if (isMobileMenuOpen && this.collapse) {
          this.collapse.hide();
          window.setTimeout(finishNavigation, reduceMotion.matches ? 0 : 190);
          return;
        }

        finishNavigation();
      });
    },

    bindScrollSpy() {
      let frame = null;

      const update = () => {
        this.updateActive();
        frame = null;
      };

      window.addEventListener('scroll', () => {
        if (frame === null) {
          frame = window.requestAnimationFrame(update);
        }
      }, { passive: true });

      window.addEventListener('resize', () => {
        this.updateActive();
      });
    },

    updateActive() {
      if (!this.sections.length) {
        return;
      }

      const probe = window.scrollY + this.navOffset() + 90;
      let currentId = this.sections[0].section.id;

      this.sections.forEach((item) => {
        if (item.section.offsetTop <= probe) {
          currentId = item.section.id;
        }
      });

      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (isAtBottom) {
        currentId = this.sections[this.sections.length - 1].section.id;
      }

      this.setActive(currentId);
    },

    setActive(id) {
      if (!id || id === this.activeId) {
        return;
      }

      this.activeId = id;

      this.links.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);

        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }
  };

  const ScrollUIModule = {
    navbar: null,
    progressBar: null,
    backToTop: null,
    frame: null,

    init() {
      this.navbar = document.getElementById('mainNav');
      this.progressBar = document.getElementById('scrollProgressBar');
      this.backToTop = document.getElementById('backToTop');

      window.addEventListener('scroll', () => this.schedule(), { passive: true });
      window.addEventListener('resize', () => this.schedule());

      if (this.backToTop) {
        this.backToTop.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            behavior: reduceMotion.matches ? 'auto' : 'smooth'
          });
        });
      }

      this.render();
    },

    schedule() {
      if (this.frame !== null) {
        return;
      }

      this.frame = window.requestAnimationFrame(() => {
        this.render();
        this.frame = null;
      });
    },

    render() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0
        ? Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100))
        : 0;

      if (this.progressBar) {
        this.progressBar.style.width = `${progress}%`;
      }

      if (this.navbar) {
        this.navbar.classList.toggle('scrolled', scrollTop > 8);
      }

      if (this.backToTop) {
        this.backToTop.classList.toggle('is-visible', scrollTop > 600);
      }
    }
  };

  const CertificateModule = {
    init() {
      const modal = document.getElementById('certificateModal');
      const image = document.getElementById('certificateModalImage');
      const title = document.getElementById('certificateModalTitle');

      if (!modal || !image || !title || !window.bootstrap) {
        return;
      }

      modal.addEventListener('show.bs.modal', (event) => {
        const trigger = event.relatedTarget;
        if (!trigger) {
          return;
        }

        const imageSource = trigger.getAttribute('data-cert-image');
        const imageAlt = trigger.getAttribute('data-cert-alt');
        const certificateTitle = trigger.getAttribute('data-cert-title');

        if (imageSource) {
          image.setAttribute('src', imageSource);
        }

        if (imageAlt) {
          image.setAttribute('alt', imageAlt);
        }

        if (certificateTitle) {
          title.textContent = certificateTitle;
        }
      });
    }
  };

  const ContactModule = {
    init() {
      const form = document.getElementById('contactForm');
      const status = document.getElementById('formStatus');

      if (!form) {
        return;
      }

      const fields = Array.from(form.querySelectorAll('.form-control'));

      fields.forEach((field) => {
        field.addEventListener('input', () => {
          if (field.classList.contains('is-invalid')) {
            field.classList.remove('is-invalid');
          }

          if (status) {
            status.textContent = '';
            status.classList.remove('is-success', 'is-error');
          }
        });
      });

      form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          form.classList.add('was-validated');

          if (status) {
            status.textContent = 'Please complete the highlighted fields.';
            status.classList.add('is-error');
          }

          const firstInvalid = form.querySelector(':invalid');
          if (firstInvalid) {
            firstInvalid.focus();
          }
          return;
        }

        const action = form.getAttribute('action') || '';
        const isPlaceholderAction = action.includes('your-form-id');

        if (!isPlaceholderAction) {
          form.classList.add('was-validated');
          return;
        }

        event.preventDefault();
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        const message = String(data.get('message') || '').trim();
        const subject = encodeURIComponent(`Portfolio message from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

        window.location.href = `mailto:divyansh222f@gmail.com?subject=${subject}&body=${body}`;

        if (status) {
          status.textContent = 'Opening your email app. You can also email divyansh222f@gmail.com directly.';
          status.classList.remove('is-error');
          status.classList.add('is-success');
        }

        form.reset();
        form.classList.remove('was-validated');
      });
    }
  };

  const SceneModule = {
    scene: null,
    dayScene: null,
    hero: null,
    queued: false,

    init() {
      this.scene = document.querySelector('.space-scene');
      this.dayScene = document.querySelector('.day-scene');
      this.hero = document.getElementById('home');

      if (!this.hero || (!this.scene && !this.dayScene)) {
        return;
      }

      const update = () => {
        const cutoff = window.innerHeight * 0.4;
        const hasPassedHero = this.hero.getBoundingClientRect().bottom <= cutoff;
        const changed = hasPassedHero !== this.scene?.classList.contains('is-past-hero');
        this.scene?.classList.toggle('is-past-hero', hasPassedHero);
        this.dayScene?.classList.toggle('is-past-hero', hasPassedHero);
        this.queued = false;

        if (changed) {
          document.dispatchEvent(new CustomEvent('scenechange', { detail: { pastHero: hasPassedHero } }));
        }
      };

      const requestUpdate = () => {
        if (this.queued) {
          return;
        }

        this.queued = true;
        window.requestAnimationFrame(update);
      };

      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate, { passive: true });
      update();
    }
  };

  const FlightModule = {
    dividers: [],
    queued: false,

    init() {
      this.dividers = Array.from(document.querySelectorAll('.flight-divider'));

      if (!this.dividers.length) {
        return;
      }

      const update = () => {
        this.queued = false;
        const viewportHeight = window.innerHeight;
        const start = viewportHeight * 0.9;
        const end = viewportHeight * 0.45;

        this.dividers.forEach((divider) => {
          let progress = 1;

          if (!reduceMotion.matches) {
            const top = divider.getBoundingClientRect().top;
            progress = Math.min(1, Math.max(0, (start - top) / (start - end)));
          }

          const isLight = root.getAttribute('data-theme') === 'light';
          const vehicle = divider.querySelector(isLight ? '.flight-divider__birds' : '.flight-divider__plane');
          const vehicleWidth = vehicle ? vehicle.offsetWidth : (isLight ? 86 : 42);
          const travel = Math.max(0, divider.clientWidth - vehicleWidth - 12);
          const previousProgress = Number(divider._flightProgress || 0);
          let direction = Number(divider._flightDirection || 1);

          if (progress < previousProgress) {
            direction = -1;
          } else if (progress > previousProgress) {
            direction = 1;
          }

          divider._flightProgress = progress;
          divider._flightDirection = direction;
          divider.style.setProperty('--flight-progress', progress.toFixed(3));
          divider.style.setProperty('--flight-x', `${Math.round(progress * travel)}px`);
          divider.style.setProperty('--flight-dir', String(direction));
        });
      };

      const requestUpdate = () => {
        if (this.queued) {
          return;
        }

        this.queued = true;
        window.requestAnimationFrame(update);
      };

      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate, { passive: true });
      document.addEventListener('themechange', requestUpdate);

      if (typeof reduceMotion.addEventListener === 'function') {
        reduceMotion.addEventListener('change', requestUpdate);
      } else if (typeof reduceMotion.addListener === 'function') {
        reduceMotion.addListener(requestUpdate);
      }

      update();
    }
  };

  const DayBirdsModule = {
    scene: null,
    container: null,
    birds: [],

    init() {
      this.scene = document.querySelector('.day-scene');
      this.container = document.querySelector('.day-birds');

      if (!this.scene || !this.container) {
        return;
      }

      this.birds = Array.from(this.container.querySelectorAll('.day-bird'));

      if (!this.birds.length) {
        return;
      }

      this.reset();
      this.bind();
      this.start();
    },

    bind() {
      window.addEventListener('resize', () => this.restart(), { passive: true });
      document.addEventListener('themechange', () => this.restart());
      document.addEventListener('scenechange', () => this.restart());
      document.addEventListener('visibilitychange', () => this.restart());

      if (typeof reduceMotion.addEventListener === 'function') {
        reduceMotion.addEventListener('change', () => this.restart());
      } else if (typeof reduceMotion.addListener === 'function') {
        reduceMotion.addListener(() => this.restart());
      }
    },

    isActive() {
      return (
        root.getAttribute('data-theme') === 'light' &&
        !document.hidden &&
        !reduceMotion.matches &&
        this.scene &&
        !this.scene.classList.contains('is-past-hero')
      );
    },

    random(min, max) {
      return min + Math.random() * (max - min);
    },

    reset() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const minX = width * 0.08;
      const maxX = width * 0.82;
      const minY = height * 0.1;
      const maxY = height * 0.36;

      this.birds.forEach((bird) => {
        const x = this.random(minX, maxX);
        const y = this.random(minY, maxY);
        bird.style.setProperty('--bird-duration', '0s');
        bird.style.setProperty('--bird-x', `${x.toFixed(1)}px`);
        bird.style.setProperty('--bird-y', `${y.toFixed(1)}px`);
        bird.style.setProperty('--bird-dir', Math.random() > 0.5 ? '1' : '-1');
        bird.dataset.dayBirdX = String(x);
        bird.dataset.dayBirdY = String(y);
      });
    },

    restart() {
      this.stop();
      this.reset();

      if (this.isActive()) {
        this.start();
      }
    },

    start() {
      if (!this.isActive()) {
        return;
      }

      this.birds.forEach((bird, index) => {
        this.schedule(bird, 180 + index * 420);
      });
    },

    stop() {
      this.birds.forEach((bird) => {
        if (bird._dayBirdTimer) {
          window.clearTimeout(bird._dayBirdTimer);
          bird._dayBirdTimer = null;
        }
      });
    },

    schedule(bird, delay) {
      if (bird._dayBirdTimer) {
        window.clearTimeout(bird._dayBirdTimer);
      }

      bird._dayBirdTimer = window.setTimeout(() => {
        bird._dayBirdTimer = null;
        this.move(bird);
      }, delay);
    },

    move(bird) {
      if (!this.isActive()) {
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentX = Number(bird.dataset.dayBirdX || 0);
      const currentY = Number(bird.dataset.dayBirdY || 0);
      const minX = width * 0.07;
      const maxX = width * 0.84;
      const minY = height * 0.09;
      const maxY = height * 0.38;
      let targetX = this.random(minX, maxX);
      let targetY = this.random(minY, maxY);

      if (Math.abs(targetX - currentX) < width * 0.16) {
        targetX = currentX + (targetX >= currentX ? 1 : -1) * width * (0.2 + Math.random() * 0.18);
        targetX = Math.max(minX, Math.min(maxX, targetX));
      }

      const distance = Math.hypot(targetX - currentX, targetY - currentY);
      const duration = Math.min(11, Math.max(4.5, distance / 55));
      const direction = targetX >= currentX ? 1 : -1;

      bird.style.setProperty('--bird-duration', `${duration.toFixed(2)}s`);
      bird.style.setProperty('--bird-x', `${targetX.toFixed(1)}px`);
      bird.style.setProperty('--bird-y', `${targetY.toFixed(1)}px`);
      bird.style.setProperty('--bird-dir', String(direction));
      bird.dataset.dayBirdX = String(targetX);
      bird.dataset.dayBirdY = String(targetY);

      const pause = duration * 1000 + this.random(1200, 4200);
      bird._dayBirdTimer = window.setTimeout(() => {
        bird._dayBirdTimer = null;
        this.move(bird);
      }, pause);
    }
  };

  const SpaceEffectsModule = {
    scene: null,
    collision: null,
    timer: null,
    finishTimer: null,

    init() {
      this.scene = document.querySelector('.space-scene');
      this.collision = document.getElementById('asteroidCollision');

      if (!this.scene || !this.collision) {
        return;
      }

      document.addEventListener('themechange', () => this.refresh(6500));
      document.addEventListener('scenechange', (event) => {
        if (event.detail.pastHero) {
          this.stop();
          return;
        }

        this.schedule(7000);
      });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stop();
          return;
        }

        this.schedule(5500);
      });

      if (typeof reduceMotion.addEventListener === 'function') {
        reduceMotion.addEventListener('change', () => this.refresh(5500));
      } else if (typeof reduceMotion.addListener === 'function') {
        reduceMotion.addListener(() => this.refresh(5500));
      }

      window.addEventListener('resize', () => {
        if (window.innerWidth < 992) {
          this.stop();
          return;
        }

        if (!this.timer && !this.finishTimer) {
          this.schedule(7000);
        }
      }, { passive: true });

      this.schedule(9000);
    },

    canRun() {
      return !document.hidden
        && !reduceMotion.matches
        && window.innerWidth >= 992
        && root.getAttribute('data-theme') !== 'light'
        && !this.scene.classList.contains('is-past-hero');
    },

    refresh(delay) {
      this.stop();
      this.schedule(delay);
    },

    schedule(delay) {
      this.stop();

      if (!this.canRun()) {
        return;
      }

      this.timer = window.setTimeout(() => this.trigger(), delay + Math.random() * 4500);
    },

    stop() {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }

      if (this.finishTimer) {
        window.clearTimeout(this.finishTimer);
        this.finishTimer = null;
      }

      this.collision.classList.remove('is-active');
    },

    trigger() {
      this.timer = null;

      if (!this.canRun()) {
        return;
      }

      this.position();
      this.collision.classList.remove('is-active');
      void this.collision.offsetWidth;
      this.collision.classList.add('is-active');

      this.finishTimer = window.setTimeout(() => {
        this.finishTimer = null;
        this.collision.classList.remove('is-active');
        this.schedule(8000);
      }, 2800);
    },

    position() {
      const nav = document.getElementById('mainNav');
      const navHeight = nav ? nav.offsetHeight : 72;
      const minX = window.innerWidth * 0.42;
      const maxX = window.innerWidth * 0.68;
      const x = minX + Math.random() * (maxX - minX);
      const y = navHeight + 30 + Math.random() * Math.min(70, window.innerHeight * 0.08);

      this.collision.style.left = `${Math.round(x)}px`;
      this.collision.style.top = `${Math.round(y)}px`;
    }
  };

  const FooterModule = {
    init() {
      const year = document.getElementById('currentYear');
      if (year) {
        year.textContent = String(new Date().getFullYear());
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    ThemeModule.init();
    TypingModule.init();
    RevealModule.init();
    NavigationModule.init();
    ScrollUIModule.init();
    CertificateModule.init();
    ContactModule.init();
    SceneModule.init();
    FlightModule.init();
    DayBirdsModule.init();
    SpaceEffectsModule.init();
    FooterModule.init();
  });
})();
