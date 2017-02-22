export default class ElmColorScorer {

	constructor(name, settings){
		this.name = name;
		this._settings = settings;
		this._colors = [
			{name: 'black',  rgb: '#000000'},
			{name: 'navy',   rgb: '#000080'},
			{name: 'blue',   rgb: '#0000FF'},
			{name: 'green',  rgb: '#008000'},
			{name: 'teal',   rgb: '#008080'},
			{name: 'lime',   rgb: '#00FF00'},
			{name: 'aqua',   rgb: '#00FFFF'},
			{name: 'maroon', rgb: '#800000'},
			{name: 'purple', rgb: '#800080'},
			{name: 'olive',  rgb: '#808000'},
			{name: 'gray',   rgb: '#808080'},
			{name: 'brown',  rgb: '#994C00'},
			{name: 'silver', rgb: '#C0C0C0'},
			{name: 'red',    rgb: '#FF0000'},
			{name: 'pink',   rgb: '#FF00FF'},
			{name: 'orange', rgb: '#FFA500'},
			{name: 'yellow', rgb: '#FFFF00'},
			{name: 'white',  rgb: '#FFFFFF'}
		];
		this._factors = [
			1.0, //Hue
			0.2, //Saturation
			0.6  //Lightness
		];
	}

	score(elm, val) {
		//val can be a value from the supported color list below
		if (!val || !elm) {
			return 0;
		}
		let computedStyle = elm.window.getComputedStyle(elm.domElm);
		let colorStr = computedStyle['background-color'];
		if (colorStr) {
			let closestColor = this._getClosestColor(colorStr, this._colors, this._factors);
			if (closestColor.name === val) {
				return 1;
			}
		}
		return 0;
	}

	_getClosestColor(colorStr, colorArray, factors) {
		//CodePen: http://codepen.io/anon/pen/LxwjGN
		let rgb, hsl, closestDiff, diff;
		let closestColorIndex = -1;
		let colorsHsl = [];
		for (let i = 0; i < this._colors.length; i++) {
			rgb = ElmColorScorer.strToRgb(colorArray[i].rgb);
			hsl = ElmColorScorer.rgbToHsl(rgb[0], rgb[1], rgb[2]);
			colorsHsl.push([hsl[0], hsl[1], hsl[2]]);
		}
		rgb = ElmColorScorer.strToRgb(colorStr);
		hsl = ElmColorScorer.rgbToHsl(rgb[0], rgb[1], rgb[2]);
		closestDiff = Number.MAX_VALUE;
		for (let i = 0; i < colorsHsl.length; i++) {
			diff = factors[0]*Math.abs(colorsHsl[i][0] - hsl[0]) + factors[1]*Math.abs(colorsHsl[i][1] - hsl[1]) + factors[2]*Math.abs(colorsHsl[i][2] - hsl[2]);
			if (diff < closestDiff) {
				closestDiff = diff;
				closestColorIndex = i;
			}
		}
		return colorArray[closestColorIndex];
	}

	static strToRgb(str) {
		let r = 0, g = 0, b = 0;
		if (str.charAt(0) === "#") {
			str = str.substring(1, str.length);
			if (str.length === 3) {
				r = parseInt(str.charAt(0),16)*17;
				g = parseInt(str.charAt(1),16)*17;
				b = parseInt(str.charAt(2),16)*17;
			} else if (str.length === 6) {
				r = parseInt(str.substring(0,2),16);
				g = parseInt(str.substring(2,4),16);
				b = parseInt(str.substring(4,6),16);
			}
		} else if (str.indexOf('rgb(') === 0 ) {
			str = str.substring(4, str.length - 1);
			let arr = str.split(',');
			if (arr.length === 3) {
				r = parseInt(arr[0],10);
				g = parseInt(arr[1],10);
				b = parseInt(arr[2],10);
			}
		}
		return [r, g, b];
	}

	static rgbToHsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
		let max = Math.max(r, g, b), min = Math.min(r, g, b);
		let h, s, l = (max + min) / 2;
		if (max == min) {
			h = s = 0; // achromatic
		} else {
			let d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		return [h, s, l];
	}

	/*
	static hslToRgb(h, s, l) {
		let r, g, b;
		if (s == 0){
			r = g = b = l; // achromatic
		} else {
			let hue2rgb = function hue2rgb(p, q, t) {
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			};
			let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			let p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	*/
}
