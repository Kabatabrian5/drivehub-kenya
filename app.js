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

  // Bulletproof embedded SVG brand database (Guaranteed 100% visible, no missing/blocked images)
  const brandDatabase = [
    { 
      name: "Toyota", 
      svg: `<svg viewBox="0 0 512 512" width="40" height="40"><ellipse cx="256" cy="256" rx="200" ry="110" fill="none" stroke="#111" stroke-width="28"/><ellipse cx="256" cy="256" rx="110" ry="180" fill="none" stroke="#111" stroke-width="28"/><path d="M120 256h272" stroke="#111" stroke-width="20"/></svg>` 
    },
    { 
      name: "Mazda", 
      svg: `<svg viewBox="0 0 512 512" width="40" height="40"><circle cx="256" cy="256" r="200" fill="none" stroke="#111" stroke-width="28"/><path d="M150 320c40-60 70-80 106-80s66 20 106 80M190 200l66 50 66-50" fill="none" stroke="#111" stroke-width="24" stroke-linejoin="round" stroke-linecap="round"/></svg>` 
    },
    { 
      name: "Subaru", 
      svg: `<svg viewBox="0 0 512 512" width="40" height="40"><circle cx="256" cy="256" r="200" fill="#003399"/><g fill="#fff"><circle cx="256" cy="150" r="30"/><circle cx="180" cy="230" r="22"/><circle cx="332" cy="230" r="22"/><circle cx="160" cy="330" r="18"/><circle cx="352" cy="330" r="18"/></g></svg>` 
    },
    { 
      name: "Nissan", 
      svg: `<svg viewBox="0 0 512 512" width="40" height="40"><circle cx="256" cy="256" r="200" fill="none" stroke="#c00" stroke-width="28"/><rect x="136" y="220" width="240" height="72" fill="#111"/><text x="50%" y="54%" font-size="75" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial" dominant-baseline="middle">NISSAN</text></svg>` 
    },
    { 
      name: "Honda", 
      svg: `<svg viewBox="0 0 512 512" width="40" height="40"><text x="50%" y="55%" font-size="280" font-weight="900" text-anchor="middle" fill="#111" font-family="Arial" dominant-baseline="middle">H</text></svg>` 
    },
    { 
      name: "Volkswagen", 
      svg: `<svg viewBox="0 0 512 512" width="40" height="40"><circle cx="256" cy="256" r="200" fill="none" stroke="#001e50" stroke-width="28"/><text x="50%" y="55%" font-size="190" font-weight="900" text-anchor="middle" fill="#001e50" font-family="Arial" dominant-baseline="middle">VW</text></svg>` 
    },
    { 
      name: "BMW", 
      svg: `<svg viewBox="0 0 512 512" width="40" height="40"><circle cx="256" cy="256" r="200" fill="#111"/><circle cx="256" cy="256" r="180" fill="#fff"/><path d="M256 256V76a180 180 0 00-180 180h180zm0 0h180A180 180 0 00256 76v180z" fill="#0066b1"/></svg>` 
    },
    { 
      name: "Mercedes", 
      svg: `<svg viewBox="0 0 512 512" width="40" height="40"><circle cx="256" cy="256" r="200" fill="none" stroke="#111" stroke-width="24"/><path d="M256 56v200l130 75M256 256L126 331" fill="none" stroke="#111" stroke-width="24"/></svg>` 
    }
  ];

  // 1. ALWAYS render the logos using inline SVGs
  if (brandLogoContainer) {
    brandLogoContainer.innerHTML = brandDatabase.map(brand => `
      <div class="brand-badge" data-make="${brand.name}" style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 10px 6px; min-width: 110px; text-align: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: all 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 85px;">
        <div style="display: flex; align-items: center; justify-content: center; height: 42px;">${brand.svg}</div>
        <p style="font-size: 12px; font-weight: bold; color: #111; margin: 0;">${brand.name}</p>
      </div>
    `).join('');

    document.querySelectorAll('.brand-badge').forEach(badge => {
      badge.addEventListener('click', () => {
        const selectedMake = badge.getAttribute('data-make');
        const isActive = badge.style.border.includes('2px solid');

        // Reset all badges
        document.querySelectorAll('.brand-badge').forEach(b => {
          b.style.border = "1px solid #ddd";
          b.style.background = "#fff";
        });

        // Toggle logic
        if (isActive) {
          if(makeFilter) makeFilter.value = "";
        } else {
          if(makeFilter) makeFilter.value = selectedMake;
          badge.style.border = "2px solid #ff4d00";
          badge.style.background = "#fff8f5";
        }
        
        // Trigger inventory filter if the function exists
        if (typeof filterInventory === 'function') {
          filterInventory();
        }
      });
    });
  }

  // 2. Handle the Cars Database and Filtering
  if (typeof cars !== 'undefined') {
    
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

    // Make filterInventory global so the brand badges can access it
    window.filterInventory = function() {
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
      container.innerHTML = `<p style="grid-column: 1/-1; color: red; text-align: center; padding: 40px; background: #fff; border-radius: 8px;">Error: <strong>cars-data.js</strong> is missing or the 'cars' array is empty. Please check your data file.</p>`;
    }
  }
});
