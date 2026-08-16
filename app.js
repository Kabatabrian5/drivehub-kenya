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

  // Inject Modal Container dynamically into body for Detailed View & Comparison
  const modalWrapper = document.createElement('div');
  modalWrapper.id = 'carDetailModal';
  modalWrapper.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:9999; overflow-y:auto; padding:20px;';
  document.body.appendChild(modalWrapper);

  // 1. Render Cars with "View Details" Button
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

    container.innerHTML = items.map((car, index) => `
      <div class="car-card" style="background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display:flex; flex-direction:column; justify-content:space-between;">
        <div class="car-img-container">
          <img src="${car.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'}" alt="${car.make} ${car.model}" style="width: 100%; height: 160px; object-fit: cover;">
        </div>
        <div class="car-details" style="padding: 15px;">
          <h3 style="font-size: 1.1rem; color: #111; margin: 0 0 8px 0;">${car.make} ${car.model}</h3>
          <p style="font-weight: 800; color: #ff4d00; font-size: 1.1rem; margin: 0 0 6px 0;">Ksh ${car.price.toLocaleString()}</p>
          <p style="font-size: 13px; color: #555; margin: 2px 0;">Year: ${car.year} | Loc: ${car.location}</p>
          <p style="font-size: 13px; color: #555; margin: 2px 0;">Trans: ${car.transmission} | Fuel: ${car.fuel}</p>
        </div>
        <div style="padding: 0 15px 15px 15px;">
          <button onclick="openCarDetails(${index})" style="width: 100%; background: #111; color: #fff; border: none; padding: 10px; border-radius: 4px; font-weight: bold; cursor: pointer;">View Details</button>
        </div>
      </div>
    `).join('');
  }

  // Global Function to Open Detailed Car Modal
  window.openCarDetails = function(carIndex) {
    const car = cars[carIndex];
    if (!car) return;

    modalWrapper.style.display = 'block';
    modalWrapper.innerHTML = `
      <div style="max-width: 900px; margin: 40px auto; background: #fff; border-radius: 10px; padding: 30px; position:relative; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
        <button onclick="closeCarDetails()" style="position:absolute; top:20px; right:20px; background:#eee; border:none; font-size:18px; width:35px; height:35px; border-radius:50%; cursor:pointer; font-weight:bold;">&times;</button>
        
        <h2 style="margin-top:0; font-size:1.6rem; color:#111;">${car.make} ${car.model} ${car.year} ${car.color || ''}</h2>
        
        <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap:wrap; align-items:center;">
          <span style="background:#f2f2f2; padding:5px 10px; border-radius:4px; font-size:12px; font-weight:bold;">📅 ${car.year}</span>
          <span style="background:#f2f2f2; padding:5px 10px; border-radius:4px; font-size:12px; font-weight:bold;">⚙️ ${car.transmission}</span>
          <span style="background:#f2f2f2; padding:5px 10px; border-radius:4px; font-size:12px; font-weight:bold;">⛽ ${car.fuel}</span>
          <span style="background:#f2f2f2; padding:5px 10px; border-radius:4px; font-size:12px; font-weight:bold;">📍 ${car.location}</span>
          
          <div style="margin-left:auto; display:flex; gap:8px;">
            <button onclick="compareSamePrice(${car.price}, '${car.make} ${car.model}')" style="background:#ffc107; border:none; padding:8px 12px; border-radius:4px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:4px; font-size:13px;">⚖️ Compare Price</button>
            <button onclick="compareSameMakeModel(${carIndex})" style="background:#111; color:#fff; border:none; padding:8px 12px; border-radius:4px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:4px; font-size:13px;">🚗 Compare Same Model</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: start;">
          <div>
            <img src="${car.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'}" style="width:100%; height:350px; object-fit:cover; border-radius:8px;">
            <h3 style="margin-top:20px; font-size:1.2rem;">Description</h3>
            <p style="color:#555; line-height:1.5;">Well-maintained and slightly used ${car.make} ${car.model} on sale. Locally used, ${car.transmission}, ${car.fuel}. Excellent deal ready for driving in Kenya.</p>
            
            <h3 style="margin-top:20px; font-size:1.2rem;">Car Overview</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:14px; color:#444;">
              <p><b>Make:</b> ${car.make}</p>
              <p><b>Model:</b> ${car.model}</p>
              <p><b>Year:</b> ${car.year}</p>
              <p><b>Fuel Type:</b> ${car.fuel}</p>
              <p><b>Transmission:</b> ${car.transmission}</p>
              <p><b>Engine CC:</b> ${car.cc || 'N/A'}</p>
              <p><b>Location:</b> ${car.location}</p>
            </div>
          </div>

          <div style="background:#f9f9f9; padding:20px; border-radius:8px; border:1px solid #e1e1e1;">
            <p style="font-size:12px; color:#777; margin:0;">Selling Price</p>
            <h2 style="color:#ff4d00; margin:5px 0 15px 0;">Ksh ${car.price.toLocaleString()}</h2>
            <button style="width:100%; background:#a30000; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom:10px;">Get Car Financing</button>
            <button style="width:100%; background:#25d366; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">WhatsApp Broker</button>
          </div>
        </div>

        <!-- Comparison Results Section inside Modal -->
        <div id="comparisonSection" style="margin-top:30px; border-top:1px solid #ddd; padding-top:20px; display:none;"></div>
      </div>
    `;
  };

  window.closeCarDetails = function() {
    modalWrapper.style.display = 'none';
  };

  // 1. Compare Vehicles of Similar Price (+/- 20% margin)
  window.compareSamePrice = function(targetPrice, currentCarName) {
    const compSection = document.getElementById('comparisonSection');
    if (!compSection) return;

    const lowerBound = targetPrice * 0.8;
    const upperBound = targetPrice * 1.2;

    const similarCars = cars.filter(c => c.price >= lowerBound && c.price <= upperBound && `${c.make} ${c.model}` !== currentCarName);

    compSection.style.display = 'block';
    compSection.innerHTML = `
      <h3 style="font-size:1.2rem; color:#111; margin-bottom:12px;">⚖️ Vehicles with Similar Price (Ksh ${lowerBound.toLocaleString()} - Ksh ${upperBound.toLocaleString()})</h3>
      ${similarCars.length === 0 ? '<p style="color:#666;">No other vehicles found in this direct price range.</p>' : `
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:15px;">
          ${similarCars.map(sc => `
            <div style="background:#fff; border:1px solid #ddd; border-radius:6px; padding:10px;">
              <img src="${sc.image}" style="width:100%; height:110px; object-fit:cover; border-radius:4px;">
              <h4 style="font-size:1rem; margin:8px 0 4px 0;">${sc.make} ${sc.model}</h4>
              <p style="color:#ff4d00; font-weight:bold; font-size:0.95rem; margin:0 0 4px 0;">Ksh ${sc.price.toLocaleString()}</p>
              <p style="font-size:12px; color:#666; margin:0;">Year: ${sc.year} | ${sc.transmission}</p>
            </div>
          `).join('')}
        </div>
      `}
    `;
  };

  // 2. Compare with Another of the Same Make & Model
  window.compareSameMakeModel = function(carIndex) {
    const currentCar = cars[carIndex];
    const compSection = document.getElementById('comparisonSection');
    if (!currentCar || !compSection) return;

    const matchingModels = cars.filter((c, idx) => 
      c.make.toLowerCase() === currentCar.make.toLowerCase() && 
      c.model.toLowerCase() === currentCar.model.toLowerCase() && 
      idx !== carIndex
    );

    compSection.style.display = 'block';
    compSection.innerHTML = `
      <h3 style="font-size:1.2rem; color:#111; margin-bottom:12px;">🚗 Other Options for ${currentCar.make} ${currentCar.model} in System</h3>
      ${matchingModels.length === 0 ? '<p style="color:#666;">No other listings of this exact make and model found in the system right now.</p>' : `
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:15px;">
          ${matchingModels.map(mc => `
            <div style="background:#fff; border:1px solid #ddd; border-radius:6px; padding:10px;">
              <img src="${mc.image}" style="width:100%; height:110px; object-fit:cover; border-radius:4px;">
              <h4 style="font-size:1rem; margin:8px 0 4px 0;">${mc.make} ${mc.model} (${mc.year})</h4>
              <p style="color:#ff4d00; font-weight:bold; font-size:0.95rem; margin:0 0 4px 0;">Ksh ${mc.price.toLocaleString()}</p>
              <p style="font-size:12px; color:#666; margin:0;">Loc: ${mc.location} | ${mc.transmission}</p>
            </div>
          `).join('')}
        </div>
      `}
    `;
  };

  if (typeof cars !== 'undefined') {
    renderCars(cars);

    const populateSelect = (element, values) => {
      if (!element) return;
      [...new Set(values)].sort().forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        element.appendChild(opt);
      });
    };

    const kenyanMarketMakes = [
      ...cars.map(c => c.make),
      'Toyota', 'Mazda', 'Subaru', 'Nissan', 'Honda', 'Mitsubishi', 
      'Mercedes-Benz', 'BMW', 'Volkswagen', 'Audi', 'Lexus', 'Land Rover', 
      'Range Rover', 'Ford', 'Hyundai', 'Kia', 'Suzuki', 'Isuzu', 'Peugeot', 'Porsche'
    ];

    populateSelect(makeFilter, kenyanMarketMakes);
    populateSelect(locationFilter, cars.map(c => c.location));
    populateSelect(transmissionFilter, cars.map(c => c.transmission));
    populateSelect(fuelFilter, cars.map(c => c.fuel));
    populateSelect(ccFilter, cars.map(c => c.cc));

    // Custom Year Range Filter Populator (2010+ to 2023+)
    if (yearFilter) {
      yearFilter.innerHTML = '<option value="">Min Year</option>';
      const yearOptions = [
        { label: '2023 and Newer', value: 2023 },
        { label: '2022 and Newer', value: 2022 },
        { label: '2021 and Newer', value: 2021 },
        { label: '2020 and Newer', value: 2020 },
        { label: '2019 and Newer', value: 2019 },
        { label: '2018 and Newer', value: 2018 },
        { label: '2017 and Newer', value: 2017 },
        { label: '2016 and Newer', value: 2016 },
        { label: '2015 and Newer', value: 2015 },
        { label: '2014 and Newer', value: 2014 },
        { label: '2013 and Newer', value: 2013 },
        { label: '2012 and Newer', value: 2012 },
        { label: '2011 and Newer', value: 2011 },
        { label: '2010 and Newer', value: 2010 }
      ];

      yearOptions.forEach(optData => {
        const opt = document.createElement('option');
        opt.value = optData.value;
        opt.textContent = optData.label;
        yearFilter.appendChild(opt);
      });
    }

    // Custom Natural English Price Filter Options Populator
    if (priceFilter) {
      priceFilter.innerHTML = '<option value="">Max Price (Ksh)</option>';
      const priceOptions = [
        { label: 'Below 500k', value: 500000 },
        { label: 'Below 1 Million', value: 1000000 },
        { label: 'Below 1.5 Million', value: 1500000 },
        { label: 'Below 2 Million', value: 2000000 },
        { label: 'Below 2.5 Million', value: 2500000 },
        { label: 'Below 3 Million', value: 3000000 },
        { label: 'Below 4 Million', value: 4000000 },
        { label: 'Below 5 Million', value: 5000000 },
        { label: 'Below 6 Million', value: 6000000 },
        { label: 'Below 8 Million', value: 8000000 },
        { label: 'Below 10 Million', value: 10000000 }
      ];

      priceOptions.forEach(optData => {
        const opt = document.createElement('option');
        opt.value = optData.value;
        opt.textContent = optData.label;
        priceFilter.appendChild(opt);
      });
    }

    window.filterInventory = function() {
      const query = searchInput ? searchInput.value.toLowerCase() : '';
      const sMake = makeFilter ? makeFilter.value.toLowerCase() : '';
      const sLoc = locationFilter ? locationFilter.value.toLowerCase() : '';
      const sTrans = transmissionFilter ? transmissionFilter.value.toLowerCase() : '';
      const sFuel = fuelFilter ? fuelFilter.value.toLowerCase() : '';
      const sYear = yearFilter && yearFilter.value ? Number(yearFilter.value) : null;
      const sCc = ccFilter ? ccFilter.value : '';
      const sPrice = priceFilter && priceFilter.value ? Number(priceFilter.value) : null;

      const filtered = cars.filter(car => {
        const matchesQuery = car.make.toLowerCase().includes(query) || car.model.toLowerCase().includes(query);
        const matchesMake = sMake === "" || car.make.toLowerCase() === sMake;
        const matchesLoc = sLoc === "" || car.location.toLowerCase() === sLoc;
        const matchesTrans = sTrans === "" || car.transmission.toLowerCase() === sTrans;
        const matchesFuel = sFuel === "" || car.fuel.toLowerCase() === sFuel;
        const matchesYear = sYear === null || Number(car.year) >= sYear;
        const matchesCc = sCc === "" || Number(car.cc) === Number(sCc);
        const matchesPrice = sPrice === null || Number(car.price) <= sPrice;

        return matchesQuery && matchesMake && matchesLoc && matchesTrans && matchesFuel && matchesYear && matchesCc && matchesPrice;
      });

      renderCars(filtered);
    };

    [searchInput, makeFilter, locationFilter, transmissionFilter, fuelFilter, yearFilter, ccFilter, priceFilter].forEach(el => {
      if (el) el.addEventListener('input', filterInventory);
      if (el) el.addEventListener('change', filterInventory);
    });

  } else {
    if (container) container.innerHTML = `<p style="color:red; text-align:center;">Error: cars-data.js is not loaded properly.</p>`;
  }

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
        <div class="brand-badge" data-make="${brand.name}" style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 10px; min-width: 90px; text-align: center; cursor: pointer; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px;">
          <img src="${brand.logo_path}" alt="${brand.name}" style="width: 36px; height: 36px; object-fit: contain;">
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
