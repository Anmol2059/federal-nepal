async function fetchData(language) {
    const jsonFileName = language === 'nepali' ? 'nep.json' : 'index.json';
    try {
        const response = await fetch(jsonFileName);
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
const languageDropdown = document.getElementById('languages');

// Function to populate provinces dropdown based on selected language
async function populateProvinces(language) {
    const data = await fetchData(language);

    provincesDropdown.innerHTML = ''; // Clear previous options

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
    const data = await fetchData(languageDropdown.value);

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
    const data = await fetchData(languageDropdown.value);

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
    const data = await fetchData(languageDropdown.value);

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

// Event listener for language dropdown changes
languageDropdown.addEventListener('change', () => {
    // Clear existing details when language changes
    areaSpan.textContent = '';
    websiteLink.textContent = '';
    websiteLink.href = '';
    wardsSpan.textContent = '';

    populateProvinces(languageDropdown.value);
});

// Populate provinces based on the initial language selection (default: English)
populateProvinces(languageDropdown.value);


// dark mode
// Get the dark mode toggle element
const darkModeToggle = document.getElementById('darkModeToggle');

// Function to set dark mode
function setDarkMode(isDarkMode) {
  const body = document.body;
  const navbar = document.querySelector('nav');
  const details = document.querySelector('.details');

  if (isDarkMode) {
    body.classList.add('dark-mode');
    navbar.classList.add('dark-mode');
    details.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
    navbar.classList.remove('dark-mode');
    details.classList.remove('dark-mode');
  }
}

// Event listener for dark mode toggle
darkModeToggle.addEventListener('change', function () {
  setDarkMode(this.checked);
});

// Function to detect user's OS preference for dark mode
function detectDarkMode() {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  setDarkMode(darkModeMediaQuery.matches);
}

// Check user's OS preference for dark mode on page load
detectDarkMode();
