// Initialize Supabase Client
const SUPABASE_URL = 'https://qzqvyceabwxvzeylfnpw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXZ5Y2VhYnd4dnpleWxmbnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NzEzMzUsImV4cCI6MjEwMjM0NzMzNX0.9fDJGRjaCamvZhxkfhwu08vFTTPcabZ00VBvi_av1wk';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const carGrid = document.getElementById('carGrid');
const postCarForm = document.getElementById('postCarForm');
const toggleFormBtn = document.getElementById('toggleFormBtn');
const postCarSection = document.getElementById('postCarSection');
const authBtn = document.getElementById('authBtn');
const userDisplay = document.getElementById('userDisplay');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authNameInput = document.getElementById('authName');
const toggleAuthMode = document.getElementById('toggleAuthMode');
const switchText = document.getElementById('switchText');

let isRegistering = false;
let currentUser = null;
let allCars = [];

// Check session on load
async function checkUserSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    currentUser = session ? session.user : null;
    updateAuthUI();
}

function updateAuthUI() {
    if (currentUser) {
        authBtn.textContent = 'Sign Out';
        userDisplay.textContent = `👤 ${currentUser.email}`;
        userDisplay.classList.remove('hidden');
        toggleFormBtn.classList.remove('hidden');
    } else {
        authBtn.textContent = 'Sign In / Register';
        userDisplay.classList.add('hidden');
        toggleFormBtn.classList.add('hidden');
        postCarSection.classList.add('hidden');
    }
}

// Auth Modal Controls
authBtn.addEventListener('click', async () => {
    if (currentUser) {
        await supabaseClient.auth.signOut();
        currentUser = null;
        updateAuthUI();
        alert('Signed out successfully.');
    } else {
        authModal.classList.remove('hidden');
    }
});

closeAuthModal.addEventListener('click', () => authModal.classList.add('hidden'));

toggleAuthMode.addEventListener('click', (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    if (isRegistering) {
        authTitle.textContent = 'Create DriveHub Account';
        authSubmitBtn.textContent = 'Register';
        authNameInput.classList.remove('hidden');
        switchText.textContent = 'Already have an account?';
        toggleAuthMode.textContent = 'Sign in here';
    } else {
        authTitle.textContent = 'Sign In to DriveHub';
        authSubmitBtn.textContent = 'Sign In';
        authNameInput.classList.add('hidden');
        switchText.textContent = "Don't have an account?";
        toggleAuthMode.textContent = 'Register here';
    }
});

// Handle Login & Registration with Email Verification
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    if (isRegistering) {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: authNameInput.value }
            }
        });
        if (error) {
            alert('Registration error: ' + error.message);
            return;
        }
        alert('Registration successful! Please check your email inbox to verify your account before signing in.');
        isRegistering = false;
        authTitle.textContent = 'Sign In to DriveHub';
        authSubmitBtn.textContent = 'Sign In';
        authNameInput.classList.add('hidden');
        switchText.textContent = "Don't have an account?";
        toggleAuthMode.textContent = 'Register here';
    } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Sign in error: ' + error.message);
            return;
        }
        alert('Signed in successfully!');
        authModal.classList.add('hidden');
        authForm.reset();
        checkUserSession();
    }
});

// Toggle Post Car Form
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
                <div class="seller-box" style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 8px; font-size: 13px;">
                    <p>👤 <strong>Seller:</strong> ${car.seller_name || 'Verified Dealer'}</p>
                    <p>📞 <strong>Phone:</strong> <a href="tel:${car.seller_phone}" style="color: #007bff; font-weight: bold;">${car.seller_phone || 'N/A'}</a></p>
                </div>
            </div>
        `;
        carGrid.appendChild(card);
    });
}

// Handle Form Submission (Uploads Image & Links to User ID)
postCarForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
        alert('You must be signed in to post a car.');
        return;
    }

    const imageFile = document.getElementById('postImageFile').files[0];
    let imageUrl = '';

    if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabaseClient.storage
            .from('car-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            alert('Error uploading image: ' + uploadError.message);
            return;
        }

        const { data: publicURLData } = supabaseClient.storage
            .from('car-images')
            .getPublicUrl(filePath);

        imageUrl = publicURLData.publicUrl;
    }

    const newCar = {
        user_id: currentUser.id,
        make: document.getElementById('postMake').value.trim(),
        model: document.getElementById('postModel').value.trim(),
        price: parseFloat(document.getElementById('postPrice').value),
        year: parseInt(document.getElementById('postYear').value),
        seller_name: document.getElementById('postSellerName').value.trim(),
        seller_phone: document.getElementById('postSellerPhone').value.trim(),
        seller_email: currentUser.email,
        location: document.getElementById('postLocation').value,
        condition: document.getElementById('postCondition').value,
        transmission: document.getElementById('postTransmission').value,
        fuel: document.getElementById('postFuel').value,
        cc: parseInt(document.getElementById('postCc').value),
        image: imageUrl
    };

    const { error } = await supabaseClient
        .from('cars')
        .insert([newCar]);

    if (error) {
        alert('Error posting car: ' + error.message);
        console.error(error);
        return;
    }

    alert('Vehicle listed successfully and linked to your profile!');
    postCarForm.reset();
    postCarSection.classList.add('hidden');
    toggleFormBtn.textContent = '+ Post Car Free';
    
    fetchCars();
});

// Filter Functionality
const makeFilter = document.getElementById('makeFilter');
const modelFilter = document.getElementById('modelFilter');
const priceFilter = document.getElementById('priceFilter');
const yearFilter = document.getElementById('yearFilter');
const locationFilter = document.getElementById('locationFilter');
const transmissionFilter = document.getElementById('transmissionFilter');
const fuelFilter = document.getElementById('fuelFilter');
const ccFilter = document.getElementById('ccFilter');

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

[makeFilter, modelFilter, priceFilter, yearFilter, locationFilter, transmissionFilter, fuelFilter, ccFilter].forEach(element => {
    element.addEventListener('input', filterCars);
    element.addEventListener('change', filterCars);
});

// Initialize on page load
checkUserSession();
fetchCars();
