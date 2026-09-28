    const apiKey = process.env.KLING_API_KEY;

if (!apiKey) {
  throw new Error('KLING_API_KEY is missing');
}

const response = await fetch(
  'https://api-singapore.klingai.com/v1/videos/text2video',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        model_name: 'kling-v2-6',
      prompt:
        'A majestic Bengal tiger standing naturally on the forest floor, subtle breathing and ear movement, realistic anatomy, cinematic wildlife photography',
      duration: '5',
      mode: 'pro',
    }),
  },
);

console.log('STATUS:', response.status);
console.log('CONTENT TYPE:', response.headers.get('content-type'));

const body = await response.text();

console.log('RESPONSE:', body);