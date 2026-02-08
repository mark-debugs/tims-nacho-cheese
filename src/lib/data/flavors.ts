import whiteCheeseImg from '$lib/assets/images/flavors/white-cheese.png';
import orangeSpiceImg from '$lib/assets/images/flavors/orange-spice.png';
import mozzPureImg from '$lib/assets/images/flavors/mozz-pure.png';
import cheddarBeddarImg from '$lib/assets/images/flavors/cheddar-beddar.png';
import megaSpiceImg from '$lib/assets/images/flavors/mega-spice.png';

export type Flavor = {
	id: string;
	name: string;
	tagline: string;
	description: string;
	heatLevel: number; // 0-5
	color: string; // Tailwind color prefix
	emoji: string;
	badge: string;
	isStar: boolean;
	image?: string;
};

export const flavors: Flavor[] = [
	{
		id: 'white-cheese',
		name: 'White Cheese Sauce',
		tagline: 'Classic Mild',
		description:
			'The OG, the classic, the one that started it all. Smooth, creamy white cheddar with just enough tang to keep things interesting. Perfect for purists who like their nachos straightforward and delicious — no frills, no fuss, just pure cheesy goodness.',
		heatLevel: 0,
		color: 'white-cheese',
		emoji: '🤍',
		badge: 'Classic Mild',
		isStar: false,
		image: whiteCheeseImg
	},
	{
		id: 'orange-spice',
		name: 'Orange Cheese with Spice',
		tagline: 'Signature Blend',
		description:
			'The one Tim made famous. That iconic nacho cheese orange with a secret blend of spices that adds just the right kick. Not too hot, not too mild — it\'s the Goldilocks of cheese sauces. One taste and you\'ll know why this is the signature.',
		heatLevel: 2,
		color: 'nacho',
		emoji: '🧡',
		badge: 'Signature Blend',
		isStar: false,
		image: orangeSpiceImg
	},
	{
		id: 'mozz-pure',
		name: 'Mozz Pure',
		tagline: 'Smooth Operator',
		description:
			'Silky, stretchy mozzarella that melts like a dream. Think pizza vibes meeting nacho perfection. It\'s mild, it\'s smooth, it\'s the cool kid that gets along with everyone. Add it to any flavor for extra stretchiness or enjoy it solo for that pure mozz magic.',
		heatLevel: 0,
		color: 'mozz',
		emoji: '💙',
		badge: 'Smooth Operator',
		isStar: false,
		image: mozzPureImg
	},
	{
		id: 'cheddar-beddar',
		name: 'Cheddar is Beddar',
		tagline: 'Bold & Sharp',
		description:
			'Sharp white cheddar with attitude. This isn\'t your average grocery store cheese — it\'s aged, bold, and ready to make a statement. A little tangy, a little funky, and completely unapologetic. For those who know that when it comes to cheddar, sharp is always beddar.',
		heatLevel: 1,
		color: 'cheddar',
		emoji: '🧀',
		badge: 'Bold & Sharp',
		isStar: false,
		image: cheddarBeddarImg
	},
	{
		id: 'mega-spice',
		name: 'MEGA SPICE Face Melter',
		tagline: 'Maximum Heat',
		description:
			'Not for the faint of heart. This is the one that separates the rookies from the legends. Loaded with Carolina Reaper, ghost pepper, and enough heat to make your taste buds question their life choices. One bite and you\'ll understand why Tim calls it the Face Melter. You\'ve been warned.',
		heatLevel: 5,
		color: 'spice',
		emoji: '🔥',
		badge: 'Maximum Heat',
		isStar: true,
		image: megaSpiceImg
	}
];
