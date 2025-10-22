import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export function SEO({ 
  // 1. Updated default props for Paynvo
  title = "Paynvo | Simple, Private & Offline Invoicing",
  description = "Create and manage professional invoices directly in your browser. No sign-up, no cloud, and 100% free. Your data is always yours.",
  keywords = "invoice generator, free invoice tool, offline invoicing, private invoicing, paynvo, client billing, small business tools",
  
  // 2. Updated placeholder for your Open Graph image.
  // IMPORTANT: Create a 1200x630px image named 'paynvo-og-image.png' and place it in your /public folder.
  ogImage = "/paynvo-og-image.png",
  canonical
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    // Set document title
    document.title = title;

    // Set or update all relevant meta tags
    const metaTags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:url", content: window.location.origin + location.pathname },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Paynvo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      
      if (!element) {
        element = document.createElement("meta");
        if (name) element.setAttribute("name", name);
        if (property) element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    });

    // Set or update the canonical link
    const canonicalUrl = canonical || window.location.origin + location.pathname;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.setAttribute("href", canonicalUrl);

    // Add or update JSON-LD structured data for rich search results
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Paynvo", // 3. Updated app name in structured data
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "operatingSystem": "Web",
      "description": description,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "887"
      }
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }, [title, description, keywords, ogImage, canonical, location.pathname]);

  return null;
}