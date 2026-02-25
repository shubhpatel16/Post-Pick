import OpenAI from 'openai';
import Product from '../models/productModel.js';

export const chatAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message required' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Step 1: Extract filters
    const extraction = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Extract shopping filters from the user message. Return ONLY JSON with: keyword, category, minPrice, maxPrice.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a smart e-commerce shopping assistant. Recommend products and ask follow-up questions if needed.',
        },
        ...(history || []),
        {
          role: 'user',
          content: message,
        },
      ],
    });

    let content = extraction.choices[0].message.content;
    content = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const filters = JSON.parse(content);

    const mongoFilter = {};

    if (filters.keyword) {
      mongoFilter.name = { $regex: filters.keyword, $options: 'i' };
    }

    if (filters.category) {
      let category = filters.category.toLowerCase();

      // normalize common variations
      if (category.includes('men')) category = 'men';
      if (category.includes('women')) category = 'women';
      if (category.includes('kid') || category.includes('child'))
        category = 'kids';

      mongoFilter.category = { $regex: category, $options: 'i' };
    }

    if (filters.minPrice || filters.maxPrice) {
      mongoFilter.price = {};
      if (filters.minPrice) mongoFilter.price.$gte = filters.minPrice;
      if (filters.maxPrice) mongoFilter.price.$lte = filters.maxPrice;
    }

    const products = await Product.find(mongoFilter).limit(5);

    // Step 2: Generate conversational reply
    const reply = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a friendly eCommerce shopping assistant. Recommend products conversationally.',
        },
        {
          role: 'user',
          content: `
User message: ${message}

Products found:
${products.map((p) => p.name + ' - ₹' + p.price).join('\n')}
          `,
        },
      ],
      temperature: 0.7,
    });

    res.json({
      reply: reply.choices[0].message.content,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
