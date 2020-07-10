let playerPic = document.createElement("img"),
	UFOPic = document.createElement("img"),
	trackerPic = document.createElement("img"),
	missilePic = document.createElement("img"),
	mgHUD = document.createElement("img"),
	missileHUD = document.createElement("img"),
	laserHUD = document.createElement("img");
	turretBasePic = document.createElement("img");
	turretCannonPic = document.createElement("img");
	grapplerPic = document.createElement("img");
	gHookPic = document.createElement("img");

function beginLoadingImage(image, fileName) {
	return new Promise((resolve, reject) => {
		image.onload = resolve;
		image.onerror = reject;
		image.src = "images/" + fileName;
	})
}

async function loadImages() {
	let imageList = [
		{ varName: playerPic, theFile: "player1.png" },
		{ varName: UFOPic, theFile: "ufo.png" },
		{ varName: turretBasePic, theFile: "turretBase.png" },
		{ varName: turretCannonPic, theFile: "turretCannon.png" },
		{ varName: trackerPic, theFile: "tracker.png" },
		{ varName: missilePic, theFile: "missile.png" },
		{ varName: mgHUD, theFile: "mgHUD.png" },
		{ varName: missileHUD, theFile: "missileHUD.png" },
		{ varName: laserHUD, theFile: "laserHUD.png" },
		{ varName: grapplerPic, theFile: "grappler.png" },
		{ varName: gHookPic, theFile: "gHook.png"}
	];

	picsToLoad = imageList.length;

	for (let i in imageList) {
		let nextImage = imageList[i];
		drawLoadScreen('Loading Sprites', i / (imageList.length - 1), nextImage.theFile);
		await beginLoadingImage(nextImage.varName, nextImage.theFile);
		nextImage.varName.chunks = divideSprite(nextImage.varName, 6);
	}
	loadingDoneSoStartGame();
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
