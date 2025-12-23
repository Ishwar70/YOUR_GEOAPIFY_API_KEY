const currentTimezoneDiv = document.getElementById("current-timezone");
const currentErrorDiv = document.getElementById("current-error");

const addressInput = document.getElementById("address");
const getTimezoneBtn = document.getElementById("get-timezone");
const addressTimezoneDiv = document.getElementById("address-timezone");
const addressErrorDiv = document.getElementById("address-error");

// Replace with your Geoapify API key
const GEOAPIFY_API_KEY = "YOUR_GEOAPIFY_API_KEY";

// ------------------ Fetch Current Timezone ------------------
function fetchTimezone(lat, lon, displayDiv, errorDiv) {
  fetch(`https://api.geoapify.com/v1/timezone?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.timezone) {
        displayDiv.textContent = data.timezone.name;
        errorDiv.textContent = "";
      } else {
        errorDiv.textContent = "Could not fetch timezone data.";
      }
    })
    .catch(err => {
      errorDiv.textContent = "Error fetching timezone: " + err.message;
    });
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchTimezone(lat, lon, currentTimezoneDiv, currentErrorDiv);
    },
    error => {
      currentErrorDiv.textContent = "Geolocation error: " + error.message;
      currentTimezoneDiv.textContent = "";
    }
  );
} else {
  currentErrorDiv.textContent = "Geolocation is not supported by your browser.";
  currentTimezoneDiv.textContent = "";
}

// ------------------ Fetch Timezone by Address ------------------
getTimezoneBtn.addEventListener("click", () => {
  const address = addressInput.value.trim();
  if (!address) {
    addressErrorDiv.textContent = "Please enter an address.";
    addressTimezoneDiv.textContent = "";
    return;
  }

  addressErrorDiv.textContent = "Fetching coordinates...";
  addressTimezoneDiv.textContent = "";

  fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${GEOAPIFY_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const lat = data.features[0].properties.lat;
        const lon = data.features[0].properties.lon;
        addressErrorDiv.textContent = "";
        fetchTimezone(lat, lon, addressTimezoneDiv, addressErrorDiv);
      } else {
        addressErrorDiv.textContent = "Could not find the location. Please enter a valid address.";
      }
    })
    .catch(err => {
      addressErrorDiv.textContent = "Error fetching coordinates: " + err.message;
    });
});
