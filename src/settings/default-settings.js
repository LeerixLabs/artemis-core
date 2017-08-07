/**
* This file is auto-generated from default-settings.json by gulp-prep.js
**/
export let defaultSettings = 
{
  "version": 1,
  "logLevel": "WARN",
  "language": "en",
  "commands": {
    "defaultSecondsToWaitBetweenCommands": 2
  },
  "actionPhrases": [
    {
      "phrase": "^(?:wait )([0-9.]+)(?: second)(?:s)?$",
      "action": "wait",
      "groupIndexValue": 1
    },
    {
      "phrase": "^(?:wait)$",
      "action": "wait"
    },
    {
      "phrase": "^(?:find )([\\S\\s]+)$",
      "action": "locate",
      "groupIndexTarget": 1
    },
    {
      "phrase": "^(?:click )([\\S\\s]+)$",
      "action": "click",
      "groupIndexTarget": 1
    },
    {
      "phrase": "^(?:enter )(?:\")([\\S\\s]+)(?:\")(?: in )([\\S\\s]+)$",
      "action": "write",
      "groupIndexValue": 1,
      "groupIndexTarget": 2
    },
    {
      "phrase": "^(?:enter )(?:')([\\S\\s]+)(?:')(?: in )([\\S\\s]+)$",
      "action": "write",
      "groupIndexValue": 1,
      "groupIndexTarget": 2
    },
    {
      "phrase": "^(?:enter )([\\S\\s]+)(?: in )([\\S\\s]+)$",
      "action": "write",
      "groupIndexValue": 1,
      "groupIndexTarget": 2
    }
  ],
  "definiteArticles": [
    "the"
  ],
  "___targetReplacements": [
    {
      "phrase": "([a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\\\\|,.<>\\/?]+)( octane-input)",
      "replace": "input inside $1 label"
    }
  ],
  "targetPhrases": [
    {
      "location": "objectType",
      "phrase": "\\*",
      "type": "elmType",
      "value": "element",
      "isObjectType": true
    },
    {
      "location": "objectType",
      "phrase": "(element|button|link|input|password|checkbox|radio|label|image|panel|toolbar|tab|dropdown|item)",
      "type": "elmType",
      "isObjectType": true
    },
    {
      "location": "preObjectType",
      "phrase": "([0-9]?1)st",
      "type": "elmOrdinal"
    },
    {
      "location": "preObjectType",
      "phrase": "([0-9]?2)nd",
      "type": "elmOrdinal"
    },
    {
      "location": "preObjectType",
      "phrase": "([0-9]?3)rd",
      "type": "elmOrdinal"
    },
    {
      "location": "preObjectType",
      "phrase": "(11|12|13)th",
      "type": "elmOrdinal"
    },
    {
      "location": "preObjectType",
      "phrase": "([0-9]?[0456789])th",
      "type": "elmOrdinal"
    },
    {
      "location": "preObjectType",
      "phrase": "(small|medium|large)",
      "type": "elmSize"
    },
    {
      "location": "preObjectType",
      "phrase": "(maroon|red|brown|orange|yellow|olive|lime|green|teal|aqua|turquoise|blue|navy|fuchsia|pink|purple|black|white|gray|grey|silver)",
      "type": "elmColor"
    },
    {
      "location": "preObjectType",
      "phrase": "(?:[\"])([a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\\\\|,.<>\\/?\\s]+)(?:[\"])",
      "type": "freeText"
    },
    {
      "location": "preObjectType",
      "phrase": "(?:['])([a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\\\\|,.<>\\/?\\s]+)(?:['])",
      "type": "freeText"
    },
    {
      "location": "preObjectType",
      "phrase": "([a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\\\\|,.<>\\/?]+)",
      "type": "freeText"
    },
    {
      "location": "postObjectType",
      "phrase": "at the top",
      "type": "elmLocation",
      "value": "top"
    },
    {
      "location": "postObjectType",
      "phrase": "at the bottom",
      "type": "elmLocation",
      "value": "bottom"
    },
    {
      "location": "postObjectType",
      "phrase": "on the left",
      "type": "elmLocation",
      "value": "left"
    },
    {
      "location": "postObjectType",
      "phrase": "on the right",
      "type": "elmLocation",
      "value": "right"
    },
    {
      "location": "postObjectType",
      "phrase": "in the middle",
      "type": "elmLocation",
      "value": "middle"
    },
    {
      "location": "postObjectType",
      "phrase": "(?:with|and) tag ([\\w-]+)",
      "type": "htmlTag"
    },
    {
      "location": "postObjectType",
      "phrase": "(?:with|and) attribute value ([\\w-]+)",
      "type": "htmlAttrVal"
    },
    {
      "location": "postObjectType",
      "phrase": "(?:with|and) attribute ([\\w-]+)=([\\w-]+)",
      "type": "htmlAttrNameAndVal"
    },
    {
      "location": "postObjectType",
      "phrase": "(?:with|and) attribute ([\\w-]+)",
      "type": "htmlAttrName"
    },
    {
      "location": "postObjectType",
      "phrase": "(?:with|and) class ([\\w-]+)",
      "type": "cssClass"
    },
    {
      "location": "postObjectType",
      "phrase": "(?:with|and) style ([\\w-]+):([\\w-]+)",
      "type": "cssStyleNameAndVal"
    },
    {
      "location": "postObjectType",
      "phrase": "(?:with|and) style ([\\w-]+)=([\\w-]+)",
      "type": "cssStyleNameAndVal"
    },
    {
      "location": "postObjectType",
      "phrase": "(?:to the )?left of",
      "type": "relPosition",
      "value": "left",
      "isObjectRelation": true
    },
    {
      "location": "postObjectType",
      "phrase": "(?:to the )?right of",
      "type": "relPosition",
      "value": "right",
      "isObjectRelation": true
    },
    {
      "location": "postObjectType",
      "phrase": "(above|below|near|inside)",
      "type": "relPosition",
      "isObjectRelation": true
    }
  ],
  "plans": [
    {
      "type": "elmType",
      "value": "element",
      "plan": {
        "scorer": "htmlTag",
        "value": "*"
      }
    },
    {
      "type": "elmType",
      "value": "button",
      "plan": {
        "or": [
          {
            "scorer": "htmlTag",
            "value": "button"
          },
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "input"
              },
              {
                "scorer": "htmlAttrNameAndVal",
                "value": [
                  "type",
                  "button"
                ]
              }
            ]
          },
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "input"
              },
              {
                "scorer": "htmlAttrNameAndVal",
                "value": [
                  "type",
                  "submit"
                ]
              }
            ]
          },
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "a"
              },
              {
                "scorer": "cssClass",
                "value": [
                  "button",
                  "btn"
                ]
              }
            ],
            "weight": 0.8
          },
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "img"
              },
              {
                "scorer": "cssClass",
                "value": [
                  "button",
                  "btn"
                ]
              }
            ],
            "weight": 0.6
          },
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "div"
              },
              {
                "scorer": "cssClass",
                "value": [
                  "button",
                  "btn"
                ]
              }
            ],
            "weight": 0.4
          },
          {
            "scorer": "htmlAttrNameAndVal",
            "value": [
              "role",
              "button"
            ]
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "link",
      "plan": {
        "or": [
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "a"
              },
              {
                "scorer": "htmlAttrName",
                "value": "href"
              }
            ]
          },
          {
            "scorer": "htmlAttrNameAndVal",
            "value": [
              "role",
              "link"
            ]
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "checkbox",
      "plan": {
        "or": [
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "input"
              },
              {
                "scorer": "htmlAttrNameAndVal",
                "value": [
                  "type",
                  "checkbox"
                ]
              }
            ]
          },
          {
            "scorer": "htmlAttrNameAndVal",
            "value": [
              "role",
              "checkbox"
            ]
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "radio",
      "plan": {
        "or": [
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "input"
              },
              {
                "scorer": "htmlAttrNameAndVal",
                "value": [
                  "type",
                  "radio"
                ]
              }
            ]
          },
          {
            "scorer": "htmlAttrNameAndVal",
            "value": [
              "role",
              "radio"
            ]
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "label",
      "plan": {
        "scorer": "htmlTag",
        "value": "label"
      }
    },
    {
      "type": "elmType",
      "value": "input",
      "plan": {
        "or": [
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "input"
              },
              {
                "scorer": "htmlAttrNameAndVal",
                "value": [
                  "type",
                  "text"
                ]
              }
            ]
          },
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "input"
              },
              {
                "scorer": "htmlAttrNameAndVal",
                "value": [
                  "type",
                  "search"
                ]
              }
            ]
          },
          {
            "scorer": "htmlTag",
            "value": "textarea",
            "weight": 0.7
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "password",
      "plan": {
        "or": [
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "input"
              },
              {
                "scorer": "htmlAttrNameAndVal",
                "value": [
                  "type",
                  "password"
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "image",
      "plan": {
        "or": [
          {
            "scorer": "htmlTag",
            "value": "img"
          },
          {
            "scorer": "htmlAttrNameAndVal",
            "value": [
              "role",
              "img"
            ]
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "panel",
      "plan": {
        "and": [
          {
            "scorer": "htmlTag",
            "value": "div"
          },
          {
            "scorer": "elmSize",
            "value": "large"
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "toolbar",
      "plan": {
        "or": [
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "div"
              },
              {
                "scorer": "cssClass",
                "value": "toolbar"
              }
            ]
          },
          {
            "scorer": "htmlAttrNameAndVal",
            "value": [
              "role",
              "toolbar"
            ]
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "tab",
      "plan": {
        "or": [
          {
            "and": [
              {
                "scorer": "htmlTag",
                "value": "div"
              },
              {
                "scorer": "cssClass",
                "value": "tab"
              }
            ]
          },
          {
            "scorer": "htmlAttrNameAndVal",
            "value": [
              "role",
              "tab"
            ]
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "dropdown",
      "plan": {
        "or": [
          {
            "scorer": "htmlTag",
            "value": "select"
          },
          {
            "scorer": "htmlAttrNameAndVal",
            "value": [
              "role",
              "combobox"
            ]
          }
        ]
      }
    },
    {
      "type": "elmType",
      "value": "item",
      "plan": {
        "or": [
          {
            "scorer": "htmlTag",
            "value": "option"
          },
          {
            "scorer": "htmlAttrNameAndVal",
            "value": [
              "role",
              "option"
            ]
          }
        ]
      }
    },
    {
      "type": "elmOrdinal",
      "plan": {
        "scorer": "elmOrdinal",
        "is-ordinal": true
      }
    },
    {
      "type": "elmSize",
      "plan": {
        "scorer": "elmSize"
      }
    },
    {
      "type": "elmColor",
      "plan": {
        "scorer": "elmColor"
      }
    },
    {
      "type": "freeText",
      "plan": {
        "scorer": "freeText"
      }
    },
    {
      "type": "elmLocation",
      "plan": {
        "scorer": "elmLocation"
      }
    },
    {
      "type": "htmlTag",
      "plan": {
        "scorer": "htmlTag"
      }
    },
    {
      "type": "htmlAttrName",
      "plan": {
        "scorer": "htmlAttrName"
      }
    },
    {
      "type": "htmlAttrVal",
      "plan": {
        "scorer": "htmlAttrVal"
      }
    },
    {
      "type": "htmlAttrNameAndVal",
      "plan": {
        "scorer": "htmlAttrNameAndVal"
      }
    },
    {
      "type": "cssClass",
      "plan": {
        "scorer": "cssClass"
      }
    },
    {
      "type": "cssStyleNameAndVal",
      "plan": {
        "scorer": "cssStyleNameAndVal"
      }
    },
    {
      "type": "relPosition",
      "plan": {
        "scorer": "relPosition",
        "isRelation": true
      }
    }
  ],
  "scorers": {
    "elmSize": {
      "small": 1024,
      "large": 16384
    },
    "elmColor": {
      "colors": [
        {
          "names": [
            "maroon",
            "red"
          ],
          "rgb": "#800000"
        },
        {
          "names": [
            "red"
          ],
          "rgb": "#FF0000"
        },
        {
          "names": [
            "brown"
          ],
          "rgb": "#994C00"
        },
        {
          "names": [
            "orange"
          ],
          "rgb": "#FF9900"
        },
        {
          "names": [
            "yellow"
          ],
          "rgb": "#FFFF00"
        },
        {
          "names": [
            "olive",
            "green"
          ],
          "rgb": "#808000"
        },
        {
          "names": [
            "lime",
            "green"
          ],
          "rgb": "#00FF00"
        },
        {
          "names": [
            "green"
          ],
          "rgb": "#008000"
        },
        {
          "names": [
            "teal",
            "turquoise",
            "blue"
          ],
          "rgb": "#008080"
        },
        {
          "names": [
            "aqua",
            "turquoise",
            "blue"
          ],
          "rgb": "#00FFFF"
        },
        {
          "names": [
            "blue"
          ],
          "rgb": "#0000FF"
        },
        {
          "names": [
            "navy",
            "blue"
          ],
          "rgb": "#000080"
        },
        {
          "names": [
            "fuchsia",
            "pink"
          ],
          "rgb": "#FF00FF"
        },
        {
          "names": [
            "purple"
          ],
          "rgb": "#800080"
        }
      ],
      "black": {
        "names": [
          "black"
        ],
        "rgb": "#000000",
        "value": 0.1
      },
      "white": {
        "names": [
          "white"
        ],
        "rgb": "#FFFFFF",
        "value": 0.9
      },
      "gray": {
        "names": [
          "gray",
          "grey",
          "silver"
        ],
        "rgb": "#808080",
        "value": 0.1
      },
      "hslFactors": [
        1,
        0.2,
        0.6
      ]
    },
    "elmOrdinal": {
      "minScore": 1
    }
  },
  "scoring": {
    "pruneScore": 0.01
  },
  "colors": {
    "singleMatchColor": "#339933",
    "scoreColors": [
      "#FFFFCC",
      "#FFFFB3",
      "#FFFF99",
      "#FFFF80",
      "#FFFF66",
      "#FFFF4D",
      "#FFFF33",
      "#FFFF1A",
      "#FFFF00",
      "#FFE600",
      "#FFCC00",
      "#FFB300",
      "#FF9900",
      "#FF8000",
      "#FF6600",
      "#FF4D00",
      "#FF3300",
      "#FF1A00",
      "#FF0000",
      "#E30000",
      "#CC0000"
    ]
  }
}
;