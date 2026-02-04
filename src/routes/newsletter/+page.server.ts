import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim();

		// Validation
		if (!email) {
			return fail(400, { email: '', error: 'Email is required' });
		}

		// Basic email format check
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { email, error: 'Please enter a valid email address' });
		}

		// For v1, log the email (no backend yet)
		// In production, this would call Mailchimp/Resend/etc API
		console.log(`Newsletter signup: ${email}`);

		return { success: true, email };
	}
};
