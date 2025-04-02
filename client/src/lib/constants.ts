export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Try before you subscribe",
    features: [
      { included: true, text: "1 free image processing" },
      { included: true, text: "Standard quality" },
      { included: true, text: "Basic download options" },
      { included: false, text: "No image history" }
    ],
    buttonText: "Try now",
    buttonLink: "#upload-section",
    popular: false
  },
  BASIC: {
    name: "Basic",
    price: "9",
    period: "month",
    description: "Perfect for occasional use",
    features: [
      { included: true, text: "50 images per month" },
      { included: true, text: "HD quality" },
      { included: true, text: "All download formats (PNG, JPG)" },
      { included: true, text: "30-day image history" }
    ],
    buttonText: "Get started",
    buttonLink: "/signup?plan=basic",
    popular: true
  },
  PRO: {
    name: "Pro",
    price: "19",
    period: "month",
    description: "For professional needs",
    features: [
      { included: true, text: "Unlimited images" },
      { included: true, text: "4K quality" },
      { included: true, text: "All formats + PSD with layers" },
      { included: true, text: "Unlimited image history" },
      { included: true, text: "Batch processing" }
    ],
    buttonText: "Get started",
    buttonLink: "/signup?plan=pro",
    popular: false
  }
};

export const HOW_IT_WORKS_STEPS = [
  {
    id: 1,
    title: "Upload your image",
    description: "Select and upload any image from your device. We support JPG, PNG and other common formats.",
    icon: "upload"
  },
  {
    id: 2,
    title: "Automatic processing",
    description: "Our AI instantly processes your image and removes the background with precision and accuracy.",
    icon: "process"
  },
  {
    id: 3,
    title: "Download result",
    description: "Preview your image and download the transparent PNG file instantly. No watermarks in any plan.",
    icon: "download"
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "John D.",
    initials: "JD",
    rating: 5,
    text: "This tool is a game-changer for my e-commerce product photos. The background removal is incredibly accurate and saves me hours of Photoshop work."
  },
  {
    id: 2,
    name: "Sarah M.",
    initials: "SM",
    rating: 5,
    text: "I've tried multiple background removal services and this one is by far the most accurate. Even complex edges like hair are handled perfectly."
  },
  {
    id: 3,
    name: "Robert K.",
    initials: "RK",
    rating: 4,
    text: "The batch processing feature of the Pro plan is incredible. I can upload multiple product images and have them all processed at once."
  }
];

export const FOOTER_LINKS = {
  product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "/pricing" },
    { name: "API", href: "#" }
  ],
  support: [
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "Contact Us", href: "#" }
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" }
  ]
};
