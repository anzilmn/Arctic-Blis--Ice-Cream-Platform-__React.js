const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Flavor = require('../models/Flavor');
const { protect, adminOnly } = require('../middleware/auth');

// Seed data
const seedFlavors = [
  { name: "Chocolate Lava", category: "Chocolate", price: 4.50, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400", description: "Rich, decadent chocolate ice cream with a molten chocolate core.", ingredients: ["Cocoa","Milk","Dark Chocolate","Vanilla Bean"], slug: "chocolate-lava" },
  { name: "Dark Fudge Brownie", category: "Chocolate", price: 4.75, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=400", description: "Intense dark chocolate loaded with chewy brownie chunks.", ingredients: ["Dark Cocoa","Brownie Bites","Cream","Sugar"], slug: "dark-fudge-brownie" },
  { name: "White Mocha Bliss", category: "Chocolate", price: 4.75, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400", description: "Creamy white chocolate blended with bold espresso swirls.", ingredients: ["White Chocolate","Espresso","Cream","Vanilla"], slug: "white-mocha-bliss" },
  { name: "Hazelnut Truffle", category: "Chocolate", price: 5.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400", description: "Smooth hazelnut cream base with roasted hazelnut pieces.", ingredients: ["Hazelnuts","Cocoa","Cream","Milk"], slug: "hazelnut-truffle" },
  { name: "Mango Magic", category: "Fruit", price: 4.00, image: "https://images.unsplash.com/photo-1505394033343-e3015a1a7051?auto=format&fit=crop&q=80&w=400", description: "Alphonso mango pulp mixed into a creamy base. Pure sunshine.", ingredients: ["Mango Pulp","Cream","Sugar"], slug: "mango-magic" },
  { name: "Blueberry Blast", category: "Fruit", price: 4.25, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=400", description: "Sweet blueberries blended with tangy Greek yogurt.", ingredients: ["Blueberries","Yogurt","Honey"], slug: "blueberry-blast" },
  { name: "Strawberry Field", category: "Fruit", price: 4.00, image: "https://images.unsplash.com/photo-1517093688865-2849e0e3713f?auto=format&fit=crop&q=80&w=400", description: "Classic creamy strawberry with real strawberry chunks.", ingredients: ["Strawberries","Cream","Sugar"], slug: "strawberry-field" },
  { name: "Raspberry Sorbet", category: "Fruit", price: 3.75, image: "https://images.unsplash.com/photo-1594971034440-e4b971a5c6ec?auto=format&fit=crop&q=80&w=400", description: "Dairy-free, refreshing raspberry sorbet.", ingredients: ["Raspberries","Water","Sugar"], slug: "raspberry-sorbet" },
  { name: "Coconut Paradise", category: "Fruit", price: 4.25, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400", description: "Toasted coconut flakes in a creamy coconut milk base.", ingredients: ["Coconut Milk","Toasted Coconut","Sugar"], slug: "coconut-paradise" },
  { name: "Pistachio Dream", category: "Special", price: 5.00, image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400", description: "Rich pistachio ice cream with crunchy roasted pistachios.", ingredients: ["Pistachios","Cream","Sugar","Milk"], slug: "pistachio-dream" },
  { name: "Sea Salt Caramel", category: "Special", price: 4.75, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a14795?auto=format&fit=crop&q=80&w=400", description: "Creamy caramel with a hint of Himalayan sea salt.", ingredients: ["Caramel","Sea Salt","Cream","Butter"], slug: "sea-salt-caramel" },
  { name: "Mint Cookie Chip", category: "Special", price: 4.50, image: "https://images.unsplash.com/photo-1599824647391-766b44a42371?auto=format&fit=crop&q=80&w=400", description: "Refreshing mint ice cream with chocolate cookie crunch.", ingredients: ["Mint Extract","Cream","Chocolate Cookies"], slug: "mint-cookie-chip" },
  { name: "Birthday Cake Bash", category: "Special", price: 4.75, image: "https://images.unsplash.com/photo-1586985289688-ca3cf47432e5?auto=format&fit=crop&q=80&w=400", description: "Cake batter ice cream with rainbow sprinkles.", ingredients: ["Cake Batter","Cream","Sprinkles","Vanilla"], slug: "birthday-cake-bash" },
  { name: "Matcha Green Tea", category: "Special", price: 5.00, image: "https://images.unsplash.com/photo-1579899321045-813c9e6573c5?auto=format&fit=crop&q=80&w=400", description: "Premium Japanese matcha green tea flavor.", ingredients: ["Matcha Powder","Cream","Sugar"], slug: "matcha-green-tea" },
  { name: "Cookie Dough Crave", category: "Special", price: 4.50, image: "https://images.unsplash.com/photo-1590059533722-e25f82fe654e?auto=format&fit=crop&q=80&w=400", description: "Vanilla base with loads of chocolate chip cookie dough chunks.", ingredients: ["Vanilla","Cookie Dough","Chocolate Chips"], slug: "cookie-dough-crave" },
  { name: "Red Velvet", category: "Special", price: 4.75, image: "https://images.unsplash.com/photo-1619468129364-706509f6e594?auto=format&fit=crop&q=80&w=400", description: "Red velvet cake crumbles in a cream cheese icing base.", ingredients: ["Cocoa","Cream Cheese","Cream","Red Food Color"], slug: "red-velvet" },
  { name: "Bubblegum Pop", category: "Special", price: 4.25, image: "https://images.unsplash.com/photo-1621250266016-160a221f422b?auto=format&fit=crop&q=80&w=400", description: "Sweet bubblegum flavor with popping candy.", ingredients: ["Bubblegum Flavor","Cream","Popping Candy"], slug: "bubblegum-pop" },
  { name: "Classic Vanilla Bean", category: "Special", price: 4.00, image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&q=80&w=400", description: "Rich, creamy vanilla made with real Madagascar vanilla beans.", ingredients: ["Vanilla Beans","Cream","Sugar"], slug: "classic-vanilla-bean" },
  { name: "Kona Coffee Fudge", category: "Special", price: 4.75, image: "https://images.unsplash.com/photo-1594967399710-1869f06a9284?auto=format&fit=crop&q=80&w=400", description: "Strong Kona coffee with thick chocolate fudge swirls.", ingredients: ["Coffee","Fudge","Cream","Milk"], slug: "kona-coffee-fudge" },
  { name: "Rocky Road Trip", category: "Special", price: 4.75, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400", description: "Chocolate, marshmallows, and nuts. A classic combination.", ingredients: ["Chocolate","Marshmallows","Almonds"], slug: "rocky-road-trip" },
  { name: "Lavender Honey", category: "Special", price: 5.00, image: "https://images.unsplash.com/photo-1599824647391-766b44a42371?auto=format&fit=crop&q=80&w=400", description: "Floral lavender base sweetened with local honey.", ingredients: ["Lavender","Honey","Cream"], slug: "lavender-honey" },
];

// @GET /api/flavors - Get all flavors (with filter)
router.get('/', async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    let query = { isAvailable: true };
    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) query.name = { $regex: search, $options: 'i' };

    const flavors = await Flavor.find(query).sort('-createdAt');
    res.json({ success: true, count: flavors.length, flavors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/flavors/seed - Seed initial flavors (run once)
router.post('/seed', protect, adminOnly, async (req, res) => {
  try {
    await Flavor.deleteMany({});
    const created = await Flavor.insertMany(seedFlavors);
    res.json({ success: true, message: `Seeded ${created.length} flavors` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/flavors/:slug
router.get('/:slug', async (req, res) => {
  try {
    const flavor = await Flavor.findOne({ slug: req.params.slug });
    if (!flavor) return res.status(404).json({ success: false, message: 'Flavor not found' });
    res.json({ success: true, flavor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/flavors - Admin create flavor
router.post('/', protect, adminOnly, [
  body('name').trim().notEmpty(),
  body('category').isIn(['Chocolate', 'Fruit', 'Special']),
  body('price').isFloat({ min: 0 }),
  body('image').isURL(),
  body('description').trim().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const flavor = await Flavor.create(req.body);
    res.status(201).json({ success: true, flavor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/flavors/:id - Admin update
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const flavor = await Flavor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!flavor) return res.status(404).json({ success: false, message: 'Flavor not found' });
    res.json({ success: true, flavor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/flavors/:id - Admin delete (soft-delete)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const flavor = await Flavor.findByIdAndUpdate(req.params.id, { isAvailable: false }, { new: true });
    if (!flavor) return res.status(404).json({ success: false, message: 'Flavor not found' });
    res.json({ success: true, message: 'Flavor deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
