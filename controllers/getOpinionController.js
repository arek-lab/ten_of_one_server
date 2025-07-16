const qdrantClient = require('../utils/qdrant_client');
const axios = require('axios');
const { COLLECTION_NAME } = process.env;
const { StatusCodes } = require('http-status-codes');
const generateOpinion = require('../utils/openai');
const contextFormatter = require('../utils/contextFormatter');

const getOpinion = async (req, res) => {
  const { texts: question } = req.body;

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

  res.status(StatusCodes.OK).json({ opinion });
};

module.exports = {
  getOpinion,
};
