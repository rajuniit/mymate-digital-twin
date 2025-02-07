// Theme switching functionality
function switchTheme(theme) {
    const themeStyle = document.getElementById('theme-style');
    themeStyle.href = `themes/${theme}.css`;
    
    // Update active button state
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === theme) {
            btn.classList.add('active');
        }
    });

    // Save theme preference
    localStorage.setItem('preferred-theme', theme);
}

// Load saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('preferred-theme') || 'modern';
    switchTheme(savedTheme);

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Add fade-in class for intersection observer
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .theme-switcher {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            gap: 10px;
            background: rgba(0, 0, 0, 0.3);
            padding: 10px;
            border-radius: 30px;
            backdrop-filter: blur(10px);
        }

        .theme-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Space Grotesk', sans-serif;
        }

        .theme-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }

        .theme-btn.active {
            background: rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);

    // Animate stats when in view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        let animated = false;
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    document.querySelectorAll('.stat-number').forEach(stat => {
                        const value = stat.textContent;
                        if (value === '∞') return;
                        
                        let start = 0;
                        const end = parseInt(value);
                        const duration = 2000;
                        const increment = end / (duration / 16);
                        
                        const timer = setInterval(() => {
                            start += increment;
                            if (start >= end) {
                                clearInterval(timer);
                                start = end;
                            }
                            stat.textContent = Math.floor(start) + (value.includes('%') ? '%' : '');
                        }, 16);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
});
