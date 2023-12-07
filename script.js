// Fetch JSON data from index.json
async function fetchData() {
    try {
        const response = await fetch('index.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

const provincesDropdown = document.getElementById('provinces');
const districtsDropdown = document.getElementById('districts');
const localBodiesDropdown = document.getElementById('localBodies');
const areaSpan = document.getElementById('area');
const websiteLink = document.getElementById('website');
const wardsSpan = document.getElementById('wards');

// Function to populate provinces dropdown
async function populateProvinces() {
    const data = await fetchData();

    data.forEach(province => {
        const option = document.createElement('option');
        option.textContent = province.name;
        option.value = province.id;
        provincesDropdown.appendChild(option);
    });

    // Trigger change event to populate districts and local bodies on initial load
    populateDistricts();
    populateLocalBodies();
}

// Function to populate districts dropdown based on selected province
async function populateDistricts() {
    const data = await fetchData();

    const selectedProvinceId = provincesDropdown.value;
    const selectedProvince = data.find(province => province.id === parseInt(selectedProvinceId));

    // Clear previous options
    districtsDropdown.innerHTML = '';
    localBodiesDropdown.innerHTML = '';

    if (selectedProvince) {
        Object.values(selectedProvince.districts).forEach(district => {
            const option = document.createElement('option');
            option.textContent = district.name;
            option.value = district.id;
            districtsDropdown.appendChild(option);
        });
        // Trigger change event to populate local bodies on district change
        populateLocalBodies();
    }
}

// Function to populate local bodies dropdown based on selected district
async function populateLocalBodies() {
    const data = await fetchData();

    const selectedDistrictId = districtsDropdown.value;
    const selectedProvince = data.find(province => province.id === parseInt(provincesDropdown.value));
    const selectedDistrict = Object.values(selectedProvince.districts).find(district => district.id === parseInt(selectedDistrictId));

    // Clear previous options
    localBodiesDropdown.innerHTML = '';

    if (selectedDistrict) {
        Object.values(selectedDistrict.municipalities).forEach(localBody => {
            const option = document.createElement('option');
            option.textContent = localBody.name;
            option.value = localBody.id;
            localBodiesDropdown.appendChild(option);
        });
    }
}

// Function to display details of selected local body
async function displayLocalBodyDetails() {
    const data = await fetchData();

    const selectedDistrictId = districtsDropdown.value;
    const selectedProvince = data.find(province => province.id === parseInt(provincesDropdown.value));
    const selectedDistrict = Object.values(selectedProvince.districts).find(district => district.id === parseInt(selectedDistrictId));

    const selectedLocalBodyId = localBodiesDropdown.value;
    const selectedLocalBody = Object.values(selectedDistrict.municipalities).find(localBody => localBody.id === parseInt(selectedLocalBodyId));

    if (selectedLocalBody) {
        areaSpan.textContent = selectedLocalBody.area_sq_km;
        websiteLink.textContent = selectedLocalBody.website;
        websiteLink.href = selectedLocalBody.website;
        wardsSpan.textContent = selectedLocalBody.wards.join(', ');
    }
}

// Event listeners for dropdown changes
provincesDropdown.addEventListener('change', () => {
    populateDistricts();
    populateLocalBodies();
    displayLocalBodyDetails();
});

districtsDropdown.addEventListener('change', () => {
    populateLocalBodies();
    displayLocalBodyDetails();
});

localBodiesDropdown.addEventListener('change', displayLocalBodyDetails);

// Populate provinces on initial load
populateProvinces();
