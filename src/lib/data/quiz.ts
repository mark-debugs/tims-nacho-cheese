export type Answer = {
	text: string;
	scores: Record<string, number>; // flavor id -> score points
};

export type Question = {
	id: number;
	question: string;
	emoji: string;
	answers: Answer[];
};

export type QuizResult = {
	flavorId: string;
	title: string;
	description: string;
	emoji: string;
	vibe: string; // one-liner vibe description
};

// 7 fun personality questions
export const questions: Question[] = [
	{
		id: 1,
		question: "What's your ideal Saturday morning?",
		emoji: '☀️',
		answers: [
			{
				text: 'Dawn patrol surfing',
				scores: { 'mozz-pure': 2, 'white-cheese': 1 }
			},
			{
				text: 'Sleeping in, then brunch',
				scores: { 'white-cheese': 2, 'cheddar-beddar': 1 }
			},
			{
				text: 'Skating the empty park',
				scores: { 'cheddar-beddar': 2, 'orange-spice': 1 }
			},
			{
				text: 'Hot yoga then a habanero smoothie',
				scores: { 'mega-spice': 2, 'orange-spice': 1 }
			}
		]
	},
	{
		id: 2,
		question: 'Pick your road trip soundtrack',
		emoji: '🎵',
		answers: [
			{
				text: 'Chill lo-fi beats',
				scores: { 'white-cheese': 2, 'mozz-pure': 1 }
			},
			{
				text: 'Classic punk rock',
				scores: { 'cheddar-beddar': 2, 'mega-spice': 1 }
			},
			{
				text: 'Reggae and good vibes',
				scores: { 'orange-spice': 2, 'mozz-pure': 1 }
			},
			{
				text: 'Death metal at max volume',
				scores: { 'mega-spice': 2, 'cheddar-beddar': 1 }
			}
		]
	},
	{
		id: 3,
		question: 'Your dream vacation is...',
		emoji: '✈️',
		answers: [
			{
				text: 'Beach house, no plans',
				scores: { 'mozz-pure': 2, 'white-cheese': 1 }
			},
			{
				text: 'Food tour through Mexico',
				scores: { 'orange-spice': 2, 'mega-spice': 1 }
			},
			{
				text: 'Skateboarding through European cities',
				scores: { 'cheddar-beddar': 2, 'orange-spice': 1 }
			},
			{
				text: 'Volcano hiking in Iceland',
				scores: { 'mega-spice': 2, 'mozz-pure': 1 }
			}
		]
	},
	{
		id: 4,
		question: 'How do you take your coffee?',
		emoji: '☕',
		answers: [
			{
				text: 'Oat milk latte, simple',
				scores: { 'white-cheese': 2, 'mozz-pure': 1 }
			},
			{
				text: 'Black with one sugar',
				scores: { 'cheddar-beddar': 2, 'orange-spice': 1 }
			},
			{
				text: 'Cold brew with caramel',
				scores: { 'orange-spice': 2, 'white-cheese': 1 }
			},
			{
				text: 'Espresso shot — make it a triple',
				scores: { 'mega-spice': 2, 'cheddar-beddar': 1 }
			}
		]
	},
	{
		id: 5,
		question: "What's your go-to party move?",
		emoji: '🎉',
		answers: [
			{
				text: 'Bring a charcuterie board',
				scores: { 'white-cheese': 2, 'cheddar-beddar': 1 }
			},
			{
				text: 'DJ and never leave the aux',
				scores: { 'orange-spice': 2, 'mozz-pure': 1 }
			},
			{
				text: 'Challenge everyone to arm wrestling',
				scores: { 'mega-spice': 2, 'cheddar-beddar': 1 }
			},
			{
				text: 'Find the dog and hang with it all night',
				scores: { 'mozz-pure': 2, 'white-cheese': 1 }
			}
		]
	},
	{
		id: 6,
		question: "Pick a Tim's Nacho Cheese slogan",
		emoji: '📣',
		answers: [
			{
				text: 'Keep it real, keep it cheesy',
				scores: { 'white-cheese': 2, 'orange-spice': 1 }
			},
			{
				text: 'Smooth moves only',
				scores: { 'mozz-pure': 2, 'white-cheese': 1 }
			},
			{
				text: 'Bold flavors, no apologies',
				scores: { 'cheddar-beddar': 2, 'orange-spice': 1 }
			},
			{
				text: "If you can't handle the heat...",
				scores: { 'mega-spice': 2, 'cheddar-beddar': 1 }
			}
		]
	},
	{
		id: 7,
		question: 'Your Vans style?',
		emoji: '👟',
		answers: [
			{
				text: 'Classic white slip-ons',
				scores: { 'white-cheese': 2, 'mozz-pure': 1 }
			},
			{
				text: 'Checkered old skools',
				scores: { 'orange-spice': 2, 'cheddar-beddar': 1 }
			},
			{
				text: 'Custom painted by a friend',
				scores: { 'mozz-pure': 2, 'cheddar-beddar': 1 }
			},
			{
				text: 'Whatever survived the last mosh pit',
				scores: { 'mega-spice': 2, 'orange-spice': 1 }
			}
		]
	}
];

// Quiz results for each flavor
export const quizResults: Record<string, QuizResult> = {
	'white-cheese': {
		flavorId: 'white-cheese',
		title: 'The Classic',
		description:
			"You're the chill friend everyone needs. Low-key, reliable, and universally loved. You don't need flash to make an impression.",
		emoji: '🤍',
		vibe: 'Effortlessly cool, no drama needed'
	},
	'orange-spice': {
		flavorId: 'orange-spice',
		title: 'The Signature',
		description:
			"You've got that perfect blend of warmth and kick. People gravitate to you because you bring the energy without overdoing it.",
		emoji: '🧡',
		vibe: 'The life of the party, but never trying too hard'
	},
	'mozz-pure': {
		flavorId: 'mozz-pure',
		title: 'The Smooth Operator',
		description:
			"Cool, calm, collected. You're the one who makes everything look effortless. Silky smooth vibes only.",
		emoji: '💙',
		vibe: 'Zen master with impeccable taste'
	},
	'cheddar-beddar': {
		flavorId: 'cheddar-beddar',
		title: 'The Bold One',
		description:
			"Sharp, confident, unapologetic. You know what you like and you're not afraid to say it. Respect.",
		emoji: '🧀',
		vibe: 'Strong opinions, stronger flavor'
	},
	'mega-spice': {
		flavorId: 'mega-spice',
		title: 'The Legend',
		description:
			"You live life at 11. Others call you intense, you call it Tuesday. Not everyone can handle your energy — and that's exactly how you like it.",
		emoji: '🔥',
		vibe: 'Maximum intensity, zero regrets'
	}
};
