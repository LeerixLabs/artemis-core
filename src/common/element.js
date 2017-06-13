export default class Element {

	constructor(id, domElm) {
		this._id = id;
		this._scores = [];
		this._domElm = domElm;
		this._window = null;
		this._document = null;
		this._tagName = null;
		this._classList = null;
		this._attributes = null;
		this._size = null;
		this._rect = null;
	}

	get id() {return this._id;}
	set id(value) {this._id = value;}

	get scores() {return this._scores;}
	getScore(targetIndex) {
		return this._scores[targetIndex];
	}
	setScore(targetIndex, score) {
		this._scores[targetIndex] = score;
	}
	get primaryScore() {return this._scores[0];}
	set primaryScore(score) {this._scores[0] = score;}

	get domElm() {return this._domElm;}
	set domElm(value) {this._domElm = value;}

	get window() {
		if (this._window === null) {
			this._window = this.document.defaultView || this.document.parentWindow;
		}
		return this._window;
	}

	get document() {
		if (this._document === null) {
			this._document = this._domElm.ownerDocument
		}
		return this._document;
	}

	get tagName() {
		if (this._tagName === null) {
			this._tagName = this._domElm.tagName.toLowerCase();
		}
		return this._tagName;
	}

	get classList() {
		if (this._classList === null) {
			this._classList = this._domElm.classList;
		}
		return this._classList;
	}

	get attributes() {
		if (this._attributes === null) {
			this._attributes = this._domElm.attributes;
		}
		return this._attributes;
	}

	get size() {
		if (this._size === null) {
			let isSvg = this._domElm.tagName.toLowerCase() === 'svg';
			let w = (isSvg ? this._domElm.getBBox().width : this._domElm && this._domElm.offsetWidth) || 0;
			let h = (isSvg ? this._domElm.getBBox().height : this._domElm && this._domElm.offsetHeight) || 0;
			this._size = w*h;
		}
		return this._size;
	}

	get rect() {
		if (this._rect === null) {
			this._rect = this._domElm.getBoundingClientRect();
		}
		return this._rect;
	}

	reportData() {
		return {
			id: this.id,
			tag: this.tagName,
			primaryScore: this.primaryScore,
			domElm: this.domElm
		}
	}

}
