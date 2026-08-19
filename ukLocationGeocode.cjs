/**
 * ukLocationGeocode.cjs
 *
 * Ported from `google_script`'s geocodeLocationFallback()/getLocationCoordinates() — the old
 * Apps Script pipeline (before the Google Sheets Queue + review app existed) set a `_geoloc`
 * pin on every published opportunity by matching its free-text Location field against this
 * dictionary. That logic was never carried over when the pipeline moved to Node, so every
 * opportunity published since has gone out with no map pin. This is a straight port, not a
 * rewrite — same dictionary, same match order (exact -> longest-partial -> word), same
 * null-for-virtual-locations list.
 *
 * The Apps Script version also had a live Google Maps Geocoding API call ahead of this
 * fallback, gated on a real API key — that key was never actually configured
 * (CONFIG.GOOGLE_MAPS_API_KEY stayed 'your-google-maps-api-key-here'), so in practice this
 * fallback dictionary was the entire mechanism. Ported without the dead API-call branch.
 */

'use strict';

const UK_LOCATIONS = {
  // Major cities (original entries)
  'manchester': { lat: 53.4872927, lng: -2.2900071 },
  'london': { lat: 51.5074456, lng: -0.1277653 },
  'birmingham': { lat: 52.4796992, lng: -1.9026911 },
  'leeds': { lat: 53.7974185, lng: -1.5437941 },
  'glasgow': { lat: 55.8610306, lng: -4.2501671 },
  'liverpool': { lat: 53.4106086, lng: -2.9779312 },
  'bristol': { lat: 51.4538022, lng: -2.5972985 },
  'edinburgh': { lat: 55.9533456, lng: -3.1883749 },
  'cardiff': { lat: 51.4816546, lng: -3.1791353 },
  'belfast': { lat: 54.5946593, lng: -5.9690754 },
  'newcastle': { lat: 54.9738474, lng: -1.6131572 },
  'newcastle upon tyne': { lat: 54.9738474, lng: -1.6131572 },
  'nottingham': { lat: 52.9534193, lng: -1.1496461 },
  'sheffield': { lat: 53.3806626, lng: -1.4702278 },
  'bradford': { lat: 53.7943026, lng: -1.7548636 },
  'coventry': { lat: 52.4082663, lng: -1.5105777 },
  'leicester': { lat: 52.6368778, lng: -1.1397592 },
  'sunderland': { lat: 54.9069619, lng: -1.3838009 },
  'plymouth': { lat: 50.3790795, lng: -4.1326565 },
  'derby': { lat: 52.9225301, lng: -1.4746186 },
  'wolverhampton': { lat: 52.5855681, lng: -2.1282226 },
  'salford': { lat: 53.4873218, lng: -2.2906621 },

  // English locations A-Z
  'abingdon': { lat: 51.6697, lng: -1.2867 },
  'abingdon-on-thames': { lat: 51.6697, lng: -1.2867 },
  'alfreton': { lat: 53.0973, lng: -1.3887 },
  'altrincham': { lat: 53.3878, lng: -2.3489 },
  'amber valley': { lat: 53.0417, lng: -1.4139 },
  'anstruther': { lat: 56.2234, lng: -2.7011 },
  'armagh': { lat: 54.3503, lng: -6.6528 },
  'ashbourne': { lat: 53.0147, lng: -1.7331 },
  'ashton under lyne': { lat: 53.4900, lng: -2.0997 },
  'axminster': { lat: 50.7785, lng: -3.0069 },
  'aylsham': { lat: 52.7938, lng: 1.2473 },
  'banbury': { lat: 52.0628, lng: -1.3392 },
  'barking': { lat: 51.5396, lng: 0.0751 },
  'barnstaple': { lat: 51.0801, lng: -4.0585 },
  'bath': { lat: 51.3811, lng: -2.3590 },
  'bedford': { lat: 52.1357, lng: -0.4668 },
  'bicester': { lat: 51.9001, lng: -1.1518 },
  'birkenhead': { lat: 53.3931, lng: -3.0173 },
  'blackpool': { lat: 53.8175, lng: -3.0357 },
  'blackwater': { lat: 51.3244, lng: -0.7879 },
  'bognor regis': { lat: 50.7824, lng: -0.6754 },
  'borehamwood': { lat: 51.6577, lng: -0.2731 },
  'bourne': { lat: 52.7670, lng: -0.3773 },
  'bournemouth': { lat: 50.7192, lng: -1.8808 },
  'bracknell': { lat: 51.4158, lng: -0.7536 },
  'brackley': { lat: 52.0332, lng: -1.1469 },
  'brierley hill': { lat: 52.4816, lng: -2.1218 },
  'brighton': { lat: 50.8225, lng: -0.1372 },
  'brighton and hove': { lat: 50.8225, lng: -0.1372 },
  'bromley': { lat: 51.4068, lng: 0.0145 },
  'broxbourne': { lat: 51.7479, lng: -0.0133 },
  'buckinghamshire': { lat: 51.8167, lng: -0.8167 },
  'burnley': { lat: 53.7887, lng: -2.2426 },
  'burton on trent': { lat: 52.8065, lng: -1.6400 },
  'burton upon trent': { lat: 52.8065, lng: -1.6400 },
  'cambridge': { lat: 52.2053, lng: 0.1218 },
  'camden': { lat: 51.5290, lng: -0.1255 },
  'canterbury': { lat: 51.2802, lng: 1.0789 },
  'carlisle': { lat: 54.8951, lng: -2.9382 },
  'chelmsford': { lat: 51.7356, lng: 0.4685 },
  'chertsey': { lat: 51.3906, lng: -0.5061 },
  'chester': { lat: 53.1906, lng: -2.8837 },
  'chesterfield': { lat: 53.2351, lng: -1.4315 },
  'chichester': { lat: 50.8365, lng: -0.7792 },
  'clacton': { lat: 51.7896, lng: 1.1567 },
  'cleckheaton': { lat: 53.7248, lng: -1.7114 },
  'clevedon': { lat: 51.4368, lng: -2.8546 },
  'colchester': { lat: 51.8959, lng: 0.9035 },
  'congleton': { lat: 53.1643, lng: -2.2118 },
  'cramlington': { lat: 55.0864, lng: -1.5901 },
  'crewe': { lat: 53.0963, lng: -2.4417 },
  'crowborough': { lat: 51.0551, lng: 0.1615 },
  'croydon': { lat: 51.3762, lng: -0.0982 },
  'dartford': { lat: 51.4472, lng: 0.2131 },
  'darlington': { lat: 54.5253, lng: -1.5584 },
  'doncaster': { lat: 53.5228, lng: -1.1285 },
  'dudley': { lat: 52.5122, lng: -2.0808 },
  'durham': { lat: 54.7753, lng: -1.5849 },
  'exeter': { lat: 50.7236, lng: -3.5269 },
  'farnborough': { lat: 51.2944, lng: -0.7581 },
  'farnham': { lat: 51.2147, lng: -0.7982 },
  'felixstowe': { lat: 51.9642, lng: 1.3506 },
  'flitwick': { lat: 52.0043, lng: -0.4886 },
  'framlingham': { lat: 52.2245, lng: 1.3408 },
  'frome': { lat: 51.2277, lng: -2.3199 },
  'gainsborough': { lat: 53.3982, lng: -0.7749 },
  'galashiels': { lat: 55.6195, lng: -2.8081 },
  'guildford': { lat: 51.2362, lng: -0.5704 },
  'halifax': { lat: 53.7218, lng: -1.8590 },
  'harpenden': { lat: 51.8153, lng: -0.3535 },
  'hartlepool': { lat: 54.6869, lng: -1.2125 },
  'hastings': { lat: 50.8429, lng: 0.5734 },
  'havant': { lat: 50.8551, lng: -0.9810 },
  'henley-on-thames': { lat: 51.5338, lng: -0.8987 },
  'henley in arden': { lat: 52.2915, lng: -1.7782 },
  'hereford': { lat: 52.0564, lng: -2.7159 },
  'high wycombe': { lat: 51.6287, lng: -0.7482 },
  'horsham': { lat: 51.0628, lng: -0.3258 },
  'huddersfield': { lat: 53.6458, lng: -1.7850 },
  'hull': { lat: 53.7676, lng: -0.3274 },
  'ipswich': { lat: 52.0595, lng: 1.1550 },
  'kidderminster': { lat: 52.3881, lng: -2.2470 },
  'kirkcaldy': { lat: 56.1121, lng: -3.1564 },
  'knutsford': { lat: 53.3041, lng: -2.3714 },
  'lancaster': { lat: 54.0466, lng: -2.8007 },
  'lancing': { lat: 50.8341, lng: -0.3208 },
  'leek': { lat: 53.1038, lng: -2.0226 },
  'lewes': { lat: 50.8738, lng: 0.0108 },
  'lewisham': { lat: 51.4649, lng: -0.0122 },
  'loughborough': { lat: 52.7684, lng: -1.2039 },
  'luton': { lat: 51.8787, lng: -0.4200 },
  'macclesfield': { lat: 53.2606, lng: -2.1259 },
  'malton': { lat: 54.1373, lng: -0.7979 },
  'mansfield': { lat: 53.1395, lng: -1.1982 },
  'margate': { lat: 51.3813, lng: 1.3862 },
  'melrose': { lat: 55.5993, lng: -2.7227 },
  'merton': { lat: 51.4098, lng: -0.1951 },
  'middleton': { lat: 53.5503, lng: -2.1932 },
  'milton keynes': { lat: 52.0406, lng: -0.7594 },
  'newbury': { lat: 51.4011, lng: -1.3223 },
  'newry': { lat: 54.1751, lng: -6.3402 },
  'norwich': { lat: 52.6309, lng: 1.2974 },
  'northampton': { lat: 52.2405, lng: -0.9027 },
  'nuneaton': { lat: 52.5225, lng: -1.4669 },
  'orpington': { lat: 51.3729, lng: 0.0967 },
  'oxford': { lat: 51.7520, lng: -1.2577 },
  'peterborough': { lat: 52.5695, lng: -0.2405 },
  'poole': { lat: 50.7150, lng: -1.9872 },
  'portsmouth': { lat: 50.8058, lng: -1.0872 },
  'preston': { lat: 53.7632, lng: -2.7031 },
  'reading': { lat: 51.4543, lng: -0.9781 },
  'retford': { lat: 53.3221, lng: -0.9464 },
  'ripley': { lat: 53.0468, lng: -1.4093 },
  'rochdale': { lat: 53.6097, lng: -2.1561 },
  'romford': { lat: 51.5748, lng: 0.1821 },
  'rotherham': { lat: 53.4302, lng: -1.3571 },
  'runcorn': { lat: 53.3420, lng: -2.7319 },
  'sale': { lat: 53.4217, lng: -2.3248 },
  'saltash': { lat: 50.4064, lng: -4.2072 },
  'sandwich': { lat: 51.2763, lng: 1.3387 },
  'scarborough': { lat: 54.2833, lng: -0.3997 },
  'scunthorpe': { lat: 53.5904, lng: -0.6544 },
  'sharnbrook': { lat: 52.2117, lng: -0.5935 },
  'shrewsbury': { lat: 52.7069, lng: -2.7528 },
  'skipton': { lat: 53.9620, lng: -2.0175 },
  'slough': { lat: 51.5105, lng: -0.5950 },
  'solihull': { lat: 52.4118, lng: -1.7776 },
  'south shields': { lat: 54.9988, lng: -1.4313 },
  'southampton': { lat: 50.9097, lng: -1.4044 },
  'southend-on-sea': { lat: 51.5459, lng: 0.7077 },
  'southwold': { lat: 52.3275, lng: 1.6810 },
  'st albans': { lat: 51.7520, lng: -0.3360 },
  'stockport': { lat: 53.4106, lng: -2.1575 },
  'stoke-on-trent': { lat: 53.0027, lng: -2.1794 },
  'stornoway': { lat: 58.2093, lng: -6.3890 },
  'stretford': { lat: 53.4455, lng: -2.3116 },
  'sutton coldfield': { lat: 52.5644, lng: -1.8241 },
  'swanage': { lat: 50.6095, lng: -1.9594 },
  'taunton': { lat: 51.0147, lng: -3.1006 },
  'torquay': { lat: 50.4619, lng: -3.5253 },
  'totton': { lat: 50.9189, lng: -1.4866 },
  'trowbridge': { lat: 51.3186, lng: -2.2081 },
  'wakefield': { lat: 53.6833, lng: -1.4977 },
  'walthamstow': { lat: 51.5820, lng: -0.0195 },
  'walton-on-thames': { lat: 51.3869, lng: -0.4099 },
  'warrington': { lat: 53.3900, lng: -2.5970 },
  'warwick': { lat: 52.2819, lng: -1.5849 },
  'washington': { lat: 54.8998, lng: -1.5180 },
  'watford': { lat: 51.6565, lng: -0.3973 },
  'welwyn garden city': { lat: 51.8011, lng: -0.2056 },
  'wembley': { lat: 51.5523, lng: -0.2964 },
  'west bridgford': { lat: 52.9261, lng: -1.1260 },
  'widnes': { lat: 53.3667, lng: -2.7333 },
  'wigan': { lat: 53.5448, lng: -2.6318 },
  'winchester': { lat: 51.0632, lng: -1.3080 },
  'windsor': { lat: 51.4816, lng: -0.6044 },
  'witham': { lat: 51.8007, lng: 0.6424 },
  'witney': { lat: 51.7836, lng: -1.4854 },
  'worcester': { lat: 52.1936, lng: -2.2200 },
  'worthing': { lat: 50.8114, lng: -0.3725 },
  'wymondham': { lat: 52.5700, lng: 1.1180 },
  'yeovil': { lat: 50.9415, lng: -2.6320 },
  'york': { lat: 53.9600, lng: -1.0873 },

  // Gloucestershire locations
  'gloucester': { lat: 51.8642, lng: -2.2382 },
  'cheltenham': { lat: 51.8994, lng: -2.0783 },
  'stroud': { lat: 51.7450, lng: -2.2094 },
  'cirencester': { lat: 51.7197, lng: -1.9685 },
  'tewkesbury': { lat: 51.9923, lng: -2.1581 },
  'dursley': { lat: 51.6799, lng: -2.3549 },
  'cinderford': { lat: 51.8226, lng: -2.4990 },
  'chipping campden': { lat: 52.0411, lng: -1.7811 },
  'thornbury': { lat: 51.6092, lng: -2.5199 },
  'wotton-under-edge': { lat: 51.6299, lng: -2.3489 },

  // Scottish locations
  'milngavie': { lat: 55.9423, lng: -4.3177 },
  'east dunbartonshire': { lat: 55.9423, lng: -4.3177 },
  'dunbartonshire': { lat: 55.9423, lng: -4.3177 },
  'stirling': { lat: 56.1165, lng: -3.9369 },
  'dundee': { lat: 56.4620, lng: -2.9707 },
  'aberdeen': { lat: 57.1497, lng: -2.0943 },
  'aberdeenshire': { lat: 57.1497, lng: -2.0943 },
  'aberfeldy': { lat: 56.6198, lng: -3.8661 },
  'aberfoyle': { lat: 56.1833, lng: -4.3833 },
  'aberystwyth': { lat: 52.4144, lng: -4.0819 },
  'aboyne': { lat: 57.0703, lng: -2.7889 },
  'alloa': { lat: 56.1156, lng: -3.7894 },
  'ayr': { lat: 55.4639, lng: -4.6289 },
  'carradale': { lat: 55.5876, lng: -5.4969 },
  'castle douglas': { lat: 54.9404, lng: -3.9269 },
  'cumbernauld': { lat: 55.9468, lng: -3.9963 },
  'dumfries': { lat: 55.0709, lng: -3.6036 },
  'east kilbride': { lat: 55.7645, lng: -4.1675 },
  'falkirk': { lat: 56.0019, lng: -3.7841 },
  'findhorn': { lat: 57.6533, lng: -3.6000 },
  'greenock': { lat: 55.9485, lng: -4.7692 },
  'hamilton': { lat: 55.7781, lng: -4.0589 },
  'inverness': { lat: 57.4778, lng: -4.2247 },
  'johnstone': { lat: 55.8356, lng: -4.5050 },
  'kilmarnock': { lat: 55.6144, lng: -4.4985 },
  'leith': { lat: 55.9763, lng: -3.1681 },
  'leven': { lat: 56.1933, lng: -3.0000 },
  'paisley': { lat: 55.8456, lng: -4.4337 },
  'perth': { lat: 56.3952, lng: -3.4304 },
  'stranraer': { lat: 54.9063, lng: -5.0286 },

  // Welsh locations
  'swansea': { lat: 51.6214, lng: -3.9436 },
  'newport': { lat: 51.5842, lng: -2.9977 },
  'wrexham': { lat: 53.0478, lng: -2.9916 },
  'bangor': { lat: 53.2280, lng: -4.1287 },
  'bridgwater': { lat: 51.1279, lng: -3.0045 },
  'cwmgors': { lat: 51.7833, lng: -3.8167 },
  'glynneath': { lat: 51.7281, lng: -3.6281 },
  'pontypridd': { lat: 51.6014, lng: -3.3428 },

  // Northern Ireland locations
  'derry': { lat: 54.9966, lng: -7.3086 },
  'londonderry': { lat: 54.9966, lng: -7.3086 },
  'lisburn': { lat: 54.5162, lng: -6.0581 },
  'lurgan': { lat: 54.4600, lng: -6.3378 },
  'portadown': { lat: 54.4231, lng: -6.4378 },

  // Counties and regions
  'cheshire': { lat: 53.2000, lng: -2.6000 },
  'cornwall': { lat: 50.4000, lng: -4.9000 },
  'devon': { lat: 50.7000, lng: -3.8000 },
  'dorset': { lat: 50.7000, lng: -2.3000 },
  'east sussex': { lat: 50.9000, lng: 0.2000 },
  'west sussex': { lat: 50.9000, lng: -0.4000 },
  'essex': { lat: 51.7500, lng: 0.4500 },
  'hampshire': { lat: 51.0000, lng: -1.3000 },
  'hertfordshire': { lat: 51.8000, lng: -0.2000 },
  'kent': { lat: 51.2500, lng: 0.7500 },
  'lancashire': { lat: 53.8000, lng: -2.6000 },
  'leicestershire': { lat: 52.6000, lng: -1.2000 },
  'lincolnshire': { lat: 53.0000, lng: -0.5000 },
  'norfolk': { lat: 52.6000, lng: 1.0000 },
  'northumberland': { lat: 55.2000, lng: -2.0000 },
  'oxfordshire': { lat: 51.8000, lng: -1.3000 },
  'somerset': { lat: 51.1000, lng: -3.0000 },
  'suffolk': { lat: 52.2000, lng: 1.0000 },
  'surrey': { lat: 51.3000, lng: -0.5000 },
  'warwickshire': { lat: 52.3000, lng: -1.6000 },
  'wiltshire': { lat: 51.3000, lng: -2.0000 },
  'worcestershire': { lat: 52.2000, lng: -2.3000 },
  'yorkshire': { lat: 54.0000, lng: -1.5000 },
  'north yorkshire': { lat: 54.2000, lng: -1.8000 },
  'west yorkshire': { lat: 53.7000, lng: -1.8000 },
  'south yorkshire': { lat: 53.4000, lng: -1.3000 },
  'east yorkshire': { lat: 53.8000, lng: -0.4000 },
  'east riding': { lat: 53.8000, lng: -0.4000 },
  'east riding of yorkshire': { lat: 53.8000, lng: -0.4000 },
  'greater manchester': { lat: 53.4800, lng: -2.2426 },
  'merseyside': { lat: 53.4000, lng: -2.9000 },
  'tyne and wear': { lat: 54.9000, lng: -1.6000 },
  'west midlands': { lat: 52.5000, lng: -2.0000 },
  'east midlands': { lat: 52.8000, lng: -1.0000 },
  'midlands': { lat: 52.5000, lng: -1.5000 },
  'south west': { lat: 51.0000, lng: -3.0000 },
  'south east': { lat: 51.2000, lng: 0.0000 },
  'north west': { lat: 54.0000, lng: -2.5000 },
  'north east': { lat: 55.0000, lng: -1.5000 },
  'wales': { lat: 52.1307, lng: -3.7837 },
  'scotland': { lat: 56.4907, lng: -4.2026 },
  'northern ireland': { lat: 54.7877, lng: -6.4923 },
  'east ayrshire': { lat: 55.4500, lng: -4.3000 },
  'fife': { lat: 56.2000, lng: -3.2000 },
  'tayside': { lat: 56.5000, lng: -3.0000 },
  'lothian': { lat: 55.9000, lng: -3.2000 },
  'county down': { lat: 54.3000, lng: -5.8000 },
  'gloucestershire': { lat: 51.8000, lng: -2.2000 },

  // Virtual/remote locations — explicitly null, never geocoded
  'online': null,
  'remote': null,
  'uk wide': null,
  'uk-wide': null,
  'nationwide': null,
  'virtual': null,
  'global': null,
  'international': null,
};

/**
 * Matches a free-text UK location string against the dictionary: exact match first, then
 * longest-name-first partial substring match, then whole-word match. Returns null if nothing
 * matches or the location is an explicitly virtual one (remote/online/UK-wide/etc).
 */
function getLocationCoordinates(locationName) {
  if (!locationName || !locationName.trim()) return null;

  const key = locationName.toLowerCase().trim();

  if (Object.prototype.hasOwnProperty.call(UK_LOCATIONS, key)) {
    return UK_LOCATIONS[key];
  }

  const namesByLengthDesc = Object.keys(UK_LOCATIONS).sort((a, b) => b.length - a.length);
  for (const name of namesByLengthDesc) {
    const coords = UK_LOCATIONS[name];
    if (coords !== null && key.includes(name)) return coords;
  }

  const words = key.split(/[\s,]+/);
  for (const word of words) {
    if (word.length > 2 && Object.prototype.hasOwnProperty.call(UK_LOCATIONS, word)) {
      const coords = UK_LOCATIONS[word];
      if (coords !== null) return coords;
    }
  }

  return null;
}

const VIRTUAL_LOCATIONS = new Set(['online', 'remote', 'uk wide', 'uk-wide', 'nationwide', 'virtual', 'global', 'international']);

function isVirtualLocation(locationName) {
  return VIRTUAL_LOCATIONS.has(String(locationName || '').toLowerCase().trim());
}

// Live Google Geocoding API call, used as a supplement for real places this dictionary doesn't
// cover (small towns like Riddlesden/Halesowen) — the ~250-entry dictionary is checked first
// since it's instant and doesn't spend API quota; only genuinely unmatched locations fall
// through to a live lookup. Explicitly virtual locations (remote/online/UK-wide/etc) short-
// circuit to null before ever reaching either path — geocoding "Remote" isn't meaningful, and
// resolving it live risked matching some unrelated real place that happens to share the name.
// With `components=country:GB` as a filter, Google's Geocoding API doesn't return
// ZERO_RESULTS for nonsense input the way you'd expect — it falls back to matching the
// country itself ("United Kingdom"), which would otherwise read as a false-positive "yes,
// recognized" for garbage text. Reject anything that resolves to just the country (or has no
// more specific type at all) rather than an actual place within it.
function isTooBroadMatch(result) {
  const types = result?.types || [];
  if (types.length === 0) return true;
  if (types.includes('country')) return true;
  return false;
}

async function geocodeViaGoogle(locationName) {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&region=uk&components=country:GB&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' && data.results?.[0] && !isTooBroadMatch(data.results[0])) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address || null,
      };
    }
    if (data.status !== 'ZERO_RESULTS') {
      console.error(`❌ Geocoding API returned ${data.status} for "${locationName}": ${data.error_message || ''}`);
    }
  } catch (err) {
    console.error(`❌ Geocoding API request failed for "${locationName}":`, err.message);
  }

  return null;
}

async function getLocationCoordinatesLive(locationName) {
  if (!locationName || !locationName.trim()) return null;
  if (isVirtualLocation(locationName)) return null;

  const dictionaryMatch = getLocationCoordinates(locationName);
  if (dictionaryMatch) return dictionaryMatch;

  const live = await geocodeViaGoogle(locationName);
  return live ? { lat: live.lat, lng: live.lng } : null;
}

// Same lookup order as getLocationCoordinatesLive(), but returns a richer result for the
// editor's live "is this location recognized" check — includes Google's own formatted address
// when a live lookup resolves it (e.g. "Salford, Greater Manchester, UK"), so a copywriter gets
// the same kind of confirmation the real portal's own address picker shows, without needing a
// full map widget.
async function checkLocationRecognition(locationName) {
  if (!locationName || !locationName.trim()) {
    return { recognized: false, isVirtual: false, source: null, formattedAddress: null };
  }
  if (isVirtualLocation(locationName)) {
    return { recognized: true, isVirtual: true, source: 'virtual', formattedAddress: null };
  }

  const dictionaryMatch = getLocationCoordinates(locationName);
  if (dictionaryMatch) {
    return { recognized: true, isVirtual: false, source: 'dictionary', formattedAddress: null };
  }

  const live = await geocodeViaGoogle(locationName);
  if (live) {
    return { recognized: true, isVirtual: false, source: 'live', formattedAddress: live.formattedAddress };
  }

  return { recognized: false, isVirtual: false, source: null, formattedAddress: null };
}

module.exports = { getLocationCoordinates, getLocationCoordinatesLive, checkLocationRecognition };
