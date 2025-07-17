const leoProfanity = require('leo-profanity');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

leoProfanity.add(['chuj', 'kurwa', 'pizda', 'jebany', 'pierdol', 'skurwiel']);

const profanityRoots = [
  'kurw', // kurwa, kurwe, kurwy, wkurwia, itd.
  'chuj', // chuj, chuja, chujowi, chujami
  'pizd', // pizda, pizdy, pizdą, pizdami
  'jeb', // jebany, jebie, zjebać
  'pierdol', // pierdolę, pierdolisz, pierdolony
  'skurw', // skurwiel, skurwysyn, skurwiony
  'ciul', // ciul, ciulem, ciulowi
  'suk', // suka, suce, suki
  'fuck', // angielski odpowiednik
  'shit', // shit, shitty
  'dziw', // dziwka, dziwki
  'cwel', // cwel, cwelem, cwelu
  'szmat', // szmata, szmatą
  'debil', // debil, debile, debilny
  'idiot', // idiota, idiotyzm
  'kretyn', // kretyn, kretyni
  'pojeb', // pojeb, pojebany
  'zjeb', // zjebać, zjebany
  'nienawidz', // nienawidzę, nienawidzisz
  'nienawisc', // nienawiść
  'spierdal', // spierdalaj, spierdalać
  'wypierdal', // wypierdalaj, wypierdalać
  'wyjeb', // wyjebać, wyjebany
  'rozjeb', // rozjebać, rozjebany
  'dojeb', // dojebać
  'napierdal', // napierdalać
  'kurwiarz',
];

const profanityRegex = new RegExp(
  `\\b(${profanityRoots.join('|')})[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*\\b`,
  'i'
);
function sanitizeInput(text) {
  return text.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, '').toLowerCase();
}

// Check #1 – Moderation API
const checkModeration = async userPrompt => {
  const moderation = await openai.moderations.create({
    input: userPrompt,
  });

  const result = moderation.results[0];
  const flagged = result.flagged;
  const scores = result.category_scores;

  if (flagged) return true;

  if (scores['hate'] > 0.15) return true;
  if (scores['hate/threatening'] > 0.1) return true;
  if (scores['profanity'] > 0.1) return true; // obniżone

  return false;
};

// Check #2 – Nonsense, discrimination detection via small LLM
const checkNonsenseAndToxicity = async userPrompt => {
  const prompt = `
Oceń poniższy temat użytkownika pod kątem:

- Czy jest absurdalny, nonsensowny, wymyślony lub żartobliwy w kontekście pytania co sądzi TVP Info o danym temacie. Czy potencjalnie reporterzy mogliby pisać o tym w poważny sposób?
- Czy zawiera wulgaryzmy lub obraźliwe treści (w tym słowa powszechnie uznawane za nieprzyzwoite).
- Czy zawiera treści nacjoalistyczne, rasistowskie, antysemickie lub inne formy dyskryminacji.
Jeśli temat jest czysty, sensowny i nie zawiera obraźliwości, odpowiedz "OK".

Jeśli temat zawiera wulgaryzmy lub jest nonsensowny, odpowiedz "ODRZUĆ".

Temat: "${userPrompt}"
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: prompt }],
  });

  const answer = response.choices[0].message.content.trim().toUpperCase();
  return answer === 'ODRZUĆ';
};

async function containsProfanity(text) {
  const [isFlagged, isRejected] = await Promise.all([
    checkModeration(text),
    checkNonsenseAndToxicity(text),
  ]);

  if (isFlagged || isRejected) {
    return 'Temat został odrzucony - może być nieodpowiedni, obraźliwy lub zbyt absurdalny do rzetelnej analizy. Spróbuj sformułować bardziej merytoryczne pytanie.';
  }
  const sanitized = sanitizeInput(text);
  return leoProfanity.check(text) || profanityRegex.test(sanitized);
}

module.exports = { containsProfanity };
