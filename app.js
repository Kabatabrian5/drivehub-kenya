// --- Modal Interactivity Handling ---
const signInBtn = document.getElementById('signInBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');

if (signInBtn && authModal) {
  signInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    authModal.style.display = 'flex';
  });
}

if (closeModal && authModal) {
  closeModal.addEventListener('click', () => {
    authModal.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.style.display = 'none';
  }
});

// Handle Login Form Submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Sign in functionality connected successfully!');
    authModal.style.display = 'none';
  });
}

// --- Render Inventory Cards ---
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('carListings');
  
  if (container && typeof cars !== 'undefined') {
    container.innerHTML = cars.map(car => `
      <div class="car-card">
        <div class="car-img-container">
          <img src="${car.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'}" alt="${car.make} ${car.model}">
        </div>
        <div class="car-details">
          <h3>${car.make} ${car.model}</h3>
          <p style="font-weight: bold; color: #2e7d32;">Ksh ${car.price.toLocaleString()}</p>
          <p style="font-size: 13px; color: #666;">Year: ${car.year} | Location: ${car.location}</p>
          <p style="font-size: 13px; color: #666;">Transmission: ${car.transmission} | Fuel: ${car.fuel}</p>
        </div>
      </div>
    `).join('');
  }
});
