export type GalleryCategory = "Prom" | "Bridal" | "Evening" | "Redesign" | "BeforeAfter";

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  priceHint: string;
  image: string; // place in /public/gallery/
  alt: string;
};

export const categories: Array<{ key: GalleryCategory | "All"; label: string }> = [
  { key: "All", label: "All" },
  { key: "Prom", label: "Prom" },
  { key: "Bridal", label: "Bridal" },
  { key: "Evening", label: "Evening" },
  { key: "Redesign", label: "Custom Redesign" },
  { key: "BeforeAfter", label: "Before & After" },
];

export const gallery: GalleryItem[] = [
  {
    id: "g1",
    title: "Rose Gold Satin Mermaid",
    category: "Evening",
    priceHint: "Starting $650+",
    image: "/gallery/8.png",
    alt: "Rose gold mermaid gown on studio model",
  },
  {
    id: "g2",
    title: "Crystal Corset Prom Look",
    category: "Prom",
    priceHint: "Starting $1,950+",
    image: "/gallery/7.png",
    alt: "Prom gown with corset and crystal details",
  },
  {
    id: "g3",
    title: "Modern Bridal A-Line",
    category: "Bridal",
    priceHint: "Starting $3,900+",
    image: "/gallery/6.png",
    alt: "Bridal a-line dress with clean silhouette",
  },
  {
    id: "g4",
    title: "Tailored Redesign (Before/After)",
    category: "BeforeAfter",
    priceHint: "Package $350+",
    image: "/gallery/13.png",
    alt: "Before and after tailoring transformation",
  },
];