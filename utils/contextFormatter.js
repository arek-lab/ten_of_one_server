module.exports = function formatQdrantContext(results) {
  return results
    .map((doc, index) => {
      const { title, headline, content, link } = doc.payload;

      const cleanContent = content
        .replace(/\s+/g, ' ')
        .replace(/#wieszwiecejPolub nas/g, '')
        .trim();

      return `🔹 Artykuł ${index + 1}:
Tytuł: ${title}
Lead: ${headline}
Link: ${link}
Treść: ${cleanContent}`;
    })
    .join('\n\n'); // oddziel artykuły
};
