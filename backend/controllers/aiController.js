import OpenAI from 'openai';

export const generateDescription = async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: 'OpenAI key missing in env' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { name, category } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional eCommerce copywriter.',
        },
        {
          role: 'user',
          content: `Write a compelling product description for a ${category} product named "${name}".`,
        },
      ],
    });

    res.json({
      description: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('AI ERROR:', error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};
