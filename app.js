/* Mobile Menu Toggle */
const menuToggleBtn = document.getElementById('menuToggleBtn');
const mobileNavDrawer = document.getElementById('mobileNavDrawer');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');

if (menuToggleBtn && mobileNavDrawer) {
  menuToggleBtn.addEventListener('click', () => mobileNavDrawer.classList.add('open'));
}
if (closeDrawerBtn && mobileNavDrawer) {
  closeDrawerBtn.addEventListener('click', () => mobileNavDrawer.classList.remove('open'));
}

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

  // 1. Render Cars Immediately (Independent of Database)
  function renderCars(items) {
    if (!container) return;
    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #fff; border-radius: 8px;">
          <h3>No vehicles found</h3>
          <p style="color: #666;">Try adjusting your search or filters.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(car => `
      <div class="car-card" style="background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <div class="car-img-container">
          <img src="${car.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'}" alt="${car.make} ${car.model}" style="width: 100%; height: 150px; object-fit: cover;">
        </div>
        <div class="car-details" style="padding: 15px;">
          <h3 style="font-size: 1.1rem; color: #111; margin: 0 0 8px 0;">${car.make} ${car.model}</h3>
          <p style="font-weight: 800; color: #ff4d00; font-size: 1.1rem; margin: 0 0 6px 0;">Ksh ${car.price.toLocaleString()}</p>
          <p style="font-size: 13px; color: #555; margin: 2px 0;">Year: ${car.year} | Loc: ${car.location}</p>
          <p style="font-size: 13px; color: #555; margin: 2px 0;">Trans: ${car.transmission} | Fuel: ${car.fuel}</p>
        </div>
      </div>
    `).join('');
  }

  if (typeof cars !== 'undefined') {
    renderCars(cars);

    // Populate dropdown filters safely
    const populateSelect = (element, values) => {
      if (!element) return;
      [...new Set(values)].sort().forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        element.appendChild(opt);
      });
    };

    populateSelect(makeFilter, cars.map(c => c.make));
    populateSelect(locationFilter, cars.map(c => c.location));
    populateSelect(transmissionFilter, cars.map(c => c.transmission));
    populateSelect(fuelFilter, cars.map(c => c.fuel));
    populateSelect(yearFilter, cars.map(c => c.year));
    populateSelect(ccFilter, cars.map(c => c.cc));
    populateSelect(priceFilter, [1000000, 2000000, 3000000, 5000000, 10000000]);

    // Filtering logic
    window.filterInventory = function() {
      const query = searchInput ? searchInput.value.toLowerCase() : '';
      const sMake = makeFilter ? makeFilter.value.toLowerCase() : '';
      const sLoc = locationFilter ? locationFilter.value.toLowerCase() : '';
      const sTrans = transmissionFilter ? transmissionFilter.value.toLowerCase() : '';
      const sFuel = fuelFilter ? fuelFilter.value.toLowerCase() : '';
      const sYear = yearFilter ? yearFilter.value : '';
      const sCc = ccFilter ? ccFilter.value : '';
      const sPrice = priceFilter && priceFilter.value ? Number(priceFilter.value) : null;

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
    };

    // Attach filter event listeners
    [searchInput, makeFilter, locationFilter, transmissionFilter, fuelFilter, yearFilter, ccFilter, priceFilter].forEach(el => {
      if (el) el.addEventListener('input', filterInventory);
      if (el) el.addEventListener('change', filterInventory);
    });

  } else {
    if (container) container.innerHTML = `<p style="color:red; text-align:center;">Error: cars-data.js is not loaded properly.</p>`;
  }

  // 2. Safely Load Supabase Brand Logos in Background
  async function loadBrandsAsync() {
    if (!brandLogoContainer || typeof supabase === 'undefined') return;
    try {
      const supabaseClient = supabase.createClient(
        'https://qzqvyceabwxvzeyifnpw.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXZ5Y2VhYnd4dnpleWxmbnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NzEzMzUsImV4cCI6MjEwMjM0NzMzNX0.9fDJGRjaCamvZhxkfhwu08vFTTPcabZ00VBvi_av1wk'
      );
      
      const { data: brands, error } = await supabaseClient.from('brands').select('*');
      if (error || !brands) return;

      brandLogoContainer.innerHTML = brands.map(brand => `
        <div class="brand-badge" data-make="${brand.name}" style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 10px; min-width: 90px; text-align: center; cursor: pointer; flex-shrink: 0;">
          <p style="font-size: 12px; font-weight: bold; margin: 0; color: #111;">${brand.name}</p>
        </div>
      `).join('');

      document.querySelectorAll('.brand-badge').forEach(badge => {
        badge.addEventListener('click', () => {
          if (makeFilter) {
            makeFilter.value = badge.getAttribute('data-make');
            filterInventory();
          }
        });
      });
    } catch (e) {
      console.log('Logo load skipped:', e);
    }
  }

  loadBrandsAsync();
});
