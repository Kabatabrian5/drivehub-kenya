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

/* Mobile Slide-out Menu Drawer Controller */
const menuToggleBtn = document.getElementById('menuToggleBtn');
const mobileNavDrawer = document.getElementById('mobileNavDrawer');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');

if (menuToggleBtn && mobileNavDrawer) {
  menuToggleBtn.addEventListener('click', () => {
    mobileNavDrawer.classList.add('open');
  });
}

if (closeDrawerBtn && mobileNavDrawer) {
  closeDrawerBtn.addEventListener('click', () => {
    mobileNavDrawer.classList.remove('open');
  });
}

// Close drawer if user clicks anywhere outside of it
window.addEventListener('click', (e) => {
  if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
    if (!mobileNavDrawer.contains(e.target) && e.target !== menuToggleBtn) {
      mobileNavDrawer.classList.remove('open');
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('carListings');
  const searchInput = document.getElementById('searchInput');
  const makeFilter = document.getElementById('makeFilter');
  const priceFilter = document.getElementById('priceFilter');
  const yearFilter = document.getElementById('yearFilter');
  const locationFilter = document.getElementById('locationFilter');
  const transmissionFilter = document.getElementById('transmissionFilter');
  const fuelFilter = document.getElementById('fuelFilter');
  const ccFilter = document.getElementById('ccFilter');
  const brandLogoContainer = document.getElementById('brandLogoContainer');

  // Structured database using reliable direct emblem asset URLs and larger proportions
  const brandDatabase = [
    { name: "Toyota", logo: "https://www.carlogos.org/car-logos/toyota-logo.png" },
    { name: "Mazda", logo: "https://www.carlogos.org/car-logos/mazda-logo.png" },
    { name: "Subaru", logo: "https://www.carlogos.org/car-logos/subaru-logo.png" },
    { name: "Nissan", logo: "https://www.carlogos.org/car-logos/nissan-logo.png" },
    { name: "Honda", logo: "https://www.carlogos.org/car-logos/honda-logo.png" },
    { name: "Volkswagen", logo: "https://www.carlogos.org/car-logos/volkswagen-logo.png" },
    { name: "BMW", logo: "https://www.carlogos.org/car-logos/bmw-logo.png" },
    { name: "Mercedes-Benz", logo: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" }
  ];

  if (typeof cars !== 'undefined') {
    // Populate dynamic filter selections from database fields first so select options are available
    const populateSelect = (element, values) => {
      values.sort().forEach(val => {
        if (val && ![...element.options].some(o => o.value == val)) {
          const opt = document.createElement('option');
          opt.value = val;
          opt.textContent = val;
          element.appendChild(opt);
        }
      });
    };

    populateSelect(makeFilter, [...new Set(cars.map(c => c.make))]);
    populateSelect(locationFilter, [...new Set(cars.map(c => c.location))]);
    populateSelect(transmissionFilter, [...new Set(cars.map(c => c.transmission))]);
    populateSelect(fuelFilter, [...new Set(cars.map(c => c.fuel))]);
    populateSelect(yearFilter, [...new Set(cars.map(c => c.year))]);
    populateSelect(ccFilter, [...new Set(cars.map(c => c.cc))]);
    populateSelect(priceFilter, [1000000, 2000000, 3000000, 5000000, 10000000]);

    if (brandLogoContainer) {
      brandLogoContainer.innerHTML = brandDatabase.map(brand => `
        <div class="brand-badge" data-make="${brand.name}" style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 12px 8px; min-width: 120px; text-align: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: all 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 90px;">
          <img src="${brand.logo}" alt="${brand.name} logo" style="width: 48px; height: 48px; object-fit: contain; margin-bottom: 4px;">
          <p style="font-size: 12px; font-weight: bold; color: #111; margin: 0;">${brand.name}</p>
        </div>
      `).join('');

      document.querySelectorAll('.brand-badge').forEach(badge => {
        badge.addEventListener('click', () => {
          const selectedMake = badge.getAttribute('data-make');
          
          // Toggle selection: if already selected, clear filter and reset styles
          if (makeFilter.value.toLowerCase() === selectedMake.toLowerCase()) {
            makeFilter.value = "";
            badge.style.border = "1px solid #ddd";
            badge.style.background = "#fff";
          } else {
            makeFilter.value = selectedMake;
            document.querySelectorAll('.brand-badge').forEach(b => {
              b.style.border = "1px solid #ddd";
              b.style.background = "#fff";
            });
            badge.style.border = "2px solid #ff4d00";
            badge.style.background = "#fff8f5";
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
            <p style="font-size: 13px; color: #555;">Trans: ${car.transmission} | Fuel: ${car.fuel} | CC: ${car.cc}</p>
          </div>
        </div>
      `).join('');
    }

    renderCars(cars);

    function filterInventory() {
      const query = searchInput.value.toLowerCase();
      const sMake = makeFilter.value.toLowerCase();
      const sLoc = locationFilter.value.toLowerCase();
      const sTrans = transmissionFilter.value.toLowerCase();
      const sFuel = fuelFilter.value.toLowerCase();
      const sYear = yearFilter.value;
      const sCc = ccFilter.value;
      const sPrice = priceFilter.value ? Number(priceFilter.value) : null;

      const filtered = cars.filter(car => {
        const matchesQuery = car.make.toLowerCase().includes(query) || car.model.toLowerCase().includes(query);
        const matchesMake = sMake === "" || car.make.toLowerCase() === sMake;
        const matchesLoc = sLoc === "" || car.location.toLowerCase() === sLoc;
        const matchesTrans = sTrans === "" || car.transmission.toLowerCase() === sTrans;
        const matchesFuel = sFuel === "" || car.fuel.toLowerCase() === sFuel;
        const matchesYear = sYear === "" || Number(car.year) >= Number(sYear);
        const matchesCc = sCc === "" || Number(car.cc) === Number(sCc);
        const matchesPrice = sPrice === null || Number(car.price) <= sPrice;

        return matchesQuery && matchesMake && matchesLoc && matchesTrans && matchesFuel && matchesYear && matchesCc && matchesPrice;
      });

      renderCars(filtered);
    }

    searchInput.addEventListener('input', filterInventory);
    makeFilter.addEventListener('change', filterInventory);
    locationFilter.addEventListener('change', filterInventory);
    transmissionFilter.addEventListener('change', filterInventory);
    fuelFilter.addEventListener('change', filterInventory);
    yearFilter.addEventListener('change', filterInventory);
    ccFilter.addEventListener('change', filterInventory);
    priceFilter.addEventListener('change', filterInventory);

  } else {
    if (container) {
      container.innerHTML = `<p style="grid-column: 1/-1; color: red; text-align: center;">Error: Database not found.</p>`;
    }
  }
});
