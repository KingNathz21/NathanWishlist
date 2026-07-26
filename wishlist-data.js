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
    price: 20.16,
    quantity: 1,
    priority: "Low",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/71T+tFXj5OL._AC_SL1500_.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B0B2P429BZ",
    description: "Black wooden docking station for organising a phone, watch, wallet, keys and other everyday items.",
    notes: ""
  },
  {
    name: "IVANKY VESA Certified DisplayPort Cable 2m",
    wishlist: "General",
    category: "Technology",
    brand: "IVANKY",
    price: 5.99,
    quantity: 3,
    priority: "High",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/415hJKWbacL.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B07JQKWX3C",
    description: "Two-metre braided DisplayPort cable for connecting a gaming PC or graphics card to a monitor.",
    notes: "Need to be bought with Monitors"
  },
  {
    name: "UGREEN Cat 6 Braided Ethernet Cable 1m",
    wishlist: "General",
    category: "Technology",
    brand: "UGREEN",
    price: 4.20,
    quantity: 3,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/71Sg0qkGY2L._AC_SL1500_.jpg",
    link: "https://www.amazon.co.uk/gp/aw/d/B086H8KM61",
    description: "One-metre braided Cat 6 Ethernet cable for a PC, games console, television, router or network switch.",
    notes: ""
  },
  {
    name: "Corsair RM850e 850W Fully Modular Power Supply",
    wishlist: "General",
    category: "Technology",
    brand: "Corsair",
    price: 127.99,
    quantity: 1,
    priority: "High",
    purchased: false,
    store: "Currys",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/71UlVM3qc5L._AC_SL1500_.jpg",
    link: "https://www.currys.co.uk/products/corsair-lownoise-rm850e-modular-atx-psu-850-w-10275775.html?searchTerm=Corsair%20RM850e",
    description: "850W fully modular, low-noise ATX power supply for upgrading a gaming PC.",
    notes: "Need to be bought with or at the same time as Graphics Card"
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
  },
    {
    name: "UGREEN 5 Port Gigabit Network Switch, Ethernet Splitter Hub",
    wishlist: "General",
    category: "Technology",
    brand: "UGREEN",
    price: 9.99,
    quantity: 1,
    priority: "High",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/71LDan+M0QL._AC_SL1500_.jpg",
    link: "https://www.amazon.co.uk/UGREEN-Ethernet-Splitter-High-speed-Wall-Mounting/dp/B0D9GRJ1H8/ref=sr_1_5?crid=7MLSCJHBJ02I&dib=eyJ2IjoiMSJ9.Vsjl1l-Y30xIGqbEOqQUIVQhzgLx6ccr6_xaz875Hko.HIipWd9FqaBmQSI_cO628s7Zd1eupoRkEiUZEs97WIw&dib_tag=se&keywords=ugreen%2B5%2Bmegabit%2Bport&qid=1785064196&sprefix=ugreen%2B5%2Bmegabit%2Bport%2Caps%2C230&sr=8-5&th=1",
    description: "",
    notes: "Needs Ethernet's and WiFi Extender"
  },
      {
    name: "Trust Yuri 2.1 Speaker Set with Wooden Subwoofer",
    wishlist: "General",
    category: "Technology",
    brand: "Trust",
    price: 49.99,
    quantity: 1,
    priority: "High",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/71zXBFY6t+L._AC_SL1500_.jpg",
    link: "https://www.amazon.co.uk/Trust-Subwoofer-Speakers-Headphones-Connections/dp/B08FR5T7N5/ref=sr_1_1?crid=1OSM4GGKRHRFN&dib=eyJ2IjoiMSJ9.GFwRTtvj3Sp1luGwzU8p2KcQS5-gL2H2H8_r-iyGa-RpR9ioD1HY-sBFQ0-vi1SEUXq5YFDeaCckJIx_iJxWsA.mQWZycz9yEK9HmnDPVtEWqEuzAIS1VnHsZ8I0VTs7QQ&dib_tag=se&keywords=Trust+Yuri+2.1&qid=1785064387&sprefix=trust+yuri+2.1%2Caps%2C193&sr=8-1&ufe=app_do%3Aamzn1.fos.95fd378e-6299-4723-b1f1-3952ffba15af",
    description: "PC Speakers with Subwoofer",
    notes: ""
  },
        {
    name: "UGREEN Extension Lead 1.5M, 6 Way Power Strip with 3 USB-A & 1 USB-C",
    wishlist: "General",
    category: "Technology",
    brand: "UGREEN",
    price: 16.99,
    quantity: 2,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/617DdqPuTzL._AC_SL1500_.jpg",
    link: "https://www.amazon.co.uk/UGREEN-Extension-Cord-Socket-Black/dp/B0FKBH9HWN/ref=sr_1_6?crid=2SG3FU26L107G&dib=eyJ2IjoiMSJ9.2WPnN9YpVOwHl2zF0jvfXANm8AKkirvSB9ElxK2wqD12Di6q1v0OxHQibH8qO70Y8CJWGtOLfe_csCYwI08aAxQnV79OMUKQZf_qdv94sT9nXsPD1l2LmGmR9Zr2-bOLmNjm4igsDUwsw-96-YoYx-XFfFLoPgam0OzeU54PStaShnF9fbW4vKEftIjgEoOPQSfTQx3SKcYmtKI-y3CGJ6mOvCyb3TLYAdyLLMnVFSRBg9AD0DTWOR0qGJIT6r7hm0M-WJ4FpcDyq4wtA_mNOwrGiM-lkHZ9e-G-BDk5fZM.r1AcsXB68oqkIlQzn9SddcnKbPeMJlopOgqftxGLXjs&dib_tag=se&keywords=ugreen+extension+lead&qid=1785064637&sprefix=ugreen+ex%2Caps%2C222&sr=8-6",
    description: "UGREEN Extension Lead with Ports",
    notes: ""
  },
          {
    name: "UGREEN Extension Lead 1.5M, 6 Way Power Strip with 3 USB-A & 1 USB-C",
    wishlist: "General",
    category: "Technology",
    brand: "UGREEN",
    price: 16.99,
    quantity: 2,
    priority: "Medium",
    purchased: false,
    store: "Amazon",
    dateAdded: "2026-07-26",
    image: "https://m.media-amazon.com/images/I/71zXBFY6t+L._AC_SL1500_.jpg",
    link: "https://www.amazon.co.uk/UGREEN-Extension-Cord-Socket-Black/dp/B0FKBH9HWN/ref=sr_1_6?crid=2SG3FU26L107G&dib=eyJ2IjoiMSJ9.2WPnN9YpVOwHl2zF0jvfXANm8AKkirvSB9ElxK2wqD12Di6q1v0OxHQibH8qO70Y8CJWGtOLfe_csCYwI08aAxQnV79OMUKQZf_qdv94sT9nXsPD1l2LmGmR9Zr2-bOLmNjm4igsDUwsw-96-YoYx-XFfFLoPgam0OzeU54PStaShnF9fbW4vKEftIjgEoOPQSfTQx3SKcYmtKI-y3CGJ6mOvCyb3TLYAdyLLMnVFSRBg9AD0DTWOR0qGJIT6r7hm0M-WJ4FpcDyq4wtA_mNOwrGiM-lkHZ9e-G-BDk5fZM.r1AcsXB68oqkIlQzn9SddcnKbPeMJlopOgqftxGLXjs&dib_tag=se&keywords=ugreen+extension+lead&qid=1785064637&sprefix=ugreen+ex%2Caps%2C222&sr=8-6",
    description: "UGREEN Extension Lead with Ports",
    notes: ""
  },
  
];
