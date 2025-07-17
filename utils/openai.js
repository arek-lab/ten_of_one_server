const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateOpinion = async (context, userPrompt) => {
  const systemPrompt = `
Twoim zadaniem jest przeanalizowanie, jak portal TVP Info przedstawia konkretny temat podany przez użytkownika. Masz do dyspozycji kontekst w postaci fragmentów tekstów (np. artykułów, nagłówków, leadów), które pochodzą z wyszukiwania semantycznego w bazie (Qdrant).
Zanim przejdziesz do analizy:

0. Najpierw sprawdź, czy przedstawione treści mają wyraźny związek z tematem użytkownika.
  - Jeśli tak - przejdź dalej do analizy.
  - Jeśli nie - napisz wyraźnie, że dostępne materiały nie są wystarczająco związane z tematem, by przeprowadzić rzetelną analizę. Nie wymyślaj wtedy żadnych opinii na siłę.

Jeśli treści są powiązane, wykonaj następujące kroki:

1. Podsumuj główną narrację TVP Info na temat wskazanego zagadnienia. Powiedz, jak ten temat został przedstawiony, jakie wątki są podkreślane, czy pojawia się jakiś przekaz dominujący.

2. Określ ogólny **sentyment** (np. pozytywny, neutralny, negatywny) - najlepiej z krótkim uzasadnieniem (1-2 zdania).

3. Jeśli to możliwe, wskaż też elementy takie jak:
  - ton wypowiedzi (np. emocjonalny, ironiczny, alarmistyczny, uspokajający),
  - typowe ramy narracyjne (np. "my kontra oni", "zagrożenie z zewnątrz", "obrona tradycyjnych wartości").

Jeśli kontekst jest niepełny lub za krótki, zaznacz to, ale mimo to spróbuj oszacować prawdopodobny ton i sentyment na podstawie dostępnych danych.

Użytkownik wpisuje pytanie w stylu: „Co sądzi TVP Info o [temat]”. Twoim celem jest dostarczenie merytorycznego, zwięzłego podsumowania i analizy opinii, jaka wyłania się z treści znalezionych w kontekście.

Odpowiadaj wyłącznie w formacie markdown (MD). Używaj nagłówków (###), wypunktowań, pogrubień (**), list numerowanych i linków, jeśli są dostępne. Nie dodawaj żadnych komentarzy ani wyjaśnień poza strukturą markdown. Cała odpowiedź powinna być gotowa do wyrenderowania w markdown-viewerze.
`;

  const messages = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Temat: ${userPrompt}\n\nKontekst z Qdranta:\n${context}\n\nCo sądzi TVP Info o tym temacie?`,
    },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
  });

  return response.choices[0].message.content;
};

module.exports = generateOpinion;
