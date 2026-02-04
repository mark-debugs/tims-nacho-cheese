import { jsPDF } from 'jspdf';

type RecipeData = {
	title: string;
	prepTime: string;
	cookTime: string;
	servings: number;
	ingredients: string[];
	instructions: string[];
};

export function generateRecipeCard(recipe: RecipeData): void {
	const doc = new jsPDF({
		orientation: 'portrait',
		unit: 'in',
		format: [4, 6] // 4x6 inch recipe card
	});

	const pageWidth = 4;
	const margin = 0.3;
	const contentWidth = pageWidth - margin * 2;

	// Tim's Nacho Cheese branding
	doc.setFontSize(7);
	doc.setFont('helvetica', 'italic');
	doc.text("Tim's Nacho Cheese", margin, 0.25);

	// Header
	doc.setFontSize(14);
	doc.setFont('helvetica', 'bold');
	const titleLines = doc.splitTextToSize(recipe.title, contentWidth);
	doc.text(titleLines, margin, 0.4);

	// Info bar
	let y = 0.4 + titleLines.length * 0.2 + 0.15;
	doc.setFontSize(8);
	doc.setFont('helvetica', 'normal');
	const infoText = `Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime} | Serves: ${recipe.servings}`;
	const infoLines = doc.splitTextToSize(infoText, contentWidth);
	doc.text(infoLines, margin, y);
	y += infoLines.length * 0.12;

	// Divider line
	y += 0.15;
	doc.setLineWidth(0.01);
	doc.line(margin, y, pageWidth - margin, y);

	// Ingredients
	y += 0.2;
	doc.setFontSize(10);
	doc.setFont('helvetica', 'bold');
	doc.text('Ingredients', margin, y);
	y += 0.15;

	doc.setFontSize(8);
	doc.setFont('helvetica', 'normal');
	recipe.ingredients.forEach((ing) => {
		const lines = doc.splitTextToSize(`- ${ing}`, contentWidth);
		doc.text(lines, margin, y);
		y += lines.length * 0.12 + 0.02;
	});

	// Instructions
	y += 0.1;
	doc.setFontSize(10);
	doc.setFont('helvetica', 'bold');
	doc.text('Instructions', margin, y);
	y += 0.15;

	doc.setFontSize(8);
	doc.setFont('helvetica', 'normal');
	recipe.instructions.forEach((step, i) => {
		const lines = doc.splitTextToSize(`${i + 1}. ${step}`, contentWidth - 0.15);
		doc.text(lines, margin + 0.15, y);
		y += lines.length * 0.12 + 0.04;
	});

	// Footer
	doc.setFontSize(6);
	doc.setFont('helvetica', 'italic');
	doc.text('timsnachocheese.com', margin, 5.85);

	// Save
	const filename = recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
	doc.save(`${filename}-recipe-card.pdf`);
}
