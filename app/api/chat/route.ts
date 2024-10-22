import axios from 'axios';
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest) {
  if (req.method === 'POST') {
    const { message } = await req.json();

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        message
      });

      return NextResponse.json({ response: response.data.response },{status:200});
    } catch (error) {
      console.error('Error communicating with Flask API:', error);
      return NextResponse.json({ error: 'Error communicating with the Flask API' },{status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' },{status: 405});
  }
}
