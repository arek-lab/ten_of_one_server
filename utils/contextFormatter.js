module.exports = function formatQdrantContext(results) {
  return results
    .map((doc, index) => {
      const { title, headline, content, link } = doc.payload;

      const cleanContent =
        typeof content === 'string'
          ? content
              .replace(/\s+/g, ' ')
              .replace(/#wieszwiecejPolub nas/g, '')
              .trim()
          : '[Brak treści]';

      return `🔹 Artykuł ${index + 1}:
Tytuł: ${title || '[Brak tytułu]'}
Lead: ${headline || '[Brak leadu]'}
Link: ${link || '[Brak linku]'}
Treść: ${cleanContent}`;
    })
    .join('\n\n'); // oddziel artykuły
};
