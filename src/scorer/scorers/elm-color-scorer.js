export default class ElmColorScorer {

	constructor(name, settings){
		this.name = name;
		this._settings = settings;
		this._config = this._settings && this._settings.scorers && this._settings.scorers['elm-color'];
		if (!this._config) {
			this._config = {
				colors: [
					{name: 'maroon', rgb: '#800000'},
					{name: 'red',    rgb: '#FF0000'},
					{name: 'brown',  rgb: '#994C00'},
					{name: 'orange', rgb: '#FF9900'},
					{name: 'yellow', rgb: '#FFFF00'},
					{name: 'olive',  rgb: '#808000'},
					{name: 'lime',   rgb: '#00FF00'},
					{name: 'green',  rgb: '#008000'},
					{name: 'teal',   rgb: '#008080'},
					{name: 'aqua',   rgb: '#00FFFF'},
					{name: 'blue',   rgb: '#0000FF'},
					{name: 'navy',   rgb: '#000080'},
					{name: 'pink',   rgb: '#FF00FF'},
					{name: 'purple', rgb: '#800080'}
				],
				black: {
					name: 'black',
					rgb: '#000000',
					value: 0.1
				},
				white: {
					name: 'white',
					rgb: '#FFFFFF',
					value: 0.9
				},
				gray: {
					name: 'gray',
					rgb: '#808080',
					value: 0.1
				},
				'hsl-factors': [1, 0.2, 0.6]
			};
		}
		for (let i = 0; i < this._config.colors.length; i++) {
			let rgb = ElmColorScorer.strToRgb(this._config.colors[i].rgb);
			let hsl = ElmColorScorer.rgbToHsl(rgb[0], rgb[1], rgb[2]);
			this._config.colors[i].hsl = [hsl[0], hsl[1], hsl[2]];
		}
	}

	score(elm, val) {
		//val can be a value from the supported color list
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

	_getClosestColor(colorStr) {
		let rgb, hsl, closestDiff, diff;
		let config = this._config;
		let closestColorIndex = -1;
		rgb = ElmColorScorer.strToRgb(colorStr);
		hsl = ElmColorScorer.rgbToHsl(rgb[0], rgb[1], rgb[2]);
		if (hsl[2] < config.black.value) {
			return config.black;
		}
		if (hsl[2] > config.white.value) {
			return config.white;
		}
		if (hsl[1] < config.gray.value) {
			return config.gray;
		}
		closestDiff = Number.MAX_VALUE;
		for (let i = 0; i < config.colors.length; i++) {
			diff =
			config['hsl-factors'][0]*Math.abs(config.colors[i].hsl[0] - hsl[0]) +
			config['hsl-factors'][1]*Math.abs(config.colors[i].hsl[1] - hsl[1]) +
			config['hsl-factors'][2]*Math.abs(config.colors[i].hsl[2] - hsl[2]);
			if (diff < closestDiff) {
				closestDiff = diff;
				closestColorIndex = i;
			}
		}
		return config.colors[closestColorIndex];
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
