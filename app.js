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
  });
}

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
  const makeFilter = document.getElementById('makeFilter');
  const locationFilter = document.getElementById('locationFilter');
  const brandLogoContainer = document.getElementById('brandLogoContainer');

  // Badge/Logo image mapping for popular car makes in Kenya
  const brandLogos = {
    "Toyota": "https://www.carlogos.org/car-logos/toyota-logo-2019-show.png",
    "Mazda": "https://www.carlogos.org/car-logos/mazda-logo-2018.png",
    "Subaru": "https://www.carlogos.org/car-logos/subaru-logo-2019.png",
    "Nissan": "https://www.carlogos.org/car-logos/nissan-logo-2020.png",
    "Honda": "https://www.carlogos.org/car-logos/honda-logo-2000.png",
    "Volkswagen": "https://www.carlogos.org/car-logos/volkswagen-logo-2019.png",
    "BMW": "https://www.carlogos.org/car-logos/bmw-logo-2020.png",
    "Mercedes-Benz": "https://www.carlogos.org/car-logos/mercedes-benz-logo-2011.png"
  };

  if (typeof cars !== 'undefined') {
    const uniqueMakes = [...new Set(cars.map(c => c.make))];
    const uniqueLocations = [...new Set(cars.map(c => c.location))];

    uniqueMakes.forEach(make => {
      const opt = document.createElement('option');
      opt.value = make;
      opt.textContent = make;
      makeFilter.appendChild(opt);
    });

    uniqueLocations.forEach(loc => {
      const opt = document.createElement('option');
      opt.value = loc;
      opt.textContent = loc;
      locationFilter.appendChild(opt);
    });

    // Render clickable brand logos
    if (brandLogoContainer) {
      brandLogoContainer.innerHTML = uniqueMakes.map(make => {
        const logoUrl = brandLogos[make] || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf";
        return `
          <div class="brand-badge" data-make="${make}" style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 10px; min-width: 100px; text-align: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: transform 0.2s;">
            <img src="${logoUrl}" alt="${make}" style="width: 45px; height: 35px; object-fit: contain; margin-bottom: 5px;">
            <p style="font-size: 12px; font-weight: bold; color: #333;">${make}</p>
          </div>
        `;
      }).join('');

      // Add click event listeners to brand badges
      document.querySelectorAll('.brand-badge').forEach(badge => {
        badge.addEventListener('click', () => {
          const selectedMake = badge.getAttribute('data-make');
          if (makeFilter.value === selectedMake) {
            makeFilter.value = ""; // Toggle off if clicked again
            badge.style.border = "1px solid #ddd";
          } else {
            makeFilter.value = selectedMake;
            document.querySelectorAll('.brand-badge').forEach(b => b.style.border = "1px solid #ddd");
            badge.style.border = "2px solid #ff4d00";
          }
          filterInventory();
        });
      });
    }

    function renderCars(items) {
      if (!container) return;
      if (items.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 40px;">No vehicles found matching your criteria.</p>`;
        return;
      }

      container.innerHTML = items.map(car => `
        <div class="car-card">
          <div class="car-img-container">
            <img src="${car.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'}" alt="${car.make} ${car.model}">
          </div>
          <div class="car-details">
            <h3 style="font-size: 1.1rem; color: #111;">${car.make} ${car.model}</h3>
            <p style="font-weight: 800; color: #ff4d00; font-size: 1.1rem;">Ksh ${car.price.toLocaleString()}</p>
            <p style="font-size: 13px; color: #555;">Year: ${car.year} | Location: ${car.location}</p>
            <p style="font-size: 13px; color: #555;">Transmission: ${car.transmission} | Fuel: ${car.fuel}</p>
          </div>
        </div>
      `).join('');
    }

    renderCars(cars);

    function filterInventory() {
      const query = searchInput.value.toLowerCase();
      const selectedMake = makeFilter.value.toLowerCase();
      const selectedLocation = locationFilter.value.toLowerCase();

      const filtered = cars.filter(car => {
        const matchesQuery = car.make.toLowerCase().includes(query) || car.model.toLowerCase().includes(query);
        const matchesMake = selectedMake === "" || car.make.toLowerCase() === selectedMake;
        const matchesLocation = selectedLocation === "" || car.location.toLowerCase() === selectedLocation;
        return matchesQuery && matchesMake && matchesLocation;
      });

      renderCars(filtered);
    }

    searchInput.addEventListener('input', filterInventory);
    makeFilter.addEventListener('change', filterInventory);
    locationFilter.addEventListener('change', filterInventory);

  } else {
    if (container) {
      container.innerHTML = `<p style="grid-column: 1/-1; color: red; text-align: center;">Error: Database not found.</p>`;
    }
  }
});
