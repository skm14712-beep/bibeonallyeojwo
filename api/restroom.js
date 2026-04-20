export default async function handler(req, res) {
  const { lat, lng } = req.query;
  const API_KEY = '898fc523c04b9682912612aadcbcbe001a6b3300d51794f98fbca2d488b8380f';
  
  // 좌표로 시군구 코드 먼저 조회 (카카오 API 활용)
  const url = `https://apis.data.go.kr/1741000/public_restroom_info/getPublicRestroomInfo`
    + `?serviceKey=${API_KEY}&pageNo=1&numOfRows=100&type=json`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // 전체 데이터에서 현재 위치 근처만 필터링
    let data;
    try { data = JSON.parse(text); } catch(e) { data = {}; }
    
    const items = Array.isArray(data?.items) ? data.items : 
                  data?.items ? [data.items] : [];
    
    const nearby = items.filter(item => {
      if (!item.WGS84_LAT || !item.WGS84_LON) return false;
      const dlat = parseFloat(item.WGS84_LAT) - parseFloat(lat);
      const dlng = parseFloat(item.WGS84_LON) - parseFloat(lng);
      return Math.sqrt(dlat*dlat + dlng*dlng) < 0.01; // 약 1km
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ items: nearby });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
