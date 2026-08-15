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

  // Structured database using reliable direct emblem asset URLs
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
    // Populate dynamic filter selections from database fields first
    const populateSelect = (element, values) => {
      values.sort().forEach(val => {
        if (val && ![...element.options].some(o => o.value.toLowerCase() == val.toLowerCase())) {
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

    // Add a "See All Vehicles / Reset Filter" button above or next to filters if needed, 
    // or handle resetting via clicking an active brand badge or clearing filters.
    if (brandLogoContainer) {
      // Prepend or include a "Reset / All" button container option if desired, 
      // clicking an active brand badge now completely deselects and resets the filter.
      brandLogoContainer.innerHTML = brandDatabase.map(brand => `
        <div class="brand-badge" data-make="${brand.name}" style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 12px 8px; min-width: 120px; text-align: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: all 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 90px;">
          <img src="${brand.logo}" alt="${brand.name} logo" style="width: 48px; height: 48px; object-fit: contain; margin-bottom: 4px;">
          <p style="font-size: 12px; font-weight: bold; color: #111; margin: 0;">${brand.name}</p>
        </div>
      `).join('');

      document.querySelectorAll('.brand-badge').forEach(badge => {
        badge.addEventListener('click', () => {
          const selectedMake = badge.getAttribute('data-make');
          
          // Check if this badge is already active
          const isActive = badge.style.border.includes('2px solid');

          // Reset all badges style
          document.querySelectorAll('.brand-badge').forEach(b => {
            b.style.border = "1px solid #ddd";
            b.style.background = "#fff";
          });

          if (isActive) {
            // If it was already active, clear the filter (See All Vehicles)
            makeFilter.value = "";
          } else {
            // Otherwise, activate this badge and filter by make
            makeFilter.value = selectedMake;
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
        container.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <h3 style="color: #333; margin-bottom: 10px; font-size: 1.3rem;">No vehicles found</h3>
            <p style="color: #666; margin-bottom: 20px;">There are no vehicles matching your current selection or brand filter.</p>
            <button id="resetFiltersBtn" style="background: #ff4d00; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">See All Vehicles</button>
          </div>
        `;

        const resetBtn = document.getElementById('resetFiltersBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            makeFilter.value = "";
            searchInput.value = "";
            priceFilter.value = "";
            yearFilter.value = "";
            locationFilter.value = "";
            transmissionFilter.value = "";
            fuelFilter.value = "";
            ccFilter.value = "";
            
            document.querySelectorAll('.brand-badge').forEach(b => {
              b.style.border = "1px solid #ddd";
              b.style.background = "#fff";
            });
            renderCars(cars);
          });
        }
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
    makeFilter.addEventListener('change', () => {
      // Sync badge UI if dropdown is changed manually
      const currentVal = makeFilter.value.toLowerCase();
      document.querySelectorAll('.brand-badge').forEach(b => {
        if (b.getAttribute('data-make').toLowerCase() === currentVal) {
          b.style.border = "2px solid #ff4d00";
          b.style.background = "#fff8f5";
        } else {
          b.style.border = "1px solid #ddd";
          b.style.background = "#fff";
        }
      });
      filterInventory();
    });
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
