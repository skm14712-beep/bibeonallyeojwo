export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { lat, lng } = req.query;
  const API_KEY = '898fc523c04b9682912612aadcbcbe001a6b3300d51794f98fbca2d488b8380f';

  // 카카오 REST API로 좌표 → 시군구 코드 변환
  const kakaoRes = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`,
    { headers: { Authorization: 'KakaoAK b35ff72524613a2c48022c5d6917a911' } }
  );
  const kakaoData = await kakaoRes.json();
  const region = kakaoData?.documents?.[0];
  if (!region) { res.status(200).json({ items: [] }); return; }

  const siDo = region.region_1depth_name;
  const siGunGu = region.region_2depth_name;

  const url = `https://apis.data.go.kr/1741000/public_restroom_info/getPublicRestroomInfo`
    + `?serviceKey=${API_KEY}&pageNo=1&numOfRows=100&type=json`
    + `&SIDO=${encodeURIComponent(siDo)}&SIGUNGU=${encodeURIComponent(siGunGu)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = {}; }
    const items = Array.isArray(data?.items) ? data.items :
                  data?.items ? [data.items] : [];
    const nearby = items.filter(item => {
      if (!item.WGS84_LAT || !item.WGS84_LON) return false;
      const dlat = parseFloat(item.WGS84_LAT) - parseFloat(lat);
      const dlng = parseFloat(item.WGS84_LON) - parseFloat(lng);
      return Math.sqrt(dlat*dlat + dlng*dlng) < 0.005;
    });
    res.status(200).json({ items: nearby });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
