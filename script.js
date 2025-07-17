document.addEventListener('DOMContentLoaded', () => {

    // [BARU] FUNGSI SLIDER IKLAN AUTOPLAY
    function initializeHeroSlider(containerSelector) {
        const sliderContainer = document.querySelector(containerSelector);
        if (!sliderContainer) return;
        
        const grid = sliderContainer.querySelector('.hero-slider-grid');
        const slides = sliderContainer.querySelectorAll('.hero-slide');
        const dotsContainer = sliderContainer.querySelector('.hero-slider-dots');
        if (slides.length <= 1) return;

        let currentIndex = 0;
        let autoplayInterval;

        // Cipta dots
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            grid.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, 5000); // Bergerak setiap 5 saat
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        sliderContainer.addEventListener('mouseenter', stopAutoplay);
        sliderContainer.addEventListener('mouseleave', startAutoplay);

        // Mula slider
        goToSlide(0);
        startAutoplay();
    }

    // Panggil fungsi slider baru
    initializeHeroSlider('.hero-slider-container');


    // Set tahun semasa di footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear().toString();
    }
    
    // Set tarikh dinamik untuk tajuk Tableau
    const dateElement = document.getElementById('dynamic-date');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-GB', options).replace(/\./g, '/');
    }

    // --- LOGIK MENU HAMBURGER BARU ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        const isExpanded = hamburgerBtn.classList.contains('active');
        hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        });

    // Tambahan: Tutup menu bila pautan diklik
        mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
            });
            }

    // --- Fungsi Smooth Scrolling ---
    document.querySelectorAll('#nav-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Tutup menu jika terbuka (untuk mobile)
            if (hamburgerBtn.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
                const offsetPosition = targetElement.offsetTop - headerHeight - navHeight - 20;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Fungsi Slider Universal ---
    function initializeSlider(containerSelector) {
        const sliderSection = document.querySelector(containerSelector);
        if (!sliderSection) return;

        const cards = Array.from(sliderSection.querySelectorAll('.project-card'));
        const nextBtn = sliderSection.querySelector('.next-slide');
        const prevBtn = sliderSection.querySelector('.prev-slide');
        const dotsContainer = sliderSection.querySelector('.slider-dots-container');
        if (cards.length === 0) return;
        
        const totalCards = cards.length;
        let currentIndex = 0;

        function updateSlider() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next');
                let prevIndex = (currentIndex - 1 + totalCards) % totalCards;
                let nextIndex = (currentIndex + 1) % totalCards;
                if (index === currentIndex) { card.classList.add('active'); }
                else if (index === prevIndex) { card.classList.add('prev'); }
                else if (index === nextIndex) { card.classList.add('next'); }
            });
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalCards; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => { currentIndex = i; updateSlider(); });
                dotsContainer.appendChild(dot);
            }
        }
        
        updateSlider();
        if(nextBtn) nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % totalCards; updateSlider(); });
        if(prevBtn) prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + totalCards) % totalCards; updateSlider(); });
    }
    initializeSlider('#looker-studio-section');

    // --- Fungsi Modal Imej ---
    const modal = document.getElementById('imageModal');
    if(modal) {
        const modalImg = document.getElementById('modalImage');
        const captionText = document.getElementById('modal-caption');
        const closeBtn = document.querySelector('.close-modal-btn');
        const downloadLink = document.getElementById('downloadLink');

        function openModal(imgSrc, imgAlt) {
            if (!modalImg || !captionText) return;
            modal.classList.add('active');
            modalImg.src = imgSrc;
            modalImg.alt = imgAlt;
            captionText.textContent = imgAlt;
            document.body.style.overflow = 'hidden';
            if (downloadLink) {
                const fileName = `${imgAlt.replace(/\s+/g, '-')}.png`;
                downloadLink.href = imgSrc;
                downloadLink.download = fileName;
            }
        }

        function closeModal() {
            modal.classList.add('closing');
            setTimeout(() => {
                modal.classList.remove('active', 'closing');
                document.body.style.overflow = '';
            }, 500);
        }

        document.querySelectorAll('.open-image-modal').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const imagePath = this.getAttribute('data-image');
                const card = this.closest('.project-card');
                const title = card ? card.querySelector('h3')?.textContent : 'Image';
                if (imagePath) { openModal(imagePath, title || 'Image'); }
            });
        });
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
    }
});
