export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { lat, lng } = req.query;
  
  const SUPABASE_URL = 'https://ucalsyqkkfdtiinrsmnz.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWxzeXFra2ZkdGlpbnJzbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTM0NzMsImV4cCI6MjA5MDU4OTQ3M30.8MTxdwv4mNFi0rqhhFLiBvgf3vNp5xLMbHmTCLl2Jlk';

  const range = 0.01; // 약 1km
  const url = `${SUPABASE_URL}/rest/v1/public_toilets?lat=gte.${parseFloat(lat)-range}&lat=lte.${parseFloat(lat)+range}&lng=gte.${parseFloat(lng)-range}&lng=lte.${parseFloat(lng)+range}&select=name,road_addr,lat,lng,open_time,phone&limit=50`;

  try {
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    const data = await response.json();
    res.status(200).json({ items: data });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
