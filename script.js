// ========================================
// PRELOADER
// ========================================
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
    setTimeout(() => {
        if (preloader) preloader.classList.add('hidden');
    }, 800);
});

// ========================================
// CUSTOM CURSOR
// ========================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.innerWidth > 1024) {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;

        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .service-card, .benefit-card, .portfolio-card, .pricing-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
}

// ========================================
// CANVAS BACKGROUND
// ========================================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas?.getContext('2d');

let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 20000);
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.4 + 0.1,
            hue: Math.random() > 0.5 ? 165 : 195
        });
    }
}

function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
            const force = (150 - dist) / 150;
            p.x -= dx * force * 0.015;
            p.y -= dy * force * 0.015;
        }

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 55%, ${p.opacity})`;
        ctx.fill();

        particles.slice(i + 1).forEach(p2 => {
            const dx2 = p.x - p2.x;
            const dy2 = p.y - p2.y;
            const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (dist2 < 100) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(0, 217, 165, ${(1 - dist2 / 100) * 0.08})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(drawParticles);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && canvas && ctx) {
    resizeCanvas();
    drawParticles();

    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

// ========================================
// HEADER SCROLL
// ========================================
const header = document.getElementById('header');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ========================================
// MOBILE MENU
// ========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========================================
// SCROLL REVEAL
// ========================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 80);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ========================================
// COUNTER ANIMATION
// ========================================
const counters = document.querySelectorAll('.stat-num[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ========================================
// FAQ ACCORDION
// ========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    }
});

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    });
});

// ========================================
// PROFILE IMAGE PLACEHOLDER
// ========================================
const profileImg = document.getElementById('profileImg');

if (profileImg) {
    profileImg.addEventListener('error', function() {
        this.style.display = 'none';
        
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #00d9a5, #00b4d8);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            font-weight: 800;
            color: #06080d;
            font-family: 'Sora', sans-serif;
            border-radius: 24px;
        `;
        placeholder.textContent = 'WS';
        
        this.parentNode.insertBefore(placeholder, this.nextSibling);
    });
}

// ========================================
// INIT
// ========================================
console.log('WebCraft Studio - Website Loaded Successfully');