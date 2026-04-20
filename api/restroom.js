export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const API_KEY = '898fc523c04b9682912612aadcbcbe001a6b3300d51794f98fbca2d488b8380f';

  const url = `https://apis.data.go.kr/1741000/public_restroom_info/getPublicRestroomInfo`
    + `?serviceKey=${API_KEY}&pageNo=1&numOfRows=3&type=json`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    res.status(200).send(text);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
