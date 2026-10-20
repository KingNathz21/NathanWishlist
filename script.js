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

async function getPdfImageData(url) {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  return new Promise(resolve => {
    const image = new Image();
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(value);
    };
    const timeout = setTimeout(() => finish(null), 4500);
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth || 1;
        canvas.height = image.naturalHeight || 1;
        canvas.getContext("2d").drawImage(image, 0, 0);
        finish(canvas.toDataURL("image/jpeg", 0.88));
      } catch (error) {
        finish(null);
      }
    };
    image.onerror = () => finish(null);
    image.src = url;
  });
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

  const button = document.getElementById("exportPdf");
  const originalLabel = button?.textContent;
  if (button) {
    button.disabled = true;
    button.textContent = "Preparing PDF…";
  }

  try {
    // Download photos in parallel. Shops that block cross-origin image access
    // will simply use the initials placeholder in the PDF.
    const imageData = await Promise.all(items.map(item => getPdfImageData(item.image)));
    const pdf = new PdfDocument({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 13;
    const contentWidth = pageWidth - margin * 2;
    const footerY = pageHeight - 19;
    const imageSize = 28;
    const imageX = margin + 4;
    const textX = imageX + imageSize + 5;
    const textWidth = margin + contentWidth - textX - 4;
    let y = 14;

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const units = items.reduce((sum, item) => sum + item.quantity, 0);

    function addHeader(firstPage) {
      pdf.setFillColor(30, 54, 103);
      pdf.roundedRect(margin, 12, contentWidth, firstPage ? 37 : 21, 4, 4, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(firstPage ? 21 : 15);
      pdf.text("Nathan's Wishlist", margin + 6, firstPage ? 23 : 25);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(220, 230, 250);
      if (firstPage) {
        pdf.text("YOUR PERSONAL COLLECTION  •  " + new Date().toLocaleDateString("en-GB"), margin + 6, 30);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(255, 255, 255);
        pdf.text(items.length + " " + (items.length === 1 ? "item" : "items") + "  ·  " + units + " " + (units === 1 ? "unit" : "units") + "  ·  " + money.format(total), margin + 6, 40);
      } else {
        pdf.text("WISHLIST COLLECTION", margin + 6, 31);
      }
      y = firstPage ? 57 : 40;
    }

    addHeader(true);

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const nameLines = pdf.splitTextToSize(item.name, textWidth).slice(0, 2);
      const descriptionLines = item.description ? pdf.splitTextToSize(item.description, textWidth).slice(0, 2) : [];
      const notesLines = item.notes ? pdf.splitTextToSize("Note: " + item.notes, textWidth).slice(0, 2) : [];
      const cardHeight = Math.max(36, 13 + nameLines.length * 4.6 + 5 + descriptionLines.length * 3.5 + notesLines.length * 3.5);

      if (y + cardHeight > footerY) {
        pdf.addPage();
        addHeader(false);
      }

      pdf.setFillColor(index % 2 === 0 ? 248 : 243, index % 2 === 0 ? 250 : 247, 254);
      pdf.setDrawColor(225, 232, 245);
      pdf.roundedRect(margin, y, contentWidth, cardHeight, 3, 3, "FD");

      pdf.setFillColor(231, 238, 250);
      pdf.roundedRect(imageX, y + 4, imageSize, imageSize, 2, 2, "F");
      if (imageData[index]) {
        try {
          pdf.addImage(imageData[index], "JPEG", imageX + 1, y + 5, imageSize - 2, imageSize - 2, undefined, "FAST");
        } catch (error) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.setTextColor(49, 87, 164);
          pdf.text((item.name.charAt(0) || "?").toUpperCase(), imageX + imageSize / 2, y + 21, { align: "center" });
        }
      } else {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(49, 87, 164);
        pdf.text((item.name.charAt(0) || "?").toUpperCase(), imageX + imageSize / 2, y + 21, { align: "center" });
      }

      const validLink = /^https?:\/\//i.test(item.link) ? item.link : undefined;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10.5);
      pdf.setTextColor(39, 75, 145);
      const titleY = y + 8;
      pdf.text(nameLines, textX, titleY, validLink ? { url: validLink } : {});
      let detailY = titleY + nameLines.length * 4.6 + 1;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.7);
      pdf.setTextColor(92, 105, 128);
      const details = [item.category, item.store, "Qty " + item.quantity, item.priority + " priority"].filter(Boolean).join("  ·  ");
      pdf.text(pdf.splitTextToSize(details, textWidth).slice(0, 1), textX, detailY);
      detailY += 4.2;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9.5);
      pdf.setTextColor(28, 43, 70);
      pdf.text(money.format(item.price * item.quantity), textX, detailY);
      detailY += 4;

      if (descriptionLines.length) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(94, 105, 124);
        pdf.text(descriptionLines, textX, detailY);
        detailY += descriptionLines.length * 3.5;
      }

      if (notesLines.length) {
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(7.3);
        pdf.setTextColor(74, 91, 122);
        pdf.text(notesLines, textX, detailY);
      }

      if (item.purchased) {
        pdf.setFillColor(220, 241, 229);
        pdf.roundedRect(margin + contentWidth - 25, y + 3, 21, 5, 2, 2, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(6.5);
        pdf.setTextColor(34, 115, 72);
        pdf.text("PURCHASED", margin + contentWidth - 14.5, y + 6.4, { align: "center" });
      }

      y += cardHeight + 3;
    }

    const pageCount = pdf.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      pdf.setPage(page);
      pdf.setDrawColor(225, 232, 245);
      pdf.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(130, 140, 155);
      pdf.text("NATHAN'S WISHLIST  ·  PRODUCT NAMES LINK TO THE SHOP", margin, pageHeight - 8);
      pdf.text(page + " / " + pageCount, pageWidth - margin, pageHeight - 8, { align: "right" });
    }

    pdf.save("Nathans-Wishlist.pdf");
  } catch (error) {
    console.error("Could not create wishlist PDF:", error);
    alert("Sorry, the PDF couldn't be created this time. Please try exporting again.");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalLabel || "Export PDF ↓";
    }
  }
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