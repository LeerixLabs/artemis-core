import {defaultSettings} from '../../src/settings/default-settings';
import Parser from '../../src/parser/artemis-parser'

describe('Target Parser Test', () => {
	let parser = new Parser(defaultSettings);

	it('test basic output structure', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('element');
		let expectedModel = {
			object: {
				type: 'elmType',
				value: 'element'
			}
		};
		expect(JSON.stringify(modeledElmDesc, null, 4)).toEqual(JSON.stringify(expectedModel, null, 4));
	});

	it('test trim single spaces', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(' element ');
		expect(modeledElmDesc.object.type).toEqual('elmType');
		expect(modeledElmDesc.object.value).toEqual('element');
	});

	it('test trim double spaces', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('  element  ');
		expect(modeledElmDesc.object.type).toEqual('elmType');
		expect(modeledElmDesc.object.value).toEqual('element');
	});

	it('test trim the word "the"', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('the element');
		expect(modeledElmDesc.object.type).toEqual('elmType');
		expect(modeledElmDesc.object.value).toEqual('element');
	});

	it('test element types', () => {
		let elmTypes = [
			'element',
			'button',
			'link',
			'input',
			'password',
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
			let modeledElmDesc = parser._buildElementDescriptionModel(et);
			expect(modeledElmDesc.object.type).toEqual('elmType');
			expect(modeledElmDesc.object.value).toEqual(et);
		});
	});

	it('test element ordinals', () => {
		let elmOrdinals = [
			{s: '1st',  v: '1'},
			{s: '2nd',  v: '2'},
			{s: '3rd',  v: '3'},
			{s: '4th',  v: '4'},
			{s: '11th',	v: '11'},
			{s: '12th', v: '12'},
			{s: '13th', v: '13'},
			{s: '14th', v: '14'},
			{s: '21st', v: '21'},
			{s: '22nd', v: '22'},
			{s: '23rd', v: '23'},
			{s: '24th', v: '24'}
		];
		elmOrdinals.forEach( eo => {
			let modeledElmDesc = parser._buildElementDescriptionModel(eo.s);
			expect(modeledElmDesc.object.type).toEqual('elmOrdinal');
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
			let modeledElmDesc = parser._buildElementDescriptionModel(es);
			expect(modeledElmDesc.object.type).toEqual('elmSize');
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
			'turquoise',
			'blue',
			'navy',
			'fuchsia',
			'pink',
			'purple',
			'black',
			'white',
			'gray',
			'grey',
			'silver'
		];
		elmColors.forEach( ec => {
			let modeledElmDesc = parser._buildElementDescriptionModel(ec);
			expect(modeledElmDesc.object.type).toEqual('elmColor');
			expect(modeledElmDesc.object.value).toEqual(ec);
		});
	});

	it('test free text', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`MyFreeText`);
		expect(modeledElmDesc.object.type).toEqual('freeText');
		expect(modeledElmDesc.object.value).toEqual('MyFreeText');
	});

	it('test free text with underscores', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`my_free_text`);
		expect(modeledElmDesc.object.type).toEqual('freeText');
		expect(modeledElmDesc.object.value).toEqual('my_free_text');
	});

	it('test free text with hyphens', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`my-free-text`);
		expect(modeledElmDesc.object.type).toEqual('freeText');
		expect(modeledElmDesc.object.value).toEqual('my-free-text');
	});

	it('test free text with underscores and hyphens', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`my_free-text`);
		expect(modeledElmDesc.object.type).toEqual('freeText');
		expect(modeledElmDesc.object.value).toEqual('my_free-text');
	});

	it('test free text with single quotes', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`'My Free Text'`);
		expect(modeledElmDesc.object.type).toEqual('freeText');
		expect(modeledElmDesc.object.value).toEqual('My Free Text');
	});

	it('test free text with double quotes', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`"My Free Text"`);
		expect(modeledElmDesc.object.type).toEqual('freeText');
		expect(modeledElmDesc.object.value).toEqual('My Free Text');
	});

	it('test complex free text', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`"My_Free-Text __1 --2"`);
		expect(modeledElmDesc.object.type).toEqual('freeText');
		expect(modeledElmDesc.object.value).toEqual('My_Free-Text __1 --2');
	});

	it('test element location', () => {
		let elmLocations = [
			{s: 'at the top',    v: 'top'},
			{s: 'at the bottom', v: 'bottom'},
			{s: 'on the left',   v: 'left'},
			{s: 'on the right',  v: 'right'},
			{s: 'in the middle', v: 'middle'}
		];
		elmLocations.forEach( el => {
			let modeledElmDesc = parser._buildElementDescriptionModel('element ' + el.s);
			expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
			expect(modeledElmDesc.object.and[0].value).toEqual('element');
			expect(modeledElmDesc.object.and[1].type).toEqual('elmLocation');
			expect(modeledElmDesc.object.and[1].value).toEqual(el.v);
		});
	});

	it('test html tag', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('element with tag div');
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlTag');
		expect(modeledElmDesc.object.and[1].value).toEqual('div');
	});

	it('test html tag with hyphens', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('element with tag my-tag');
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlTag');
		expect(modeledElmDesc.object.and[1].value).toEqual('my-tag');
	});

	it('test html attribute name', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('element with attribute name aaa');
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlAttrName');
		expect(modeledElmDesc.object.and[1].value).toEqual('aaa');
	});

	it('test html attribute value', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('element with attribute value bbb');
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlAttrVal');
		expect(modeledElmDesc.object.and[1].value).toEqual('bbb');
	});

	it('test html attribute value with single quotes', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`element with attribute value 'bbb bbb'`);
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlAttrVal');
		expect(modeledElmDesc.object.and[1].value).toEqual('bbb bbb');
	});

	it('test html attribute value with double quotes', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`element with attribute value "bbb bbb"`);
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlAttrVal');
		expect(modeledElmDesc.object.and[1].value).toEqual('bbb bbb');
	});

	it('test html attribute name and value', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('element with attribute ccc=ddd');
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlAttrNameAndVal');
		expect(modeledElmDesc.object.and[1].value.length).toEqual(2);
		expect(modeledElmDesc.object.and[1].value[0]).toEqual('ccc');
		expect(modeledElmDesc.object.and[1].value[1]).toEqual('ddd');
	});

	it('test html attribute name and value with single quotes', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`element with attribute ccc="1 2"`);
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlAttrNameAndVal');
		expect(modeledElmDesc.object.and[1].value.length).toEqual(2);
		expect(modeledElmDesc.object.and[1].value[0]).toEqual('ccc');
		expect(modeledElmDesc.object.and[1].value[1]).toEqual('1 2');
	});

	it('test html attribute name and value with double quotes', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`element with attribute ccc="1 2"`);
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlAttrNameAndVal');
		expect(modeledElmDesc.object.and[1].value.length).toEqual(2);
		expect(modeledElmDesc.object.and[1].value[0]).toEqual('ccc');
		expect(modeledElmDesc.object.and[1].value[1]).toEqual('1 2');
	});

	it('test css class', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('element with class my-btn');
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('cssClass');
		expect(modeledElmDesc.object.and[1].value).toEqual('my-btn');
	});

	it('test css style', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('element with style margin-left:10px');
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('cssStyleNameAndVal');
		expect(modeledElmDesc.object.and[1].value.length).toEqual(2);
		expect(modeledElmDesc.object.and[1].value[0]).toEqual('margin-left');
		expect(modeledElmDesc.object.and[1].value[1]).toEqual('10px');
	});

	it('test css style with single quotes', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`element with style flex:'1 1 auto'`);
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('cssStyleNameAndVal');
		expect(modeledElmDesc.object.and[1].value.length).toEqual(2);
		expect(modeledElmDesc.object.and[1].value[0]).toEqual('flex');
		expect(modeledElmDesc.object.and[1].value[1]).toEqual('1 1 auto');
	});

	it('test css style with double quotes', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel(`element with style flex:"0 0 auto"`);
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('cssStyleNameAndVal');
		expect(modeledElmDesc.object.and[1].value.length).toEqual(2);
		expect(modeledElmDesc.object.and[1].value[0]).toEqual('flex');
		expect(modeledElmDesc.object.and[1].value[1]).toEqual('0 0 auto');
	});

	it('test multiple post object type properties added with the word "with"', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('element with tag my-tag with class my-class');
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlTag');
		expect(modeledElmDesc.object.and[1].value).toEqual('my-tag');
		expect(modeledElmDesc.object.and[2].type).toEqual('cssClass');
		expect(modeledElmDesc.object.and[2].value).toEqual('my-class');
	});

	it('test multiple post object type properties added with the word "and"', () => {
		let modeledElmDesc = parser._buildElementDescriptionModel('element with tag my-tag and class my-class');
		expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
		expect(modeledElmDesc.object.and[0].value).toEqual('element');
		expect(modeledElmDesc.object.and[1].type).toEqual('htmlTag');
		expect(modeledElmDesc.object.and[1].value).toEqual('my-tag');
		expect(modeledElmDesc.object.and[2].type).toEqual('cssClass');
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
			let modeledElmDesc = parser._buildElementDescriptionModel('element ' + erp.s + ' element');
			expect(modeledElmDesc.object.and[0].type).toEqual('elmType');
			expect(modeledElmDesc.object.and[0].value).toEqual('element');
			expect(modeledElmDesc.object.and[1].type).toEqual('relPosition');
			expect(modeledElmDesc.object.and[1].value).toEqual(erp.v);
			expect(modeledElmDesc.object.and[1].object.type).toEqual('elmType');
			expect(modeledElmDesc.object.and[1].object.value).toEqual('element');
		});
	});

	it('test complex sentencen', () => {
		let elm1 = `small blue log-in button with attribute type=submit`;
		let elm2 = `2nd "password" input with class secret-field and style margin-left:10px`;
		let elm3 = `'user profile' panel with tag div`;
		let modeledElmDesc = parser._buildElementDescriptionModel(` ${elm1} below the ${elm2} inside the ${elm3} `);
		let expectedModel = {
			object: {
				and: [
					{
						type: 'elmSize',
						value: 'small'
					},
					{
						type: 'elmColor',
						value: 'blue'
					},
					{
						type: 'freeText',
						value: 'log-in'
					},
					{
						type: 'elmType',
						value: 'button'
					},
					{
						type: 'htmlAttrNameAndVal',
						value: ['type', 'submit']
					},
					{
						type: 'relPosition',
						value: 'below',
						object: {
							and: [
								{
									type: 'elmOrdinal',
									value: '2'
								},
								{
									type: 'freeText',
									value: 'password'
								},
								{
									type: 'elmType',
									value: 'input'
								},
								{
									type: 'cssClass',
									value: 'secret-field'
								},
								{
									type: 'cssStyleNameAndVal',
									value: ['margin-left', '10px']
								}
							]
						}
					},
					{
						type: 'relPosition',
						value: 'inside',
						object: {
							and: [
								{
									type: 'freeText',
									value: 'user profile'
								},
								{
									type: 'elmType',
									value: 'panel'
								},
								{
									type: 'htmlTag',
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
