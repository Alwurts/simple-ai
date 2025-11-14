import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export type ContactFormData = {
	name: string;
	email: string;
	message: string;
};

export function useContact() {
	return useMutation({
		mutationFn: async (contactData: { name: string; email: string; message: string }) => {
			const response = await apiClient.api.contact.$post({ json: contactData });
			const data = await response.json();
			if (!response.ok) {
				throw new Error("Failed to submit contact form");
			}

			return data;
		},
	});
}
