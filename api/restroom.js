export default async function handler(req, res) {
  const { lat, lng } = req.query;
  const API_KEY = '898fc523c04b9682912612aadcbcbe001a6b3300d51794f98fbca2d488b8380f';
  const url = `https://apis.data.go.kr/1741000/public_restroom_info/getPublicRestroomInfo?serviceKey=${API_KEY}&pageNo=1&numOfRows=50&type=json&WGS84_LAT=${lat}&WGS84_LON=${lng}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
