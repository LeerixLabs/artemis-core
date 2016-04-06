const constants = {
    ignoredTags : ['script', 'noscript'],
    html: {
        ARTEMIS_DIV_ID:                            'artemis-div',
        ARTEMIS_LINE_ID:                           'artemis-line',
        ARTEMIS_LINE_CSS_CLASS:                    'artemis-line-class',
        ARTEMIS_LINE_ANIMATE_CSS_CLASS:            'animate-artemis-line',
        ARTEMIS_ID_ATTRIBUTE:                      'artemis-id',
        ARTEMIS_SCORE_ATTRIBUTE:                   'artemis-score',
        ARTEMIS_MARKED_CONTROL_CSS_CLASS_PREFIX:   'artemis-mark-'
    },
    keyword: {
        SMALL:          '-small',
        MEDIUM:         '-medium',
        LARGE:          '-large',
        ELEMENT:        '-element',
        BUTTON:         '-button',
        LINK:           '-link',
        INPUT:          '-input',
        CHECKBOX:       '-checkbox',
        LABEL:          '-label',
        IMAGE:          '-image',
        PANEL:          '-panel',
        TOOLBAR:        '-toolbar',
        TAG:            '-tag',
        IDENTITY:       '-identity',
        CLASS:          '-class',
        STYLE:          '-style',
        ATTR_NAME:      '-attr-name',
        ATTR_VALUE:     '-attr-value',
        ATTR_EQUALS:    '-attr-equals',
        WITH_TYPE:      -'with-type',
        TEXT:           '-text',
        AT_THE_TOP:     '-at-the-top',
        AT_THE_BOTTOM:  '-at-the-bottom',
        ON_THE_LEFT:    '-on-the-left',
        ON_THE_RIGHT:   '-on-the-right',
        ON_THE_MIDDLE:  '-on-the-middle',
        RIGHT_OF:       '-right-of',
        LEFT_OF:        '-left-of',
        ABOVE:          '-above',
        BELOW:          '-below',
        NEAR:           '-near',
        INSIDE:         '-inside'
    },
    targetType: {
        ELEMENT:    'ELEMENT',
        BUTTON:     'BUTTON',
        LINK:       'LINK',
        INPUT:      'INPUT',
        CHECKBOX:   'CHECKBOX',
        LABEL:      'LABEL',
        IMAGE:      'IMAGE',
        TOOLBAR:    'TOOLBAR',
        PANEL:      'PANEL',
        ITEM:       'ITEM'
    },
    targetProperty: {
        ELEMENT_TAG:        'ELEMENT_TAG',
        ELEMENT_ATTRIBUTE:  'ELEMENT_ATTRIBUTE',
        CSS_CLASS:          'CSS_CLASS',
        CSS_STYLE:          'CSS_STYLE',
        TEXT:               'TEXT',
        SCREEN_POSITION:    'SCREEN_POSITION',
        SIZE:               'SIZE'
    },
    relationType: {
        REL_LOCATION:       'REL_LOCATION'
    },
    relLocationType: {
        RIGHT_OF:           'RIGHT_OF',
        LEFT_OF:            'LEFT_OF',
        ABOVE:              'ABOVE',
        BELOW:              'BELOW',
        NEAR:               'NEAR',
        INSIDE:             'INSIDE'
    },
    screenPosition: {
        LEFT:   'LEFT',
        RIGHT:  'RIGHT',
        TOP:    'TOP',
        BOTTOM: 'BOTTOM',
        MIDDLE: 'MIDDLE'
    },
    elementSize: {
        S:      'S',
        M:      'M',
        L:      'L'
    }
};

export default constants;
