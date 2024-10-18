import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        message
      });

      return res.status(200).json({ response: response.data.response });
    } catch (error) {
      console.error('Error communicating with Flask API:', error);
      return res.status(500).json({ error: 'Error communicating with the Flask API' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
