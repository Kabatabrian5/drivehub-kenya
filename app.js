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

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Sign in functionality connected successfully!');
    authModal.style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('carListings');
  const searchInput = document.getElementById('searchInput');

  function renderCars(items) {
    if (!container) return;
    
    if (items.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 30px;">No vehicles found matching your criteria.</p>`;
      return;
    }

    container.innerHTML = items.map(car => `
      <div class="car-card">
        <div class="car-img-container">
          <img src="${car.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'}" alt="${car.make} ${car.model}">
        </div>
        <div class="car-details">
          <h3>${car.make} ${car.model}</h3>
          <p style="font-weight: bold; color: #2e7d32;">Ksh ${car.price.toLocaleString()}</p>
          <p style="font-size: 13px; color: #666;">Year: ${car.year} | Location: ${car.location}</p>
          <p style="font-size: 13px; color: #666;">Transmission: ${car.transmission} | Fuel: ${car.fuel} | CC: ${car.cc}</p>
        </div>
      </div>
    `).join('');
  }

  if (typeof cars !== 'undefined') {
    renderCars(cars);

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = cars.filter(car => 
          car.make.toLowerCase().includes(query) || 
          car.model.toLowerCase().includes(query) ||
          car.location.toLowerCase().includes(query)
        );
        renderCars(filtered);
      });
    }
  } else {
    if (container) {
      container.innerHTML = `<p style="grid-column: 1/-1; color: red; text-align: center;">Error: Car database file not detected.</p>`;
    }
  }
});
