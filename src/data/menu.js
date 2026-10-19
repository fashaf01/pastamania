// Menu price observations per branch, LKR, from public Uber Eats listings (18 Oct 2026).
// These are delivery-platform prices; replace with the official dine-in menu when supplied.
// Alfred House is a partial menu – nothing from other branches has been copied into it.
//
// Photos live in public/images/menu. Havelock and One Galle Face use their own photo sets
// (Havelock: branded white plates; OGF: grey bowls, files with a hash suffix).
// Items without a photo show their category icon instead.

const item = (category, name, price, photo = null) => ({
  category,
  name,
  price,
  image: photo && `/images/menu/${photo}`,
})

export const menus = {
  havelock: [
    item('Appetizers', 'Potato Wedges', 890, 'potato-wedges.jpg'),
    item('Appetizers', 'Cheese Sticks', 1590, 'cheese-sticks.jpg'),
    item('Appetizers', 'Creamy Mushroom Soup with Garlic Bread', 1590, 'creamy-mushroom-soup-with-garlic-bread.jpg'),
    item('Appetizers', 'Garlic Bread', 490, 'garlic-bread.jpg'),
    item('Appetizers', 'Honey Garlic Chicken', 1590, 'honey-garlic-chicken.jpg'),
    item('Cream Pasta', 'Carbonara Pasta', 2290, 'carbonara-pasta.jpg'),
    item('Cream Pasta', 'Creamy Chicken Pasta', 1890, 'creamy-chicken-pasta.jpg'),
    item('Cream Pasta', 'Seafood Tom Yum Pasta', 2890, 'seafood-tom-yum-pasta.jpg'),
    item('Cream Pasta', 'Beef Stroganoff Pasta', 2590, 'beef-stroganoff-pasta.jpg'),
    item('Tomato Pasta', 'Beef Bolognese Pasta', 2290, 'beef-bolognese-pasta.jpg'),
    item('Tomato Pasta', 'Chicken Bolognese Pasta', 2190, 'chicken-bolognese-pasta.jpg'),
    item('Tomato Pasta', 'Spicy Chicken Pasta', 2090, 'spicy-chicken-pasta.jpg'),
    item('Tomato Pasta', 'Arrabiata with Chicken Rasher Pasta', 2090, 'arrabiata-with-chicken-rasher-pasta.jpg'),
    item('Tomato Pasta', 'Marinara Tomato Sauce Pasta', 2290, 'marinara-tomato-sauce-pasta.jpg'),
    item('Aglio Pasta', 'Basil Chicken Aglio Pasta', 1090, 'basil-chicken-aglio-pasta.jpg'),
    item('Aglio Pasta', 'Prawn Aglio Pasta', 2290, 'prawn-aglio-pasta.jpg'),
    item('Pasta Favourites', 'Jaffna Calamari Pasta', 1990, 'jaffna-calamari-pasta.jpg'),
    item('Pasta Favourites', 'Chilli Crab Pasta', 3190, 'chilli-crab-pasta.jpg'),
    item('Pasta Favourites', 'Chicken Aurora Pasta', 1790, 'chicken-aurora-pasta.jpg'),
    item('Pasta Favourites', 'Kochi Creamy Chicken Pasta', 1890, 'kochi-creamy-chicken-pasta.jpg'),
    item('Vegetarian Pasta', 'Aglio Olio Pasta', 790, 'aglio-olio-pasta.jpg'),
    item('Vegetarian Pasta', 'Pomodoro Pasta', 1190, 'pomodoro-pasta.jpg'),
    item('Pizza', 'Hot Basil Chicken Pizza', 1590, 'hot-basil-chicken-pizza.jpg'),
    item('Pizza', 'Pepperoni Pizza', 2090, 'pepperoni-pizza.jpg'),
    item('Pizza', 'Margherita Pizza', 1490, 'margherita-pizza.jpg'),
    item('Pizza', 'Tuscan Chicken Pizza', 1990, 'tuscan-chicken-pizza.jpg'),
    item('Pizza', 'Hot Basil Chicken Pizza 10 inch', 2990, 'hot-basil-chicken-pizza.jpg'),
    item('Baked Rice', 'Tom Yum Baked Rice with Prawn', 2190, 'tom-yum-baked-rice-with-prawn.jpg'),
    item('Baked Rice', 'Stroganoff Baked Rice with Chicken', 2190),
    item('Meal Sets', 'Soup Set – Creamy Mushroom Soup with Garlic Bread', 1890, 'soup-set-creamy-mushroom-soup-with-garlic-bread.jpg'),
    item('Beverages', 'Passion Fruit Italian Soda', 1390, 'passion-fruit-italian-soda.jpg'),
    item('Beverages', 'Peach Italian Soda', 1390, 'peach-italian-soda.jpg'),
    item('Beverages', 'Strawberry Italian Soda', 1390, 'strawberry-italian-soda.jpg'),
    item('Beverages', 'Pepsi', 165, 'pepsi.jpg'),
    item('Beverages', '7 Up', 165, '7-up.jpg'),
    item('Beverages', 'Water Bottle', 66, 'water-bottle.jpg'),
  ],
  ogf: [
    item('Appetizers', 'Chicken Bites', 1390, 'chicken-bites.jpg'),
    item('Appetizers', 'Paprika Wings', 1590, 'paprika-wings.jpg'),
    item('Appetizers', 'Cheesy Garlic Bread', 790, 'cheesy-garlic-bread.jpg'),
    item('Appetizers', 'Honey Garlic Chicken', 1590, 'honey-garlic-chicken-bf07a167.jpg'),
    item('Appetizers', 'Garlic Bread', 490, 'garlic-bread-0cd602b6.jpg'),
    item('Appetizers', 'Creamy Mushroom Soup with Garlic Bread', 1590, 'creamy-mushroom-soup-with-garlic-bread-745ae891.jpg'),
    item('Salads', 'Caesar Salad', 1490, 'caesar-salad.jpg'),
    item('Salads', 'Chicken Caesar Salad', 2190, 'chicken-caesar-salad.jpg'),
    item('Salads', 'Five Bean Salad', 1490),
    item('Pasta Favourites', 'Jaffna Calamari', 1990, 'jaffna-calamari.jpg'),
    item('Pasta Favourites', 'Kochi Cream & Chicken Pasta', 1890, 'kochi-cream-chicken-pasta.jpg'),
    item('Cream Pasta', 'Alfredo Pasta', 2190, 'alfredo-pasta.jpg'),
    item('Cream Pasta', 'Carbonara Pasta', 2290, 'carbonara-pasta-0308d344.jpg'),
    item('Cream Pasta', 'Chicken Rasher Cheesy Crumble Pasta', 2290, 'chicken-rasher-cheesy-crumble-pasta.jpg'),
    item('Cream Pasta', 'Creamy Chicken Pasta', 1890, 'creamy-chicken-pasta-dd640915.jpg'),
    item('Cream Pasta', 'Seafood Tom Yum Pasta', 2890, 'seafood-tom-yum-pasta-ca82d989.jpg'),
    item('Cream Pasta', 'Chicken Sausage Pasta', 1990, 'chicken-sausage-pasta.jpg'),
    item('Aglio Pasta', 'Basil Chicken Aglio Pasta', 1090, 'basil-chicken-aglio-pasta-d343ad49.jpg'),
    item('Aglio Pasta', 'Prawn Aglio Pasta', 2290, 'prawn-aglio-pasta-b2716adc.jpg'),
    item('Tomato Pasta', 'Beef Bolognese Pasta', 2290, 'beef-bolognese-pasta-2a4f0588.jpg'),
    item('Tomato Pasta', 'Chicken Bolognese Pasta', 2190, 'chicken-bolognese-pasta-14f808fc.jpg'),
    item('Tomato Pasta', 'Marinara Pasta', 2290, 'marinara-tomato-sauce-pasta.jpg'),
    item('Tomato Pasta', 'Spicy Chicken Pasta', 2090, 'spicy-chicken-pasta-f02a9473.jpg'),
    item('Tomato Pasta', 'Arrabiata with Chicken Rasher', 2090, 'arrabiata-with-chicken-rasher.jpg'),
    item('Vegetarian Pasta', 'Aglio Olio Pasta', 790, 'aglio-olio-pasta-2f871bbf.jpg'),
    item('Vegetarian Pasta', 'Al Funghi Pasta', 1490, 'al-funghi-pasta.jpg'),
    item('Vegetarian Pasta', 'Pomodoro Pasta', 1190, 'pomodoro-pasta-175f23b1.jpg'),
    item('Pizza', 'Margherita Pizza', 1490, 'margherita-pizza-a5b2322d.jpg'),
    item('Pizza', 'Corned Chicken Slice and Mushroom Pizza', 1990, 'corned-chicken-slice-and-mushroom-pizza.jpg'),
    item('Pizza', 'Hot Basil Chicken Pizza', 1590, 'hot-basil-chicken-pizza-5b689951.jpg'),
    item('Pizza', 'Meat Lover Pizza', 2190, 'meat-lover-pizza.jpg'),
    item('Pizza', 'Pepperoni Pizza', 2090, 'pepperoni-pizza-71f0dc9f.jpg'),
    item('Pizza', 'Quattro Formaggi Pizza', 1790, 'quattro-formaggi-pizza.jpg'),
    item('Pizza', 'Tuscan Chicken Pizza', 1990, 'tuscan-chicken-pizza-95dc42db.jpg'),
    item('Beverages', 'Italian Sodas (Strawberry / Passion Fruit / Peach)', 1290, 'italian-sodas.jpg'),
    item('Beverages', 'Passion Berry Tea Carafe', 1490),
    item('Beverages', 'Passion Peach Tea Carafe', 1490),
    item('Beverages', 'Strawberry and Rosehip Carafe', 1790),
    item('Beverages', 'Pepsi', 590, 'pepsi.jpg'),
    item('Beverages', '7up', 590, '7-up.jpg'),
    item('Beverages', 'Mountain Dew', 590),
  ],
  alfred: [
    item('Pasta Favourites', 'Creamy Chicken Pasta', 1890, 'creamy-chicken-pasta.jpg'),
    item('Pasta Favourites', 'Prawn Aglio Pasta', 2290, 'prawn-aglio-pasta.jpg'),
    item('Pasta Favourites', 'Carbonara Pasta', 2290, 'carbonara-pasta.jpg'),
    item('Pasta Favourites', 'Beef Bolognese Pasta', 2290, 'beef-bolognese-pasta.jpg'),
    item('Appetizers', 'Cheesy Garlic Bread', 790, 'cheesy-garlic-bread.jpg'),
    item('Appetizers', 'Chicken Bites', 1390, 'chicken-bites.jpg'),
    item('Appetizers', 'Paprika Wings', 1590, 'paprika-wings.jpg'),
    item('Appetizers', 'Honey Garlic Chicken', 1590, 'honey-garlic-chicken.jpg'),
  ],
}

// Display order and a fallback icon per category for items without a photo.
export const categories = [
  { name: 'Pasta Favourites', icon: '⭐' },
  { name: 'Cream Pasta', icon: '🍝' },
  { name: 'Tomato Pasta', icon: '🍅' },
  { name: 'Aglio Pasta', icon: '🧄' },
  { name: 'Vegetarian Pasta', icon: '🌿' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Baked Rice', icon: '🍚' },
  { name: 'Appetizers', icon: '🥖' },
  { name: 'Salads', icon: '🥗' },
  { name: 'Meal Sets', icon: '🍽️' },
  { name: 'Beverages', icon: '🥤' },
]

export const categoryIcon = (name) => categories.find((c) => c.name === name)?.icon ?? '🍴'

// 'Hot Basil Chicken Pizza 10 inch' -> 'hot-basil-chicken-pizza-10-inch'
export const dishSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// A dish by slug, preferring the given branch's menu, else the first branch that serves it.
export const findDish = (slug, branchId) => {
  const order = [branchId, ...Object.keys(menus).filter((id) => id !== branchId)].filter((id) => menus[id])
  for (const id of order) {
    const item = menus[id].find((i) => dishSlug(i.name) === slug)
    if (item) return { item, branchId: id }
  }
  return null
}

// Branches whose menu lists a dish of this name.
export const branchesServing = (name) => Object.keys(menus).filter((id) => menus[id].some((i) => i.name === name))

// The Sri Lankan fusion dishes the brand leads with.
export const isLocalFavourite = (name) => /jaffna|kochi/i.test(name)
