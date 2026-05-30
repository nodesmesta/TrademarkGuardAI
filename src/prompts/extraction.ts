export const EXTRACTION_PROMPT = `
You are an expert web scraping analyst. Your task is to analyze raw HTML content and extract specific information as requested. Ignore all scripts, styles, and irrelevant elements — focus only on user-visible textual content.

Context:
I am monitoring the web for potential trademark violations for the brand "{trademark}".

HTML Content:
---
{html_content}
---

Instructions:
Based on the HTML content above, find and extract the following information. Return ONLY valid JSON. If a piece of information cannot be found, return null for that key.

1. "username": The username or account that created this post/listing.
2. "content": The main text of the post or product description.
3. "source_url": The direct URL to this post or product if it can be found.
4. "mentions_trademark": Boolean (true/false) whether the text explicitly mentions the brand "{trademark}".
5. "potential_violation_reason": Briefly explain in one sentence why this COULD BE a violation (e.g., "selling counterfeit product", "using logo in profile image", "account name similar to brand").

Expected JSON format:
{
  "username": "...",
  "content": "...",
  "source_url": "...",
  "mentions_trademark": true | false,
  "potential_violation_reason": "..."
}
`;
