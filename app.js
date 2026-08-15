const defaultCars = [
    { make: "Toyota", model: "RAV4", price: 3200000, year: 2017, location: "Nairobi", condition: "Foreign Used", transmission: "Automatic", fuel: "Petrol", cc: 2000, image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80" },
    { make: "Mazda", model: "Demio", price: 950000, year: 2016, location: "Mombasa", condition: "Foreign Used", transmission: "Automatic", fuel: "Petrol", cc: 1300, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80" },
    { make: "Subaru", model: "Forester", price: 2800000, year: 2015, location: "Nakuru", condition: "Locally Used", transmission: "Automatic", fuel: "Petrol", cc: 2500, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80" }
];

let cars = JSON.parse(localStorage.getItem("drivehub_cars")) || defaultCars;

const carGrid = document.getElementById("carGrid");
const toggleFormBtn = document.getElementById("toggleFormBtn");
const postCarSection = document.getElementById("postCarSection");
const postCarForm = document.getElementById("postCarForm");

toggleFormBtn.addEventListener("click", () => {
    postCarSection.classList.toggle("hidden");
    toggleFormBtn.textContent = postCarSection.classList.contains("hidden") ? "+ Post Car Free" : "Close Form";
});

postCarForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const userImg = document.getElementById("postImage").value.trim();
    const fallbackImg = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80";

    const newCar = {
        make: document.getElementById("postMake").value,
        model: document.getElementById("postModel").value,
        price: Number(document.getElementById("postPrice").value),
        year: Number(document.getElementById("postYear").value),
        location: document.getElementById("postLocation").value,
        condition: document.getElementById("postCondition").value,
        transmission: document.getElementById("postTransmission").value,
        fuel: document.getElementById("postFuel").value,
        cc: Number(document.getElementById("postCc").value),
        image: userImg !== "" ? userImg : fallbackImg
    };

    cars.unshift(newCar);
    localStorage.setItem("drivehub_cars", JSON.stringify(cars));
    
    postCarForm.reset();
    postCarSection.classList.add("hidden");
    toggleFormBtn.textContent = "+ Post Car Free";
    
    filterCars();
});

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
        carGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #64748b;'>No cars found matching your filters.</p>";
        return;
    }
    
    carsToDisplay.forEach(car => {
        const card = document.createElement("div");
        card.classList.add("car-card");
        card.innerHTML = `
            <div class="car-badge">${car.condition || 'Foreign Used'}</div>
            <img src="${car.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'}" alt="${car.make} ${car.model}" class="car-img">
            <div class="car-info">
                <h4>${car.make} ${car.model} (${car.year})</h4>
                <div class="car-price">KSh ${car.price.toLocaleString()}</div>
                <div class="car-details">
                    📍 Town: <strong>${car.location}</strong><br>
                    ⚙️ Trans: ${car.transmission} | ⛽ Fuel: ${car.fuel}<br>
                    🔋 Engine: ${car.cc}cc
                </div>
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

[makeFilter, modelFilter, priceFilter, yearFilter, locationFilter, transmissionFilter, fuelFilter, ccFilter].forEach(element => {
    element.addEventListener("input", filterCars);
    element.addEventListener("change", filterCars);
});

displayCars(cars);
