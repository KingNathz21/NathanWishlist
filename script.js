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

function cleanText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function safePrice(value) {
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : 0;
}

function getQuantity(item) {
  const quantity = Number(item?.quantity ?? 1);
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(99, Math.max(1, Math.floor(quantity)));
}

function normaliseItem(item, index) {
  const safeItem = item && typeof item === "object" ? item : {};
  const priorityValue = cleanText(safeItem.priority, "Medium");
  const validPriority = ["High", "Medium", "Low"].includes(priorityValue)
    ? priorityValue
    : "Medium";

  return {
    ...safeItem,
    name: cleanText(safeItem.name, `Wishlist item ${index + 1}`),
    wishlist: cleanText(safeItem.wishlist, "General"),
    category: cleanText(safeItem.category, "Other"),
    brand: cleanText(safeItem.brand),
    store: cleanText(safeItem.store),
    description: cleanText(safeItem.description),
    notes: cleanText(safeItem.notes),
    image: cleanText(safeItem.image),
    link: cleanText(safeItem.link),
    dateAdded: cleanText(safeItem.dateAdded),
    price: safePrice(safeItem.price),
    quantity: getQuantity(safeItem),
    priority: validPriority,
    purchased: safeItem.purchased === true
  };
}

function getItems() {
  if (!Array.isArray(window.wishlistItems) && typeof wishlistItems === "undefined") {
    return [];
  }

  const source = typeof wishlistItems !== "undefined" && Array.isArray(wishlistItems)
    ? wishlistItems
    : [];

  return source.map(normaliseItem);
}

function getWishlists() {
  return ["All", ...new Set(getItems().map(item => item.wishlist))];
}

function getCategories() {
  return ["All", ...new Set(getItems().map(item => item.category))];
}

function createFilterButtons(container, values, selectedValue, dataName, onSelect) {
  if (!container) return;

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
      selectedWishlist = value || "All";
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
      selectedCategory = value || "All";
      renderFilters();
      renderWishlist();
      updateStats();
    }
  );
}

function sortItems(items) {
  const priorityRank = { High: 1, Medium: 2, Low: 3 };

  return [...items].sort((a, b) => {
    if (sortMode === "price-low") return a.price - b.price;
    if (sortMode === "price-high") return b.price - a.price;
    if (sortMode === "priority") return priorityRank[a.priority] - priorityRank[b.priority];
    if (sortMode === "newest") return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);

    if (a.purchased !== b.purchased) return Number(a.purchased) - Number(b.purchased);
    const priorityDifference = priorityRank[a.priority] - priorityRank[b.priority];
    if (priorityDifference !== 0) return priorityDifference;
    return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
  });
}

function filteredItems() {
  const term = searchTerm.toLowerCase();

  const filtered = getItems().filter(item => {
    const matchesWishlist = selectedWishlist === "All" || item.wishlist === selectedWishlist;
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

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

    return matchesWishlist && matchesCategory && searchableText.includes(term);
  });

  return sortItems(filtered);
}

function imageMarkup(item) {
  const initial = escapeHtml(item.name.charAt(0).toUpperCase() || "?");

  if (item.image) {
    return `
      <img
        src="${escapeHtml(item.image)}"
        alt="${escapeHtml(item.name)}"
        loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.hidden=false;"
      />
      <div class="image-placeholder" hidden>${initial}</div>
    `;
  }

  return `<div class="image-placeholder">${initial}</div>`;
}

function cardMarkup(item) {
  const linkAvailable = Boolean(item.link);
  const quantity = item.quantity;
  const unitPrice = item.price;
  const lineTotal = unitPrice * quantity;
  const date = new Date(item.dateAdded);
  const formattedDate = item.dateAdded && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "";
  const priorityClass = item.priority.toLowerCase();

  return `
    <article class="wish-card ${item.purchased ? "purchased" : ""}">
      <div class="image-wrap">
        ${imageMarkup(item)}
        <div class="card-badges">
          <span class="badge priority-${escapeHtml(priorityClass)}">
            ${escapeHtml(item.priority)} priority
          </span>
          <span class="badge" title="Quantity set in wishlist-data.js">×${quantity}</span>
          <span class="badge">${escapeHtml(item.wishlist)}</span>
          ${item.purchased ? '<span class="badge purchased-badge">Purchased</span>' : ""}
        </div>
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span>${escapeHtml(item.category)}</span>
          <span>${escapeHtml(item.store)}</span>
        </div>

        <h3>${escapeHtml(item.name)}</h3>
        ${item.brand ? `<div class="card-meta" style="justify-content:flex-start;margin-top:8px;">Brand: ${escapeHtml(item.brand)}</div>` : ""}
        <p class="card-description">${escapeHtml(item.description)}</p>
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
  const shownUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  grid.innerHTML = items.map(item => {
    try {
      return cardMarkup(item);
    } catch (error) {
      console.error("Could not display wishlist item:", item, error);
      return "";
    }
  }).join("");

  emptyState.hidden = items.length !== 0;
  resultsText.textContent = `${items.length} ${items.length === 1 ? "item" : "items"} shown · ${shownUnits} ${shownUnits === 1 ? "unit" : "units"}`;
}

function updateStats() {
  const visibleItems = filteredItems();
  const totalUnits = visibleItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = visibleItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const purchasedUnits = visibleItems
    .filter(item => item.purchased)
    .reduce((sum, item) => sum + item.quantity, 0);

  itemCount.textContent = totalUnits;
  totalValue.textContent = money.format(totalCost);
  purchasedCount.textContent = purchasedUnits;
}


async function loadPdfLibrary() {
  if (window.jspdf?.jsPDF) return window.jspdf.jsPDF;

  const sources = [
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js",
    "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js",
    "https://unpkg.com/jspdf@2.5.2/dist/jspdf.umd.min.js"
  ];

  for (const source of sources) {
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = source;
        script.async = true;
        script.onload = resolve;
        script.onerror = () => {
          script.remove();
          reject(new Error("Could not load PDF library from " + source));
        };
        document.head.appendChild(script);
      });

      if (window.jspdf?.jsPDF) return window.jspdf.jsPDF;
    } catch (error) {
      console.warn("PDF library source failed:", source);
    }
  }

  throw new Error("All PDF library sources failed to load.");
}

async function exportWishlistPdf() {
  let PdfDocument;
  try {
    PdfDocument = await loadPdfLibrary();
  } catch (error) {
    console.error("Wishlist PDF export failed:", error);
    alert("The PDF tool couldn't load from its providers. Please try again in a moment, or open the wishlist in Safari/Chrome and try again.");
    return;
  }

  const items = filteredItems();
  if (!items.length) {
    alert("There are no wishlist items to export with the current filters.");
    return;
  }

  const pdf = new PdfDocument({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(49, 87, 164);
  pdf.text("Nathan's Wishlist", margin, y);
  y += 7;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(100, 113, 138);
  pdf.text(`Exported ${new Date().toLocaleDateString("en-GB")} · ${items.length} ${items.length === 1 ? "item" : "items"}`, margin, y);
  y += 5;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(30, 45, 75);
  pdf.text(`Total wishlist value: ${money.format(total)}`, margin, y);
  y += 9;

  pdf.setDrawColor(215, 224, 240);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 7;

  items.forEach((item, index) => {
    const nameLines = pdf.splitTextToSize(item.name, contentWidth - 4);
    const descriptionLines = item.description
      ? pdf.splitTextToSize(item.description, contentWidth - 4)
      : [];
    const notesLines = item.notes
      ? pdf.splitTextToSize(`Notes: ${item.notes}`, contentWidth - 4)
      : [];
    const blockHeight = 8 + nameLines.length * 5 + 5 + descriptionLines.length * 4 +
      notesLines.length * 4 + 5;

    if (y + blockHeight > pageHeight - 15) {
      pdf.addPage();
      y = 18;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(49, 87, 164);
    const validLink = /^https?:\/\//i.test(item.link) ? item.link : undefined;
    pdf.text(nameLines, margin, y, validLink ? { url: validLink } : {});
    y += nameLines.length * 5 + 1;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(55, 65, 81);
    const details = [
      item.category,
      item.store,
      `Qty: ${item.quantity}`,
      `Priority: ${item.priority}`,
      money.format(item.price * item.quantity)
    ].filter(Boolean).join(" · ");
    pdf.text(details, margin, y);
    y += 5;

    if (descriptionLines.length) {
      pdf.setTextColor(100, 113, 138);
      pdf.text(descriptionLines, margin, y);
      y += descriptionLines.length * 4;
    }

    if (notesLines.length) {
      pdf.setTextColor(100, 113, 138);
      pdf.text(notesLines, margin, y);
      y += notesLines.length * 4;
    }

    y += 4;
    pdf.setDrawColor(230, 235, 244);
    if (index < items.length - 1) {
      pdf.line(margin, y - 1, pageWidth - margin, y - 1);
    }
    y += 2;
  });

  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(130, 140, 155);
    pdf.text(`Nathan's Wishlist · Page ${page} of ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: "center" });
  }

  pdf.save("Nathans-Wishlist.pdf");
}

function setTheme(theme) {
  const dark = theme === "dark";
  document.body.classList.toggle("dark", dark);
  const themeIcon = document.querySelector(".theme-icon");
  if (themeIcon) themeIcon.textContent = dark ? "☀" : "☾";
  localStorage.setItem("wishlist-theme", dark ? "dark" : "light");
}

searchInput?.addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderWishlist();
  updateStats();
});

sortSelect?.addEventListener("change", event => {
  sortMode = event.target.value;
  renderWishlist();
});

document.getElementById("exportPdf")?.addEventListener("click", exportWishlistPdf);

themeToggle?.addEventListener("click", () => {
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