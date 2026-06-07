import { FoodItem } from '../types';

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  // --- INDIAN FOODS ---
  {
    id: 'ind-1',
    name: 'Paneer Butter Masala',
    category: 'Indian Foods',
    description: 'Cubes of cottage cheese cooked in a rich, creamy, and mildly sweet tomato-gravel with aromatic spices.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    availabilityStatus: 'Available',
    preparationTime: '15 mins'
  },
  {
    id: 'ind-2',
    name: 'Palak Paneer',
    category: 'Indian Foods',
    description: 'Fresh spinach greens pureed and simmered with soft paneer cubes, garlic, and traditional spices.',
    price: 260,
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    availabilityStatus: 'Available',
    preparationTime: '15 mins'
  },
  {
    id: 'ind-3',
    name: 'Dal Tadka',
    category: 'Indian Foods',
    description: 'Yellow lentils cooked to perfection, tempered with ghee, dry red chilies, garlic, and cumin.',
    price: 190,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400',
    rating: 4.4,
    availabilityStatus: 'Available',
    preparationTime: '10 mins'
  },
  {
    id: 'ind-4',
    name: 'Dal Makhani',
    category: 'Indian Foods',
    description: 'Slow-cooked black lentils and kidney beans enriched with pure butter, cream, and ginger-garlic paste.',
    price: 230,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    availabilityStatus: 'Available',
    preparationTime: '20 mins'
  },
  {
    id: 'ind-5',
    name: 'Butter Chicken',
    category: 'Indian Foods',
    description: 'Tender tandoori chicken pieces simmered in a luscious, velvety smooth buttery tomato cream sauce.',
    price: 360,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    availabilityStatus: 'Available',
    preparationTime: '20 mins'
  },
  {
    id: 'ind-6',
    name: 'Chicken Biryani',
    category: 'Indian Foods',
    description: 'Slow-cooked aromatic basmati rice layered with juicy pieces of chicken, fried onions, mint, and saffron flavor.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    availabilityStatus: 'Available',
    preparationTime: '25 mins'
  },
  {
    id: 'ind-7',
    name: 'Veg Biryani',
    category: 'Indian Foods',
    description: 'Basmati rice cooked slow style (dum) with mixed seasonal vegetables, caramelized onions, and house spices.',
    price: 240,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    availabilityStatus: 'Available',
    preparationTime: '20 mins'
  },
  {
    id: 'ind-8',
    name: 'Naan / Butter Naan',
    category: 'Indian Foods',
    description: 'Soft and fluffy leavened flatbread freshly baked in tandoor (clay oven), slathered with pure butter.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    availabilityStatus: 'Available',
    preparationTime: '8 mins'
  },
  {
    id: 'ind-9',
    name: 'Tandoori Roti',
    category: 'Indian Foods',
    description: 'Whole wheat flatbread prepared in clay oven. Crispy and wholesome.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400',
    rating: 4.3,
    availabilityStatus: 'Available',
    preparationTime: '5 mins'
  },
  {
    id: 'ind-10',
    name: 'Masala Dosa',
    category: 'Indian Foods',
    description: 'Thin and crispy fermented rice-lentil crepe stuffed with spiced mashed potatoes, served with sambar and chutneys.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    availabilityStatus: 'Available',
    preparationTime: '10 mins'
  },
  {
    id: 'ind-11',
    name: 'Idli / Vada Combo',
    category: 'Indian Foods',
    description: 'Two pieces of steamed pillowy soft rice cakes paired with a crispy, savory lentil fritter.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    availabilityStatus: 'Available',
    preparationTime: '5 mins'
  },

  // --- INDIAN STREET FOODS ---
  {
    id: 'str-1',
    name: 'Pani Puri',
    category: 'Indian Street Foods',
    description: 'Crispy hollow puris filled with spicy potatoes and submersed in flavored tangy mint and sweet tamarind waters.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    availabilityStatus: 'Available',
    preparationTime: '5 mins'
  },
  {
    id: 'str-2',
    name: 'Pav Bhaji',
    category: 'Indian Street Foods',
    description: 'Thick, spicy mixed vegetable mash simmered on a flat top, served piping hot with buttered soft bread buns.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    availabilityStatus: 'Available',
    preparationTime: '10 mins'
  },
  {
    id: 'str-3',
    name: 'Vada Pav',
    category: 'Indian Street Foods',
    description: 'The iconic Mumbai slider: spiced fried potato dumpling nested inside a soft bun slathered with garlic chutney.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    availabilityStatus: 'Available',
    preparationTime: '5 mins'
  },
  {
    id: 'str-4',
    name: 'Samosa / Kachori',
    category: 'Indian Street Foods',
    description: 'Crispy, flaky snack pastries stuffed with seasoned spiced potato-green pea filling or lentils.',
    price: 50,
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    availabilityStatus: 'Available',
    preparationTime: '5 mins'
  },

  // --- ITALIAN FOODS ---
  {
    id: 'ita-1',
    name: 'Margherita Pizza',
    category: 'Italian Foods',
    description: 'Simple and elegant artisan thin crust topped with classic tomato sauce, fresh buffalo mozzarella, and basil.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    availabilityStatus: 'Available',
    preparationTime: '15 mins'
  },
  {
    id: 'ita-2',
    name: 'White Sauce Pasta',
    category: 'Italian Foods',
    description: 'Penne pasta tossed in a velvety smooth cheesy Alfredo white sauce, sautéed mushrooms, and bell peppers.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    availabilityStatus: 'Available',
    preparationTime: '12 mins'
  },
  {
    id: 'ita-3',
    name: 'Red Sauce Pasta',
    category: 'Italian Foods',
    description: 'Penne pasta cooked in classic herb-infused tangy Italian tomato marinara sauce with olives and garlic.',
    price: 270,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400',
    rating: 4.4,
    availabilityStatus: 'Available',
    preparationTime: '12 mins'
  },

  // --- SPANISH FOODS ---
  {
    id: 'spa-1',
    name: 'Paella de Verduras',
    category: 'Spanish Foods',
    description: 'Traditional saffron-infused Spanish rice platter slow-cooked on wide pans with peppers, beans, and fresh herbs.',
    price: 380,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    availabilityStatus: 'Available',
    preparationTime: '22 mins'
  },
  {
    id: 'spa-2',
    name: 'Patatas Bravas',
    category: 'Spanish Foods',
    description: 'Crispy cubed fried potatoes tossed in spicy Spanish bravas warm tomato sauce and garlicky aioli drizzle.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
    rating: 4.3,
    availabilityStatus: 'Available',
    preparationTime: '10 mins'
  },

  // --- ARABIAN FOODS ---
  {
    id: 'ara-1',
    name: 'Chicken Shawarma',
    category: 'Arabian Foods',
    description: 'Juicy, dynamic spit-roasted chicken wrapped inside fluffy pita bread with pickled cucumbers and rich toum garlic paste.',
    price: 160,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    availabilityStatus: 'Available',
    preparationTime: '10 mins'
  },
  {
    id: 'ara-2',
    name: 'Kabsa Rice',
    category: 'Arabian Foods',
    description: 'Fragrant premium long-grain rice served with marinated roasted meat, toasted almonds, raisins, and Arabic spices.',
    price: 390,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    availabilityStatus: 'Available',
    preparationTime: '25 mins'
  },

  // --- JAPANESE FOODS ---
  {
    id: 'jap-1',
    name: 'Veg Sushi (Kappa Maki)',
    category: 'Japanese Foods',
    description: 'Traditional seasoned Japanese vinegared rice rolled with crisp cucumber chunks, wrapped tightly in nori seaweed sheets.',
    price: 340,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    availabilityStatus: 'Available',
    preparationTime: '20 mins'
  },
  {
    id: 'jap-2',
    name: 'Shoyu Ramen Bowl',
    category: 'Japanese Foods',
    description: 'Noodles in a savory soy-sauce infused steaming vegetable broth with spring onions, sweet corn, and soft egg halves.',
    price: 390,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    availabilityStatus: 'Available',
    preparationTime: '18 mins'
  },

  // --- CHINESE FOODS ---
  {
    id: 'chi-1',
    name: 'Veg Fried Rice',
    category: 'Chinese Foods',
    description: 'Classic wok-tossed long grain rice combined with finely diced carrots, beans, celery, spring onions, and soy.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=400',
    rating: 4.4,
    availabilityStatus: 'Available',
    preparationTime: '12 mins'
  },
  {
    id: 'chi-2',
    name: 'Schezwan Noodles',
    category: 'Chinese Foods',
    description: 'Fiery, spicy stir-fried wheat noodles tossed with spicy garlic-chili Schezwan paste and fresh crunchy vegetables.',
    price: 210,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    availabilityStatus: 'Available',
    preparationTime: '12 mins'
  },
  {
    id: 'chi-3',
    name: 'Veg Manchurian Gravy',
    category: 'Chinese Foods',
    description: 'Delectable golden-fried cabbage-carrot round balls submerged in tangy, savory ginger-garlic soy gravy.',
    price: 220,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    availabilityStatus: 'Available',
    preparationTime: '15 mins'
  },

  // --- DESSERTS ---
  {
    id: 'des-1',
    name: 'Gulab Jamun (2 pcs)',
    category: 'Desserts',
    description: 'Golden, fluffy fried dough balls milk solids soaked in cardamom and saffron-infused warm sugary syrup.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    availabilityStatus: 'Available',
    preparationTime: '5 mins'
  },
  {
    id: 'des-2',
    name: 'Rasmalai (2 pcs)',
    category: 'Desserts',
    description: 'Flattened cottage cheese patties soaked heavily in sweet cream, cardamom, and topped with shredded pistachios.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    availabilityStatus: 'Available',
    preparationTime: '5 mins'
  },
  {
    id: 'des-3',
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    description: 'Indulgent baked chocolate mini cake filled with hot, luscious liquid chocolate center that oozes out upon touch.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    availabilityStatus: 'Available',
    preparationTime: '10 mins'
  },

  // --- ICE CREAMS ---
  {
    id: 'ice-1',
    name: 'Butterscotch Regular Scoop',
    category: 'Ice Creams',
    description: 'Premium rich and creamy vanilla-butterscotch ice cream infused throughout with buttery cashew crunch bites.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    availabilityStatus: 'Available',
    preparationTime: '3 mins'
  },
  {
    id: 'ice-2',
    name: 'Mango Premium Scoop',
    category: 'Ice Creams',
    description: 'Velvety sweet ice cream churned with the pulp of authentic Alphonso mangoes.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    availabilityStatus: 'Available',
    preparationTime: '3 mins'
  },

  // --- JUICES ---
  {
    id: 'jui-1',
    name: 'Watermelon Cold-Pressed Juice',
    category: 'Juices',
    description: 'Thirst-quenching, fresh, cold-pressed watermelon extract with zero sugar or added preservatives.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    availabilityStatus: 'Available',
    preparationTime: '5 mins'
  },
  {
    id: 'jui-2',
    name: 'Fresh Mint Lemonade',
    category: 'Juices',
    description: 'Crisp hand-squeezed lemon juice blended with refreshing fresh garden mint leaves and a hint of rock salt.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    availabilityStatus: 'Available',
    preparationTime: '5 mins'
  }
];
