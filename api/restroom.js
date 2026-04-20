export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { lat, lng } = req.query;
  const API_KEY = '898fc523c04b9682912612aadcbcbe001a6b3300d51794f98fbca2d488b8380f';
  const KAKAO_REST = '67d35f53f97b576ddeb197e83d3abed1';

  try {
    const kakaoRes = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`,
      { headers: { Authorization: `KakaoAK ${KAKAO_REST}` } }
    );
    const kakaoData = await kakaoRes.json();
    const region = kakaoData?.documents?.[0];
    const sido = region?.region_1depth_name || '';
    const sigungu = region?.region_2depth_name || '';

    const url = `https://apis.data.go.kr/1741000/public_restroom_info?serviceKey=${API_KEY}&pageNo=1&numOfRows=100&type=json&SIDO=${encodeURIComponent(sido)}&SIGUNGU=${encodeURIComponent(sigungu)}`;
    const response = await fetch(url);
    const text = await response.text();
    res.status(200).send(text);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
