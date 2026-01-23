// cookie-consent.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already made a choice
    if (!getCookie('cookie_consent')) {
        // Create and show the cookie popup after a short delay
        setTimeout(createCookiePopup, 1000);
    }

    // Function to create the cookie popup
    function createCookiePopup() {
        const popup = document.createElement('div');
        popup.id = 'cookie-consent-popup';
        popup.className = 'cookie-popup';
        popup.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <h3><i class="fas fa-cookie-bite"></i> Cookie Consent</h3>
                    <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. 
                    <a href="cookie-policy.html">Learn more in our Cookie Policy</a></p>
                </div>
                <div class="cookie-buttons">
                    <button class="cookie-btn accept-all">Accept All</button>
                    <button class="cookie-btn accept-necessary">Necessary Only</button>
                    <button class="cookie-btn customize">Customize</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Add event listeners
        document.querySelector('.accept-all').addEventListener('click', () => acceptAllCookies());
        document.querySelector('.accept-necessary').addEventListener('click', () => acceptNecessaryCookies());
        document.querySelector('.customize').addEventListener('click', showCustomizeModal);

        // Show the popup with animation
        setTimeout(() => popup.classList.add('show'), 100);
    }

    // Function to show customization modal
    function showCustomizeModal() {
        const modal = document.createElement('div');
        modal.id = 'cookie-customize-modal';
        modal.className = 'cookie-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-sliders-h"></i> Cookie Preferences</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="cookie-category">
                        <div class="category-header">
                            <div class="toggle-switch">
                                <input type="checkbox" id="necessary-cookies" checked disabled>
                                <label for="necessary-cookies" class="toggle-label"></label>
                            </div>
                            <div>
                                <h4>Necessary Cookies <span class="required">Required</span></h4>
                                <p>Essential for the website to function properly. Cannot be disabled.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="category-header">
                            <div class="toggle-switch">
                                <input type="checkbox" id="analytics-cookies">
                                <label for="analytics-cookies" class="toggle-label"></label>
                            </div>
                            <div>
                                <h4>Analytics Cookies</h4>
                                <p>Help us understand how visitors interact with the website.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="category-header">
                            <div class="toggle-switch">
                                <input type="checkbox" id="marketing-cookies">
                                <label for="marketing-cookies" class="toggle-label"></label>
                            </div>
                            <div>
                                <h4>Marketing Cookies</h4>
                                <p>Used to track visitors across websites for targeted advertising.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-buttons">
                        <button class="modal-btn save-preferences">Save Preferences</button>
                        <button class="modal-btn accept-all-modal">Accept All</button>
                        <button class="modal-btn reject-all">Reject All</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Set initial states based on existing preferences
        const consent = getCookie('cookie_consent');
        if (consent) {
            const preferences = JSON.parse(consent);
            document.getElementById('analytics-cookies').checked = preferences.analytics;
            document.getElementById('marketing-cookies').checked = preferences.marketing;
        }

        // Event listeners for modal
        document.querySelector('.modal-close').addEventListener('click', closeModal);
        document.querySelector('.save-preferences').addEventListener('click', savePreferences);
        document.querySelector('.accept-all-modal').addEventListener('click', acceptAllCookies);
        document.querySelector('.reject-all').addEventListener('click', rejectAllCookies);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Function to close modal
    function closeModal() {
        const modal = document.getElementById('cookie-customize-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }

    // Function to save preferences
    function savePreferences() {
        const preferences = {
            necessary: true,
            analytics: document.getElementById('analytics-cookies').checked,
            marketing: document.getElementById('marketing-cookies').checked,
            timestamp: new Date().toISOString()
        };

        setCookie('cookie_consent', JSON.stringify(preferences), 365);
        setCookie('cookie_consent_date', new Date().toISOString(), 365);
        
        // Update Google Analytics based on preferences
        updateAnalytics(preferences.analytics);
        
        closeModal();
        hidePopup();
        showNotification('Cookie preferences saved successfully!');
    }

    // Function to accept all cookies
    function acceptAllCookies() {
        const preferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };

        setCookie('cookie_consent', JSON.stringify(preferences), 365);
        setCookie('cookie_consent_date', new Date().toISOString(), 365);
        
        // Enable Google Analytics
        updateAnalytics(true);
        
        hidePopup();
        closeModal();
        showNotification('All cookies accepted!');
    }

    // Function to accept only necessary cookies
    function acceptNecessaryCookies() {
        const preferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };

        setCookie('cookie_consent', JSON.stringify(preferences), 365);
        setCookie('cookie_consent_date', new Date().toISOString(), 365);
        
        // Disable Google Analytics
        updateAnalytics(false);
        
        hidePopup();
        closeModal();
        showNotification('Only necessary cookies accepted.');
    }

    // Function to reject all non-necessary cookies
    function rejectAllCookies() {
        acceptNecessaryCookies();
    }

    // Function to update Google Analytics based on preferences
    function updateAnalytics(enable) {
        if (enable) {
            // Enable Google Analytics
            window[`ga-disable-G-H9TQKQQW3T`] = false;
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            }
        } else {
            // Disable Google Analytics
            window[`ga-disable-G-H9TQKQQW3T`] = true;
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
            }
        }
    }

    // Function to hide the popup
    function hidePopup() {
        const popup = document.getElementById('cookie-consent-popup');
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }
    }

    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cookie-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Cookie utility functions
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    // Initialize Google Analytics consent state based on user preferences
    const consent = getCookie('cookie_consent');
    if (consent) {
        const preferences = JSON.parse(consent);
        updateAnalytics(preferences.analytics);
    }

    // Add cookie settings link to footer (optional)
    addCookieSettingsLink();
});

// Function to add cookie settings link to footer
function addCookieSettingsLink() {
    const footerLinks = document.querySelector('.footer-links ul');
    if (footerLinks) {
        const cookieLink = document.createElement('li');
        cookieLink.innerHTML = '<a href="cookie-policy.html"><i class="fas fa-cookie"></i> Cookie Policy</a>';
        footerLinks.appendChild(cookieLink);
    }
}

// Function to reset cookie consent (for testing or user preferences)
function resetCookieConsent() {
    document.cookie = "cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "cookie_consent_date=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.reload();
}