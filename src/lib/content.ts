const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface ContentItem {
  id: string;
  page: string;
  section: string;
  key: string;
  type: string;
  value: string;
  metadata?: Record<string, unknown>;
}

export interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  whyVisit: {
    title: string;
    items: Array<{
      title: string;
      image: string;
      bgColor: string;
    }>;
  };
  topTours: {
    title: string;
    description: string;
    tours: Array<{
      title: string;
      description: string;
      image: string;
      date: string;
      location: string;
      rating: number;
    }>;
  };
  cities: {
    title: string;
    description: string;
    mapImage: string;
  };
  instagram: {
    handle: string;
    description: string;
    images: string[];
  };
  about: {
    title: string;
    description: string;
    stats: Array<{
      value: string;
      description: string;
    }>;
  };
}

export const defaultHomepageContent: HomepageContent = {
  hero: {
    title: "Your Next Best Trip,",
    subtitle: "Return Inspired",
    backgroundImage: "/image.png"
  },
  whyVisit: {
    title: "Why Visit Kazakhstan",
    items: [
      { title: "Silk Road History", image: "/desert.jpg", bgColor: "from-blue-400 to-blue-600" },
      { title: "Nomadic Soul", image: "/shanyrak.jpg", bgColor: "from-amber-600 to-amber-800" },
      { title: "Modern Meets Traditional", image: "/baiterek.jpg", bgColor: "from-orange-400 to-orange-600" },
      { title: "No Crowds, Just Space", image: "/kanatnaya_doroga.jpg", bgColor: "from-red-400 to-red-600" },
      { title: "Unspoiled Nature", image: "/yurta.jpg", bgColor: "from-green-400 to-green-600" }
    ]
  },
  topTours: {
    title: "Top Tour Themes",
    description: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.",
    tours: [
      {
        title: "Charyn Canyon & Kolsai Lakes Tour",
        description: "A classic multi-day trip from Almaty into the Tian Shan mountains — explore canyons, alpine lakes, and mountain villages.",
        image: "/bao_contras.jpg",
        date: "20 may 2025",
        location: "Almaty",
        rating: 5
      },
      {
        title: "Mangystau Desert Expedition",
        description: "Visit Bozzhyra, Sherkala, and Torysh with local guides. Sleep in a yurt under the stars, explore sacred places.",
        image: "/mangystau.jpg",
        date: "20 may 2025",
        location: "",
        rating: 5
      },
      {
        title: "Turkestan - Taraz - Otrar Route",
        description: "A historical journey across mausoleums, caravanserais, and ruins — with stories of poets, traders, and pilgrims.",
        image: "/kozha_akhmet_yassaui.jpg",
        date: "20 may 2025",
        location: "",
        rating: 5
      },
      {
        title: "Almaty",
        description: "Street art, fashion studios, coffee culture, and live music — explore Almaty's youthful soul.",
        image: "/almaty.jpg",
        date: "20 may 2025",
        location: "",
        rating: 5
      }
    ]
  },
  cities: {
    title: "Discover Cities",
    description: "Kazakhstan's cities reflect the country's past, present, and future — from ancient Silk Road stops to futuristic capitals, sleepy desert towns to cultural and academic centers. Each has its own character, rhythm, and reason to explore.",
    mapImage: "/kz_map.png"
  },
  instagram: {
    handle: "@into.kazakhstan",
    description: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.",
    images: ["/nomad_girls.png", "/desert.jpg", "/yurta.jpg"]
  },
  about: {
    title: "About us",
    description: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.",
    stats: [
      { value: "2010", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { value: "50+", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { value: "1000+", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { value: "20", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
    ]
  }
};

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/content/homepage`);
    
    if (!response.ok) {
      console.warn('Failed to fetch homepage content, using defaults');
      return defaultHomepageContent;
    }

    const data = await response.json();
    
    if (!data.success || !data.data.content.length) {
      return defaultHomepageContent;
    }

    // Transform API content to our format
    const apiContent = data.data.content;
    const transformedContent: Record<string, Record<string, unknown>> = {};
    
    apiContent.forEach((item: ContentItem) => {
      if (!transformedContent[item.section]) {
        transformedContent[item.section] = {};
      }
      
      if (item.type === 'json') {
        try {
          transformedContent[item.section][item.key] = JSON.parse(item.value);
        } catch {
          transformedContent[item.section][item.key] = item.value;
        }
      } else {
        transformedContent[item.section][item.key] = item.value;
      }
    });
    
    // Merge with defaults to ensure all required fields exist
    return {
      hero: {
        ...defaultHomepageContent.hero,
        ...transformedContent.hero
      },
      whyVisit: {
        ...defaultHomepageContent.whyVisit,
        ...transformedContent.whyVisit
      },
      topTours: {
        ...defaultHomepageContent.topTours,
        ...transformedContent.topTours
      },
      cities: {
        ...defaultHomepageContent.cities,
        ...transformedContent.cities
      },
      instagram: {
        ...defaultHomepageContent.instagram,
        ...transformedContent.instagram
      },
      about: {
        ...defaultHomepageContent.about,
        ...transformedContent.about
      }
    };
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return defaultHomepageContent;
  }
}