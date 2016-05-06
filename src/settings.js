export let settings = {
  "version":	1,
  "log-level": "DEBUG",
  "language": "en",
  "phrases": [
    {
      "location": "object-type",
      "phrase": "(element|button|link|input|checkbox|radio|label|image|panel|toolbar|tab|dropdown|item)",
      "type": "elm-type",
      "is-object-type": true
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
      "phrase": "(red|orange|yellow|green|blue|purple|pink|brown|gray|black|white)",
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
      "phrase": "left of",
      "type": "rel-position",
      "value": "left-of",
      "is-object-relation": true
    },
    {
      "location": "post-object-type",
      "phrase": "right of",
      "type": "rel-position",
      "value": "right-of",
      "is-object-relation": true
    },
    {
      "location": "post-object-type",
      "phrase": "(above|below|inside)",
      "type": "rel-position",
      "is-object-relation": true
    }
  ],
  "plans": [
    {
      "type": "elm-type",
      "value": "button",
      "plan": {
        "or": [
          {
            "scorer": "html-tag",
            "param": "button",
            "weight": 1
          },
          {
            "and": [
              {
                "scorer": "html-tag",
                "param": "input",
                "weight": 1
              },
              {
                "scorer": "html-attr-name-and-val",
                "param": [
                  "type",
                  "button"
                ],
                "weight": 1
              }
            ],
            "weight": 1
          },
          {
            "and": [
              {
                "scorer": "html-tag",
                "param": "input",
                "weight": 1
              },
              {
                "scorer": "html-attr-name-and-val",
                "param": [
                  "type",
                  "submit"
                ],
                "weight": 1
              }
            ],
            "weight": 1
          },
          {
            "and": [
              {
                "scorer": "html-tag",
                "param": "a",
                "weight": 1
              },
              {
                "scorer": "css-class",
                "param": [
                  "button",
                  "btn"
                ],
                "weight": 1
              }
            ],
            "weight": 0.8
          },
          {
            "and": [
              {
                "scorer": "html-tag",
                "param": "img",
                "weight": 1
              },
              {
                "scorer": "css-class",
                "param": [
                  "button",
                  "btn"
                ],
                "weight": 1
              }
            ],
            "weight": 0.6
          },
          {
            "and": [
              {
                "scorer": "html-tag",
                "param": "div",
                "weight": 1
              },
              {
                "scorer": "css-class",
                "param": [
                  "button",
                  "btn"
                ],
                "weight": 1
              }
            ],
            "weight": 0.4
          }
        ]
      }
    },
    {
      "type": "elm-type",
      "value": "input",
      "plan": {
        "or": [
          {
            "scorer": "html-tag",
            "param": "textarea",
            "weight": 0.7
          },
          {
            "scorer": "html-tag",
            "param": "input",
            "weight": 1
          },
          {
            "and": [
              {
                "scorer": "html-tag",
                "param": "input",
                "weight": 1
              },
              {
                "scorer": "html-attr-name-and-val",
                "param": [
                  "type",
                  "checkbox"
                ],
                "weight": 0.01
              }
            ],
            "weight": 1
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
            "scorer": "html-tag",
            "param": "a",
            "weight": 0.7
          },
          {
            "and": [
              {
                "scorer": "html-tag",
                "param": "a",
                "weight": 1
              },
              {
                "scorer": "html-attr-name",
                "param": "href",
                "weight": 1
              }
            ],
            "weight": 1
          },
          {
            "and": [
              {
                "scorer": "html-tag",
                "param": "button",
                "weight": 1
              },
              {
                "scorer": "css-class",
                "param": "btn-link",
                "weight": 1
              }
            ],
            "weight": 1
          },
          {
            "and": [
              {
                "scorer": "html-tag",
                "param": "div",
                "weight": 0.9
              },
              {
                "scorer": "css-class",
                "param": "btn-link",
                "weight": 1
              }
            ],
            "weight": 1
          }
        ]
      }
    },
    {
      "type": "elm-type",
      "value": "checkbox",
      "plan": {
        "or": [
          {
            "and": [
              {
                "scorer": "html-tag",
                "param": "input",
                "weight": 1
              },
              {
                "scorer": "html-attr-name-and-val",
                "param": [
                  "type",
                  "checkbox"
                ],
                "weight": 1
              }
            ],
            "weight": 1
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
                "param": "input",
                "weight": 1
              },
              {
                "scorer": "html-attr-name-and-val",
                "param": [
                  "type",
                  "radio"
                ],
                "weight": 1
              }
            ],
            "weight": 1
          }
        ]
      }
    },
    {
      "type": "elm-type",
      "value": "label",
      "plan": {
        "or": [
          {
            "scorer": "html-tag",
            "param": "label",
            "weight": 1
          }
        ]
      }
    },
    {
      "type": "elm-type",
      "value": "element",
      "plan": {
        "or": [
          {
            "scorer": "html-tag",
            "param": "element",
            "weight": 1
          }
        ]
      }
    },
    {
      "type": "html-tag",
      "plan": {
        "scorer": "html-tag",
        "param":"<value>",
        "weight": 1
      }
    },
    {
      "type": "html-attr-name",
      "plan": {
        "scorer": "html-attr-name",
        "param":"<value>",
        "weight": 1
      }
    },
    {
      "type": "html-attr-val",
      "plan": {
        "scorer": "html-attr-val",
        "param":"<value>",
        "weight": 1
      }
    },
    {
      "type": "html-attr-name-and-val",
      "plan": {
        "scorer": "html-attr-name-and-val",
        "param":"<value>",
        "weight": 1
      }
    },
    {
      "type": "free-text",
      "plan": {
        "scorer": "free-text",
        "param":"<value>",
        "weight": 1
      }
    },
    {
      "type": "css-class",
      "plan": {
        "scorer": "css-class",
        "param":"<value>",
        "weight": 1
      }
    }
  ],
  "colors": {
    "single-match-color": "#00FF00",
    "score-colors": [
      {"value": 1, "color": "#FF0000"},
      {"value": 0.95, "color": "#FF3300"},
      {"value": 0.9, "color": "#FF6600"},
      {"value": 0.85, "color": "#FF9900"}
    ]
  }
};
