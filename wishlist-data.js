/*
  ============================================================
  EDIT THIS FILE TO ADD, REMOVE OR CHANGE YOUR WISHLIST ITEMS
  ============================================================

  Copy one full item block, paste it below, then change its details.

  wishlist:
  - Give each item a list name, such as "General", "Birthday" or "Christmas".
  - The website will automatically create a filter for every list name used.

  brand:
  - Enter the product brand, such as "Gigabyte", "UGREEN" or "Tapo".

  notes:
  - Add any extra reminder or personal note.
  - Leave it blank ("") if you do not need a note.

  image:
  - Use a direct image URL, for example: "https://example.com/photo.jpg"
  - Or add an image to an "images" folder and use: "images/photo.jpg"
  - Leave it blank ("") to show a stylish letter placeholder.

  price:
  - Enter numbers only. Example: 79.99

  quantity:
  - Enter how many of the item you want. Example: 2
  - Use a whole number between 1 and 99.

  priority:
  - Use "High", "Medium" or "Low"

  purchased:
  - Use true if bought, or false if still wanted.
*/

const wishlistItems = [
  {
    name: "Gigabyte GS32QCA 31.5 QHD Curved Gaming Monitor",
    wishlist: "General",
    category: "Technology",
    brand: "Gigabyte",
    price: 199,
    quantity: 1,
    priority: "High",
    purchased: false,
    store: "Currys",
    dateAdded: "2026-07-26",
    image: "https://media.currys.biz/i/currysprod/10282565?$l-large$&fmt=auto",
    link: "https://www.currys.co.uk/products/gigabyte-gs32qca-quad-hd-31.5-curved-va-lcd-gaming-monitor-black-10282565.html?searchTerm=gigabyte%2031.5",
    description: "Gaming Monitor to replace BUSH TV.",
    notes: ""
  },
  {
    name: "Tapo L530B Smart Bulb B22",
    wishlist: "General",
    category: "Lighting",
    brand: "Tapo",
    price: 7.99,
    quantity: 1,
    priority: "Low",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-24",
    image: "https://m.media-amazon.com/images/I/71BBEvO36ML._AC_SL1500_.jpg",
    link: "https://www.amazon.co.uk/TP-LINK-Tapo-Colour-Changeable-Required-L530B/dp/B08JZHXQC4",
    description: "Light Bulb",
    notes: ""
  },
  {
    name: "Wooden Phone Docking Station & Desk Organiser",
    wishlist: "General",
    category: "Home",
    brand: "",
    price: null,
    quantity: 1,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://ws-na.ssl-images-amazon.com/images/P/B0B2P429BZ.01.LZZZZZZZ.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B0B2P429BZ",
    description: "Black wooden docking station for organising a phone, watch, wallet, keys and other everyday items.",
    notes: ""
  },
  {
    name: "IVANKY VESA Certified DisplayPort Cable 2m",
    wishlist: "General",
    category: "Technology",
    brand: "IVANKY",
    price: null,
    quantity: 3,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/415hJKWbacL.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B07JQKWX3C",
    description: "Two-metre braided DisplayPort cable for connecting a gaming PC or graphics card to a monitor.",
    notes: ""
  },
  {
    name: "UGREEN Cat 6 Braided Ethernet Cable 1m",
    wishlist: "General",
    category: "Technology",
    brand: "UGREEN",
    price: null,
    quantity: 3,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://ws-na.ssl-images-amazon.com/images/P/B086H8KM61.01.LZZZZZZZ.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B086H8KM61",
    description: "One-metre braided Cat 6 Ethernet cable for a PC, games console, television, router or network switch.",
    notes: ""
  },
  {
    name: "Corsair RM850e 850W Fully Modular Power Supply",
    wishlist: "General",
    category: "Technology",
    brand: "Corsair",
    price: null,
    quantity: 1,
    priority: "High",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/71UlVM3qc5L._AC_SL1500_.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B0DMTL43VR",
    description: "850W fully modular, low-noise ATX power supply for upgrading a gaming PC.",
    notes: ""
  },
  {
    name: "POWEROWL 16 x AA & AAA Rechargeable Batteries",
    wishlist: "General",
    category: "Technology",
    brand: "POWEROWL",
    price: 16.99,
    quantity: 1,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://ws-na.ssl-images-amazon.com/images/P/B07YZJ6SBB.01.LZZZZZZZ.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B07YZJ6SBB",
    description: "Set of eight rechargeable AA batteries and eight rechargeable AAA batteries for controllers, remotes and other devices.",
    notes: ""
  },
  {
    name: "POWEROWL AA & AAA Rechargeable Batteries with 8-Slot Charger",
    wishlist: "General",
    category: "Technology",
    brand: "POWEROWL",
    price: 14.99,
    quantity: 1,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://ws-na.ssl-images-amazon.com/images/P/B0DFH3XX1N.01.LZZZZZZZ.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B0DFH3XX1N",
    description: "Eight-slot USB battery charger supplied with four rechargeable AA batteries and four rechargeable AAA batteries.",
    notes: ""
  },
  {
    name: "Gigabyte GS25F2A 24.5-inch Full HD Gaming Monitor",
    wishlist: "General",
    category: "Technology",
    brand: "Gigabyte",
    price: 99,
    quantity: 2,
    priority: "High",
    purchased: false,
    store: "Currys",
    dateAdded: "2026-07-26",
    image: "https://media.currys.biz/i/currysprod/10299628?$l-large$&fmt=auto",
    link: "https://www.currys.co.uk/products/gigabyte-gs25f2a-full-hd-24.5-ips-lcd-gaming-monitor-black-10299628.html",
    description: "24.5-inch Full HD IPS gaming monitor with a 240Hz refresh rate, 1ms response time, built-in speakers and VESA mounting support.",
    notes: ""
  }
];