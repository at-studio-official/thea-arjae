// ==================================================== AOS Animation ========================================
AOS.init({
  duration: 700, // faster for smoother first-load
  once: true,
  mirror: false,
  disableMutationObserver: true
});

// ========================================================== LOADER & INITIAL SCROLL =======================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = 0;
    setTimeout(() => loader.style.display = 'none', 500);
  }

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      const headerOffset = 0;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }
});

// ================================================== QUICK NAV MENU =====================================================
const toggle = document.getElementById('quick-nav-toggle');
const nav = document.getElementById('quick-nav');
const links = nav.querySelectorAll('a');

toggle.addEventListener('click', () => nav.classList.toggle('show'));

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    nav.classList.remove('show');
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    const headerOffset = 0;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  });
});

// ================================================= HERO SLIDESHOW =======================================================
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
let heroInterval;

function showSlide(index) {
  heroSlides[currentSlide].classList.remove('active');
  currentSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides[currentSlide].classList.add('active');
  updateDots();
}

function startAutoSlide() { heroInterval = setInterval(() => showSlide(currentSlide + 1), 5000); }
function resetAutoSlide() { clearInterval(heroInterval); startAutoSlide(); }

if (heroSlides.length > 0) {
  startAutoSlide();
  const hero = document.querySelector('.hero');
  let startX = 0, endX = 0;

  hero.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  hero.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) < 50) return;
    showSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    resetAutoSlide();
  });

  const dotsContainer = document.querySelector('.hero-dots');
  heroSlides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => { showSlide(i); resetAutoSlide(); });
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('span');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }
}

// ============================================== COUNTDOWN ===============================================
(function(){
  const countdownItems = document.querySelectorAll('.countdown .count');
  const targetDate = new Date("November 26, 2027 16:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    let diff = targetDate - now;

    if(diff < 0) diff = 0; // avoid negative countdown

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownItems[0].textContent = days;
    countdownItems[1].textContent = hours;
    countdownItems[2].textContent = minutes;
    countdownItems[3].textContent = seconds;
  }

  updateCountdown(); // initial call
  setInterval(updateCountdown, 1000); // update every second
})();

// ================================================== JOURNEY, TIMELINE, DRESSCODE, RSVP ===================================
const animatedSections = document.querySelectorAll('.journey-item, .timeline .event, .dresscode-item, .rsvp-section');

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // ===== RSVP fix =====
      if (entry.target.classList.contains('rsvp-section')) {
        const header = entry.target.querySelector('h2');
        const btn = entry.target.querySelector('.btn');

        if (header) header.classList.add('visible');
        if (btn) {
          btn.classList.add('visible');
          setTimeout(() => btn.classList.add('pulse'), 600);
        }
      }

      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

animatedSections.forEach(sec => sectionObserver.observe(sec));

const rsvpBtn = document.getElementById('rsvpBtn');
const modal = document.getElementById('rsvpModal');
const cancelBtn = document.getElementById('modalCancel');
const proceedBtn = document.getElementById('modalProceed');

rsvpBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

proceedBtn.addEventListener('click', () => {
  window.open('https://forms.gle/qME86T6phNhG5NWP8', '_blank');
  modal.style.display = 'none';
});

// Close modal if clicking outside the content box
window.addEventListener('click', e => {
  if(e.target === modal) modal.style.display = 'none';
});

// =================================== SMOOTH BACKGROUND TRANSITION =====================================
const bgSections = document.querySelectorAll('[data-bg]');
const bgObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.body.style.background = entry.target.dataset.bg === "white" ? "#fff" : "#000";
    }
  });
}, { threshold: 0.5 });

bgSections.forEach(sec => bgObserver.observe(sec));

// ============================================= SWIPER GALLERY ==========================================
const galleryEl = document.querySelector('.gallery-swiper');
if (galleryEl) {
  const gallerySwiper = new Swiper('.gallery-swiper', {
    slidesPerView: 2,
    slidesPerGroup: 1,
    spaceBetween: 0,
    loop: true,
    grabCursor: true,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 0: { slidesPerView: 2 }, 768: { slidesPerView: 2 } }
  });

  const slides = galleryEl.querySelectorAll('.swiper-slide');
  slides.forEach(slide => {
    ['touchstart', 'touchend', 'touchcancel'].forEach(evt => {
      slide.addEventListener(evt, () => slide.classList.toggle('touch-active', evt === 'touchstart'));
    });
  });

  gallerySwiper.on('sliderMove', () => slides.forEach(s => s.classList.add('dragging')));
  gallerySwiper.on('touchEnd', () => slides.forEach(s => s.classList.remove('dragging')));
}

// ========================================================= FAQ ===========================================
document.querySelectorAll('.faq-item').forEach((item, index) => {
  const answer = item.querySelector('p');
  item.querySelector('h4').addEventListener('click', () => {
    document.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) {
        other.classList.remove('active');
        other.querySelector('p').style.setProperty('--delay', '0s');
      }
    });
    item.classList.toggle('active');
    answer.style.setProperty('--delay', item.classList.contains('active') ? `${index * 0.1}s` : '0s');
  });
});

// ============================================== AUDIO TOGGLE ===============================================
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.classList.add('active');
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('active');
    }
  });
}

// ============================================== GIFTS - OPEN QR ===============================================
function openQR(img) {
  const modal = document.getElementById('qr-modal');
  const modalImg = document.getElementById('qr-modal-img');
  modal.style.display = 'flex';
  modalImg.src = img.src;
}

const qrModal = document.getElementById('qr-modal');
const qrClose = document.getElementById('qr-close');

if (qrModal) {
  qrClose.addEventListener('click', () => { qrModal.style.display = 'none'; });
  qrModal.addEventListener('click', e => { if (e.target === qrModal) qrModal.style.display = 'none'; });
}