// Variables used by Scriptable. 
// These must be at the very top of the file. Do not edit. 
// icon-color: deep-gray; icon-glyph: futbol; 
const teamId = 133610; 
const teamDetailUrl = "https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id="; 

const leagueDetailUrl = "https://www.thesportsdb.com/api/v1/json/1/lookupleague.php?id=" 

const teamUrl = teamDetailUrl + teamId; 
let r = new Request(teamUrl); 
let teamDetail = await r.loadJSON(); 

const widgetSize = config.widgetFamily 

const maxEvents = widgetSize === "large" ? 4 : 2 

async function getTeamImg(id) { 
let teamUrl = teamDetailUrl + id; 
let req = new Request(teamUrl) 
let res = await req.loadJSON() 
let imageUrl = res.teams[0].strTeamBadge + "/preview" 
let imgReq = new Request(imageUrl) 
let img = await imgReq.loadImage() 
return img 
} 

async function getLeagueImg(id) { 
let leagueUrl = leagueDetailUrl + id; 
let req = new Request(leagueUrl) 
let res = await req.loadJSON() 
let imageUrl = res.leagues[0].strBadge 
let imgReq = new Request(imageUrl) 
let img = await imgReq.loadImage() 
return img 
} 

function createDivider() { 
const drawContext = new DrawContext() 
drawContext.size = new Size(543, 1) 
const path = new Path() 
path.addLine(new Point(1000, 20)) 
drawContext.addPath(path) 
drawContext.setStrokeColor(Device.isUsingDarkAppearance() ? new Color("#fff", 1) : new Color("#000000", 1)) 
drawContext.setLineWidth(1) 
drawContext.strokePath() 
return drawContext.getImage() 
}
async function createWidget() { 
const eventsUrl = "https://www.thesportsdb.com/api/v1/json/1/eventsnext.php?id=" + teamId; 
let req = new Request(eventsUrl); 
let res = await req.loadJSON(); 
let events = res.events; 

let teamImg = await getTeamImg(teamId) 

let w = new ListWidget(); 

w.backgroundColor = Device.isUsingDarkAppearance() ? new Color("#000000", 1) : new Color("#ffffff", 1) 
w.useDefaultPadding() 

const limitedEvents = events.slice(0, maxEvents) 

const imageSize = widgetSize === "large" ? 32 : 26; 

w.addSpacer() 

if (widgetSize === "large") { 

const teamName = events[0].idHomeTeam == teamId ? events[0].strHomeTeam : events[0].strAwayTeam 
let titleStack = w.addStack() 
let title = titleStack.addText(`${teamName}'s upcoming matches`) 
title.font = Font.boldSystemFont(16); 

w.addSpacer() 

} 

for (let i = 0; i < limitedEvents.length; i++) { 
let e = events[i] 

if (widgetSize === "large" || i > 0) { 
w.addSpacer(10) 
} 

let homeImg = "" 
let awayImg = "" 

if (e.idHomeTeam == teamId) { 
homeImg = teamImg 
awayImg = await getTeamImg(e.idAwayTeam) 
} else { 
homeImg = await getTeamImg(e.idHomeTeam) 
awayImg = teamImg 
} 

let rowStack = w.addStack() 
rowStack.centerAlignContent() 

// home team image 
let homeImageStack = rowStack.addStack(); 
let homeImage = homeImageStack.addImage(homeImg); 
homeImage.imageSize = new Size(imageSize, imageSize) 
homeImageStack.addSpacer(10) 

// home team name 
let homeNameStack = rowStack.addStack(); 
let homeName = homeNameStack.addText(e.strHomeTeam); 
homeName.font = Font.mediumSystemFont(12); 
homeNameStack.size = new Size(100, 14) 
homeNameStack.addSpacer() 

let separatorStack = rowStack.addStack(); 
let separator = separatorStack.addText('-') 
separator.font = Font.mediumSystemFont(12) 
separatorStack.size = new Size(24, 12) 
separatorStack.addSpacer(10) 

// away team name 
let awayNameStack = rowStack.addStack(); 
awayNameStack.addSpacer() 
let awayName = awayNameStack.addText(e.strAwayTeam); 
awayName.font = Font.mediumSystemFont(12); 
awayNameStack.size = new Size(100, 14) 
awayNameStack.addSpacer(10) 

// away team image 
let awayImageStack = rowStack.addStack(); 
let awayImage = awayImageStack.addImage(awayImg); 
awayImage.imageSize = new Size(imageSize, imageSize); 

w.addSpacer(5) 

let infoRowStack = w.addStack() 
infoRowStack.centerAlignContent() 
infoRowStack.addSpacer() 

let dateStack = infoRowStack.addStack() 
const dateFormatter = new DateFormatter() 
dateFormatter.useMediumDateStyle() 
dateFormatter.useShortTimeStyle() 
let parsedDate = new Date(Date.parse(e.strTimestamp)) 
let formattedDate = dateFormatter.string(parsedDate) 

let date = dateStack.addText(formattedDate) 
date.font = Font.mediumSystemFont(10) 
date.textOpacity = 0.5 

dateStack.addSpacer(10) 

//league image 
if (widgetSize === "large") { 
let leagueImg = await getLeagueImg(e.idLeague) 
let leagueImageStack = infoRowStack.addStack() 
let leagueImage = leagueImageStack.addImage(leagueImg) 
leagueImage.size = new Size(10, 10) 
} 

infoRowStack.addSpacer() 

if (i !== maxEvents - 1) { 
w.addSpacer(10) 

let dividerStack = w.addStack() 
let divider = dividerStack.addImage(createDivider()) 
divider.imageOpacity = 0.5 
} 
} 

w.addSpacer() 

return w 
} 

const widget = await createWidget() 

Script.setWidget(widget) 
Script.complete()
