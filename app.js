/* ========================================================
   CERTIFICATE PORTFOLIO — APPLICATION
   3D horizontal scroll gallery with mesh backgrounds
   ======================================================== */

(function () {
    'use strict';

    /* ── DOM References ── */
    const galleryTrack     = document.getElementById('galleryTrack');
    const galleryViewport  = document.getElementById('galleryViewport');
    const galleryDots      = document.getElementById('galleryDots');
    const progressBar      = document.getElementById('progressBar');
    const currentIndexEl   = document.getElementById('currentIndex');
    const totalCountEl     = document.getElementById('totalCount');
    const prevBtn          = document.getElementById('prevBtn');
    const nextBtn          = document.getElementById('nextBtn');
    const heroStats        = document.getElementById('heroStats');
    const modalOverlay     = document.getElementById('modalOverlay');
    const modalClose       = document.getElementById('modalClose');
    const meshCanvas       = document.getElementById('meshCanvas');
    const particlesCanvas  = document.getElementById('particlesCanvas');

    let activeIndex = 0;
    let cardWidth   = 380;
    let gap         = 32; // 2rem
    let isDragging  = false;
    let startX      = 0;
    let dragOffset   = 0;

    /* ══════════════════════════════════════════════
       1. RENDER CERTIFICATES
       ══════════════════════════════════════════════ */

    function renderCards() {
        galleryTrack.innerHTML = '';
        galleryDots.innerHTML  = '';

        CERTIFICATES.forEach((cert, i) => {
            // Card
            const card = document.createElement('div');
            card.className = 'cert-card';
            card.dataset.index = i;
            card.style.animationDelay = `${0.1 + i * 0.1}s`;

            const catColor = CATEGORY_COLORS[cert.category] || {
                bg: 'rgba(99, 102, 241, 0.10)',
                border: 'rgba(99, 102, 241, 0.20)',
                text: '#a78bfa'
            };

            const imageSection = cert.image
                ? `<div class="card-image-container">
                       <img src="${cert.image}" alt="${cert.title}" loading="lazy">
                       <div class="card-image-overlay"></div>
                   </div>`
                : `<div class="card-image-placeholder">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                           <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                       </svg>
                   </div>`;

            card.innerHTML = `
                ${imageSection}
                <div class="card-body">
                    <span class="card-category" style="background:${catColor.bg};border-color:${catColor.border};color:${catColor.text}">
                        <span class="category-dot" style="background:${catColor.text}"></span>
                        ${cert.category}
                    </span>
                    <h3 class="card-title">${cert.title}</h3>
                    <p class="card-issuer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        ${cert.issuer}
                    </p>
                    <div class="card-footer">
                        <span class="card-date">${cert.date}</span>
                        <span class="card-view-btn">
                            Ver detalhes
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => openModal(i));
            galleryTrack.appendChild(card);

            // Dot
            const dot = document.createElement('button');
            dot.className = 'gallery-dot';
            dot.setAttribute('aria-label', `Certificado ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            galleryDots.appendChild(dot);
        });

        // Set counter
        totalCountEl.textContent = String(CERTIFICATES.length).padStart(2, '0');

        // Render stats
        renderStats();

        // Initial state
        updateActiveCard();
    }

    function renderStats() {
        const totalCerts = CERTIFICATES.length;
        const categories = [...new Set(CERTIFICATES.map(c => c.category))];
        const totalSkills = [...new Set(CERTIFICATES.flatMap(c => c.skills))].length;

        heroStats.innerHTML = `
            <div class="stat-item">
                <span class="stat-value">${totalCerts}</span>
                <span class="stat-label">Certificados</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${categories.length}</span>
                <span class="stat-label">Categorias</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${totalSkills}+</span>
                <span class="stat-label">Skills</span>
            </div>
        `;
    }

    /* ══════════════════════════════════════════════
       2. GALLERY NAVIGATION
       ══════════════════════════════════════════════ */

    function goTo(index) {
        activeIndex = Math.max(0, Math.min(index, CERTIFICATES.length - 1));
        updateActiveCard();
    }

    function goNext() { goTo(activeIndex + 1); }
    function goPrev() { goTo(activeIndex - 1); }

    function updateActiveCard() {
        const cards = document.querySelectorAll('.cert-card');
        const dots  = document.querySelectorAll('.gallery-dot');

        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev', 'next');
            if (i === activeIndex) card.classList.add('active');
            else if (i === activeIndex - 1) card.classList.add('prev');
            else if (i === activeIndex + 1) card.classList.add('next');
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });

        // Compute card width dynamically
        if (cards.length > 0) {
            cardWidth = cards[0].getBoundingClientRect().width;
        }

        // Center the active card
        const viewportWidth = galleryViewport.getBoundingClientRect().width;
        const offset = activeIndex * (cardWidth + gap) - (viewportWidth / 2 - cardWidth / 2);
        galleryTrack.style.transform = `translateX(${-Math.max(0, offset)}px)`;

        // Update counter
        currentIndexEl.textContent = String(activeIndex + 1).padStart(2, '0');

        // Update progress
        const progress = CERTIFICATES.length > 1 ? (activeIndex / (CERTIFICATES.length - 1)) * 100 : 100;
        progressBar.style.width = `${progress}%`;
    }

    // Navigation buttons
    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (modalOverlay.classList.contains('visible')) {
            if (e.key === 'Escape') closeModal();
            return;
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    });

    // Mouse wheel horizontal scroll
    galleryViewport.addEventListener('wheel', (e) => {
        // Support both vertical and horizontal wheel
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (delta > 30) goNext();
        else if (delta < -30) goPrev();
        e.preventDefault();
    }, { passive: false });

    // Touch / Drag
    galleryViewport.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        dragOffset = 0;
    });

    galleryViewport.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        dragOffset = 0;
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragOffset = e.clientX - startX;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        dragOffset = e.touches[0].clientX - startX;
    }, { passive: true });

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        if (dragOffset < -60) goNext();
        else if (dragOffset > 60) goPrev();
    }

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateActiveCard();
            resizeMeshCanvas();
            resizeParticlesCanvas();
        }, 150);
    });

    /* ══════════════════════════════════════════════
       3. MODAL
       ══════════════════════════════════════════════ */

    function openModal(index) {
        const cert = CERTIFICATES[index];
        const catColor = CATEGORY_COLORS[cert.category] || {
            bg: 'rgba(99, 102, 241, 0.10)',
            border: 'rgba(99, 102, 241, 0.20)',
            text: '#a78bfa'
        };

        document.getElementById('modalCategory').textContent = cert.category;
        document.getElementById('modalCategory').style.cssText = `background:${catColor.bg};border-color:${catColor.border};color:${catColor.text}`;
        document.getElementById('modalTitle').textContent = cert.title;
        document.getElementById('modalIssuer').textContent = `Emitido por: ${cert.issuer}`;
        document.getElementById('modalDate').textContent = cert.date;
        document.getElementById('modalDescription').textContent = cert.description;

        // Image
        const modalImg = document.getElementById('modalImage');
        const imgContainer = document.querySelector('.modal-image-container');
        if (cert.image) {
            modalImg.src = cert.image;
            modalImg.alt = cert.title;
            imgContainer.style.display = 'flex';
        } else {
            imgContainer.style.display = 'none';
        }

        // Skills
        const skillsContainer = document.getElementById('modalSkills');
        skillsContainer.innerHTML = cert.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');

        // Credential link
        const link = document.getElementById('modalLink');
        if (cert.credentialUrl && cert.credentialUrl !== '#') {
            link.href = cert.credentialUrl;
            link.classList.remove('hidden');
        } else {
            link.classList.add('hidden');
        }

        modalOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    /* ══════════════════════════════════════════════
       4. MESH CANVAS BACKGROUND
       ══════════════════════════════════════════════ */

    const meshCtx = meshCanvas.getContext('2d');
    let meshW, meshH;
    let mouseX = 0, mouseY = 0;

    function resizeMeshCanvas() {
        meshW = meshCanvas.width = window.innerWidth;
        meshH = meshCanvas.height = window.innerHeight;
    }

    resizeMeshCanvas();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function drawMesh(time) {
        meshCtx.clearRect(0, 0, meshW, meshH);

        const gridSize = 60;
        const cols = Math.ceil(meshW / gridSize) + 1;
        const rows = Math.ceil(meshH / gridSize) + 1;

        // Subtle wave offset
        const waveSpeed = time * 0.0003;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * gridSize;
                const y = j * gridSize;

                // Distance from mouse
                const dx = x - mouseX;
                const dy = y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 350;
                const influence = Math.max(0, 1 - dist / maxDist);

                // Wave displacement
                const waveX = Math.sin(waveSpeed + i * 0.3 + j * 0.15) * 3;
                const waveY = Math.cos(waveSpeed + j * 0.3 + i * 0.15) * 3;

                const px = x + waveX + influence * dx * 0.03;
                const py = y + waveY + influence * dy * 0.03;

                // Draw node
                const alpha = 0.03 + influence * 0.12;
                const size = 1 + influence * 2;

                meshCtx.beginPath();
                meshCtx.arc(px, py, size, 0, Math.PI * 2);
                meshCtx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
                meshCtx.fill();

                // Draw horizontal line to next node
                if (i < cols - 1) {
                    const nx = (i + 1) * gridSize + Math.sin(waveSpeed + (i + 1) * 0.3 + j * 0.15) * 3;
                    const ny = y + Math.cos(waveSpeed + j * 0.3 + (i + 1) * 0.15) * 3;
                    meshCtx.beginPath();
                    meshCtx.moveTo(px, py);
                    meshCtx.lineTo(nx, ny);
                    meshCtx.strokeStyle = `rgba(99, 102, 241, ${0.015 + influence * 0.06})`;
                    meshCtx.lineWidth = 0.5;
                    meshCtx.stroke();
                }

                // Draw vertical line to next node
                if (j < rows - 1) {
                    const nx = x + Math.sin(waveSpeed + i * 0.3 + (j + 1) * 0.15) * 3;
                    const ny = (j + 1) * gridSize + Math.cos(waveSpeed + (j + 1) * 0.3 + i * 0.15) * 3;
                    meshCtx.beginPath();
                    meshCtx.moveTo(px, py);
                    meshCtx.lineTo(nx, ny);
                    meshCtx.strokeStyle = `rgba(99, 102, 241, ${0.015 + influence * 0.06})`;
                    meshCtx.lineWidth = 0.5;
                    meshCtx.stroke();
                }
            }
        }
    }

    /* ══════════════════════════════════════════════
       5. FLOATING PARTICLES
       ══════════════════════════════════════════════ */

    const partCtx = particlesCanvas.getContext('2d');
    let partW, partH;
    const particles = [];
    const PARTICLE_COUNT = 50;

    function resizeParticlesCanvas() {
        partW = particlesCanvas.width = window.innerWidth;
        partH = particlesCanvas.height = window.innerHeight;
    }

    resizeParticlesCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * partW;
            this.y = Math.random() * partH;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.3 + 0.05;
            this.hue = Math.random() > 0.5 ? 239 : 187; // indigo or cyan
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < -10 || this.x > partW + 10 || this.y < -10 || this.y > partH + 10) {
                this.reset();
            }
        }

        draw() {
            partCtx.beginPath();
            partCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            partCtx.fillStyle = this.hue === 239
                ? `rgba(99, 102, 241, ${this.opacity})`
                : `rgba(34, 211, 238, ${this.opacity})`;
            partCtx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawParticles() {
        partCtx.clearRect(0, 0, partW, partH);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const alpha = (1 - dist / 150) * 0.08;
                    partCtx.beginPath();
                    partCtx.moveTo(particles[i].x, particles[i].y);
                    partCtx.lineTo(particles[j].x, particles[j].y);
                    partCtx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    partCtx.lineWidth = 0.5;
                    partCtx.stroke();
                }
            }
        }
    }

    /* ══════════════════════════════════════════════
       6. ANIMATION LOOP
       ══════════════════════════════════════════════ */

    function animate(time) {
        drawMesh(time);
        drawParticles();
        requestAnimationFrame(animate);
    }

    /* ══════════════════════════════════════════════
       7. INTERSECTION OBSERVER (Scroll Animations)
       ══════════════════════════════════════════════ */

    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.section-title, .gallery-controls').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s var(--ease-out-expo)';
            observer.observe(el);
        });
    }

    /* ══════════════════════════════════════════════
       8. INITIALIZE
       ══════════════════════════════════════════════ */

    function init() {
        renderCards();
        initScrollAnimations();
        requestAnimationFrame(animate);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
