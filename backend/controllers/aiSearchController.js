import OpenAI from 'openai';
import Product from '../models/productModel.js';

export const smartSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query required' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Extract product filters from the user search query. Respond ONLY with valid JSON. Do not include explanation, markdown, or backticks. Return keys: keyword, category, minPrice, maxPrice, brand.',
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0,
    });

    let content = aiResponse.choices[0].message.content;

    // Remove ```json if present
    content = content.replace(/```json/g, '');

    // Remove ``` if present
    content = content.replace(/```/g, '');

    // Remove extra spaces
    content = content.trim();

    // Now safely parse
    const extracted = JSON.parse(content);

    const filter = {};

    if (extracted.keyword) {
      filter.name = { $regex: extracted.keyword, $options: 'i' };
    }

    if (extracted.category) {
      filter.category = { $regex: extracted.category, $options: 'i' };
    }

    if (extracted.brand) {
      filter.brand = { $regex: extracted.brand, $options: 'i' };
    }

    if (extracted.minPrice || extracted.maxPrice) {
      filter.price = {};
      if (extracted.minPrice) filter.price.$gte = extracted.minPrice;
      if (extracted.maxPrice) filter.price.$lte = extracted.maxPrice;
    }

    const products = await Product.find(filter);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
