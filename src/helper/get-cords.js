// const API_KEY = 'AIzaSyASQhy6gI5pQH7ux2SfrFSsAVFJ6OR1N0s'; 

const rawInput = `
Bergy Bandroom	https://www.google.com/maps/search/?api=1&query=Bergy+Bandroom+Brunswick
Spleen Bar	https://www.google.com/maps/search/?api=1&query=Spleen+Bar+Melbourne
The Local Taphouse	https://www.google.com/maps/search/?api=1&query=The+Local+Taphouse+St+Kilda
The Catfish	https://www.google.com/maps/search/?api=1&query=The+Catfish+Fitzroy
Lido Cinema	https://www.google.com/maps/search/?api=1&query=Lido+Cinemas+Hawthorn
Miranda Tequila Bar	https://www.google.com/maps/search/?api=1&query=Miranda+Tequila+Bar+Melbourne
Hotel Esplenade	https://www.google.com/maps/search/?api=1&query=Hotel+Esplanade+St+Kilda
Redwood Tasting Room	https://www.google.com/maps/search/?api=1&query=Redwood+Tasting+Room
Mount Eliza Country Club	https://www.google.com/maps/search/?api=1&query=Mount+Eliza+Country+Club
Wheat Wine & Whiskey	
Improv Conspiracy	https://www.google.com/maps/search/?api=1&query=The+Improv+Conspiracy+Theatre
Central Club Hotel	https://www.google.com/maps/search/?api=1&query=Central+Club+Hotel+North+Melbourne
Nighthawks Bar	https://www.google.com/maps/search/?api=1&query=Nighthawks+Bar+Collingwood
Young Street Tavern	https://www.google.com/maps/search/?api=1&query=Young+Street+Tavern
The Black Sheep	https://www.google.com/maps/search/?api=1&query=The+Black+Sheep+Hawthorn
Varies	
Varies	
Club Voltaire	https://www.google.com/maps/search/?api=1&query=Club+Voltaire+North+Melbourne
Varies	
The Grace Darling Hotel	https://www.google.com/maps/search/?api=1&query=The+Grace+Darling+Hotel
Stay Gold	https://www.google.com/maps/search/?api=1&query=Stay+Gold+Brunswick
Easey Street Concert Hall	https://www.google.com/maps/search/?api=1&query=Easey+Street+Concert+Hall
Theory Bar	https://www.google.com/maps/search/?api=1&query=Theory+Bar+Melbourne
Varies	
Varies	
???	
Varies	
Varies	
Ming Dining	https://www.google.com/maps/search/?api=1&query=Ming+Dining
Varies	
Yarraville Club	https://www.google.com/maps/search/?api=1&query=The+Yarraville+Club
The Collection Bar	https://www.google.com/maps/search/?api=1&query=The+Collection+Bar+Richmond
The Wesley Anne	https://www.google.com/maps/search/?api=1&query=The+Wesley+Anne
The Grand	
Nord Bar	https://www.google.com/maps/search/?api=1&query=Nord+Bar+Preston
Stubby Bar	
Angler's Club	https://www.google.com/maps/search/?api=1&query=Albert+Park+Anglers+Club
The Grace Darling Hotel	https://www.google.com/maps/search/?api=1&query=The+Grace+Darling+Hotel
Co-Conspirators Brewpub	https://www.google.com/maps/search/?api=1&query=Co-Conspirators+Brewpub
Sugar Glider	
The Exford Hotel	https://www.google.com/maps/search/?api=1&query=The+Exford+Hotel
Creature	https://www.google.com/maps/search/?api=1&query=Creature+Brunswick+East
Bar Humbug	https://www.google.com/maps/search/?api=1&query=Bar+Humbug
Manhattan Bar	https://www.google.com/maps/search/?api=1&query=Manhattan+Hotel
Queens Arms Hotel	
Motley Bauhaus	https://www.google.com/maps/search/?api=1&query=The+Motley+Bauhaus
Theory Bar	https://www.google.com/maps/search/?api=1&query=Theory+Bar+Melbourne
Bar Open	https://www.google.com/maps/search/?api=1&query=Bar+Open+Fitzroy
Wildflower Video Bar	
Bards Apothecary	https://www.google.com/maps/search/?api=1&query=Bards+Apothecary
Comedy Republic	https://www.google.com/maps/search/?api=1&query=Comedy+Republic
Near And Far Bar	https://www.google.com/maps/search/?api=1&query=Near+and+Far+Bar
Dirty Secrets	https://www.google.com/maps/search/?api=1&query=Dirty+Secrets+Collingwood
The McKinnon Hotel	https://www.google.com/maps/search/?api=1&query=The+McKinnon+Hotel
Varies	
Theory Bar	https://www.google.com/maps/search/?api=1&query=Theory+Bar+Melbourne
Speakeasy Theatre	https://www.google.com/maps/search/?api=1&query=Speakeasy+Theatre
522 Flinders St	https://www.google.com/maps/search/?api=1&query=522+Flinders+St+Melbourne
Theory Bar	https://www.google.com/maps/search/?api=1&query=Theory+Bar+Melbourne
Sonder Bar	https://www.google.com/maps/search/?api=1&query=Sonder+Bar+Bentleigh
Boddrigy	https://www.google.com/maps/search/?api=1&query=Bodriggy+Brewing+Company
Dirty Secrets	https://www.google.com/maps/search/?api=1&query=Dirty+Secrets+Collingwood
Comedy Republic	https://www.google.com/maps/search/?api=1&query=Comedy+Republic
The Coopers Inn	https://www.google.com/maps/search/?api=1&query=Coopers+Inn
The Comic's Lounge	https://www.google.com/maps/search/?api=1&query=The+Comics+Lounge
The Nash	https://www.google.com/maps/search/?api=1&query=The+National+Hotel+Geelong
The Coopers Inn	https://www.google.com/maps/search/?api=1&query=Coopers+Inn
The Comic's Lounge	https://www.google.com/maps/search/?api=1&query=The+Comics+Lounge
Dirty Secrets	https://www.google.com/maps/search/?api=1&query=Dirty+Secrets+Collingwood
Club Voltaire	https://www.google.com/maps/search/?api=1&query=Club+Voltaire
???	
Jambo Bar & Cafe	https://www.google.com/maps/search/?api=1&query=Jambo+Bar+Cafe
Frankston Brewhouse	https://www.google.com/maps/search/?api=1&query=Frankston+Brewhouse
Miss Moses	https://www.google.com/maps/search/?api=1&query=Miss+Moses
Morris House	https://www.google.com/maps/search/?api=1&query=Morris+House
Comedy Republic	https://www.google.com/maps/search/?api=1&query=Comedy+Republic
Kings of Comedy	https://www.google.com/maps/search/?api=1&query=Kings+of+Comedy
Morris House	https://www.google.com/maps/search/?api=1&query=Morris+House
Comedy Republic	https://www.google.com/maps/search/?api=1&query=Comedy+Republic
Iddy Biddy Bar	https://www.google.com/maps/search/?api=1&query=Iddy+Biddy+Bar
East Ivanhoe Bowls Club	https://www.google.com/maps/search/?api=1&query=East+Ivanhoe+Bowls+Club
The Vineyard	https://www.google.com/maps/search/?api=1&query=The+Vineyard+St+Kilda
Nevermind Bar	https://www.google.com/maps/search/?api=1&query=Nevermind+Bar+Hawthorn
DT's Hotel	https://www.google.com/maps/search/?api=1&query=DTs+Hotel
St Kilda Cellars	https://www.google.com/maps/search/?api=1&query=St+Kilda+Cellars
Jak's Music	https://www.google.com/maps/search/?api=1&query=Jaks+Music
Post Office Club Hotel	https://www.google.com/maps/search/?api=1&query=Post+Office+Club+Hotel
St Luja	https://www.google.com/maps/search/?api=1&query=St+Luja
Subculture Brewing	
Trainscendence	
La La Land	
Red Betty	https://www.google.com/maps/search/?api=1&query=Red+Betty
Kathleen Syme Library	https://www.google.com/maps/search/?api=1&query=Kathleen+Syme+Library
Bards Apothecary	https://www.google.com/maps/search/?api=1&query=Bards+Apothecary
The Drunken Poet	https://www.google.com/maps/search/?api=1&query=The+Drunken+Poet
Platform 3095	https://www.google.com/maps/search/?api=1&query=Platform+3095
Varies	
Here & Now Lounge	https://www.google.com/maps/search/?api=1&query=Here+Now+Lounge
Here & Now Lounge	https://www.google.com/maps/search/?api=1&query=Here+Now+Lounge
Penni Ave Distillery	https://www.google.com/maps/search/?api=1&query=Penni+Ave+Distillery
Mr Paul's Beers	https://www.google.com/maps/search/?api=1&query=Mr+Pauls+Beer
Lyrebird Lounge	https://www.google.com/maps/search/?api=1&query=Lyrebird+Lounge
Korr Jee	https://www.google.com/maps/search/?api=1&query=Korr+Jee
Mazi Brunswick	https://www.google.com/maps/search/?api=1&query=Mazi+Brunswick
Piano On High	https://www.google.com/maps/search/?api=1&query=Piano+On+High
Prahran Kebabs	
Cyan Bar	https://www.google.com/maps/search/?api=1&query=Cyan+Bar
East Brunswick Hotel	https://www.google.com/maps/search/?api=1&query=East+Brunswick+Hotel
Varies	
Varies	
Grouse	https://www.google.com/maps/search/?api=1&query=Grouse+Bar
`;

async function runConsole() {
  console.log("%cStarting Geocode Job...", "color: cyan; font-size: 14px;");
  
  let csvContent = "Venue Name,Address,Latitude,Longitude\n";
  const lines = rawInput.trim().split('\n');
  const total = lines.length;

  for (let i = 0; i < total; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    let parts = line.split('\t');
    let venueName = parts[0]?.trim();
    let rawAddress = parts[1]?.trim();

    if (!venueName || venueName === "???" || venueName === "Varies") continue;

    let searchAddress = rawAddress;
    if (!searchAddress || searchAddress.includes('http')) {
        searchAddress = venueName;
    }

    const cleanName = venueName;
    const cleanAddress = searchAddress;

    console.log(`Processing ${i + 1}/${total}: ${cleanName}...`);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cleanAddress + ", Melbourne, Australia")}&key=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        csvContent += `"${cleanName}","${cleanAddress}","${lat}","${lng}"\n`;
      } else {
        csvContent += `"${cleanName}","${cleanAddress}","","ERROR: ${data.status}"\n`;
      }
    } catch (e) {
      csvContent += `"${cleanName}","${cleanAddress}","","ERROR: ${e.message}"\n`;
    }
    
    // Tiny pause to avoid rate limiting
    await new Promise(r => setTimeout(r, 150)); 
  }

  console.log("%c👇 DONE! COPY THE CSV BELOW 👇", "color: lime; font-size: 16px; font-weight: bold;");
  console.log(csvContent);
  console.log("%c👆 DONE! COPY THE CSV ABOVE 👆", "color: lime; font-size: 16px; font-weight: bold;");
}

runConsole();