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
	const imageList = [
		{ varName: playerPic, theFile: "player1" },
		{ varName: UFOPic, theFile: "ufo" },
		{ varName: turretBasePic, theFile: "turretBase" },
		{ varName: turretCannonPic, theFile: "turretCannon" },
		{ varName: trackerPic, theFile: "tracker" },
		{ varName: missilePic, theFile: "missile" },
		{ varName: mgHUD, theFile: "mgHUD" },
		{ varName: missileHUD, theFile: "missileHUD" },
		{ varName: laserHUD, theFile: "laserHUD" },
		{ varName: grapplerPic, theFile: "grappler" },
		{ varName: gHookPic, theFile: "gHook"}
	];

	const picsToLoad = imageList.length;
	let promises = [];
	let picsLoaded = 0;

	for (let nextImage of imageList) {
		let image = nextImage.varName;
		let fileName = nextImage.theFile;

		promises.push(new Promise((resolve, reject) => {
			image.onload = () => {
					picsLoaded++;
					drawLoadScreen('Loading Sprites', picsLoaded / (picsToLoad - 1), fileName);
					image.chunks = divideSprite(image, 6);
					resolve();
				}
			image.onerror = reject;
			image.src = "images/" + fileName + '.png';
		}));
	}

	return Promise.all(promises);
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
