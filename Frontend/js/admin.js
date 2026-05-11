const API_BASE = "http://localhost:5001";

const nameInput    = document.getElementById("dest-name");
const countryInput = document.getElementById("dest-country");
const imageInput   = document.getElementById("dest-image");
const submitBtn    = document.getElementById("submit-btn");
const statusMsg    = document.getElementById("status-msg");
const imagePreview = document.getElementById("image-preview");
const destList     = document.getElementById("admin-dest-list");

// ── Image Preview on URL input ────────────────────────────

imageInput.addEventListener("input", () => {
  const url = imageInput.value.trim();
  if (url) {
    imagePreview.innerHTML = `
      <img
        src="${url}"
        alt="Preview"
        onerror="this.parentElement.innerHTML='<i class=\'fa-solid fa-triangle-exclamation\'></i><p>Invalid image URL</p>'"
      >
    `;
  } else {
    imagePreview.innerHTML = `
      <i class="fa-solid fa-image"></i>
      <p>Image preview will appear here</p>
    `;
  }
});

// ── Show Status Message ───────────────────────────────────

function showStatus(message, type) {
  statusMsg.textContent = message;
  statusMsg.className = `status-msg show ${type}`;
  setTimeout(() => {
    statusMsg.className = "status-msg";
  }, 3000);
}

// ── Validate Inputs ───────────────────────────────────────

function validate() {
  if (!nameInput.value.trim()) {
    showStatus("❌ Destination name is required.", "error");
    nameInput.focus();
    return false;
  }
  if (!countryInput.value.trim()) {
    showStatus("❌ Country is required.", "error");
    countryInput.focus();
    return false;
  }
  if (!imageInput.value.trim()) {
    showStatus("❌ Image URL is required.", "error");
    imageInput.focus();
    return false;
  }
  return true;
}

// ── POST — Add Destination ────────────────────────────────

submitBtn.addEventListener("click", async () => {
  if (!validate()) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Adding...`;

  const newDestination = {
    name:    nameInput.value.trim(),
    country: countryInput.value.trim(),
    image:   imageInput.value.trim(),
  };

  try {
    const response = await fetch(`${API_BASE}/api/destinations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDestination),
    });

    if (!response.ok) throw new Error("Failed to add destination");

    const saved = await response.json();
    showStatus(`✅ "${saved.name}" added successfully!`, "success");

    // Clear form
    nameInput.value    = "";
    countryInput.value = "";
    imageInput.value   = "";
    imagePreview.innerHTML = `
      <i class="fa-solid fa-image"></i>
      <p>Image preview will appear here</p>
    `;

    // Refresh list
    loadDestinations();

  } catch (err) {
    showStatus("❌ Failed to add. Is the server running?", "error");
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Destination`;
  }
});

// ── GET — Load All Destinations ───────────────────────────

async function loadDestinations() {
  destList.innerHTML = `<p class="loading-text">Loading...</p>`;

  try {
    const response = await fetch(`${API_BASE}/api/destinations`);
    const data     = await response.json();

    if (data.length === 0) {
      destList.innerHTML = `<p class="loading-text">No destinations yet.</p>`;
      return;
    }

    destList.innerHTML = "";
    data.forEach((dest) => {
      const item = document.createElement("div");
      item.classList.add("dest-item");
      item.innerHTML = `
        <img src="${dest.image}" alt="${dest.name}"
          onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'"
        >
        <div class="dest-item-info">
          <h4>${dest.name}</h4>
          <p>${dest.country}</p>
        </div>
        <button class="delete-btn" onclick="deleteDestination('${dest._id}', this)">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
      destList.appendChild(item);
    });

  } catch (err) {
    destList.innerHTML = `<p class="loading-text">❌ Could not load. Is server running?</p>`;
  }
}

// ── DELETE — Remove Destination ───────────────────────────

async function deleteDestination(id, btn) {
  if (!confirm("Delete this destination?")) return;

  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;

  try {
    const response = await fetch(`${API_BASE}/api/destinations/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Delete failed");

    showStatus("🗑️ Destination deleted.", "success");
    loadDestinations();

  } catch (err) {
    showStatus("❌ Delete failed.", "error");
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  }
}

// ── Init ──────────────────────────────────────────────────

loadDestinations();