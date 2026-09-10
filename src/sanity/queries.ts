import { groq } from 'next-sanity';

const seoFragment = /* groq */ `seo { title, description, noIndex, "ogImage": ogImage.asset->url }`;
const imageFragment = /* groq */ `{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "blurDataURL": asset->metadata.lqip
}`;

export const projectsQuery = groq`
  *[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc) {
    "slug": slug.current,
    client, title, summary, domain, url, role, category, tags, stack, accent, featured,
    context,
    challenge { heading, body },
    solution { heading, body },
    features[] { title, body },
    outcome,
    "cover": cover ${imageFragment},
    "gallery": gallery[] ${imageFragment},
    ${seoFragment}
  }
`;

export const servicesQuery = groq`
  *[_type == "service" && defined(slug.current)] | order(order asc, _createdAt asc) {
    "slug": slug.current,
    index, title, tagline, description, deliverables, priceFrom, duration
  }
`;

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    title, excerpt, category, readingTime,
    "publishedAt": publishedAt,
    "updatedAt": updatedAt,
    "cover": cover ${imageFragment},
    "body": pt::text(body),
    ${seoFragment}
  }
`;

export const faqQuery = groq`
  *[_type == "faq" && key == $key][0].items[] { question, answer }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc, _createdAt desc) { quote, author, role, source }
`;

export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    eyebrow, heading, lead,
    faq[] { question, answer },
    cta { title, lead, label, href },
    ${seoFragment}
  }
`;
