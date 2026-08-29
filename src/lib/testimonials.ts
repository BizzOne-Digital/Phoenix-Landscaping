/**
 * Real client testimonials only.
 *
 * This array is intentionally EMPTY. No testimonials have been supplied by the
 * client, and inventing reviews would be both dishonest and a legal risk.
 *
 * To publish real testimonials, add entries below. Every page that shows
 * testimonials will populate automatically; while the array is empty those
 * pages show an honest "reviews coming soon" state instead.
 *
 * Example:
 * {
 *   quote: 'Exact wording provided by the client, unedited.',
 *   author: 'First name and last initial, or full name with permission',
 *   role: 'Homeowner',            // optional
 *   location: 'Sherwood Park',    // optional
 *   service: 'Snow Removal',      // optional
 * }
 */

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  location?: string;
  service?: string;
};

export const testimonials: Testimonial[] = [];
