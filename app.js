const carGrid = document.getElementById("carGrid");

const makeFilter = document.getElementById("makeFilter");
const modelFilter = document.getElementById("modelFilter");
const priceFilter = document.getElementById("priceFilter");
const yearFilter = document.getElementById("yearFilter");
const locationFilter = document.getElementById("locationFilter");
const transmissionFilter = document.getElementById("transmissionFilter");
const fuelFilter = document.getElementById("fuelFilter");
const ccFilter = document.getElementById("ccFilter");

function displayCars(carsToDisplay) {
    carGrid.innerHTML = "";
    if (carsToDisplay.length === 0) {
        carGrid.innerHTML = "<p>No cars found matching your filters.</p>";
        return;
    }
    
    carsToDisplay.forEach(car => {
        const card = document.createElement("div");
        card.classList.add("car-card");
        card.innerHTML = `
            <h3>${car.make} ${car.model} (${car.year})</h3>
            <div class="car-price">KSh ${car.price.toLocaleString()}</div>
            <div class="car-details">
                📍 ${car.location} | ⚙️ ${car.transmission}<br>
                ⛽ ${car.fuel} | 🔋 ${car.cc}cc
            </div>
        `;
        carGrid.appendChild(card);
    });
}

function filterCars() {
    const selectedMake = makeFilter.value;
    const typedModel = modelFilter.value.toLowerCase();
    const maxPrice = priceFilter.value ? Number(priceFilter.value) : Infinity;
    const minYear = yearFilter.value ? Number(yearFilter.value) : 0;
    const selectedLocation = locationFilter.value;
    const selectedTransmission = transmissionFilter.value;
    const selectedFuel = fuelFilter.value;
    const maxCc = ccFilter.value ? Number(ccFilter.value) : Infinity;

    const filtered = cars.filter(car => {
        return (selectedMake === "" || car.make === selectedMake) &&
               (typedModel === "" || car.model.toLowerCase().includes(typedModel)) &&
               (car.price <= maxPrice) &&
               (car.year >= minYear) &&
               (selectedLocation === "" || car.location === selectedLocation) &&
               (selectedTransmission === "" || car.transmission === selectedTransmission) &&
               (selectedFuel === "" || car.fuel === selectedFuel) &&
               (car.cc <= maxCc);
    });

    displayCars(filtered);
}

// Event listeners for real-time filtering
[makeFilter, modelFilter, priceFilter, yearFilter, locationFilter, transmissionFilter, fuelFilter, ccFilter].forEach(element => {
    element.addEventListener("input", filterCars);
    element.addEventListener("change", filterCars);
});

// Initial load
displayCars(cars);
