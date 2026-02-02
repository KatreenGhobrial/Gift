// Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const celebration = document.getElementById('celebration');
const heartsContainer = document.getElementById('heartsContainer');

// Track YES button size
let yesButtonScale = 1;
let clickCount = 0;

// Create floating hearts
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = ['💕', '💖', '💗', '💝', '💘', '❤️', '💓'][Math.floor(Math.random() * 7)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Create hearts continuously
setInterval(createFloatingHeart, 300);

// Initial hearts
for (let i = 0; i < 15; i++) {
    setTimeout(createFloatingHeart, i * 200);
}

// NO button escape logic
noBtn.addEventListener('mouseenter', (e) => {
    escapeFromCursor(e);
});

noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    escapeFromCursor(e);
});

// Try to click NO button
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    escapeFromCursor(e);
});

function escapeFromCursor(e) {
    const btn = noBtn;

    // Add escaping class to switch to fixed positioning first
    if (!btn.classList.contains('escaping')) {
        btn.classList.add('escaping');
    }

    // Get ACTUAL button dimensions after it's positioned fixed
    const btnRect = btn.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    // Use a simple, conservative approach for bounds
    // Position is relative to viewport for fixed positioning
    const padding = 200; // MASSIVE padding to absolutely prevent escape

    console.log('🔴 NO BUTTON DEBUG');
    console.log('Window:', window.innerWidth, 'x', window.innerHeight);
    console.log('Button size:', btnWidth, 'x', btnHeight);

    // Simple strict bounds - button must fit completely in viewport
    const minX = padding;
    const maxX = window.innerWidth - btnWidth - padding;
    const minY = padding;
    const maxY = window.innerHeight - btnHeight - padding;

    // Generate random position within strict bounds, avoiding YES button
    let newX, newY;
    let attempts = 0;

    do {
        newX = minX + Math.random() * Math.max(0, maxX - minX);
        newY = minY + Math.random() * Math.max(0, maxY - minY);
        attempts++;
    } while (attempts < 10 && isNearYesButton(newX, newY));

    // Clamp to ensure we never exceed bounds
    newX = Math.max(padding, Math.min(window.innerWidth - btnWidth - padding, newX));
    newY = Math.max(padding, Math.min(window.innerHeight - btnHeight - padding, newY));

    console.log('Final X:', newX, '→', (newX + btnWidth), '(viewport:', window.innerWidth, ')');
    console.log('🔴 ---');

    // Apply the position
    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';

    // Force visibility with important to override CSS
    btn.style.setProperty('display', 'block', 'important');
    btn.style.setProperty('opacity', '1', 'important');
    btn.style.setProperty('visibility', 'visible', 'important');
    btn.style.setProperty('z-index', '9999', 'important');

    // Grow YES button each time NO is attempted
    growYesButton();
}

function isNearYesButton(x, y) {
    const yesRect = yesBtn.getBoundingClientRect();
    const yesCenterX = yesRect.left + yesRect.width / 2;
    const yesCenterY = yesRect.top + yesRect.height / 2;

    // Check if NO button position is too close to YES button center
    const distance = Math.sqrt(
        Math.pow(x - yesCenterX, 2) +
        Math.pow(y - yesCenterY, 2)
    );

    // Increase avoidance radius as YES button grows
    const avoidanceRadius = 250 + (yesButtonScale * 100);
    return distance < avoidanceRadius;
}

function growYesButton() {
    clickCount++;

    // Hide NO button when YES button gets big enough
    if (yesButtonScale >= 15) {
        noBtn.style.setProperty('opacity', '0', 'important');
        noBtn.style.setProperty('pointer-events', 'none', 'important');
        noBtn.style.setProperty('visibility', 'hidden', 'important');
    }

    // Detect if on mobile/portrait mode
    const isMobilePortrait = window.innerHeight > window.innerWidth;

    // Keep growing as a bubble - faster to fullscreen
    if (yesButtonScale < 15) {
        // Continuous bubble growth
        yesButtonScale += 0.5;

        // On mobile portrait, scale height more than width after scale 2.5
        if (isMobilePortrait && yesButtonScale > 2.5) {
            const heightScale = yesButtonScale * 1.2;
            yesBtn.style.transform = `scale(${yesButtonScale}, ${heightScale})`;
        } else {
            yesBtn.style.transform = `scale(${yesButtonScale})`;
        }

        yesBtn.style.transformOrigin = 'center center';
        yesBtn.style.transition = 'transform 0.3s ease-out';
    }

    // Always ensure NO button is hidden once threshold is reached
    if (yesButtonScale >= 14) {
        noBtn.style.setProperty('display', 'none', 'important');
    }
}

// YES button click - show celebration
yesBtn.addEventListener('click', () => {
    celebration.classList.add('active');

    // Create explosion of hearts
    createHeartsExplosion();

    // Add confetti effect
    createConfetti();
});

function createHeartsExplosion() {
    const explosionContainer = document.querySelector('.hearts-explosion');

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = ['💕', '💖', '💗', '💝', '💘', '❤️', '💓', '✨', '🎉'][Math.floor(Math.random() * 9)];
            heart.style.position = 'absolute';
            heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.pointerEvents = 'none';

            const angle = (Math.PI * 2 * i) / 50;
            const velocity = Math.random() * 300 + 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            heart.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.5) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: 2000,
                easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
            });

            explosionContainer.appendChild(heart);

            setTimeout(() => heart.remove(), 2000);
        }, i * 20);
    }
}

function createConfetti() {
    const colors = ['#ff6b6b', '#ff8e53', '#ff6b9d', '#c44569', '#f8b500', '#fff'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '10002';

            document.body.appendChild(confetti);

            confetti.animate([
                {
                    transform: `translateY(0) rotate(0deg)`,
                    opacity: 1
                },
                {
                    transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: Math.random() * 2000 + 2000,
                easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
            });

            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}