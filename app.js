// Initialize Supabase Client
const SUPABASE_URL = 'https://qzqvyceabwxvzeylfnpw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXZ5Y2VhYnd4dnpleWxmbnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NzEzMzUsImV4cCI6MjEwMjM0NzMzNX0.9fDJGRjaCamvZhxkfhwu08vFTTPcabZ00VBvi_av1wk';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const carGrid = document.getElementById('carGrid');
const postCarForm = document.getElementById('postCarForm');
const toggleFormBtn = document.getElementById('toggleFormBtn');
const postCarSection = document.getElementById('postCarSection');

// Filter Inputs
const makeFilter = document.getElementById('makeFilter');
const modelFilter = document.getElementById('modelFilter');
const priceFilter = document.getElementById('priceFilter');
const yearFilter = document.getElementById('yearFilter');
const locationFilter = document.getElementById('locationFilter');
const transmissionFilter = document.getElementById('transmissionFilter');
const fuelFilter = document.getElementById('fuelFilter');
const ccFilter = document.getElementById('ccFilter');

let allCars = [];

// Toggle Post Form Visibility
toggleFormBtn.addEventListener('click', () => {
    postCarSection.classList.toggle('hidden');
    toggleFormBtn.textContent = postCarSection.classList.contains('hidden') ? '+ Post Car Free' : 'Close Form';
});

// Fetch Cars from Supabase
async function fetchCars() {
    const { data, error } = await supabaseClient
        .from('cars')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching cars:', error);
        return;
    }

    allCars = data || [];
    displayCars(allCars);
}

// Display Cars in Grid
function displayCars(cars) {
    carGrid.innerHTML = '';

    if (cars.length === 0) {
        carGrid.innerHTML = `<p class="no-cars">No vehicles found matching your criteria.</p>`;
        return;
    }

    cars.forEach(car => {
        const card = document.createElement('div');
        card.className = 'car-card';

        const defaultImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80';
        const carImage = car.image && car.image.trim() !== '' ? car.image : defaultImage;

        card.innerHTML = `
            <div class="car-image-container">
                <img src="${carImage}" alt="${car.make} ${car.model}" onerror="this.src='${defaultImage}'">
                <span class="badge-condition">${car.condition}</span>
            </div>
            <div class="car-details">
                <h4>${car.make} ${car.model} (${car.year})</h4>
                <p class="car-price">KSh ${Number(car.price).toLocaleString()}</p>
                <div class="car-specs">
                    <span>📍 ${car.location}</span>
                    <span>⚙️ ${car.transmission}</span>
                    <span>⛽ ${car.fuel}</span>
                    <span>🔧 ${car.cc}cc</span>
                </div>
            </div>
        `;
        carGrid.appendChild(card);
    });
}

// Handle Form Submission (Save to Supabase)
postCarForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newCar = {
        make: document.getElementById('postMake').value.trim(),
        model: document.getElementById('postModel').value.trim(),
        price: parseFloat(document.getElementById('postPrice').value),
        year: parseInt(document.getElementById('postYear').value),
        location: document.getElementById('postLocation').value,
        condition: document.getElementById('postCondition').value,
        transmission: document.getElementById('postTransmission').value,
        fuel: document.getElementById('postFuel').value,
        cc: parseInt(document.getElementById('postCc').value),
        image: document.getElementById('postImage').value.trim()
    };

    const { error } = await supabaseClient
        .from('cars')
        .insert([newCar]);

    if (error) {
        alert('Error posting car: ' + error.message);
        console.error(error);
        return;
    }

    alert('Vehicle listed successfully to Supabase!');
    postCarForm.reset();
    postCarSection.classList.add('hidden');
    toggleFormBtn.textContent = '+ Post Car Free';
    
    // Refresh listing view
    fetchCars();
});

// Filter Functionality
function filterCars() {
    const selectedMake = makeFilter.value.toLowerCase();
    const searchModel = modelFilter.value.toLowerCase().trim();
    const maxPrice = priceFilter.value ? parseFloat(priceFilter.value) : Infinity;
    const minYear = yearFilter.value ? parseInt(yearFilter.value) : 0;
    const selectedLocation = locationFilter.value.toLowerCase();
    const selectedTransmission = transmissionFilter.value.toLowerCase();
    const selectedFuel = fuelFilter.value.toLowerCase();
    const selectedCc = ccFilter.value ? parseInt(ccFilter.value) : 0;

    const filtered = allCars.filter(car => {
        const matchesMake = selectedMake === '' || car.make.toLowerCase() === selectedMake;
        const matchesModel = car.model.toLowerCase().includes(searchModel);
        const matchesPrice = car.price <= maxPrice;
        const matchesYear = car.year >= minYear;
        const matchesLocation = selectedLocation === '' || car.location.toLowerCase() === selectedLocation;
        const matchesTransmission = selectedTransmission === '' || car.transmission.toLowerCase() === selectedTransmission;
        const matchesFuel = selectedFuel === '' || car.fuel.toLowerCase() === selectedFuel;
        
        let matchesCc = true;
        if (selectedCc === 1500) matchesCc = car.cc <= 1500;
        else if (selectedCc === 2000) matchesCc = car.cc <= 2000;
        else if (selectedCc === 2500) matchesCc = car.cc >= 2000;

        return matchesMake && matchesModel && matchesPrice && matchesYear && matchesLocation && matchesTransmission && matchesFuel && matchesCc;
    });

    displayCars(filtered);
}

// Attach filter events
[makeFilter, modelFilter, priceFilter, yearFilter, locationFilter, transmissionFilter, fuelFilter, ccFilter].forEach(element => {
    element.addEventListener('input', filterCars);
    element.addEventListener('change', filterCars);
});

// Load cars on page load
fetchCars();
