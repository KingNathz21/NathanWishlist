const grid = document.getElementById("wishlistGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const categoryFilters = document.getElementById("categoryFilters");
const sortSelect = document.getElementById("sortSelect");
const resultsText = document.getElementById("resultsText");
const itemCount = document.getElementById("itemCount");
const totalValue = document.getElementById("totalValue");
const purchasedCount = document.getElementById("purchasedCount");
const themeToggle = document.getElementById("themeToggle");

let selectedCategory = "All";
let searchTerm = "";
let sortMode = "featured";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP"
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCategories() {
  return ["All", ...new Set(wishlistItems.map(item => item.category))];
}

function renderFilters() {
  categoryFilters.innerHTML = getCategories()
    .map(category => `
      <button
        class="filter-pill ${category === selectedCategory ? "active" : ""}"
        type="button"
        data-category="${escapeHtml(category)}"
      >
        ${escapeHtml(category)}
      </button>
    `)
    .join("");

  categoryFilters.querySelectorAll(".filter-pill").forEach(button => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      renderFilters();
      renderWishlist();
    });
  });
}

function sortItems(items) {
  const priorityRank = { High: 1, Medium: 2, Low: 3 };

  return [...items].sort((a, b) => {
    if (sortMode === "price-low") return a.price - b.price;
    if (sortMode === "price-high") return b.price - a.price;
    if (sortMode === "priority") return priorityRank[a.priority] - priorityRank[b.priority];
    if (sortMode === "newest") return new Date(b.dateAdded) - new Date(a.dateAdded);

    // Featured: unpurchased first, then priority, then newest
    if (a.purchased !== b.purchased) return Number(a.purchased) - Number(b.purchased);
    const priorityDifference = priorityRank[a.priority] - priorityRank[b.priority];
    if (priorityDifference !== 0) return priorityDifference;
    return new Date(b.dateAdded) - new Date(a.dateAdded);
  });
}

function filteredItems() {
  const filtered = wishlistItems.filter(item => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const searchableText = [
      item.name,
      item.category,
      item.store,
      item.description,
      item.priority
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
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
          ${item.purchased ? '<span class="badge purchased-badge">Purchased</span>' : ""}
        </div>
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span>${escapeHtml(item.category)}</span>
          <span>${escapeHtml(item.store || "")}</span>
        </div>

        <h3>${escapeHtml(item.name)}</h3>
        <p class="card-description">${escapeHtml(item.description || "")}</p>

        <div class="card-footer">
          <div>
            <strong class="price">${money.format(item.price)}</strong>
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

  grid.innerHTML = items.map(cardMarkup).join("");
  emptyState.hidden = items.length !== 0;
  resultsText.textContent = `${items.length} ${items.length === 1 ? "item" : "items"} shown`;
}

function updateStats() {
  itemCount.textContent = wishlistItems.length;
  totalValue.textContent = money.format(
    wishlistItems.reduce((sum, item) => sum + Number(item.price || 0), 0)
  );
  purchasedCount.textContent = wishlistItems.filter(item => item.purchased).length;
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
