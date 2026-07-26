/*
  ============================================================
  EDIT THIS FILE TO ADD, REMOVE OR CHANGE YOUR WISHLIST ITEMS
  ============================================================

  Copy one full item block, paste it below, then change its details.

  image:
  - Use a direct image URL, for example: "https://example.com/photo.jpg"
  - Or add an image to an "images" folder and use: "images/photo.jpg"
  - Leave it blank ("") to show a stylish letter placeholder.

  price:
  - Enter numbers only. Example: 79.99

  priority:
  - Use "High", "Medium" or "Low"

  purchased:
  - Use true if bought, or false if still wanted.
*/

const wishlistItems = [
  {
    name: "Gigabyte GS32QCA 31.5 QHD Curved Gaming Monitor",
    category: "Technology",
    price: 199,
    priority: "High",
    purchased: false,
    store: "Currys",
    dateAdded: "2026-07-26",
    image: "https://media.currys.biz/i/currysprod/10282565?$l-large$&fmt=auto",
    link: "https://www.currys.co.uk/products/gigabyte-gs32qca-quad-hd-31.5-curved-va-lcd-gaming-monitor-black-10282565.html?searchTerm=gigabyte%2031.5",
    description: "Gaming Monitor to replace BUSH TV."
  },
  {
    name: "Tapo L530B Smart Bulb B22",
    category: "Lighting",
    price: 7.99,
    priority: "Low",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-24",
    image: "https://m.media-amazon.com/images/I/71BBEvO36ML._AC_SL1500_.jpg",
    link: "amazon.co.uk/TP-LINK-Tapo-Colour-Changeable-Required-L530B/dp/B08JZHXQC4/ref=sr_1_4?crid=2JPW6PZHYS8A0&dib=eyJ2IjoiMSJ9.7-mhOPgzAK_E0zT3wCB9E0BEuwSccTSHA7b8b1ORfy9DjKOwEUx6U04LE5YoPxiXXJI9jYBd9-PxaQMX11pe8xdXKp7vJvmQeoRvKM1C0CmIgriK4yX9XQFr4m2lT_ynYNiTKD06q8HBAUyh-pzOhtLerHO6W80Ot9HCBw8e-_N-me5v-QAtgQxpVFNTdGqMERok6TfS3HzaPzZB3ZV-vvVVqm6P0bMsZPoa-aM_r342Npozt5qqDl0wMVUZIbeGQZYVGLRXegRtpfO5zqNRs_M4CiJcvIsqiTcTxK5sOm4.i7mGvGrkSGK5DeZTN_Or9LZtYyfShd6vjGebIbtNhaM&dib_tag=se&keywords=Tapo+l530b&qid=1785059553&sprefix=tapo+l530b%2Caps%2C221&sr=8-4",
    description: "Light Bulb"
  },
  const newWishlistItems = [
  {
    name: "Wooden Phone Docking Station & Desk Organiser",
    category: "Home",
    price: null,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://ws-na.ssl-images-amazon.com/images/P/B0B2P429BZ.01.LZZZZZZZ.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B0B2P429BZ",
    description: "Black wooden docking station for organising a phone, watch, wallet, keys and other everyday items."
  },
  {
    name: "IVANKY VESA Certified DisplayPort Cable 2m",
    category: "Technology",
    price: null,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/415hJKWbacL.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B07JQKWX3C",
    description: "Two-metre braided DisplayPort cable for connecting a gaming PC or graphics card to a monitor."
  },
  {
    name: "UGREEN Cat 6 Braided Ethernet Cable 1m",
    category: "Technology",
    price: null,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://ws-na.ssl-images-amazon.com/images/P/B086H8KM61.01.LZZZZZZZ.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B086H8KM61",
    description: "One-metre braided Cat 6 Ethernet cable for a PC, games console, television, router or network switch."
  },
  {
    name: "Corsair RM850e 850W Fully Modular Power Supply",
    category: "Technology",
    price: null,
    priority: "High",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/71UlVM3qc5L._AC_SL1500_.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B0DMTL43VR",
    description: "850W fully modular, low-noise ATX power supply for upgrading a gaming PC."
  },
  {
    name: "POWEROWL 16 x AA & AAA Rechargeable Batteries",
    category: "Technology",
    price: 16.99,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://ws-na.ssl-images-amazon.com/images/P/B07YZJ6SBB.01.LZZZZZZZ.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B07YZJ6SBB",
    description: "Set of eight rechargeable AA batteries and eight rechargeable AAA batteries for controllers, remotes and other devices."
  },
  {
    name: "POWEROWL AA & AAA Rechargeable Batteries with 8-Slot Charger",
    category: "Technology",
    price: 14.99,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://ws-na.ssl-images-amazon.com/images/P/B0DFH3XX1N.01.LZZZZZZZ.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B0DFH3XX1N",
    description: "Eight-slot USB battery charger supplied with four rechargeable AA batteries and four rechargeable AAA batteries."
  },
  {
    name: "Gigabyte GS25F2A 24.5-inch Full HD Gaming Monitor",
    category: "Technology",
    price: 99,
    priority: "High",
    purchased: false,
    store: "Currys",
    dateAdded: "2026-07-26",
    image: "https://media.currys.biz/i/currysprod/10299628?$l-large$&fmt=auto",
    link: "https://www.currys.co.uk/products/gigabyte-gs25f2a-full-hd-24.5-ips-lcd-gaming-monitor-black-10299628.html",
    description: "24.5-inch Full HD IPS gaming monitor with a 240Hz refresh rate, 1ms response time, built-in speakers and VESA mounting support."
  }
];
