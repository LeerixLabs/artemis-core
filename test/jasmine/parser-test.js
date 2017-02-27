import {settings} from '../../src/settings';
import {Parser} from '../../src/parser/artemis-parser.js'

describe('Parser', () => {
	let parser = new Parser(settings);

	it('test basic output structure', () => {
		let modeledElmDesc = parser.parse('element');
		let expectedModel = {
			object: {
				type: 'elm-type',
				value: 'element'
			}
		};
		expect(JSON.stringify(modeledElmDesc, null, 4)).toEqual(JSON.stringify(expectedModel, null, 4));
	});

	it('test trim single spaces', () => {
		let modeledElmDesc = parser.parse(' element ');
		expect(modeledElmDesc.object.type).toEqual('elm-type');
		expect(modeledElmDesc.object.value).toEqual('element');
	});

	it('test trim double spaces', () => {
		let modeledElmDesc = parser.parse('  element  ');
		expect(modeledElmDesc.object.type).toEqual('elm-type');
		expect(modeledElmDesc.object.value).toEqual('element');
	});

	it('test trim the word "the"', () => {
		let modeledElmDesc = parser.parse('the element');
		expect(modeledElmDesc.object.type).toEqual('elm-type');
		expect(modeledElmDesc.object.value).toEqual('element');
	});

	it('test element types', () => {
		let elmTypes = [
			'element',
			'button',
			'link',
			'input',
			'checkbox',
			'radio',
			'label',
			'image',
			'panel',
			'toolbar',
			'tab',
			'dropdown',
			'item'
		];
		elmTypes.forEach( et => {
			let modeledElmDesc = parser.parse(et);
			expect(modeledElmDesc.object.type).toEqual('elm-type');
			expect(modeledElmDesc.object.value).toEqual(et);
		});
	});

	it('test 1st, 2nd, and 3rd element ordinals', () => {
		let elmOrdinals = [
			{s: '1st',    v: 1},
			{s: 'first',  v: 1},
			{s: '2nd',    v: 2},
			{s: 'second', v: 2},
			{s: '3rd',    v: 3},
			{s: 'third',  v: 3}
		];
		elmOrdinals.forEach( eo => {
			let modeledElmDesc = parser.parse(eo.s);
			expect(modeledElmDesc.object.type).toEqual('elm-ordinal');
			expect(modeledElmDesc.object.value).toEqual(eo.v);
		});
	});

	it('test n-th element ordinals', () => {
		let elmOrdinals = [
			{s: '4th',  v: '4'},
			{s: '5th',  v: '5'},
			{s: '10th', v: '10'}
		];
		elmOrdinals.forEach( eo => {
			let modeledElmDesc = parser.parse(eo.s);
			expect(modeledElmDesc.object.type).toEqual('elm-ordinal');
			expect(modeledElmDesc.object.value).toEqual(eo.v);
		});
	});

	it('test element size', () => {
		let elmSizes = [
			'small',
			'medium',
			'large'
		];
		elmSizes.forEach( es => {
			let modeledElmDesc = parser.parse(es);
			expect(modeledElmDesc.object.type).toEqual('elm-size');
			expect(modeledElmDesc.object.value).toEqual(es);
		});
	});

	it('test element color', () => {
		let elmColors = [
			'maroon',
			'red',
			'brown',
			'orange',
			'yellow',
			'olive',
			'lime',
			'green',
			'teal',
			'aqua',
			'blue',
			'navy',
			'pink',
			'purple',
			'black',
			'white',
			'gray'
		];
		elmColors.forEach( ec => {
			let modeledElmDesc = parser.parse(ec);
			expect(modeledElmDesc.object.type).toEqual('elm-color');
			expect(modeledElmDesc.object.value).toEqual(ec);
		});
	});

	it('test free text', () => {
		let modeledElmDesc = parser.parse(`MyFreeText`);
		expect(modeledElmDesc.object.type).toEqual('free-text');
		expect(modeledElmDesc.object.value).toEqual('MyFreeText');
	});

	it('test free text with underscores', () => {
		let modeledElmDesc = parser.parse(`my_free_text`);
		expect(modeledElmDesc.object.type).toEqual('free-text');
		expect(modeledElmDesc.object.value).toEqual('my_free_text');
	});

	it('test free text with hyphens', () => {
		let modeledElmDesc = parser.parse(`my-free-text`);
		expect(modeledElmDesc.object.type).toEqual('free-text');
		expect(modeledElmDesc.object.value).toEqual('my-free-text');
	});

	it('test free text with underscores and hyphens', () => {
		let modeledElmDesc = parser.parse(`my_free-text`);
		expect(modeledElmDesc.object.type).toEqual('free-text');
		expect(modeledElmDesc.object.value).toEqual('my_free-text');
	});

	it('test free text with single quotes', () => {
		let modeledElmDesc = parser.parse(`'My Free Text'`);
		expect(modeledElmDesc.object.type).toEqual('free-text');
		expect(modeledElmDesc.object.value).toEqual('My Free Text');
	});

	it('test free text with double quotes', () => {
		let modeledElmDesc = parser.parse(`"My Free Text"`);
		expect(modeledElmDesc.object.type).toEqual('free-text');
		expect(modeledElmDesc.object.value).toEqual('My Free Text');
	});

	it('test complex free text', () => {
		let modeledElmDesc = parser.parse(`"My_Free-Text __1 --2"`);
		expect(modeledElmDesc.object.type).toEqual('free-text');
		expect(modeledElmDesc.object.value).toEqual('My_Free-Text __1 --2');
	});

	it('test element location', () => {
		let elmLocations = [
			{s: 'at the top',    v: 'top'},
			{s: 'at the bottom', v: 'bottom'},
			{s: 'on the left',   v: 'left'},
			{s: 'on the right',  v: 'right'},
			{s: 'at the middle', v: 'middle'}
		];
		elmLocations.forEach( el => {
			let modeledElmDesc = parser.parse('element ' + el.s);
			expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
			expect(modeledElmDesc.object.and[0].value).toEqual('element');
			expect(modeledElmDesc.object.and[1].type).toEqual('elm-location');
			expect(modeledElmDesc.object.and[1].value).toEqual(el.v);
		});
	});

	it('test html tag', () => {
		let modeledElmDesc = parser.parse('element with tag div');
		expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('html-tag');
		expect(modeledElmDesc.object.and[1].value).toEqual('div');
	});

	it('test html tag with hyphens', () => {
		let modeledElmDesc = parser.parse('element with tag my-tag');
		expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('html-tag');
		expect(modeledElmDesc.object.and[1].value).toEqual('my-tag');
	});

	it('test html attribute name', () => {
		let modeledElmDesc = parser.parse('element with attribute aaa');
		expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('html-attr-name');
		expect(modeledElmDesc.object.and[1].value).toEqual('aaa');
	});

	it('test html attribute value', () => {
		let modeledElmDesc = parser.parse('element with attribute value bbb');
		expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('html-attr-val');
		expect(modeledElmDesc.object.and[1].value).toEqual('bbb');
	});

	it('test html attribute name and value', () => {
		let modeledElmDesc = parser.parse('element with attribute aaa=bbb');
		expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('html-attr-name-and-val');
		expect(modeledElmDesc.object.and[1].value.length).toEqual(2);
		expect(modeledElmDesc.object.and[1].value[0]).toEqual('aaa');
		expect(modeledElmDesc.object.and[1].value[1]).toEqual('bbb');
	});

	it('test css class', () => {
		let modeledElmDesc = parser.parse('element with class my-btn');
		expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('css-class');
		expect(modeledElmDesc.object.and[1].value).toEqual('my-btn');
	});

	it('test css style', () => {
		let modeledElmDesc = parser.parse('element with style margin-left:10px');
		expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('css-style-name-and-val');
		expect(modeledElmDesc.object.and[1].value.length).toEqual(2);
		expect(modeledElmDesc.object.and[1].value[0]).toEqual('margin-left');
		expect(modeledElmDesc.object.and[1].value[1]).toEqual('10px');
	});

	it('test multiple post object type properties added with the word "with"', () => {
		let modeledElmDesc = parser.parse('element with tag my-tag with class my-class');
		expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('html-tag');
		expect(modeledElmDesc.object.and[1].value).toEqual('my-tag');
		expect(modeledElmDesc.object.and[2].type).toEqual('css-class');
		expect(modeledElmDesc.object.and[2].value).toEqual('my-class');
	});

	it('test multiple post object type properties added with the word "and"', () => {
		let modeledElmDesc = parser.parse('element with tag my-tag and class my-class');
		expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('html-tag');
		expect(modeledElmDesc.object.and[1].value).toEqual('my-tag');
		expect(modeledElmDesc.object.and[2].type).toEqual('css-class');
		expect(modeledElmDesc.object.and[2].value).toEqual('my-class');
	});

	it('test element relative position', () => {
		let elmRelPositions = [
			{s: 'left of',  v: 'left'},
			{s: 'right of', v: 'right'},
			{s: 'above',    v: 'above'},
			{s: 'below',    v: 'below'},
			{s: 'near',		v: 'near'},
			{s: 'inside',   v: 'inside'}
		];
		elmRelPositions.forEach( erp => {
			let modeledElmDesc = parser.parse('element ' + erp.s + ' element');
			expect(modeledElmDesc.object.and[0].type).toEqual('elm-type');
			expect(modeledElmDesc.object.and[0].value).toEqual('element');
			expect(modeledElmDesc.object.and[1].type).toEqual('rel-position');
			expect(modeledElmDesc.object.and[1].value).toEqual(erp.v);
			expect(modeledElmDesc.object.and[1].object.type).toEqual('elm-type');
			expect(modeledElmDesc.object.and[1].object.value).toEqual('element');
		});
	});

	it('test complex sentencen', () => {
		let elm1 = `small blue log-in button with attribute type=submit`;
		let elm2 = `2nd "password" input with class secret-field and style margin-left:10px`;
		let elm3 = `'user profile' panel with tag div`;
		let modeledElmDesc = parser.parse(` ${elm1}  below   the ${elm2}  inside   the ${elm3} `);
		let expectedModel = {
			object: {
				and: [
					{
						type: 'elm-size',
						value: 'small'
					},
					{
						type: 'elm-color',
						value: 'blue'
					},
					{
						type: 'free-text',
						value: 'log-in'
					},
					{
						type: 'elm-type',
						value: 'button'
					},
					{
						type: 'html-attr-name-and-val',
						value: ['type', 'submit']
					},
					{
						type: 'rel-position',
						value: 'below',
						object: {
							and: [
								{
									type: 'elm-ordinal',
									value: 2
								},
								{
									type: 'free-text',
									value: 'password'
								},
								{
									type: 'elm-type',
									value: 'input'
								},
								{
									type: 'css-class',
									value: 'secret-field'
								},
								{
									type: 'css-style-name-and-val',
									value: ['margin-left', '10px']
								}
							]
						}
					},
					{
						type: 'rel-position',
						value: 'inside',
						object: {
							and: [
								{
									type: 'free-text',
									value: 'user profile'
								},
								{
									type: 'elm-type',
									value: 'panel'
								},
								{
									type: 'html-tag',
									value: 'div'
								}
							]
						}
					}
				]
			}
		};
		expect(JSON.stringify(modeledElmDesc, null, 4)).toEqual(JSON.stringify(expectedModel, null, 4));
	});

});
