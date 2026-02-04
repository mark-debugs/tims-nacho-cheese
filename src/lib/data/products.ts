export type ProductCategory = 'apparel' | 'skate-decks' | 'stickers' | 'pins' | 'accessories';

export type Product = {
	id: string;
	name: string;
	category: ProductCategory;
	description: string;
	price: number;
	emoji: string;
	gradient: string; // Tailwind gradient classes (from-X to-Y)
	comingSoon: boolean;
};

export const categories: { id: ProductCategory; label: string; emoji: string }[] = [
	{ id: 'apparel', label: 'Apparel', emoji: '👕' },
	{ id: 'skate-decks', label: 'Skate Decks', emoji: '🛹' },
	{ id: 'stickers', label: 'Stickers', emoji: '✨' },
	{ id: 'pins', label: 'Pins', emoji: '📌' },
	{ id: 'accessories', label: 'Accessories', emoji: '🎒' }
];

export const products: Product[] = [
	{
		id: 'classic-tee',
		name: 'Classic Tee',
		category: 'apparel',
		description: '100% organic cotton. Big cheese logo. West coast fit. Available in white, orange, and MEGA SPICE red.',
		price: 28,
		emoji: '👕',
		gradient: 'from-nacho-300 to-nacho-500',
		comingSoon: true
	},
	{
		id: 'pullover-hoodie',
		name: 'Pullover Hoodie',
		category: 'apparel',
		description: 'Super soft fleece. Oversized hood. Perfect for chilly beach nights and early morning skate sessions.',
		price: 58,
		emoji: '🧥',
		gradient: 'from-cheddar-300 to-cheddar-500',
		comingSoon: true
	},
	{
		id: 'skate-deck',
		name: 'Skate Deck',
		category: 'skate-decks',
		description: '8.25" deck. Custom cheese graphic by local artists. Signed by Tim. Limited edition drops.',
		price: 65,
		emoji: '🛹',
		gradient: 'from-spice-300 to-spice-600',
		comingSoon: true
	},
	{
		id: 'sticker-pack',
		name: 'Sticker Pack',
		category: 'stickers',
		description: '10 waterproof stickers. Cheese emojis, brand logos, west coast vibes. Slap \'em everywhere.',
		price: 12,
		emoji: '✨',
		gradient: 'from-blue-300 to-blue-500',
		comingSoon: true
	},
	{
		id: 'dad-hat',
		name: 'Dad Hat',
		category: 'accessories',
		description: 'Unstructured. Adjustable. Embroidered cheese logo. The perfect low-key flex.',
		price: 32,
		emoji: '🧢',
		gradient: 'from-gray-300 to-gray-500',
		comingSoon: true
	},
	{
		id: 'tote-bag',
		name: 'Tote Bag',
		category: 'accessories',
		description: 'Heavy canvas. Big enough for cheese jars, skate gear, beach essentials. Eco-friendly vibes.',
		price: 24,
		emoji: '👜',
		gradient: 'from-cream-100 to-nacho-300',
		comingSoon: true
	},
	{
		id: 'enamel-pin-set',
		name: 'Enamel Pin Set',
		category: 'pins',
		description: '5-pack of cheese-themed pins. Hard enamel, rubber clutch backs. Perfect for jackets, bags, and hats.',
		price: 18,
		emoji: '📌',
		gradient: 'from-nacho-200 to-cheddar-400',
		comingSoon: true
	},
	{
		id: 'cheese-koozie',
		name: 'Cheese Koozie',
		category: 'accessories',
		description: 'Insulated can holder. Keeps your drink cold during beach sessions. Fits standard 12oz cans.',
		price: 8,
		emoji: '🥤',
		gradient: 'from-mozz-200 to-mozz-400',
		comingSoon: true
	}
];
