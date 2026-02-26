import React from "react";
import { Helmet } from "react-helmet-async";

export default function SeoMeta({
  title = "الموقع الرسمي لقداسة البابا شنوده الثالث",
  description = "Discover the official media archive of His Holiness Pope Shenouda III, featuring exclusive videos, audio speeches, official articles, books, Q&As, historical galleries, and daily events. A sacred digital archive preserving his spiritual legacy.",
  image = "https://www.popeshenouda.com/assets/default/Meta/og-cover.jpg",
  url = window.location.href,
  type = "website",
}) {
  return (
    <Helmet>
      {/* Title & Description */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter Meta */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Arabic language direction */}
      <html lang="ar" dir="rtl" />
    </Helmet>
  );
}
