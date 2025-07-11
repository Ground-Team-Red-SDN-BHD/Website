document.addEventListener('DOMContentLoaded', () => {

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

    // --- Fungsi Smooth Scrolling ---
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
                const offsetPosition = targetElement.offsetTop - navHeight - 20;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- LOGIK SLIDER COVER FLOW ---
    const sliderSection = document.getElementById('looker-studio-section');
    if (sliderSection) {
        const cards = Array.from(sliderSection.querySelectorAll('.project-card'));
        const nextBtn = sliderSection.querySelector('.next-slide');
        const prevBtn = sliderSection.querySelector('.prev-slide');
        const dotsContainer = sliderSection.querySelector('.slider-dots-container');
        const totalCards = cards.length;
        let currentIndex = 0;

        function updateSlider() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next');
                let prevIndex = (currentIndex - 1 + totalCards) % totalCards;
                let nextIndex = (currentIndex + 1) % totalCards;
                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === prevIndex) {
                    card.classList.add('prev');
                } else if (index === nextIndex) {
                    card.classList.add('next');
                }
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
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        if (totalCards > 0) {
            updateSlider();
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalCards;
                updateSlider();
            });
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateSlider();
            });
        }
    }

    // --- Fungsi Modal Imej ---
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.close-modal-btn');
    const downloadLink = document.getElementById('downloadLink');

    function openModal(imgSrc, imgAlt) {
        if (!modal || !modalImg || !captionText) return;
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
        if (!modal) return;
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
            if (imagePath) {
                openModal(imagePath, title || 'Image');
            }
        });
    });
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal(); });

    // [TAMBAH INI] Letakkan kod ini di dalam 'DOMContentLoaded'

    // --- LOGIK SLIDER UNTUK HIGHLIGHTS (AUTOPLAY) ---
    const highlightSlider = document.querySelector('#highlights .highlight-slider-grid');
    if (highlightSlider) {
    const slides = highlightSlider.querySelectorAll('.highlight-slide');
    const nextBtn = document.querySelector('.next-slide-h');
    const prevBtn = document.querySelector('.prev-slide-h');
    const dotsContainer = document.querySelector('.slider-dots-container-h');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoplayInterval;

    function goToHighlight(index) {
        sliderGrid.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
        updateHighlightDots();
    }

    function updateHighlightDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot-h');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToHighlight(i);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function nextHighlight() {
        let nextIndex = (currentIndex + 1) % totalSlides;
        goToHighlight(nextIndex);
    }
    
    function prevHighlight() {
        let prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        goToHighlight(prevIndex);
    }

    function startAutoplay() {
        stopAutoplay(); // Pastikan tiada autoplay lain berjalan
        autoplayInterval = setInterval(nextHighlight, 5000); // Tukar slaid setiap 5 saat
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    if (totalSlides > 0) {
        const sliderContainer = document.querySelector('.highlight-slider-container');
        nextBtn.addEventListener('click', () => { nextHighlight(); resetAutoplay(); });
        prevBtn.addEventListener('click', () => { prevHighlight(); resetAutoplay(); });

        // Jeda autoplay apabila tetikus berada di atas slider
        sliderContainer.addEventListener('mouseenter', stopAutoplay);
        sliderContainer.addEventListener('mouseleave', startAutoplay);
        
        // Mula semuanya
        updateHighlightDots();
        startAutoplay();
    }
}

});
