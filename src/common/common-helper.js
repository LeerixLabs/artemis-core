export default class Helper {

	static toJSON(object) {
		return JSON.stringify(object, null, 4);
	}

	static extend(destination, source) {
		for (let property in source)
			destination[property] = source[property];
		return destination;
	}

}
