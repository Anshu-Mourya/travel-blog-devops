const API_BASE = "http://localhost:5001";

let allDestinations = [];

const container = document.getElementById("card-container");
const searchInput = document.querySelector('input[type="text"]');

// ── Skeleton Loader ───────────────────────────────────────

function showSkeletons(count = 6) {
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");

    skeleton.classList.add("card", "skeleton-card");

    skeleton.innerHTML = `
      <div class="skeleton skeleton-img"></div>

      <div class="card-content">
        <div class="skeleton skeleton-text"></div>
      </div>
    `;

    container.appendChild(skeleton);
  }
}

// ── Render Cards ──────────────────────────────────────────

function displayDestinations(destinations) {
  container.innerHTML = "";

  if (destinations.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fa-solid fa-compass"></i>
        <p>No destinations found for "<strong>${searchInput.value}</strong>"</p>
      </div>
    `;
    return;
  }

  destinations.forEach((destination, index) => {
    const card = document.createElement("div");

    card.classList.add("card", "card-animate");

    card.style.animationDelay = `${index * 60}ms`;

    card.innerHTML = `
      <img
        src="${destination.image}"
        alt="${destination.name}"
        loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'"
      >

      <div class="card-content">
        <h3>${destination.name}</h3>

        ${
          destination.country
            ? `<p class="card-country">${destination.country}</p>`
            : ""
        }
      </div>
    `;

    card.addEventListener("click", () => openDestination(destination));

    container.appendChild(card);
  });
}

// ── Fetch Data ────────────────────────────────────────────

showSkeletons();

fetch(`${API_BASE}/api/destinations`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  })

  .then((data) => {
    console.log("Destinations loaded:", data);

    allDestinations = data;

    displayDestinations(allDestinations);
  })

  .catch((err) => {
    console.error("Failed to load destinations:", err);

    container.innerHTML = `
      <div class="no-results">
        <i class="fa-solid fa-triangle-exclamation"></i>

        <p>
          Could not load destinations.
          Make sure backend server is running on port 5001.
        </p>
      </div>
    `;
  });

// ── Search with Debounce ──────────────────────────────────

let debounceTimer;

searchInput.addEventListener("keyup", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const searchText = searchInput.value.toLowerCase().trim();

    const filtered = allDestinations.filter((d) =>
      d.name.toLowerCase().includes(searchText) ||
      (d.country &&
        d.country.toLowerCase().includes(searchText))
    );

    displayDestinations(filtered);
  }, 300);
});

// ── Sidebar Active State ──────────────────────────────────

document.querySelectorAll(".sidebar ul li").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".sidebar ul li")
      .forEach((li) => li.classList.remove("active"));

    item.classList.add("active");
  });
});

// ── Card Click Handler ────────────────────────────────────

function openDestination(destination) {
  console.log("Opened destination:", destination.name);
}