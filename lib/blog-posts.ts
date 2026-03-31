export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: number;
  author: string;
};

export const posts: BlogPost[] = [
  {
    slug: "permafrost-thaw-infrastructure-risk",
    title: "Understanding Permafrost Thaw Risk for Arctic Infrastructure",
    excerpt:
      "As global temperatures rise, permafrost across the Arctic is thawing at unprecedented rates. We break down what this means for pipelines, buildings, and roads — and how to quantify the risk before you build.",
    date: "2026-03-15",
    category: "Infrastructure",
    readTime: 7,
    author: "Circumpolar Research Team",
  },
  {
    slug: "sea-ice-shipping-routes-2026",
    title: "Sea Ice Trends and the Opening of Arctic Shipping Routes",
    excerpt:
      "The Northern Sea Route is increasingly navigable. We analyze the latest NSIDC sea ice extent data and what it means for shipping costs, transit times, and environmental liability.",
    date: "2026-02-28",
    category: "Maritime",
    readTime: 6,
    author: "Circumpolar Research Team",
  },
  {
    slug: "cellular-connectivity-arctic-challenges",
    title: "Cellular Connectivity in the Arctic: Challenges and Solutions",
    excerpt:
      "The Arctic has some of the lowest cellular coverage density on Earth. We map the gaps, explain why they exist, and review emerging satellite solutions from Starlink, Iridium Certus, and more.",
    date: "2026-02-10",
    category: "Connectivity",
    readTime: 5,
    author: "Circumpolar Research Team",
  },
  {
    slug: "arcticdem-elevation-data-guide",
    title: "ArcticDEM: Free 2-Meter Elevation Data for the Entire Arctic",
    excerpt:
      "The Polar Geospatial Center's ArcticDEM provides 2m resolution terrain data for all land above 60°N — free and open to all. Here's how to access it and what you can do with it.",
    date: "2026-01-22",
    category: "Data",
    readTime: 8,
    author: "Circumpolar Research Team",
  },
  {
    slug: "permafrost-insurance-underwriting",
    title: "How Insurers Are Pricing Permafrost Risk in 2026",
    excerpt:
      "Arctic infrastructure insurers are increasingly requiring site-specific permafrost assessments. We look at emerging underwriting frameworks and which data signals matter most.",
    date: "2025-12-18",
    category: "Insurance",
    readTime: 6,
    author: "Circumpolar Research Team",
  },
];
