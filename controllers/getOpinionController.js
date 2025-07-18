const qdrantClient = require('../utils/qdrant_client');
const axios = require('axios');
const User = require('../models/User');
const { COLLECTION_NAME } = process.env;
const { StatusCodes } = require('http-status-codes');
const generateOpinion = require('../utils/openai');
const contextFormatter = require('../utils/contextFormatter');
const { containsProfanity } = require('../utils/profanityChecker');

const getOpinion = async (req, res) => {
  const creditsObj = await User.findOne({ _id: req.user.userId }).select(
    'credits'
  );
  const credits = creditsObj.credits;
  if (credits.credits <= 0)
    return res.status(StatusCodes.OK).json({
      opinion:
        'Liczba dostpenych kredytów wynosi 0. Skontaktuj się praconikiem obsługi klienta, aby uzyskać więcej informacji.',
    });
  const { texts: question } = req.body;

  const profanityCheck = await containsProfanity(...question);
  if (profanityCheck) {
    return res.status(StatusCodes.OK).json({
      opinion: profanityCheck,
      credits,
    });
  }

  const {
    data: { embeddings },
  } = await axios.post(
    process.env.SENTENCE_TRANSFORMER_API + '/embed',
    {
      texts: question,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.SENTENCE_TRANSFORMER_TOKEN}`,
      },
    }
  );

  const vector = embeddings[0];

  const { data } = await qdrantClient.post(
    `/collections/${COLLECTION_NAME}/points/search`,
    {
      vector,
      top: 5,
      with_payload: true,
    }
  );

  const result = data.result.map(item => ({
    id: item.id,
    score: item.score,
    payload: item.payload,
  }));

  const context = contextFormatter(result);

  const opinion = await generateOpinion(question, context);
  const updatedCredits = await User.findByIdAndUpdate(
    req.user.userId,
    { $inc: { credits: -1 } },
    { new: true }
  ).select('credits');

  res.status(StatusCodes.OK).json({ opinion, credits: updatedCredits.credits });
};

module.exports = {
  getOpinion,
};
