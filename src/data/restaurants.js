/**
 * UrbanBite Restaurant Branches in Pakistan (Single Branch Per City)
 */

export const restaurants = [
  // Lahore
  {
    id: 'urbanbite-gulberg-lahore',
    name: 'UrbanBite Gulberg Main Blvd',
    slug: 'urbanbite-gulberg-lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    address: '94-B/1, Main Boulevard Gulberg III, Lahore',
    phone: '+92 42 3571 2244',
    timing: '11:00 AM - 03:00 AM',
    rating: 4.9,
    reviewCount: 920,
    isOpen: true,
    distance: '4.1 km away',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Bustling multi-story restaurant and open-kitchen diner in the heart of Gulberg commercial district.',
    facilities: ['Dine-In', 'Takeaway', 'Late Night Hub', 'Free Wi-Fi', 'Wheelchair Accessible', 'Party Hall'],
    coords: { lat: 31.5204, lng: 74.3587 }
  },

  // Islamabad
  {
    id: 'urbanbite-f7-islamabad',
    name: 'UrbanBite F-7 Markaz',
    slug: 'urbanbite-f7-islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    address: 'Shop 12-14, Jinnah Super Market, F-7 Markaz, Islamabad',
    phone: '+92 51 265 4488',
    timing: '11:00 AM - 02:00 AM',
    rating: 4.9,
    reviewCount: 840,
    isOpen: true,
    distance: '1.8 km away',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    description: 'Iconic flagship café-style UrbanBite location in F-7 with outdoor terrace seating facing the Margalla Hills.',
    facilities: ['Terrace Seating', 'Dine-In', 'Takeaway', 'Artisan Coffee Bar', 'Free High-Speed Wi-Fi'],
    coords: { lat: 33.7215, lng: 73.0558 }
  },

  // Multan
  {
    id: 'urbanbite-cantt-multan',
    name: 'UrbanBite Cantt Multan',
    slug: 'urbanbite-cantt-multan',
    city: 'Multan',
    citySlug: 'multan',
    address: 'Mall Plaza, Nusrat Road, Multan Cantt',
    phone: '+92 61 458 9912',
    timing: '12:00 PM - 01:00 AM',
    rating: 4.8,
    reviewCount: 380,
    isOpen: true,
    distance: '5.2 km away',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Premier culinary destination in Cantt featuring gourmet burger creations and artisan pizzas.',
    facilities: ['Dine-In', 'Takeaway', 'Family Hall', 'Free Wi-Fi', 'Parking'],
    coords: { lat: 30.1878, lng: 71.4428 }
  }
];
