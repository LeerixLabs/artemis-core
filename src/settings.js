export let settings = {
	"version":	1,
	"logLevel": "WARN",
	"language": "en",
	"commands": {
		"secondsBetweenCommands": 3,
	},
	"actionPhrases" : [
		{
			"phrase": "^(?:wait)$",
			"action": "wait"
		},
		{
			"phrase": "^(?:find |locate )([\\S\\s]+)$",
			"action": "locate",
			"numOfGroups": 1,
			"groupIndexTarget": 1
		},
		{
			"phrase": "^(?:click |push |press |select )([\\S\\s]+)$",
			"action": "click",
			"numOfGroups": 1,
			"groupIndexTarget": 1
		},
		{
			"phrase": "^(?:enter )(?:\")([\\S\\s]+)(?:\")(?: in )([\\S\\s]+)$",
			"action": "write",
			"numOfGroups": 2,
			"groupIndexValue": 1,
			"groupIndexTarget": 2
		},
		{
			"phrase": "^(?:enter )(?:\')([\\S\\s]+)(?:\')(?: in )([\\S\\s]+)$",
			"action": "write",
			"numOfGroups": 2,
			"groupIndexValue": 1,
			"groupIndexTarget": 2
		},
		{
			"phrase": "^(?:enter )([\\S\\s]+)(?: in )([\\S\\s]+)$",
			"action": "write",
			"numOfGroups": 2,
			"groupIndexValue": 1,
			"groupIndexTarget": 2
		}
	],
	"targetPhrases": [
		{
			"location": "object-type",
			"phrase": "(element|button|link|input|checkbox|radio|label|image|panel|toolbar|tab|dropdown|item)",
			"type": "elm-type",
			"isObjectType": true
		},
		{
			"location": "pre-object-type",
			"phrase": "(1st|first)",
			"type": "elm-ordinal",
			"value": 1
		},
		{
			"location": "pre-object-type",
			"phrase": "(2nd|second)",
			"type": "elm-ordinal",
			"value": 2
		},
		{
			"location": "pre-object-type",
			"phrase": "(3rd|third)",
			"type": "elm-ordinal",
			"value": 3
		},
		{
			"location": "pre-object-type",
			"phrase": "([0-9]+)th",
			"type": "elm-ordinal"
		},
		{
			"location": "pre-object-type",
			"phrase": "(small|medium|large)",
			"type": "elm-size"
		},
		{
			"location": "pre-object-type",
			"phrase": "(maroon|red|brown|orange|yellow|olive|lime|green|teal|aqua|blue|navy|pink|purple|black|white|gray)",
			"type": "elm-color"
		},
		{
			"location": "pre-object-type",
			"phrase": "(?:['|\"])([\\w\\s-]+)(?:['|\"])",
			"type": "free-text"
		},
		{
			"location": "pre-object-type",
			"phrase": "([\\w-]+)",
			"type": "free-text"
		},
		{
			"location": "post-object-type",
			"phrase": "at the top",
			"type": "elm-location",
			"value": "top"
		},
		{
			"location": "post-object-type",
			"phrase": "at the bottom",
			"type": "elm-location",
			"value": "bottom"
		},
		{
			"location": "post-object-type",
			"phrase": "on the left",
			"type": "elm-location",
			"value": "left"
		},
		{
			"location": "post-object-type",
			"phrase": "on the right",
			"type": "elm-location",
			"value": "right"
		},
		{
			"location": "post-object-type",
			"phrase": "at the middle",
			"type": "elm-location",
			"value": "middle"
		},
		{
			"location": "post-object-type",
			"phrase": "(?:with|and) tag ([\\w-]+)",
			"type": "html-tag"
		},
		{
			"location": "post-object-type",
			"phrase": "(?:with|and) attribute value ([\\w-]+)",
			"type": "html-attr-val"
		},
		{
			"location": "post-object-type",
			"phrase": "(?:with|and) attribute ([\\w-]+)=([\\w-]+)",
			"type": "html-attr-name-and-val"
		},
		{
			"location": "post-object-type",
			"phrase": "(?:with|and) attribute ([\\w-]+)",
			"type": "html-attr-name"
		},
		{
			"location": "post-object-type",
			"phrase": "(?:with|and) class ([\\w-]+)",
			"type": "css-class"
		},
		{
			"location": "post-object-type",
			"phrase": "(?:with|and) style ([\\w-]+):([\\w-]+)",
			"type": "css-style-name-and-val"
		},
		{
			"location": "post-object-type",
			"phrase": "(?:with|and) style ([\\w-]+)=([\\w-]+)",
			"type": "css-style-name-and-val"
		},
		{
			"location": "post-object-type",
			"phrase": "left of",
			"type": "rel-position",
			"value": "left",
			"isObjectRelation": true
		},
		{
			"location": "post-object-type",
			"phrase": "right of",
			"type": "rel-position",
			"value": "right",
			"isObjectRelation": true
		},
		{
			"location": "post-object-type",
			"phrase": "(above|below|near|inside)",
			"type": "rel-position",
			"isObjectRelation": true
		}
	],
	"plans": [
		{
			"type": "elm-type",
			"value": "element",
			"plan": {
				"scorer": "html-tag",
				"value": "*"
			}
		},
		{
			"type": "elm-type",
			"value": "button",
			"plan": {
				"or": [
					{
						"scorer": "html-tag",
						"value": "button"
					},
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "input"
							},
							{
								"scorer": "html-attr-name-and-val",
								"value": ["type", "button"]
							}
						]
					},
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "input"
							},
							{
								"scorer": "html-attr-name-and-val",
								"value": ["type", "submit"]
							}
						]
					},
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "a"
							},
							{
								"scorer": "css-class",
								"value": ["button", "btn"]
							}
						],
						"weight": 0.8
					},
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "img"
							},
							{
								"scorer": "css-class",
								"value": ["button", "btn"]
							}
						],
						"weight": 0.6
					},
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "div"
							},
							{
								"scorer": "css-class",
								"value": ["button", "btn"]
							}
						],
						"weight": 0.4
					},
					{
						"scorer": "html-attr-name-and-val",
						"value": ["role", "button"]
					}
				]
			}
		},
		{
			"type": "elm-type",
			"value": "link",
			"plan": {
				"or": [
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "a"
							},
							{
								"scorer": "html-attr-name",
								"value": "href"
							}
						]
					},
					{
						"scorer": "html-attr-name-and-val",
						"value": ["role", "link"]
					}
				]
			}
		},
		{
			"type": "elm-type",
			"value": "checkbox",
			"plan": {
				"or" : [
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "input"
							},
							{
								"scorer": "html-attr-name-and-val",
								"value": ["type", "checkbox"]
							}
						]
					},
					{
						"scorer": "html-attr-name-and-val",
						"value": ["role", "checkbox"]
					}
				]
			}
		},
		{
			"type": "elm-type",
			"value": "radio",
			"plan": {
				"or": [
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "input"
							},
							{
								"scorer": "html-attr-name-and-val",
								"value": ["type", "radio"]
							}
						]
					},
					{
						"scorer": "html-attr-name-and-val",
						"value": ["role", "radio"]
					}
				]
			}
		},
		{
			"type": "elm-type",
			"value": "label",
			"plan": {
				"scorer": "html-tag",
				"value": "label"
			}
		},
		{
			"type": "elm-type",
			"value": "input",
			"plan": {
				"or": [
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "input"
							},
							{
								"scorer": "html-attr-name-and-val",
								"value": ["type", "text"]
							}
						]
					},
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "input"
							},
							{
								"scorer": "html-attr-name-and-val",
								"value": ["type", "search"]
							}
						]
					},
					{
						"scorer": "html-tag",
						"value": "textarea",
						"weight": 0.7
					}
				]
			}
		},
		{
			"type": "elm-type",
			"value": "image",
			"plan": {
				"or": [
					{
						"scorer": "html-tag",
						"value": "img"
					},
					{
						"scorer": "html-attr-name-and-val",
						"value": ["role", "img"]
					}
				]
			}
		},
		{
			"type": "elm-type",
			"value": "panel",
			"plan": {
				"and": [
					{
						"scorer": "html-tag",
						"value": "div"
					},
					{
						"scorer": "elm-size",
						"value": "large"
					}
				]
			}
		},
		{
			"type": "elm-type",
			"value": "toolbar",
			"plan": {
				"or" : [
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "div"
							},
							{
								"scorer": "css-class",
								"value": "toolbar"
							}
						]
					},
					{
						"scorer": "html-attr-name-and-val",
						"value": ["role", "toolbar"]
					}
				]
			}
		},
		{
			"type": "elm-type",
			"value": "tab",
			"plan": {
				"or" : [
					{
						"and": [
							{
								"scorer": "html-tag",
								"value": "div"
							},
							{
								"scorer": "css-class",
								"value": "tab"
							}
						]
					},
					{
						"scorer": "html-attr-name-and-val",
						"value": ["role", "tab"]
					}
				]
			}
		},
		{
			"type": "elm-type",
			"value": "dropdown",
			"plan": {
				"or": [
					{
						"scorer": "html-tag",
						"value": "select"
					},
					{
						"scorer": "html-attr-name-and-val",
						"value": ["role", "combobox"]
					}
				]
			}
		},
		{
			"type": "elm-type",
			"value": "item",
			"plan": {
				"or" : [
					{
						"scorer": "html-tag",
						"value": "option"
					},
					{
						"scorer": "html-attr-name-and-val",
						"value": ["role", "option"]
					}
				]
			}
		},
		{
			"type": "elm-ordinal",
			"plan": {
				"scorer": "elm-ordinal",
				"is-ordinal": true
			}
		},
		{
			"type": "elm-size",
			"plan": {
				"scorer": "elm-size"
			}
		},
		{
			"type": "elm-color",
			"plan": {
				"scorer": "elm-color"
			}
		},
		{
			"type": "free-text",
			"plan": {
				"scorer": "free-text"
			}
		},
		{
			"type": "elm-location",
			"plan": {
				"scorer": "elm-location"
			}
		},
		{
			"type": "html-tag",
			"plan": {
				"scorer": "html-tag"
			}
		},
		{
			"type": "html-attr-name",
			"plan": {
				"scorer": "html-attr-name"
			}
		},
		{
			"type": "html-attr-val",
			"plan": {
				"scorer": "html-attr-val"
			}
		},
		{
			"type": "html-attr-name-and-val",
			"plan": {
				"scorer": "html-attr-name-and-val"
			}
		},
		{
			"type": "css-class",
			"plan": {
				"scorer": "css-class"
			}
		},
		{
			"type": "css-style-name-and-val",
			"plan": {
				"scorer": "css-style-name-and-val"
			}
		},
		{
			"type": "rel-position",
			"plan": {
				"scorer": "rel-position",
				"isRelation": true
			}
		}
	],
	"scorers": {
		"elm-size": {
			"small": 1024,
			"large": 16384
		},
		"elm-color": {
			colors: [
				{name: "maroon", rgb: "#800000"},
				{name: "red",    rgb: "#FF0000"},
				{name: "brown",  rgb: "#994C00"},
				{name: "orange", rgb: "#FF9900"},
				{name: "yellow", rgb: "#FFFF00"},
				{name: "olive",  rgb: "#808000"},
				{name: "lime",   rgb: "#00FF00"},
				{name: "green",  rgb: "#008000"},
				{name: "teal",   rgb: "#008080"},
				{name: "aqua",   rgb: "#00FFFF"},
				{name: "blue",   rgb: "#0000FF"},
				{name: "navy",   rgb: "#000080"},
				{name: "pink",   rgb: "#FF00FF"},
				{name: "purple", rgb: "#800080"}
			],
			black: {
				name: "black",
				rgb: "#000000",
				value: 0.1
			},
			white: {
				name: "white",
				rgb: "#FFFFFF",
				value: 0.9
			},
			gray: {
				name: "gray",
				rgb: "#808080",
				value: 0.1
			},
			"hslFactors": [1, 0.2, 0.6]
		},
		"elm-ordinal": {
			"minScore": 1
		}
	},
	"scoring": {
		"pruneScore": 0.01
	},
	"colors": {
		"singleMatchColor": "#339933",
		"scoreColors": [
			'#FFFFCC',
			'#FFFFB3',
			'#FFFF99',
			'#FFFF80',
			'#FFFF66',
			'#FFFF4D',
			'#FFFF33',
			'#FFFF1A',
			'#FFFF00',
			'#FFE600',
			'#FFCC00',
			'#FFB300',
			'#FF9900',
			'#FF8000',
			'#FF6600',
			'#FF4D00',
			'#FF3300',
			'#FF1A00',
			'#FF0000',
			'#E30000',
			'#CC0000'
		]
	}
};
