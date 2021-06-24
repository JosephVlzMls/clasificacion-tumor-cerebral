import { Router, Request, Response } from 'express';
import process from 'child_process';
import fs from 'fs';

var router: Router = Router();
var multipart = require('connect-multiparty');
var middleware = multipart({uploadDir: './public'});

router.post('/uploadImage', middleware, async (req: any, res: Response) => {
	try {
		var image: any = req.files.image;
		fs.renameSync(image.path, 'public/image.png');
		var stdout: Buffer = process.execSync('octave src/octave/grayscale.m');
		var [n, m] = stdout.toString().split(',');
		res.send({status: 0, n: Number.parseInt(n), m: Number.parseInt(m)});
	}
	catch(error) {
		res.send({status: -1});
	}
});

router.post('/uploadMask', middleware, async (req: any, res: Response) => {
	try {
		var mask: string = req.body.mask;
		var csv = mask.split(';').map((a) => { return Array.from(a).join(','); }).join('\n');
		fs.writeFileSync('public/mask.csv', csv);
		process.execSync('octave src/octave/mask.m');		
		res.send({status: 0});
	}
	catch(error) {
		res.send({status: -1});
	}
});

router.get('/loadImage', async (req: any, res: Response) => {
	try {
		var image = fs.readFileSync('public/image.png');
		res.send({status: 0, image: image});
	}
	catch(error) {
		res.send({status: -1});
	}
});

router.get('/loadROI', async (req: any, res: Response) => {
	try {
		process.execSync('octave src/octave/roi.m');
		var roi = fs.readFileSync('public/ROI.png');
		res.send({status: 0, image: roi});
	}
	catch(error) {
		res.send({status: -1});
	}
});

router.get('/loadResult', async (req: any, res: Response) => {
	try {
		var image = fs.readFileSync('public/result.png');
		res.send({status: 0, image: image});
	}
	catch(error) {
		res.send({status: -1});
	}
});

router.get('/classify', async (req: any, res: Response) => {
	try {
		process.execSync('octave src/octave/feature_extraction.m');
		var stdout: Buffer = process.execSync('python src/python/classify.py');
		res.send({status: 0, class: Number.parseInt(stdout.toString())});
	}
	catch(error) {
		res.send({status: -1});
	}
});

export default router;