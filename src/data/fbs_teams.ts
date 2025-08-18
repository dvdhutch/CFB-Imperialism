export type FbsTeamRecord = {
  id: string;
  name: string;
  mascot: string;
  location: { lat: number; lon: number } | null; // stadium lat/lon
  city: string;
  state: string;
  stadium: string;
  stadiumCapacity: number | null;
  conference: string;
  imageUrl: string;
  logoUrl: string;
  colorHex: string;
};



function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\(fl\)/g, '-fl') // Keep (FL) distinction for Miami
    .replace(/\(oh\)/g, '-oh') // Keep (OH) distinction for Miami
    .replace(/\([^)]*\)/g, '') // drop other parentheticals
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Conference logo URLs mapping
export const CONFERENCE_LOGOS: Record<string, string> = {
  'ACC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Atlantic_Coast_Conference_logo.svg/2880px-Atlantic_Coast_Conference_logo.svg.png',
  'Big Ten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Big_Ten_Conference_logo.svg/2880px-Big_Ten_Conference_logo.svg.png',
  'SEC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Southeastern_Conference_logo_%282024%29.svg/1920px-Southeastern_Conference_logo_%282024%29.svg.png',
  'Big 12': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Big_12_Conference_%28cropped%29_logo.svg/2560px-Big_12_Conference_%28cropped%29_logo.svg.png',
  'Pac-12': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/Pac-12_logo.svg/1024px-Pac-12_logo.svg.png',
  'AAC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/American_Athletic_Conference_logo.svg/1280px-American_Athletic_Conference_logo.svg.png',
  'Mountain West': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Mountain_West_Conference_logo.svg/1280px-Mountain_West_Conference_logo.svg.png',
  'MAC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Mid-American_Conference_logo.svg/1280px-Mid-American_Conference_logo.svg.png',
  'Sun Belt': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Sun_Belt_Conference_2020_logo_and_name.svg/2880px-Sun_Belt_Conference_2020_logo_and_name.svg.png',
  'Conference USA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/CUSA_logo.svg/2880px-CUSA_logo.svg.png',
  'Independent': 'https://upload.wikimedia.org/wikipedia/en/6/68/NCAA_Division_I_FBS_independent_schools_logo.png'
};

// Authoritative 2025 FBS list (136 schools)
const FBS_TEAM_NAMES_2025: string[] = [
  // ACC (17)
  'Boston College','Clemson','Duke','Florida State','Georgia Tech','Louisville','Miami (FL)','NC State','North Carolina','Pittsburgh','Syracuse','Virginia','Virginia Tech','Wake Forest','California','Stanford','SMU',
  // Big Ten (18)
  'Illinois','Indiana','Iowa','Maryland','Michigan','Michigan State','Minnesota','Nebraska','Northwestern','Ohio State','Penn State','Purdue','Rutgers','Wisconsin','Oregon','UCLA','USC','Washington',
  // SEC (16)
  'Alabama','Arkansas','Auburn','Florida','Georgia','Kentucky','LSU','Mississippi State','Missouri','Ole Miss','South Carolina','Tennessee','Texas','Texas A&M','Vanderbilt','Oklahoma',
  // Big 12 (16)
  'Baylor','BYU','Cincinnati','Houston','Iowa State','Kansas','Kansas State','Oklahoma State','TCU','Texas Tech','UCF','West Virginia','Arizona','Arizona State','Colorado','Utah',
  // Pac-12 (2)
  'Oregon State','Washington State',
  // AAC (14)
  'Charlotte','East Carolina','Florida Atlantic','Memphis','Navy','North Texas','Rice','South Florida','UAB','Tulsa','Tulane','Temple','UTSA','Army',
  // Mountain West (12)
  'Air Force','Boise State','Colorado State','Fresno State','Hawaiʻi','Nevada','New Mexico','San Diego State','San José State','UNLV','Utah State','Wyoming',
  // MAC (12)
  'Akron','Ball State','Bowling Green','Buffalo','Central Michigan','Eastern Michigan','Kent State','Miami (OH)','Northern Illinois','Ohio','Toledo', 'UMass','Western Michigan',
  // Sun Belt (14)
  'Appalachian State','Arkansas State','Coastal Carolina','Georgia Southern','Georgia State','James Madison','Louisiana','Louisiana-Monroe','Marshall','Old Dominion','South Alabama','Southern Miss','Texas State','Troy',
  // Conference USA (12 in 2025 including Delaware, Missouri State)
  'FIU','Jacksonville State','Liberty','Louisiana Tech','Middle Tennessee','New Mexico State','Sam Houston','UTEP','Western Kentucky','Kennesaw State','Delaware','Missouri State',
  // Independents (3)
  'Notre Dame','UConn'
];

// Build array of objects and sort alphabetically by school name
const baseTeams: FbsTeamRecord[] = FBS_TEAM_NAMES_2025.map((name) => ({
  id: slugify(name),
  name,
  mascot: '',
  location: null,
  city: '',
  state: '',
  stadium: '',
  stadiumCapacity: null,
  conference: '',
  imageUrl: '',
  logoUrl: '',
  colorHex: '',
})).sort((a, b) => a.name.localeCompare(b.name));

// Fill comprehensive dataset for all 136 FBS teams
export const FBS_TEAMS: FbsTeamRecord[] = baseTeams.map((t) => {
  if (t.name === 'Air Force') {
    return { ...t, mascot: 'Falcons', location: { lat: 38.997, lon: -104.843 }, city: 'Colorado Springs', state: 'Colorado', stadium: 'Falcon Stadium', stadiumCapacity: 39441, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Air_Force_Academy_Stadium.jpg/2880px-Air_Force_Academy_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Air_Force_Falcons_logo.svg/1920px-Air_Force_Falcons_logo.svg.png', colorHex: '#0059f2' };
  }
  if (t.name === 'Akron') {
    return { ...t, mascot: 'Zips', location: { lat: 41.072347, lon: -81.508019 }, city: 'Akron', state: 'Ohio', stadium: 'InfoCision Stadium–Summa Field', stadiumCapacity: 30000, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/InfoCision_opening_day2.JPG/1920px-InfoCision_opening_day2.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Akron_Zips_2022_A_icon_football_blue-gold.svg/1920px-Akron_Zips_2022_A_icon_football_blue-gold.svg.png', colorHex: '#083f8a' };
  }
  if (t.name === 'Alabama') {
    return { ...t, mascot: 'Crimson Tide', location: { lat: 33.208333, lon: -87.550278 }, city: 'Tuscaloosa', state: 'Alabama', stadium: 'Bryant–Denny Stadium', stadiumCapacity: 100077, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Bryant-Denny_10-22-11.jpg/2880px-Bryant-Denny_10-22-11.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Alabama_Athletics_logo.svg/1920px-Alabama_Athletics_logo.svg.png', colorHex: '#e66c82' };
  }
  if (t.name === 'Appalachian State') {
    return { ...t, mascot: 'Mountaineers', location: { lat: 36.211667, lon: -81.685556 }, city: 'Boone', state: 'North Carolina', stadium: 'Kidd Brewer Stadium', stadiumCapacity: 30000, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/KiddBrewerStadium%28ViewFromSE%29.jpg/2560px-KiddBrewerStadium%28ViewFromSE%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Appalachian_State_Mountaineers_logo.svg/1280px-Appalachian_State_Mountaineers_logo.svg.png', colorHex: '#262626' };
  }
  if (t.name === 'Arizona') {
    return { ...t, mascot: 'Wildcats', location: { lat: 32.229, lon: -110.949 }, city: 'Tucson', state: 'Arizona', stadium: 'Arizona Stadium', stadiumCapacity: 56029, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Arizona_Stadium_Fisheye.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Arizona_Wildcats_logo.svg/1920px-Arizona_Wildcats_logo.svg.png', colorHex: '#f5072e' };
  }
  if (t.name === 'Arizona State') {
    return { ...t, mascot: 'Sun Devils', location: { lat: 33.426389, lon: -111.9325 }, city: 'Tempe', state: 'Arizona', stadium: 'Mountain America Stadium', stadiumCapacity: 56232, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/2021_Sun_Devil_Stadium_%28pano%29.jpg/2880px-2021_Sun_Devil_Stadium_%28pano%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Arizona_State_Sun_Devils_logo.svg/1200px-Arizona_State_Sun_Devils_logo.svg.png', colorHex: '#cb2a5d' };
  }
  if (t.name === 'Arkansas') {
    return { ...t, mascot: 'Razorbacks', location: { lat: 36.068056, lon: -94.178889}, city: 'Fayetteville', state: 'Arkansas', stadium: 'Donald W. Reynolds Razorback Stadium', stadiumCapacity: 76212, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Hog_call.jpg/1920px-Hog_call.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/30/Arkansas_razorbacks_logo.png', colorHex: '#d43850' };
  }
  if (t.name === 'Arkansas State') {
    return { ...t, mascot: 'Red Wolves', location: { lat: 35.848889, lon: -90.667222}, city: 'Jonesboro', state: 'Arkansas', stadium: 'Centennial Bank Stadium', stadiumCapacity: 30964, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Centennial_Bank_Stadium.jpg/1920px-Centennial_Bank_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Arkansas_State_Red_Wolves_wordmark.svg/1920px-Arkansas_State_Red_Wolves_wordmark.svg.png', colorHex: '#ef4e6e' };
  }
  if (t.name === 'Army') {
    return { ...t, mascot: 'Black Knights', location: { lat: 41.3875, lon: -73.964167}, city: 'West Point', state: 'New York', stadium: 'Michie Stadium', stadiumCapacity: 38000, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Michie_Stadium_West.jpg/1920px-Michie_Stadium_West.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Army_West_Point_logo.svg/1280px-Army_West_Point_logo.svg.png', colorHex: '#cdc29c' };
  }
  if (t.name === 'Auburn') {
    return { ...t, mascot: 'Tigers', location: { lat: 32.602222, lon: -85.489167 }, city: 'Auburn', state: 'Alabama', stadium: 'Jordan-Hare Stadium', stadiumCapacity: 88043, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pregame_warmups_at_Jordan-Hare_Stadium%2C_Auburn_%28December_19%2C_2006%29.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Auburn_Tigers_logo.svg/1920px-Auburn_Tigers_logo.svg.png', colorHex: '#184680' };
  }
  if (t.name === 'Ball State') {
    return { ...t, mascot: 'Cardinals', location: { lat: 40.2011, lon: -85.4106 }, city: 'Muncie', state: 'Indiana', stadium: 'Scheumann Stadium', stadiumCapacity: 22500, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Scheumann_Stadium_2.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Ball_State_Cardinals_logo.svg/1200px-Ball_State_Cardinals_logo.svg.png', colorHex: '#ff1a1a' };
  }
  if (t.name === 'Baylor') {
    return { ...t, mascot: 'Bears', location: { lat: 31.5513, lon: -97.1114 }, city: 'Waco', state: 'Texas', stadium: 'McLane Stadium', stadiumCapacity: 45140, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/McLane_Stadium_facingsouth7.16.14.jpg/1920px-McLane_Stadium_facingsouth7.16.14.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Baylor_Athletics_logo.svg/1280px-Baylor_Athletics_logo.svg.png', colorHex: '#007d36' };
  }
  if (t.name === 'Boise State') {
    return { ...t, mascot: 'Broncos', location: { lat: 43.6059, lon: -116.1975 }, city: 'Boise', state: 'Idaho', stadium: 'Albertsons Stadium', stadiumCapacity: 36387, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/BSUvsFresnoSt.jpg/1920px-BSUvsFresnoSt.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Primary_Boise_State_Broncos_Athletics_Logo.svg/1200px-Primary_Boise_State_Broncos_Athletics_Logo.svg.png', colorHex: '#004bed' };
  }
  if (t.name === 'Boston College') {
    return { ...t, mascot: 'Eagles', location: { lat: 42.3355, lon: -71.1685 }, city: 'Newton', state: 'Massachusetts', stadium: 'Alumni Stadium', stadiumCapacity: 44500, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Alumni_Stadium_Boston_College_2023_%28Quintin_Soloviev%29.png/1920px-Alumni_Stadium_Boston_College_2023_%28Quintin_Soloviev%29.png', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/96/Boston_College_Eagles_logo.svg', colorHex: '#d80000' };
  }
  if (t.name === 'Bowling Green') {
    return { ...t, mascot: 'Falcons', location: { lat: 41.3648, lon: -83.6348 }, city: 'Bowling Green', state: 'Ohio', stadium: 'Doyt Perry Stadium', stadiumCapacity: 24000, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Kent_State_BG_2012.JPG/1920px-Kent_State_BG_2012.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Bowling_Green_Falcons_logo.svg/640px-Bowling_Green_Falcons_logo.svg.png', colorHex: '#ff944d' };
  }
  if (t.name === 'Buffalo') {
    return { ...t, mascot: 'Bulls', location: { lat: 43.0011, lon: -78.7865 }, city: 'Amherst', state: 'New York', stadium: 'UB Stadium', stadiumCapacity: 25013, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/UB_Stadium_2_picture.JPG/1920px-UB_Stadium_2_picture.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Buffalo_Bulls_Athletic_Logo.svg', colorHex: '#0880ff' };
  }
  if (t.name === 'BYU') {
    return { ...t, mascot: 'Cougars', location: { lat: 40.2518, lon: -111.6493 }, city: 'Provo', state: 'Utah', stadium: 'LaVell Edwards Stadium', stadiumCapacity: 63470, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/09-18-04k.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/BYU_Stretch_Y_Logo.png', colorHex: '#000811' };
  }
  if (t.name === 'California') {
    return { ...t, mascot: 'Golden Bears', location: { lat: 37.8719, lon: -122.2507 }, city: 'Berkeley', state: 'California', stadium: 'California Memorial Stadium', stadiumCapacity: 62717, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/CaliforniaMemorialStadium.JPG/1920px-CaliforniaMemorialStadium.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/California_Golden_Bears_logo.svg/800px-California_Golden_Bears_logo.svg.png', colorHex: '#fbff51' };
  }
  if (t.name === 'Central Michigan') {
    return { ...t, mascot: 'Chippewas', location: { lat: 43.5983, lon: -84.7692 }, city: 'Mount Pleasant', state: 'Michigan', stadium: 'Kelly/Shorts Stadium', stadiumCapacity: 30255, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Kelly_Shorts_Stadium.jpg/1920px-Kelly_Shorts_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Central_Michigan_Chippewas_logo.svg', colorHex: '#c70029' };
  }
  if (t.name === 'Charlotte') {
    return { ...t, mascot: '49ers', location: { lat: 35.3081, lon: -80.7340 }, city: 'Charlotte', state: 'North Carolina', stadium: 'Jerry Richardson Stadium', stadiumCapacity: 15314, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/JRS_Entrance_3.jpg/2560px-JRS_Entrance_3.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Charlotte_49ers_logo.svg/1200px-Charlotte_49ers_logo.svg.png', colorHex: '#07b45f' };
  }
  if (t.name === 'Cincinnati') {
    return { ...t, mascot: 'Bearcats', location: { lat: 39.1329, lon: -84.5150 }, city: 'Cincinnati', state: 'Ohio', stadium: 'Nippert Stadium', stadiumCapacity: 38088, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nippert_Stadium%2C_September_2015.JPG/2880px-Nippert_Stadium%2C_September_2015.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Cincinnati_Bearcats_logo.svg/655px-Cincinnati_Bearcats_logo.svg.png', colorHex: '#fe2f4e' };
  }
  if (t.name === 'Clemson') {
    return { ...t, mascot: 'Tigers', location: { lat: 34.6781, lon: -82.8473 }, city: 'Clemson', state: 'South Carolina', stadium: 'Memorial Stadium', stadiumCapacity: 81500, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/MemorialStadiumSept2006.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Clemson_Tigers_logo.svg/1200px-Clemson_Tigers_logo.svg.png', colorHex: '#ff9143' };
  }
  if (t.name === 'Coastal Carolina') {
    return { ...t, mascot: 'Chanticleers', location: { lat: 33.7969, lon: -79.0075 }, city: 'Conway', state: 'South Carolina', stadium: 'Brooks Stadium', stadiumCapacity: 20000, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/CoastalBrooksStad2.jpg/1920px-CoastalBrooksStad2.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Coastal_Carolina_Chanticleers_logo.svg/800px-Coastal_Carolina_Chanticleers_logo.svg.png', colorHex: '#00b786' };
  }
  if (t.name === 'Colorado') {
    return { ...t, mascot: 'Buffaloes', location: { lat: 40.0095, lon: -105.2669 }, city: 'Boulder', state: 'Colorado', stadium: 'Folsom Field', stadiumCapacity: 50183, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Folsom_field.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Colorado_Buffaloes_logo.svg/800px-Colorado_Buffaloes_logo.svg.png', colorHex: '#e4d6b4' };
  }
  if (t.name === 'Colorado State') {
    return { ...t, mascot: 'Rams', location: { lat: 40.5748, lon: -105.0906 }, city: 'Fort Collins', state: 'Colorado', stadium: 'Canvas Stadium', stadiumCapacity: 41200, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Canvas_Stadium_2021.jpg/1920px-Canvas_Stadium_2021.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/14/Colorado_State_Rams_logo.svg/1200px-Colorado_State_Rams_logo.svg.png', colorHex: '#33844a' };
  }
  if (t.name === 'Delaware') {
    return { ...t, mascot: 'Blue Hens', location: { lat: 39.6726, lon: -75.7467 }, city: 'Newark', state: 'Delaware', stadium: 'Delaware Stadium', stadiumCapacity: 18309, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Delaware_Stadium_in_2023.jpg/2560px-Delaware_Stadium_in_2023.jpg', logoUrl: 'https://1000logos.net/wp-content/uploads/2022/01/Delaware-Blue-Hens-Logo-2009.png', colorHex: '#007bec' };
  }
  if (t.name === 'Duke') {
    return { ...t, mascot: 'Blue Devils', location: { lat: 36.0014, lon: -78.9382 }, city: 'Durham', state: 'North Carolina', stadium: 'Wallace Wade Stadium', stadiumCapacity: 35018, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Wallace_Wade_Stadium_2018_panoramic.jpg/2880px-Wallace_Wade_Stadium_2018_panoramic.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Duke_Athletics_logo.svg/1200px-Duke_Athletics_logo.svg.png', colorHex: '#00153b' };
  }
  if (t.name === 'East Carolina') {
    return { ...t, mascot: 'Pirates', location: { lat: 35.6059, lon: -77.3664 }, city: 'Greenville', state: 'North Carolina', stadium: 'Dowdy-Ficklen Stadium', stadiumCapacity: 51000, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/UAB_at_ECU_football_game_2009-11-21.JPG/2560px-UAB_at_ECU_football_game_2009-11-21.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/East_Carolina_Pirates_logo.svg/1200px-East_Carolina_Pirates_logo.svg.png', colorHex: '#7f3dc4' };
  }
  if (t.name === 'Eastern Michigan') {
    return { ...t, mascot: 'Eagles', location: { lat: 42.2459, lon: -83.6278 }, city: 'Ypsilanti', state: 'Michigan', stadium: 'Rynearson Stadium', stadiumCapacity: 30200, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/WaltDrone4_081524.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Eastern_Michigan_Eagles_logo.svg/1200px-Eastern_Michigan_Eagles_logo.svg.png', colorHex: '#00b359' };
  }
  if (t.name === 'FIU') {
    return { ...t, mascot: 'Panthers', location: { lat: 25.7563, lon: -80.3733 }, city: 'Miami', state: 'Florida', stadium: 'Pitbull Stadium', stadiumCapacity: 23500, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/FIU_Stadium%2C_October_13%2C_2012.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/FIU_Panthers_logo.svg/1200px-FIU_Panthers_logo.svg.png', colorHex: '#113e83' };
  }
  if (t.name === 'Florida') {
    return { ...t, mascot: 'Gators', location: { lat: 29.6499, lon: -82.3486 }, city: 'Gainesville', state: 'Florida', stadium: 'Ben Hill Griffin Stadium', stadiumCapacity: 88548, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/BenHillGriffinStadium.png/2560px-BenHillGriffinStadium.png', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/14/Florida_Gators_gator_logo.svg/1200px-Florida_Gators_gator_logo.svg.png', colorHex: '#0021A5' };
  }
  if (t.name === 'Florida Atlantic') {
    return { ...t, mascot: 'Owls', location: { lat: 26.3781, lon: -80.1018 }, city: 'Boca Raton', state: 'Florida', stadium: 'Flagler Credit Union Stadium', stadiumCapacity: 30000, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/FAUStadium_night.jpg/1920px-FAUStadium_night.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Florida_Atlantic_Owls_logo.svg/1200px-Florida_Atlantic_Owls_logo.svg.png', colorHex: '#ef3654' };
  }
  if (t.name === 'Florida State') {
    return { ...t, mascot: 'Seminoles', location: { lat: 30.4374, lon: -84.3048 }, city: 'Tallahassee', state: 'Florida', stadium: 'Doak S. Campbell Stadium', stadiumCapacity: 79560, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Doak_Campbell_Stadium_fireworks.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Florida_State_Seminoles_logo.svg/1200px-Florida_State_Seminoles_logo.svg.png', colorHex: '#782F40' };
  }
  if (t.name === 'Fresno State') {
    return { ...t, mascot: 'Bulldogs', location: { lat: 36.8137, lon: -119.7462 }, city: 'Fresno', state: 'California', stadium: 'Valley Children\'s Stadium', stadiumCapacity: 41031, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Fresno_State_Jim_Sweeny_Field_%28_Bulldog_Stadium%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Fresno_State_Bulldogs_logo.svg/1200px-Fresno_State_Bulldogs_logo.svg.png', colorHex: '#C8102E' };
  }
  if (t.name === 'Georgia') {
    return { ...t, mascot: 'Bulldogs', location: { lat: 33.9496, lon: -83.3704 }, city: 'Athens', state: 'Georgia', stadium: 'Sanford Stadium', stadiumCapacity: 92746, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/UGA_vs._Notre_Dame_2019_%28Cropped%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Georgia_Athletics_logo.svg/640px-Georgia_Athletics_logo.svg.png', colorHex: '#f1224b' };
  }
  if (t.name === 'Georgia Southern') {
    return { ...t, mascot: 'Eagles', location: { lat: 32.4249, lon: -81.7832 }, city: 'Statesboro', state: 'Georgia', stadium: 'Paulson Stadium', stadiumCapacity: 25000, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Expanded_Paulson_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Georgia_Southern_Eagles_logo.svg/1200px-Georgia_Southern_Eagles_logo.svg.png', colorHex: '#041E42' };
  }
  if (t.name === 'Georgia State') {
    return { ...t, mascot: 'Panthers', location: { lat: 33.7490, lon: -84.3880 }, city: 'Atlanta', state: 'Georgia', stadium: 'Center Parc Stadium', stadiumCapacity: 25000, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Georgia_State_Stadium_field.jpg/1920px-Georgia_State_Stadium_field.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Georgia_State_Athletics_logo.svg', colorHex: '#0039A6' };
  }
  if (t.name === 'Georgia Tech') {
    return { ...t, mascot: 'Yellow Jackets', location: { lat: 33.7729, lon: -84.3920 }, city: 'Atlanta', state: 'Georgia', stadium: 'Bobby Dodd Stadium', stadiumCapacity: 55000, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/BobbyDoddStadiumGTMiami2008.jpg/2880px-BobbyDoddStadiumGTMiami2008.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Georgia_Tech_Yellow_Jackets_logo.svg/1200px-Georgia_Tech_Yellow_Jackets_logo.svg.png', colorHex: '#B3A369' };
  }
  if (t.name === 'Hawaiʻi') {
    return { ...t, mascot: 'Rainbow Warriors', location: { lat: 21.2969, lon: -157.8226 }, city: 'Honolulu', state: 'Hawaii', stadium: 'Clarence T.C. Ching Athletics Complex', stadiumCapacity: 16909, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Clarence_T.C._Ching_Athletics_Complex.jpg/2560px-Clarence_T.C._Ching_Athletics_Complex.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Hawaii_Warriors_logo.svg/1200px-Hawaii_Warriors_logo.svg.png', colorHex: '#024731' };
  }
  if (t.name === 'Houston') {
    return { ...t, mascot: 'Cougars', location: { lat: 29.7199, lon: -95.3422 }, city: 'Houston', state: 'Texas', stadium: 'TDECU Stadium', stadiumCapacity: 40000, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Night_panorama_of_TDECU_Stadium.JPG/2880px-Night_panorama_of_TDECU_Stadium.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Houston_Cougars_primary_logo.svg/1200px-Houston_Cougars_primary_logo.svg.png', colorHex: '#C8102E' };
  }
  if (t.name === 'Illinois') {
    return { ...t, mascot: 'Fighting Illini', location: { lat: 40.0956, lon: -88.2356 }, city: 'Champaign', state: 'Illinois', stadium: 'Memorial Stadium', stadiumCapacity: 60670, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Memorial_Stadium_ReDedication.jpg', logoUrl: 'https://brand.illinois.edu/wp-content/uploads/2025/02/Illinois_logo_fullcolor_%C2%AE_rgb.png', colorHex: '#E84A27' };
  }
  if (t.name === 'Indiana') {
    return { ...t, mascot: 'Hoosiers', location: { lat: 39.1837, lon: -86.5264 }, city: 'Bloomington', state: 'Indiana', stadium: 'Memorial Stadium', stadiumCapacity: 52959, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Memorial_Stadium_-_South_End_Zone_-_Complete.jpg/1920px-Memorial_Stadium_-_South_End_Zone_-_Complete.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Indiana_Hoosiers_logo.svg', colorHex: '#e60000' };
  }
  if (t.name === 'Iowa') {
    return { ...t, mascot: 'Hawkeyes', location: { lat: 41.6581, lon: -91.5506 }, city: 'Iowa City', state: 'Iowa', stadium: 'Kinnick Stadium', stadiumCapacity: 69250, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Kinnick_Night.jpg/1920px-Kinnick_Night.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Iowa_Hawkeyes_logo.svg/1200px-Iowa_Hawkeyes_logo.svg.png', colorHex: '#fffd00' };
  }
  if (t.name === 'Iowa State') {
    return { ...t, mascot: 'Cyclones', location: { lat: 42.0140, lon: -93.6357 }, city: 'Ames', state: 'Iowa', stadium: 'Jack Trice Stadium', stadiumCapacity: 61500, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Jack_Trice_Stadium%2C_daytime.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Iowa_State_Cyclones_logo.svg/1200px-Iowa_State_Cyclones_logo.svg.png', colorHex: '#C8102E' };
  }
  if (t.name === 'Jacksonville State') {
    return { ...t, mascot: 'Gamecocks', location: { lat: 33.8200, lon: -85.7714 }, city: 'Jacksonville', state: 'Alabama', stadium: 'AmFirst Stadium', stadiumCapacity: 22500, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Burgess%E2%80%93Snow_Field_at_AmFirst_Stadium%2C_September_2015.jpg/2560px-Burgess%E2%80%93Snow_Field_at_AmFirst_Stadium%2C_September_2015.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Jacksonville_State_Gamecocks_wordmark.svg/2880px-Jacksonville_State_Gamecocks_wordmark.svg.png', colorHex: '#DC143C' };
  }
  if (t.name === 'James Madison') {
    return { ...t, mascot: 'Dukes', location: { lat: 38.4335, lon: -78.8689 }, city: 'Harrisonburg', state: 'Virginia', stadium: 'Bridgeforth Stadium', stadiumCapacity: 24878, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/James_Madison_University_Football.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/James_Madison_University_Athletics_logo.svg/2880px-James_Madison_University_Athletics_logo.svg.png', colorHex: '#450084' };
  }
  if (t.name === 'Kansas') {
    return { ...t, mascot: 'Jayhawks', location: { lat: 38.9543, lon: -95.2558 }, city: 'Lawrence', state: 'Kansas', stadium: 'David Booth Kansas Memorial Stadium', stadiumCapacity: 50071, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/David_Booth_Kansas_Memorial_Stadium_aerial_view_2023_-_Quintin_Soloviev.jpg/1920px-David_Booth_Kansas_Memorial_Stadium_aerial_view_2023_-_Quintin_Soloviev.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kansas_Jayhawks_1946_logo.svg/1920px-Kansas_Jayhawks_1946_logo.svg.png', colorHex: '#0051BA' };
  }
  if (t.name === 'Kansas State') {
    return { ...t, mascot: 'Wildcats', location: { lat: 39.1950, lon: -96.5847 }, city: 'Manhattan', state: 'Kansas', stadium: 'Bill Snyder Family Football Stadium', stadiumCapacity: 50000, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Kansas_State_vs_Stephen_F._Austin.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Kansas_State_Wildcats_logo.svg/1200px-Kansas_State_Wildcats_logo.svg.png', colorHex: '#7439c3' };
  }
  if (t.name === 'Kent State') {
    return { ...t, mascot: 'Golden Flashes', location: { lat: 41.1504, lon: -81.3431 }, city: 'Kent', state: 'Ohio', stadium: 'Dix Stadium', stadiumCapacity: 25000, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/KSUDixStadium.JPG/2560px-KSUDixStadium.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Kent_State_athletic_logo.svg/1200px-Kent_State_athletic_logo.svg.png', colorHex: '#041E42' };
  }
  if (t.name === 'Kennesaw State') {
    return { ...t, mascot: 'Owls', location: { lat: 34.0362, lon: -84.5804 }, city: 'Kennesaw', state: 'Georgia', stadium: 'Fifth Third Stadium', stadiumCapacity: 10200, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fifth_Third_Bank_Stadium%2C_Kennesaw_State_University.JPG/2560px-Fifth_Third_Bank_Stadium%2C_Kennesaw_State_University.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Kennesaw_State_Owls_logo.svg/1920px-Kennesaw_State_Owls_logo.svg.png', colorHex: '#000000' };
  }
  if (t.name === 'Kentucky') {
    return { ...t, mascot: 'Wildcats', location: { lat: 38.0226, lon: -84.5041 }, city: 'Lexington', state: 'Kentucky', stadium: 'Kroger Field at C.M. Newton Grounds', stadiumCapacity: 61000, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Commonwealth_Stadium_of_Kentucky_-_Kentucky_Wildcats_v.s._Georgia_Bulldogs_-_SEC_football%2C_October_2012_%282012-10-20_by_Navin75%29.jpg/1920px-Commonwealth_Stadium_of_Kentucky_-_Kentucky_Wildcats_v.s._Georgia_Bulldogs_-_SEC_football%2C_October_2012_%282012-10-20_by_Navin75%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Kentucky_Wildcats_logo.svg/640px-Kentucky_Wildcats_logo.svg.png', colorHex: '#0033A0' };
  }
  if (t.name === 'Liberty') {
    return { ...t, mascot: 'Flames', location: { lat: 37.3518, lon: -79.1645 }, city: 'Lynchburg', state: 'Virginia', stadium: 'Arthur L. Williams Stadium', stadiumCapacity: 25000, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Williams_Stadium_Field.jpg/1920px-Williams_Stadium_Field.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Liberty_Flames_logo.svg/1200px-Liberty_Flames_logo.svg.png', colorHex: '#A71930' };
  }
  if (t.name === 'Louisiana') {
    return { ...t, mascot: 'Ragin\' Cajuns', location: { lat: 30.2081, lon: -92.0198 }, city: 'Lafayette', state: 'Louisiana', stadium: 'Cajun Field', stadiumCapacity: 41426, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Cajun_field_gameday.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/La-lafayette_logo_from_NCAA.svg/1200px-La-lafayette_logo_from_NCAA.svg.png', colorHex: '#CE181E' };
  }
  if (t.name === 'Louisiana Tech') {
    return { ...t, mascot: 'Bulldogs', location: { lat: 32.5248, lon: -92.6379 }, city: 'Ruston', state: 'Louisiana', stadium: 'Joe Aillet Stadium', stadiumCapacity: 28019, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Joe_Aillet_Stadium%2C_Louisiana_Tech_Bulldogs%2C_Ruston%2C_Louisiana.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Louisiana_Tech_Athletics_logo.svg/1200px-Louisiana_Tech_Athletics_logo.svg.png', colorHex: '#002D62' };
  }
  if (t.name === 'Louisiana-Monroe') {
    return { ...t, mascot: 'Warhawks', location: { lat: 32.5182, lon: -92.0781 }, city: 'Monroe', state: 'Louisiana', stadium: 'Malone Stadium', stadiumCapacity: 30427, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Malone_Stadium%2C_Monroe%2C_Louisiana_-_Home_Stands_interior_and_JPS_Field%2C_from_end_zone.jpg/1920px-Malone_Stadium%2C_Monroe%2C_Louisiana_-_Home_Stands_interior_and_JPS_Field%2C_from_end_zone.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/Louisiana-Monroe_Warhawks_logo.svg/1200px-Louisiana-Monroe_Warhawks_logo.svg.png', colorHex: '#d80000' };
  }
  if (t.name === 'Louisville') {
    return { ...t, mascot: 'Cardinals', location: { lat: 38.2098, lon: -85.7585 }, city: 'Louisville', state: 'Kentucky', stadium: 'L&N Federal Credit Union Stadium', stadiumCapacity: 61000, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Papa_John%27s_Cardinal_Stadium_after_expansion_in_2010.jpeg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Louisville_Cardinals_logo.svg/800px-Louisville_Cardinals_logo.svg.png', colorHex: '#AD0000' };
  }
  if (t.name === 'LSU') {
    return { ...t, mascot: 'Tigers', location: { lat: 30.4118, lon: -91.1834 }, city: 'Baton Rouge', state: 'Louisiana', stadium: 'Tiger Stadium', stadiumCapacity: 102321, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tiger_Stadium_%28LSU%29%2C_Fog_Rolling_In_vs._OU_%282%29.jpg/1920px-Tiger_Stadium_%28LSU%29%2C_Fog_Rolling_In_vs._OU_%282%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/LSU_Athletics_logo.svg/2560px-LSU_Athletics_logo.svg.png', colorHex: '#692cba' };
  }
  if (t.name === 'Marshall') {
    return { ...t, mascot: 'Thundering Herd', location: { lat: 38.4192, lon: -82.4229 }, city: 'Huntington', state: 'West Virginia', stadium: 'Joan C. Edwards Stadium', stadiumCapacity: 38019, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Panoramic_of_Joan_C._Edwards_Stadium.JPG/2880px-Panoramic_of_Joan_C._Edwards_Stadium.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Marshall_University_logo.svg/2560px-Marshall_University_logo.svg.png', colorHex: '#00B04F' };
  }
  if (t.name === 'Maryland') {
    return { ...t, mascot: 'Terrapins', location: { lat: 38.9907, lon: -76.9378 }, city: 'College Park', state: 'Maryland', stadium: 'SECU Stadium', stadiumCapacity: 51802, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Chevy_Chase_Field_at_Byrd_Stadium_9-13-08.jpg/2880px-Chevy_Chase_Field_at_Byrd_Stadium_9-13-08.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Maryland_Terrapins_logo.svg/1200px-Maryland_Terrapins_logo.svg.png', colorHex: '#E03A3E' };
  }
  if (t.name === 'Memphis') {
    return { ...t, mascot: 'Tigers', location: { lat: 35.1174, lon: -89.9711 }, city: 'Memphis', state: 'Tennessee', stadium: 'Simmons Bank Liberty Stadium', stadiumCapacity: 62380, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Uom_stadium.JPG/1920px-Uom_stadium.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Memphis_Tigers_logo.svg/1200px-Memphis_Tigers_logo.svg.png', colorHex: '#003087' };
  }
  if (t.name === 'Miami (OH)') {
    return { ...t, mascot: 'RedHawks', location: { lat: 39.5103, lon: -84.7394 }, city: 'Oxford', state: 'Ohio', stadium: 'Fred C. Yager Stadium', stadiumCapacity: 24286, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Muohiofootball.jpg/1920px-Muohiofootball.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Miami_Redhawks_logo.svg/2560px-Miami_Redhawks_logo.svg.png', colorHex: '#C8102E' };
  }
  if (t.name === 'Miami (FL)') {
    return { ...t, mascot: 'Hurricanes', location: { lat: 25.9580, lon: -80.2389 }, city: 'Miami Gardens', state: 'Florida', stadium: 'Hard Rock Stadium', stadiumCapacity: 65326, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/200127-H-PX819-0092.jpg/2560px-200127-H-PX819-0092.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Miami_Hurricanes_logo.svg/1200px-Miami_Hurricanes_logo.svg.png', colorHex: '#F47321' };
  }
  if (t.name === 'Michigan') {
    return { ...t, mascot: 'Wolverines', location: { lat: 42.2659, lon: -83.7485 }, city: 'Ann Arbor', state: 'Michigan', stadium: 'Michigan Stadium', stadiumCapacity: 107601, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Michigan_Stadium_2011.jpg/2560px-Michigan_Stadium_2011.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Michigan_Wolverines_logo.svg/1920px-Michigan_Wolverines_logo.svg.png', colorHex: '#00274C' };
  }
  if (t.name === 'Michigan State') {
    return { ...t, mascot: 'Spartans', location: { lat: 42.7284, lon: -84.4854 }, city: 'East Lansing', state: 'Michigan', stadium: 'Spartan Stadium', stadiumCapacity: 75005, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Spartan_Stadium_2014.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Michigan_State_Athletics_logo.svg/1200px-Michigan_State_Athletics_logo.svg.png', colorHex: '#2c7e6c' };
  }
  if (t.name === 'Middle Tennessee') {
    return { ...t, mascot: 'Blue Raiders', location: { lat: 35.8456, lon: -86.3903 }, city: 'Murfreesboro', state: 'Tennessee', stadium: 'Johnny "Red" Floyd Stadium', stadiumCapacity: 31000, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/MT_vs_Ga_Tech.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Middle_Tennessee_MT_Logomark.svg/1200px-Middle_Tennessee_MT_Logomark.svg.png', colorHex: '#0066CC' };
  }
  if (t.name === 'Minnesota') {
    return { ...t, mascot: 'Golden Gophers', location: { lat: 44.9762, lon: -93.2266 }, city: 'Minneapolis', state: 'Minnesota', stadium: 'Huntington Bank Stadium', stadiumCapacity: 50805, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/TCF_Bank_Stadium_opener.jpg/1920px-TCF_Bank_Stadium_opener.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Minnesota_Golden_Gophers_logo.svg/2560px-Minnesota_Golden_Gophers_logo.svg.png', colorHex: '#94001e' };
  }
  if (t.name === 'Mississippi State') {
    return { ...t, mascot: 'Bulldogs', location: { lat: 33.4551, lon: -88.7890 }, city: 'Mississippi State', state: 'Mississippi', stadium: 'Davis Wade Stadium', stadiumCapacity: 61337, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/DavisWadeStadiumExpansion.jpg/1920px-DavisWadeStadiumExpansion.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mississippi_State_Bulldogs_logo.svg/2560px-Mississippi_State_Bulldogs_logo.svg.png', colorHex: '#5D1725' };
  }
  if (t.name === 'Missouri') {
    return { ...t, mascot: 'Tigers', location: { lat: 38.9351, lon: -92.3370 }, city: 'Columbia', state: 'Missouri', stadium: 'Memorial Stadium', stadiumCapacity: 62621, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Faurot_Field_Aerial.jpg/2560px-Faurot_Field_Aerial.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/Missouri_Tigers_logo.svg/1200px-Missouri_Tigers_logo.svg.png', colorHex: '#F1B82D' };
  }
  if (t.name === 'Missouri State') {
    return { ...t, mascot: 'Bears', location: { lat: 37.1940, lon: -93.2923 }, city: 'Springfield', state: 'Missouri', stadium: 'Robert W. Plaster Stadium', stadiumCapacity: 17500, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Robert_W._Plaster_Stadium%2C_Missouri_Stste_University%2C_aerial.jpg', logoUrl: 'https://greatjobskc.org/wp-content/uploads/2024/05/Missouri-State-Bears-logo.png', colorHex: '#9a263d' };
  }
  if (t.name === 'Navy') {
    return { ...t, mascot: 'Midshipmen', location: { lat: 38.9826, lon: -76.4951 }, city: 'Annapolis', state: 'Maryland', stadium: 'Navy-Marine Corps Memorial Stadium', stadiumCapacity: 34000, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/2005_Stanford-Navy_Game_at_Navy-Marine_Corps_Memorial_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Navy_Athletics_logo.svg/1280px-Navy_Athletics_logo.svg.png', colorHex: '#000080' };
  }
  if (t.name === 'NC State') {
    return { ...t, mascot: 'Wolfpack', location: { lat: 35.7873, lon: -78.6926 }, city: 'Raleigh', state: 'North Carolina', stadium: 'Carter-Finley Stadium', stadiumCapacity: 57583, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Carter-Finley_Stadium_1.jpg/2560px-Carter-Finley_Stadium_1.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/NC_State_Wolfpack_logo.svg/640px-NC_State_Wolfpack_logo.svg.png', colorHex: '#CC0000' };
  }
  if (t.name === 'Nebraska') {
    return { ...t, mascot: 'Cornhuskers', location: { lat: 40.8202, lon: -96.7005 }, city: 'Lincoln', state: 'Nebraska', stadium: 'Memorial Stadium', stadiumCapacity: 85458, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/091507-USCNeb-MemorialStadium.jpg/1920px-091507-USCNeb-MemorialStadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Nebraska_Cornhuskers_logo.svg/1920px-Nebraska_Cornhuskers_logo.svg.png', colorHex: '#ff1e1e' };
  }
  if (t.name === 'Nevada') {
    return { ...t, mascot: 'Wolf Pack', location: { lat: 39.5439, lon: -119.8538 }, city: 'Reno', state: 'Nevada', stadium: 'Mackay Stadium', stadiumCapacity: 27000, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Mackay_10oct2015.jpg/2560px-Mackay_10oct2015.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/21/Nevada_Wolf_Pack_logo.svg/1200px-Nevada_Wolf_Pack_logo.svg.png', colorHex: '#0059b3' };
  }
  if (t.name === 'New Mexico') {
    return { ...t, mascot: 'Lobos', location: { lat: 35.0845, lon: -106.6511 }, city: 'Albuquerque', state: 'New Mexico', stadium: 'University Stadium', stadiumCapacity: 39224, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Branch_Field_at_University_Stadium_%28Cropped%29.png', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/45/New_Mexico_Lobos_logo.svg/1200px-New_Mexico_Lobos_logo.svg.png', colorHex: '#BA0C2F' };
  }
  if (t.name === 'New Mexico State') {
    return { ...t, mascot: 'Aggies', location: { lat: 32.2767, lon: -106.7619 }, city: 'Las Cruces', state: 'New Mexico', stadium: 'Aggie Memorial Stadium', stadiumCapacity: 30343, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Aggie_Memorial_Stadium_-_West_Side_Stands_%26_Press_Box_01.JPG/1920px-Aggie_Memorial_Stadium_-_West_Side_Stands_%26_Press_Box_01.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c8/New_Mexico_State_Aggies_logo.svg/1200px-New_Mexico_State_Aggies_logo.svg.png', colorHex: '#ffffff' };
  }
  if (t.name === 'North Carolina') {
    return { ...t, mascot: 'Tar Heels', location: { lat: 35.9049, lon: -79.0469 }, city: 'Chapel Hill', state: 'North Carolina', stadium: 'Kenan Stadium', stadiumCapacity: 50500, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kenan_Memorial_Stadium.jpg/2560px-Kenan_Memorial_Stadium.jpg', logoUrl: 'https://images.seeklogo.com/logo-png/22/2/unc-tar-heels-logo-png_seeklogo-226980.png', colorHex: '#4B9CD3' };
  }
  if (t.name === 'North Texas') {
    return { ...t, mascot: 'Mean Green', location: { lat: 33.2098, lon: -97.1331 }, city: 'Denton', state: 'Texas', stadium: 'DATCU Stadium', stadiumCapacity: 30850, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Southern_Methodist_vs._North_Texas_football_2018_03_%28Green_Brigade_Marching_Band%29.jpg/2560px-Southern_Methodist_vs._North_Texas_football_2018_03_%28Green_Brigade_Marching_Band%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png', colorHex: '#00d262' };
  }
  if (t.name === 'Northern Illinois') {
    return { ...t, mascot: 'Huskies', location: { lat: 41.9308, lon: -88.7540 }, city: 'DeKalb', state: 'Illinois', stadium: 'Huskie Stadium', stadiumCapacity: 23595, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/NIU_Huskie_Stadium_76881w.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Northern_Illinois_Huskies_logo.svg/640px-Northern_Illinois_Huskies_logo.svg.png', colorHex: '#fffff' };
  }
  if (t.name === 'Northwestern') {
    return { ...t, mascot: 'Wildcats', location: { lat: 42.0664, lon: -87.6921 }, city: 'Evanston', state: 'Illinois', stadium: 'Lanny and Sharon Martin Stadium', stadiumCapacity: 12023, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Wisconsin_at_Northwestern_football_%28October_19%2C_2024%29_IMG_3250_%281%29.jpg/2560px-Wisconsin_at_Northwestern_football_%28October_19%2C_2024%29_IMG_3250_%281%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Northwestern_Wildcats_logo.svg/1024px-Northwestern_Wildcats_logo.svg.png', colorHex: '#4E2A84' };
  }
  if (t.name === 'Notre Dame') {
    return { ...t, mascot: 'Fighting Irish', location: { lat: 41.7001, lon: -86.2379 }, city: 'Notre Dame', state: 'Indiana', stadium: 'Notre Dame Stadium', stadiumCapacity: 77622, conference: 'Independent', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/NotreDameStadiumNight.jpg/1920px-NotreDameStadiumNight.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Nd_athletics_gold_logo_2015.svg/1920px-Nd_athletics_gold_logo_2015.svg.png', colorHex: '#0C2340' };
  }
  if (t.name === 'Ohio') {
    return { ...t, mascot: 'Bobcats', location: { lat: 39.3292, lon: -82.1013 }, city: 'Athens', state: 'Ohio', stadium: 'Peden Stadium', stadiumCapacity: 24000, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Peden_Stadium_Interior.jpg/1920px-Peden_Stadium_Interior.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/78/Ohio_Bobcats_logo.svg/1200px-Ohio_Bobcats_logo.svg.png', colorHex: '#00694E' };
  }
  if (t.name === 'Ohio State') {
    return { ...t, mascot: 'Buckeyes', location: { lat: 40.0017, lon: -83.0197 }, city: 'Columbus', state: 'Ohio', stadium: 'Ohio Stadium', stadiumCapacity: 102780, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ohio_Stadium_Overhead.jpg/2560px-Ohio_Stadium_Overhead.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ohio_State_Buckeyes_logo.svg/1920px-Ohio_State_Buckeyes_logo.svg.png', colorHex: '#ff0808' };
  }
  if (t.name === 'Oklahoma') {
    return { ...t, mascot: 'Sooners', location: { lat: 35.2058, lon: -97.4426 }, city: 'Norman', state: 'Oklahoma', stadium: 'Gaylord Family Oklahoma Memorial Stadium', stadiumCapacity: 80126, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/OMU_with_2016_extension.jpg/2560px-OMU_with_2016_extension.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Oklahoma_Sooners_logo.svg/1024px-Oklahoma_Sooners_logo.svg.png', colorHex: '#841617' };
  }
  if (t.name === 'Oklahoma State') {
    return { ...t, mascot: 'Cowboys', location: { lat: 36.1214, lon: -97.0670 }, city: 'Stillwater', state: 'Oklahoma', stadium: 'Boone Pickens Stadium', stadiumCapacity: 60218, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Boone_Pickens_Stadium_-_Night.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Oklahoma_State_University_system_logo.svg/2560px-Oklahoma_State_University_system_logo.svg.png', colorHex: '#FF7300' };
  }
  if (t.name === 'Old Dominion') {
    return { ...t, mascot: 'Monarchs', location: { lat: 36.8851, lon: -76.3058 }, city: 'Norfolk', state: 'Virginia', stadium: 'S.B. Ballard Stadium', stadiumCapacity: 21944, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Old_Dominion_Monarchs_versus_Louisiana_Ragin_Cajuns_football_game_at_SB_Ballard_Stadium_9-9-2023.jpeg/1920px-Old_Dominion_Monarchs_versus_Louisiana_Ragin_Cajuns_football_game_at_SB_Ballard_Stadium_9-9-2023.jpeg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Old_Dominion_Athletics_logo_wordmark.svg/1920px-Old_Dominion_Athletics_logo_wordmark.svg.png', colorHex: '#003087' };
  }
  if (t.name === 'Ole Miss') {
    return { ...t, mascot: 'Rebels', location: { lat: 34.3643, lon: -89.5348 }, city: 'Oxford', state: 'Mississippi', stadium: 'Vaught-Hemingway Stadium', stadiumCapacity: 64038, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Vaught-Hemingway_Stadium.jpg/1920px-Vaught-Hemingway_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Ole-miss_bgd_logo_from_NCAA.svg/2048px-Ole-miss_bgd_logo_from_NCAA.svg.png', colorHex: '#CE1126' };
  }
  if (t.name === 'Oregon') {
    return { ...t, mascot: 'Ducks', location: { lat: 44.0582, lon: -123.0684 }, city: 'Eugene', state: 'Oregon', stadium: 'Autzen Stadium', stadiumCapacity: 54000, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/102707-Oregon-Autzen-USC-UO-02.jpg/1920px-102707-Oregon-Autzen-USC-UO-02.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Oregon_Ducks_logo.svg/1920px-Oregon_Ducks_logo.svg.png', colorHex: '#154733' };
  }
  if (t.name === 'Oregon State') {
    return { ...t, mascot: 'Beavers', location: { lat: 44.5646, lon: -123.2620 }, city: 'Corvallis', state: 'Oregon', stadium: 'Reser Stadium', stadiumCapacity: 35548, conference: 'Pac-12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/71/ReserStadium2012.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Oregon_State_Beavers_logo.svg/1200px-Oregon_State_Beavers_logo.svg.png', colorHex: '#DC4405' };
  }
  if (t.name === 'Penn State') {
    return { ...t, mascot: 'Nittany Lions', location: { lat: 40.8120, lon: -77.8560 }, city: 'University Park', state: 'Pennsylvania', stadium: 'Beaver Stadium', stadiumCapacity: 106572, conference: 'Big Ten', imageUrl: 'https://gopsusports.com/imgproxy/xuPVPshSzLbxQ2PZazgWiKESdVoGiQg7eD4KJZhMK60/rs:fit:1980:0:0/g:ce/q:90/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2dvcHN1c3BvcnRzLXByb2QvMjAyNC8wNS8xMy9Oa3NGRENvOURDQWdTRlgyTVFqTlRROTN5ejBKb1J3TWZPcWhXWjluLmpwZw.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Penn_State_Nittany_Lions_logo.svg/1200px-Penn_State_Nittany_Lions_logo.svg.png', colorHex: '#041E42' };
  }
  if (t.name === 'Pittsburgh') {
    return { ...t, mascot: 'Panthers', location: { lat: 40.4468, lon: -80.0158 }, city: 'Pittsburgh', state: 'Pennsylvania', stadium: 'Acrisure Stadium', stadiumCapacity: 68400, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Heinz_Field_%282005%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Pitt_Panthers_wordmark.svg/2560px-Pitt_Panthers_wordmark.svg.png', colorHex: '#003594' };
  }
  if (t.name === 'Purdue') {
    return { ...t, mascot: 'Boilermakers', location: { lat: 40.4237, lon: -87.0074 }, city: 'West Lafayette', state: 'Indiana', stadium: 'Ross-Ade Stadium', stadiumCapacity: 61441, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/RossAde.JPG/1920px-RossAde.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Purdue_Boilermakers_logo.svg/2560px-Purdue_Boilermakers_logo.svg.png', colorHex: '#CEB888' };
  }
  if (t.name === 'Rice') {
    return { ...t, mascot: 'Owls', location: { lat: 29.7174, lon: -95.4018 }, city: 'Houston', state: 'Texas', stadium: 'Rice Stadium', stadiumCapacity: 47000, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Aerial_view_of_Rice_Stadium_in_Houston%2C_Texas_2024.jpg/1920px-Aerial_view_of_Rice_Stadium_in_Houston%2C_Texas_2024.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Rice_Owls_logo.svg/1280px-Rice_Owls_logo.svg.png', colorHex: '#ffffff' };
  }
  if (t.name === 'Rutgers') {
    return { ...t, mascot: 'Scarlet Knights', location: { lat: 40.5137, lon: -74.4637 }, city: 'Piscataway', state: 'New Jersey', stadium: 'SHI Stadium', stadiumCapacity: 52454, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Rutgers_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Rutgers_Scarlet_Knights_logo.svg/1920px-Rutgers_Scarlet_Knights_logo.svg.png', colorHex: '#CC0033' };
  }
  if (t.name === 'Sam Houston') {
    return { ...t, mascot: 'Bearkats', location: { lat: 30.7173, lon: -95.5521 }, city: 'Huntsville', state: 'Texas', stadium: 'Elliott T. Bowers Stadium', stadiumCapacity: 14000, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Bowers_stadium_huntsville_tx_2014.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/de/SHSU_athletics_logo.svg/800px-SHSU_athletics_logo.svg.png', colorHex: '#ff974d' };
  }
  if (t.name === 'San Diego State') {
    return { ...t, mascot: 'Aztecs', location: { lat: 32.7831, lon: -117.1196 }, city: 'San Diego', state: 'California', stadium: 'Snapdragon Stadium', stadiumCapacity: 35000, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Snapdragon_Stadium_interior-Night_panorama_view_1.jpg/2560px-Snapdragon_Stadium_interior-Night_panorama_view_1.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/San_Diego_State_Aztecs_logo.svg/1920px-San_Diego_State_Aztecs_logo.svg.png', colorHex: '#A6192E' };
  }
  if (t.name === 'San José State') {
    return { ...t, mascot: 'Spartans', location: { lat: 37.3352, lon: -121.8811 }, city: 'San Jose', state: 'California', stadium: 'CEFCU Stadium', stadiumCapacity: 18265, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/SS_pan.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/ec/San_Jose_State_Spartans_logo.svg', colorHex: '#007df1' };
  }
  if (t.name === 'SMU') {
    return { ...t, mascot: 'Mustangs', location: { lat: 32.8407, lon: -96.7845 }, city: 'Dallas', state: 'Texas', stadium: 'Gerald J. Ford Stadium', stadiumCapacity: 32000, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Gerald_J_Ford_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/SMU_Mustang_logo.svg/2560px-SMU_Mustang_logo.svg.png', colorHex: '#ef3654' };
  }
  if (t.name === 'South Alabama') {
    return { ...t, mascot: 'Jaguars', location: { lat: 30.7335, lon: -88.1817 }, city: 'Mobile', state: 'Alabama', stadium: 'Hancock Whitney Stadium', stadiumCapacity: 25450, conference: 'Sun Belt', imageUrl: 'https://usajaguars.com/images/2025/5/21/IMG_7422.jpg', logoUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/6.png', colorHex: '#0066CC' };
  }
  if (t.name === 'South Carolina') {
    return { ...t, mascot: 'Gamecocks', location: { lat: 34.0135, lon: -81.0186 }, city: 'Columbia', state: 'South Carolina', stadium: 'Williams-Brice Stadium', stadiumCapacity: 77559, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Williams_Brice_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/South_Carolina_Gamecocks_logo.svg/1280px-South_Carolina_Gamecocks_logo.svg.png', colorHex: '#73000A' };
  }
  if (t.name === 'South Florida') {
    return { ...t, mascot: 'Bulls', location: { lat: 27.9759, lon: -82.5033 }, city: 'Tampa', state: 'Florida', stadium: 'Raymond James Stadium', stadiumCapacity: 65857, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Raymond_James_Stadium02.JPG/1920px-Raymond_James_Stadium02.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Official_USF_Bulls_Athletic_Logo.png/1200px-Official_USF_Bulls_Athletic_Logo.png', colorHex: '#006747' };
  }
  if (t.name === 'Southern Miss') {
    return { ...t, mascot: 'Golden Eagles', location: { lat: 31.3271, lon: -89.3370 }, city: 'Hattiesburg', state: 'Mississippi', stadium: 'M.M. Roberts Stadium', stadiumCapacity: 36000, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Therock.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Southern_Miss_Athletics_logo.svg/1200px-Southern_Miss_Athletics_logo.svg.png', colorHex: '#000000' };
  }
  if (t.name === 'Stanford') {
    return { ...t, mascot: 'Cardinal', location: { lat: 37.4343, lon: -122.1598 }, city: 'Stanford', state: 'California', stadium: 'Stanford Stadium', stadiumCapacity: 50424, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/11-04-06-StanfordStadium002.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1024px-Stanford_Cardinal_logo.svg.png', colorHex: '#8C1515' };
  }
  if (t.name === 'Syracuse') {
    return { ...t, mascot: 'Orange', location: { lat: 43.0361, lon: -76.1368 }, city: 'Syracuse', state: 'New York', stadium: 'JMA Wireless Dome', stadiumCapacity: 42784, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Syracuse_Football_vs._Boston_College_%28November_2%2C_2019%29.jpg/1920px-Syracuse_Football_vs._Boston_College_%28November_2%2C_2019%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Syracuse_Orange_logo.svg/1024px-Syracuse_Orange_logo.svg.png', colorHex: '#D44500' };
  }
  if (t.name === 'TCU') {
    return { ...t, mascot: 'Horned Frogs', location: { lat: 32.7096, lon: -97.3621 }, city: 'Fort Worth', state: 'Texas', stadium: 'Amon G. Carter Stadium', stadiumCapacity: 45000, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Southern_Methodist_vs._Texas_Christian_football_2019_01_%28opening_kickoff%29.jpg/2560px-Southern_Methodist_vs._Texas_Christian_football_2019_01_%28opening_kickoff%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/TCU_Horned_Frogs_logo.svg/2880px-TCU_Horned_Frogs_logo.svg.png', colorHex: '#7526b8' };
  }
  if (t.name === 'Temple') {
    return { ...t, mascot: 'Owls', location: { lat: 39.9008, lon: -75.1675 }, city: 'Philadelphia', state: 'Pennsylvania', stadium: 'Lincoln Financial Field', stadiumCapacity: 68532, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Lincoln_Financial_Field%2C_Philadelphia.jpg', logoUrl: 'https://tuportal6.temple.edu/documents/20121/0/TempleT_NoBox_Red.png/03f1f315-a520-5b50-cfba-51ff28cde995?version=1.0&t=1681129531723&imagePreview=1', colorHex: '#db2b4a' };
  }
  if (t.name === 'Tennessee') {
    return { ...t, mascot: 'Volunteers', location: { lat: 35.9550, lon: -83.9255 }, city: 'Knoxville', state: 'Tennessee', stadium: 'Neyland Stadium', stadiumCapacity: 101915, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Neyland_aerial_view_of_checkerboard.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Tennessee_Volunteers_logo.svg/1920px-Tennessee_Volunteers_logo.svg.png', colorHex: '#ffa84d' };
  }
  if (t.name === 'Texas') {
    return { ...t, mascot: 'Longhorns', location: { lat: 30.2838, lon: -97.7322 }, city: 'Austin', state: 'Texas', stadium: 'Darrell K Royal-Texas Memorial Stadium', stadiumCapacity: 100119, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Darrell_K_Royal-Texas_Memorial_Stadium_at_Night.jpg/1920px-Darrell_K_Royal-Texas_Memorial_Stadium_at_Night.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Texas_Longhorns_logo.svg/2560px-Texas_Longhorns_logo.svg.png', colorHex: '#ff7b0d' };
  }
  if (t.name === 'Texas A&M') {
    return { ...t, mascot: 'Aggies', location: { lat: 30.6103, lon: -96.3400 }, city: 'College Station', state: 'Texas', stadium: 'Kyle Field', stadiumCapacity: 102733, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Kyle_Field_Panorama.jpg/2880px-Kyle_Field_Panorama.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Texas_A%26M_University_logo.svg/1920px-Texas_A%26M_University_logo.svg.png', colorHex: '#9d0000' };
  }
  if (t.name === 'Texas State') {
    return { ...t, mascot: 'Bobcats', location: { lat: 29.8933, lon: -97.9372 }, city: 'San Marcos', state: 'Texas', stadium: 'UFCU Stadium', stadiumCapacity: 30000, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Bobcat_Stadium_West_Side.jpg/1920px-Bobcat_Stadium_West_Side.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/97/Texas_State_Bobcats_logo.svg/800px-Texas_State_Bobcats_logo.svg.png', colorHex: '#8e2024' };
  }
  if (t.name === 'Texas Tech') {
    return { ...t, mascot: 'Red Raiders', location: { lat: 33.5904, lon: -101.8715 }, city: 'Lubbock', state: 'Texas', stadium: 'Jones AT&T Stadium', stadiumCapacity: 60054, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Jones_AT%26T_Stadium_%28August_2013%29.jpg/2880px-Jones_AT%26T_Stadium_%28August_2013%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Texas_Tech_Athletics_logo.svg/1280px-Texas_Tech_Athletics_logo.svg.png', colorHex: '#CC0000' };
  }
  if (t.name === 'Toledo') {
    return { ...t, mascot: 'Rockets', location: { lat: 41.6528, lon: -83.6153 }, city: 'Toledo', state: 'Ohio', stadium: 'Glass Bowl', stadiumCapacity: 26038, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Glass_bowl_stadium_utoledo.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Toledo_Rockets_logo.svg/1200px-Toledo_Rockets_logo.svg.png', colorHex: '#003E7E' };
  }
  if (t.name === 'Troy') {
    return { ...t, mascot: 'Trojans', location: { lat: 31.8068, lon: -85.9695 }, city: 'Troy', state: 'Alabama', stadium: 'Veterans Memorial Stadium', stadiumCapacity: 30470, conference: 'Sun Belt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Movie_Gallery_Stadium.JPG/1920px-Movie_Gallery_Stadium.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Troy_Trojans_logo.svg/1280px-Troy_Trojans_logo.svg.png', colorHex: '#CC0000' };
  }
  if (t.name === 'Tulane') {
    return { ...t, mascot: 'Green Wave', location: { lat: 29.9384, lon: -90.1212 }, city: 'New Orleans', state: 'Louisiana', stadium: 'Yulman Stadium', stadiumCapacity: 30000, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Yulman_Stadium_Homecoming.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Tulane_Green_Wave_logo.svg/1200px-Tulane_Green_Wave_logo.svg.png', colorHex: '#00703C' };
  }
  if (t.name === 'Tulsa') {
    return { ...t, mascot: 'Golden Hurricane', location: { lat: 36.1515, lon: -95.9430 }, city: 'Tulsa', state: 'Oklahoma', stadium: 'H.A. Chapman Stadium', stadiumCapacity: 30000, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HA-Chapman-Stadium-Tulsa.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Tulsa_Golden_Hurricane_logo.svg/1920px-Tulsa_Golden_Hurricane_logo.svg.png', colorHex: '#0d6cff' };
  }
  if (t.name === 'UAB') {
    return { ...t, mascot: 'Blazers', location: { lat: 33.5151, lon: -86.8097 }, city: 'Birmingham', state: 'Alabama', stadium: 'Protective Stadium', stadiumCapacity: 47100, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Protective_Stadium.jpg/2880px-Protective_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/UAB_Container_Blaze_and_Blazers_TM.png', colorHex: '#1E6B52' };
  }
  if (t.name === 'UCF') {
    return { ...t, mascot: 'Knights', location: { lat: 28.6080, lon: -81.1975 }, city: 'Orlando', state: 'Florida', stadium: 'Acrisure Bounce House', stadiumCapacity: 44206, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Bright_House_Networks_Stadium_from_Student_Section%2C_Sept._15.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/UCF_Knights_logo.svg/1920px-UCF_Knights_logo.svg.png', colorHex: '#000000' };
  }
  if (t.name === 'UCLA') {
    return { ...t, mascot: 'Bruins', location: { lat: 34.1611, lon: -118.1678 }, city: 'Pasadena', state: 'California', stadium: 'Rose Bowl', stadiumCapacity: 89702, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/2018.06.17_Over_the_Rose_Bowl%2C_Pasadena%2C_CA_USA_0034_%2842855645211%29.jpg/1920px-2018.06.17_Over_the_Rose_Bowl%2C_Pasadena%2C_CA_USA_0034_%2842855645211%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/UCLA_Bruins_primary_logo.svg/2880px-UCLA_Bruins_primary_logo.svg.png', colorHex: '#ffb300' };
  }
  if (t.name === 'UConn') {
    return { ...t, mascot: 'Huskies', location: { lat: 41.8077, lon: -72.2540 }, city: 'East Hartford', state: 'Connecticut', stadium: 'Pratt & Whitney Stadium at Rentschler Field', stadiumCapacity: 40000, conference: 'Independent', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Pratt_%26_Whitney_Stadium_in_2025.jpg/1920px-Pratt_%26_Whitney_Stadium_in_2025.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Connecticut_Huskies_logo.svg/1200px-Connecticut_Huskies_logo.svg.png', colorHex: '#000E2F' };
  }
  if (t.name === 'UMass') {
    return { ...t, mascot: 'Minutemen', location: { lat: 42.3868, lon: -72.5301 }, city: 'Hadley', state: 'Massachusetts', stadium: 'Warren McGuirk Alumni Stadium', stadiumCapacity: 17000, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Stadium2-4.jpg/1920px-Stadium2-4.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/UMass_Amherst_athletics_logo.svg/1920px-UMass_Amherst_athletics_logo.svg.png', colorHex: '#881C1C' };
  }
  if (t.name === 'UNLV') {
    return { ...t, mascot: 'Rebels', location: { lat: 36.0909, lon: -115.1833 }, city: 'Paradise', state: 'Nevada', stadium: 'Allegiant Stadium', stadiumCapacity: 65000, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Las_Vegas_%285152659900-Cropped2%29.jpg/2880px-Las_Vegas_%285152659900-Cropped2%29.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/UNLV_Rebels_wordmark.svg/2560px-UNLV_Rebels_wordmark.svg.png', colorHex: '#CF0A2C' };
  }
  if (t.name === 'USC') {
    return { ...t, mascot: 'Trojans', location: { lat: 34.0141, lon: -118.2879 }, city: 'Los Angeles', state: 'California', stadium: 'Los Angeles Memorial Coliseum', stadiumCapacity: 77500, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/USC_vs_University_of_Oregon_November_2019.png', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/USC_Trojans_logo.svg/1024px-USC_Trojans_logo.svg.png', colorHex: '#990000' };
  }
  if (t.name === 'Utah') {
    return { ...t, mascot: 'Utes', location: { lat: 40.7589, lon: -111.8521 }, city: 'Salt Lake City', state: 'Utah', stadium: 'Rice-Eccles Stadium', stadiumCapacity: 51444, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/University_of_Utah_Vs._Utah_State_-_Via_MUSS.jpg/2880px-University_of_Utah_Vs._Utah_State_-_Via_MUSS.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Utah_Utes_primary_logo.svg/1920px-Utah_Utes_primary_logo.svg.png', colorHex: '#ff1a1a' };
  }
  if (t.name === 'Utah State') {
    return { ...t, mascot: 'Aggies', location: { lat: 41.7518, lon: -111.8110 }, city: 'Logan', state: 'Utah', stadium: 'Maverik Stadium', stadiumCapacity: 25513, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Romney_Stadium.jpg/1920px-Romney_Stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Utah_State_Aggies_logo.svg/1920px-Utah_State_Aggies_logo.svg.png', colorHex: '#1f4a76' };
  }
  if (t.name === 'UTEP') {
    return { ...t, mascot: 'Miners', location: { lat: 31.7619, lon: -106.4850 }, city: 'El Paso', state: 'Texas', stadium: 'Sun Bowl Stadium', stadiumCapacity: 46670, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/UTEP_Sun_Bowl_Stadium_Aerial_View_Sept_6_2009.jpg/2560px-UTEP_Sun_Bowl_Stadium_Aerial_View_Sept_6_2009.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/06/UTEP_Miners_logo.svg/1200px-UTEP_Miners_logo.svg.png', colorHex: '#FF8200' };
  }
  if (t.name === 'UTSA') {
    return { ...t, mascot: 'Roadrunners', location: { lat: 29.5372, lon: -98.4738 }, city: 'San Antonio', state: 'Texas', stadium: 'Alamodome', stadiumCapacity: 65000, conference: 'AAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Alamodome_Conference_USA_Championship.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/UTSA_Athletics_logo.svg/1200px-UTSA_Athletics_logo.svg.png', colorHex: '#0C2340' };
  }
  if (t.name === 'Vanderbilt') {
    return { ...t, mascot: 'Commodores', location: { lat: 36.1447, lon: -86.8027 }, city: 'Nashville', state: 'Tennessee', stadium: 'FirstBank Stadium', stadiumCapacity: 28500, conference: 'SEC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Vanderbilt_Stadium_vs._Tennessee_11.26.16.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Vanderbilt_Athletics_logo.svg/1920px-Vanderbilt_Athletics_logo.svg.png', colorHex: '#866D4B' };
  }
  if (t.name === 'Virginia') {
    return { ...t, mascot: 'Cavaliers', location: { lat: 38.0336, lon: -78.5080 }, city: 'Charlottesville', state: 'Virginia', stadium: 'Scott Stadium', stadiumCapacity: 61500, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Scott_Stadium_UVa.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Virginia_Cavaliers_logo.svg/1200px-Virginia_Cavaliers_logo.svg.png', colorHex: '#232D4B' };
  }
  if (t.name === 'Virginia Tech') {
    return { ...t, mascot: 'Hokies', location: { lat: 37.2284, lon: -80.4234 }, city: 'Blacksburg', state: 'Virginia', stadium: 'Lane Stadium', stadiumCapacity: 66233, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/2016_Lane_Stadium_Panoramic.jpg/2880px-2016_Lane_Stadium_Panoramic.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Virginia_Tech_Hokies_logo.svg/2880px-Virginia_Tech_Hokies_logo.svg.png', colorHex: '#861F41' };
  }
  if (t.name === 'Wake Forest') {
    return { ...t, mascot: 'Demon Deacons', location: { lat: 36.1349, lon: -80.2772 }, city: 'Winston-Salem', state: 'North Carolina', stadium: 'Allegacy Federal Credit Union Stadium', stadiumCapacity: 31500, conference: 'ACC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/BBT_Field_Deacon_Tower_Wake_Forest_University_football_stadium.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Wake_Forest_University_Athletic_logo.svg/1920px-Wake_Forest_University_Athletic_logo.svg.png', colorHex: '#000000' };
  }
  if (t.name === 'Washington') {
    return { ...t, mascot: 'Huskies', location: { lat: 47.6501, lon: -122.3015 }, city: 'Seattle', state: 'Washington', stadium: 'Husky Stadium', stadiumCapacity: 70083, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/UW_vs_USC_at_Husky_Stadium%2C_September_2019.jpg/1920px-UW_vs_USC_at_Husky_Stadium%2C_September_2019.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Washington_Huskies_logo.svg/1920px-Washington_Huskies_logo.svg.png', colorHex: '#4B2E83' };
  }
  if (t.name === 'Washington State') {
    return { ...t, mascot: 'Cougars', location: { lat: 46.7319, lon: -117.1542 }, city: 'Pullman', state: 'Washington', stadium: 'Martin Stadium', stadiumCapacity: 32248, conference: 'Pac-12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/WSUMartinStadium-08-16-2012.jpg/2880px-WSUMartinStadium-08-16-2012.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Washington_State_Cougars_logo.svg/1200px-Washington_State_Cougars_logo.svg.png', colorHex: '#981E32' };
  }
  if (t.name === 'West Virginia') {
    return { ...t, mascot: 'Mountaineers', location: { lat: 39.6519, lon: -79.9553 }, city: 'Morgantown', state: 'West Virginia', stadium: 'Milan Puskar Stadium', stadiumCapacity: 60000, conference: 'Big 12', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Mountaineer_Field.png', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/WVU_flying_WV_Gold124.svg/1184px-WVU_flying_WV_Gold124.svg.png', colorHex: '#002855' };
  }
  if (t.name === 'Western Kentucky') {
    return { ...t, mascot: 'Hilltoppers', location: { lat: 36.9685, lon: -86.4808 }, city: 'Bowling Green', state: 'Kentucky', stadium: 'Houchens Industries-L.T. Smith Stadium', stadiumCapacity: 22113, conference: 'Conference USA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Insidesmith.jpeg/1920px-Insidesmith.jpeg', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/WKU_Athletics_logo.svg/1200px-WKU_Athletics_logo.svg.png', colorHex: '#C8102E' };
  }
  if (t.name === 'Western Michigan') {
    return { ...t, mascot: 'Broncos', location: { lat: 42.2917, lon: -85.6024 }, city: 'Kalamazoo', state: 'Michigan', stadium: 'Waldo Stadium', stadiumCapacity: 30200, conference: 'MAC', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/26/WaldoStadium1.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Western_Michigan_Broncos_%282021%29_logo.svg/1200px-Western_Michigan_Broncos_%282021%29_logo.svg.png', colorHex: '#8B4513' };
  }
  if (t.name === 'Wisconsin') {
    return { ...t, mascot: 'Badgers', location: { lat: 43.0695, lon: -89.4124 }, city: 'Madison', state: 'Wisconsin', stadium: 'Camp Randall Stadium', stadiumCapacity: 76057, conference: 'Big Ten', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camp_Randall_Stadium_2.jpg/1920px-Camp_Randall_Stadium_2.jpg', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Wisconsin_Badgers_logo.svg/1920px-Wisconsin_Badgers_logo.svg.png', colorHex: '#C5050C' };
  }
  if (t.name === 'Wyoming') {
    return { ...t, mascot: 'Cowboys', location: { lat: 41.3114, lon: -105.5800 }, city: 'Laramie', state: 'Wyoming', stadium: 'War Memorial Stadium', stadiumCapacity: 29181, conference: 'Mountain West', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/War_Memorial_Stadium.JPG/2560px-War_Memorial_Stadium.JPG', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Wyoming_Athletics_logo.svg/800px-Wyoming_Athletics_logo.svg.png', colorHex: '#492F24' };
  }

  return t;
});

export const FBS_TEAM_NAMES: string[] = FBS_TEAMS.map(t => t.name);

// Get teams with location data for display on the map
export function getTeamsWithCompleteData(): Array<{
  id: string;
  name: string;
  colorHex: string;
  logoUrl: string;
  coords: { lat: number; lon: number };
}> {
  return FBS_TEAMS
    .filter(team => team.location !== null)
    .map(team => ({
      id: team.id,
      name: team.name,
      colorHex: team.colorHex || '#ff0000', // Use stored color or default to red
      logoUrl: team.logoUrl || '',
      coords: {
        lat: team.location!.lat,
        lon: team.location!.lon
      }
    }));
}


