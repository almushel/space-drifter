let playerPic = document.createElement("img"),
	UFOPic = document.createElement("img"),
	trackerPic = document.createElement("img"),
	missilePic = document.createElement("img"),
	mgHUD = document.createElement("img"),
	missileHUD = document.createElement("img"),
	laserHUD = document.createElement("img");

var picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
	picsToLoad--;
	this.chunks = divideSprite(this, 6);
	if (picsToLoad == 0) { // last image loaded?
		loadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	imgVar.onload = countLoadedImageAndLaunchIfReady;
	imgVar.src = "images/" + fileName;
}

function loadImages() {

	var imageList = [
		{ varName: playerPic, theFile: "player1.png" },
		{ varName: UFOPic, theFile: "ufo.png" },
		{ varName: trackerPic, theFile: "tracker.png" },
		{ varName: missilePic, theFile: "missile.png" },
		{ varName: mgHUD, theFile: "mgHUD.png" },
		{ varName: missileHUD, theFile: "missileHUD.png" },
		{ varName: laserHUD, theFile: "laserHUD.png" }
	];

	picsToLoad = imageList.length;

	for (let i in imageList) {
		beginLoadingImage(imageList[i].varName, imageList[i].theFile);
	} // end of for imageList
}

function divideSprite(sprite, division) {
	let clipW = Math.round(sprite.width / 2);
	let clipH = Math.round(sprite.height / (division / 2));
	let chunks = [];

	//Cut the sprite into chunks
	//Doesn't actually divide properly (division of 6 gives 9 chunks);
	for (let i = 0; i < 2; i++) {
		for (let e = 0; e < Math.round(division / 2); e++) {
			let sChunk = document.createElement('canvas');
			sChunk.width = clipW;
			sChunk.height = clipH;
			sChunk.ctx = sChunk.getContext('2d');
			sChunk.ctx.drawImage(sprite, clipW * i, clipH * e, clipW, clipH, 0, 0, clipW, clipH);
			chunks.push(sChunk);
		}
	}

	return chunks;
}
