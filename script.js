const grid = document.getElementById("wishlistGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const wishlistFilters = document.getElementById("wishlistFilters");
const categoryFilters = document.getElementById("categoryFilters");
const sortSelect = document.getElementById("sortSelect");
const resultsText = document.getElementById("resultsText");
const itemCount = document.getElementById("itemCount");
const totalValue = document.getElementById("totalValue");
const purchasedCount = document.getElementById("purchasedCount");
const themeToggle = document.getElementById("themeToggle");

let selectedWishlist = "All";
let selectedCategory = "All";
let searchTerm = "";
let sortMode = "featured";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP"
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getQuantity(item) {
  const quantity = Number(item.quantity ?? 1);
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.floor(quantity));
}

function getWishlists() {
  return ["All", ...new Set(wishlistItems.map(item => item.wishlist || "General"))];
}

function getCategories() {
  return ["All", ...new Set(wishlistItems.map(item => item.category))];
}

function createFilterButtons(container, values, selectedValue, dataName, onSelect) {
  container.innerHTML = values
    .map(value => `
      <button
        class="filter-pill ${value === selectedValue ? "active" : ""}"
        type="button"
        data-${dataName}="${escapeHtml(value)}"
      >
        ${escapeHtml(value)}
      </button>
    `)
    .join("");

  container.querySelectorAll(".filter-pill").forEach(button => {
    button.addEventListener("click", () => onSelect(button.dataset[dataName]));
  });
}

function renderFilters() {
  createFilterButtons(
    wishlistFilters,
    getWishlists(),
    selectedWishlist,
    "wishlist",
    value => {
      selectedWishlist = value;
      renderFilters();
      renderWishlist();
      updateStats();
    }
  );

  createFilterButtons(
    categoryFilters,
    getCategories(),
    selectedCategory,
    "category",
    value => {
      selectedCategory = value;
      renderFilters();
      renderWishlist();
      updateStats();
    }
  );
}

function sortItems(items) {
  const priorityRank = { High: 1, Medium: 2, Low: 3 };

  return [...items].sort((a, b) => {
    if (sortMode === "price-low") return Number(a.price || 0) - Number(b.price || 0);
    if (sortMode === "price-high") return Number(b.price || 0) - Number(a.price || 0);
    if (sortMode === "priority") return priorityRank[a.priority] - priorityRank[b.priority];
    if (sortMode === "newest") return new Date(b.dateAdded) - new Date(a.dateAdded);

    if (a.purchased !== b.purchased) return Number(a.purchased) - Number(b.purchased);
    const priorityDifference = priorityRank[a.priority] - priorityRank[b.priority];
    if (priorityDifference !== 0) return priorityDifference;
    return new Date(b.dateAdded) - new Date(a.dateAdded);
  });
}

function filteredItems() {
  const filtered = wishlistItems.filter(item => {
    const itemWishlist = item.wishlist || "General";
    const matchesWishlist =
      selectedWishlist === "All" || itemWishlist === selectedWishlist;
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const searchableText = [
      item.name,
      item.wishlist,
      item.category,
      item.brand,
      item.store,
      item.description,
      item.notes,
      item.priority
    ].join(" ").toLowerCase();

    return matchesWishlist && matchesCategory && searchableText.includes(searchTerm.toLowerCase());
  });

  return sortItems(filtered);
}

function imageMarkup(item) {
  if (item.image) {
    return `
      <img
        src="${escapeHtml(item.image)}"
        alt="${escapeHtml(item.name)}"
        loading="lazy"
        onerror="this.parentElement.innerHTML='<div class=&quot;image-placeholder&quot;>${escapeHtml(item.name.charAt(0))}</div>'"
      />
    `;
  }

  return `<div class="image-placeholder">${escapeHtml(item.name.charAt(0))}</div>`;
}

function cardMarkup(item) {
  const linkAvailable = Boolean(item.link);
  const quantity = getQuantity(item);
  const unitPrice = Number(item.price || 0);
  const lineTotal = unitPrice * quantity;
  const itemWishlist = item.wishlist || "General";
  const date = new Date(item.dateAdded);
  const formattedDate = Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });

  return `
    <article class="wish-card ${item.purchased ? "purchased" : ""}">
      <div class="image-wrap">
        ${imageMarkup(item)}
        <div class="card-badges">
          <span class="badge priority-${escapeHtml(item.priority.toLowerCase())}">
            ${escapeHtml(item.priority)} priority
          </span>
          <span class="badge" title="Quantity set in wishlist-data.js">×${quantity}</span>
          <span class="badge">${escapeHtml(itemWishlist)}</span>
          ${item.purchased ? '<span class="badge purchased-badge">Purchased</span>' : ""}
        </div>
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span>${escapeHtml(item.category)}</span>
          <span>${escapeHtml(item.store || "")}</span>
        </div>

        <h3>${escapeHtml(item.name)}</h3>
        ${item.brand ? `<div class="card-meta" style="justify-content:flex-start;margin-top:8px;">Brand: ${escapeHtml(item.brand)}</div>` : ""}
        <p class="card-description">${escapeHtml(item.description || "")}</p>
        ${item.notes ? `<div class="item-notes"><strong>Notes:</strong> ${escapeHtml(item.notes)}</div>` : ""}

        <div class="card-footer">
          <div>
            <strong class="price">${money.format(lineTotal)}</strong>
            ${quantity > 1 ? `<div class="card-meta">${money.format(unitPrice)} each · ${quantity} wanted</div>` : ""}
            ${formattedDate ? `<div class="card-meta">Added ${formattedDate}</div>` : ""}
          </div>

          <a
            class="view-button ${linkAvailable ? "" : "disabled"}"
            href="${linkAvailable ? escapeHtml(item.link) : "#"}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${linkAvailable ? "View item ↗" : "No link"}
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderWishlist() {
  const items = filteredItems();
  const shownUnits = items.reduce((sum, item) => sum + getQuantity(item), 0);

  grid.innerHTML = items.map(cardMarkup).join("");
  emptyState.hidden = items.length !== 0;
  resultsText.textContent = `${items.length} ${items.length === 1 ? "item" : "items"} shown · ${shownUnits} ${shownUnits === 1 ? "unit" : "units"}`;
}

function updateStats() {
  const visibleItems = filteredItems();
  const totalUnits = visibleItems.reduce((sum, item) => sum + getQuantity(item), 0);
  const totalCost = visibleItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * getQuantity(item),
    0
  );
  const purchasedUnits = visibleItems
    .filter(item => item.purchased)
    .reduce((sum, item) => sum + getQuantity(item), 0);

  itemCount.textContent = totalUnits;
  totalValue.textContent = money.format(totalCost);
  purchasedCount.textContent = purchasedUnits;
}

function setTheme(theme) {
  const dark = theme === "dark";
  document.body.classList.toggle("dark", dark);
  document.querySelector(".theme-icon").textContent = dark ? "☀" : "☾";
  localStorage.setItem("wishlist-theme", dark ? "dark" : "light");
}

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderWishlist();
  updateStats();
});

sortSelect.addEventListener("change", event => {
  sortMode = event.target.value;
  renderWishlist();
});

themeToggle.addEventListener("click", () => {
  setTheme(document.body.classList.contains("dark") ? "light" : "dark");
});

const savedTheme = localStorage.getItem("wishlist-theme");
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setTheme("dark");
}

renderFilters();
updateStats();
renderWishlist();