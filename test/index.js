'use strict';

var mdast,
    assert,
    fixtures,
    chalk,
    diff,
    plugin;

mdast = require('..');
assert = require('assert');
fixtures = require('./fixtures.js');
chalk = require('chalk');
diff = require('diff');
plugin = require('./plugin.js');

/*
 * Settings.
 */

var INDENT;

INDENT = 2;

/**
 * No-operation.
 */
function noop() {}

/*
 * Tests.
 */

describe('mdast', function () {
    it('should be an `object`', function () {
        assert(typeof mdast === 'object');
    });
});

describe('mdast.parse(value, options, CustomParser)', function () {
    it('should be a `function`', function () {
        assert(typeof mdast.parse === 'function');
    });

    it('should throw when `value` is not a string', function () {
        assert.throws(function () {
            mdast.parse(false);
        }, /false/);
    });

    it('should throw when `options` is not an object', function () {
        assert.throws(function () {
            mdast.parse('', false);
        }, /options/);
    });

    it('should throw when `options.gfm` is not a boolean', function () {
        assert.throws(function () {
            mdast.parse('', {
                'gfm': Infinity
            });
        }, /options.gfm/);
    });

    it('should throw when `options.tables` is not a boolean', function () {
        assert.throws(function () {
            mdast.parse('', {
                'tables': Math
            });
        }, /options.tables/);
    });

    it('should throw when `options.tables` is true and ' +
        '`options.gfm` is false',
        function () {
            assert.throws(function () {
                mdast.parse('', {
                    'gfm': false,
                    'tables': true
                });
            }, /options.tables/);
        }
    );

    it('should throw when `options.footnotes` is not a boolean', function () {
        assert.throws(function () {
            mdast.parse('', {
                'footnotes': 1
            });
        }, /options.footnotes/);
    });

    it('should throw when `options.breaks` is not a boolean', function () {
        assert.throws(function () {
            mdast.parse('', {
                'breaks': 'unicorn'
            });
        }, /options.breaks/);
    });

    it('should throw when `options.pedantic` is not a boolean', function () {
        assert.throws(function () {
            mdast.parse('', {
                'pedantic': {}
            });
        }, /options.pedantic/);
    });

    it('should accept a `CustomParser` as a third argument', function () {
        var isInvoked;

        /**
         * Construct a parser.
         *
         * @constructor {CustomParser}
         */
        function CustomParser() {
            return mdast.parse.Parser.apply(this, arguments);
        }

        /**
         * Mock `parse`.
         */
        function parse() {
            isInvoked = true;

            return {};
        }

        CustomParser.prototype.parse = parse;

        mdast.parse('', null, CustomParser);

        assert(isInvoked === true);
    });
});

describe('mdast.stringify(ast, options, CustomCompiler)', function () {
    it('should be a `function`', function () {
        assert(typeof mdast.stringify === 'function');
    });

    it('should throw when `ast` is not an object', function () {
        assert.throws(function () {
            mdast.stringify(false);
        }, /false/);
    });

    it('should throw when `ast` is not a valid node', function () {
        assert.throws(function () {
            mdast.stringify({
                'type': 'unicorn'
            });
        }, /unicorn/);
    });

    it('should throw when `options` is not an object', function () {
        assert.throws(function () {
            mdast.stringify({}, false);
        }, /options/);
    });

    it('should throw when `options.bullet` is not a valid list bullet',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'bullet': true
                });
            }, /options\.bullet/);
        }
    );

    it('should throw when `options.rule` is not a valid ' +
        'horizontal rule bullet',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'rule': true
                });
            }, /options\.rule/);
        }
    );

    it('should throw when `options.ruleSpaces` is not a boolean',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'ruleSpaces': 1
                });
            }, /options\.ruleSpaces/);
        }
    );

    it('should throw when `options.ruleRepetition` is not a ' +
        'valid repetition count',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'ruleRepetition': 1
                });
            }, /options\.ruleRepetition/);

            assert.throws(function () {
                mdast.stringify({}, {
                    'ruleRepetition': NaN
                });
            }, /options\.ruleRepetition/);

            assert.throws(function () {
                mdast.stringify({}, {
                    'ruleRepetition': true
                });
            }, /options\.ruleRepetition/);
        }
    );

    it('should throw when `options.emphasis` is not a ' +
        'valid emphasis marker',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'emphasis': '-'
                });
            }, /options\.emphasis/);
        }
    );

    it('should throw when `options.strong` is not a ' +
        'valid emphasis marker',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'strong': '-'
                });
            }, /options\.strong/);
        }
    );

    it('should throw when `options.setext` is not a boolean',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'setext': 0
                });
            }, /options\.setext/);
        }
    );

    it('should throw when `options.referenceLinks` is not a boolean',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'referenceLinks': Infinity
                });
            }, /options\.referenceLinks/);
        }
    );

    it('should throw when `options.referenceFootnotes` is not a ' +
        'boolean',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'referenceFootnotes': -1
                });
            }, /options\.referenceFootnotes/);
        }
    );

    it('should throw when `options.fences` is not a boolean',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'fences': NaN
                });
            }, /options\.fences/);
        }
    );

    it('should throw when `options.fence` is not a ' +
        'valid fence marker',
        function () {
            assert.throws(function () {
                mdast.stringify({}, {
                    'fence': '-'
                });
            }, /options\.fence/);
        }
    );

    it('should throw when `options.closeAtx` is not a boolean', function () {
        assert.throws(function () {
            mdast.stringify({}, {
                'closeAtx': NaN
            });
        }, /options\.closeAtx/);
    });

    it('should accept a `CustomCompiler` as a third argument', function () {
        var isInvoked;

        /**
         * Construct a compiler.
         *
         * @constructor {CustomCompiler}
         */
        function CustomCompiler() {
            return mdast.stringify.Compiler.apply(this, arguments);
        }

        /**
         * Mock `visit`.
         */
        function visit() {
            isInvoked = true;

            return '';
        }

        CustomCompiler.prototype.visit = visit;

        mdast.stringify({}, null, CustomCompiler);

        assert(isInvoked === true);
    });
});

describe('mdast.use(function(plugin))', function () {
    it('should be a `function`', function () {
        assert(typeof mdast.use === 'function');
    });

    it('should accept a function', function () {
        mdast.use(noop);
    });

    it('should return an instance of mdast', function () {
        var parser;

        parser = mdast.use(noop);

        assert(mdast.use(noop) instanceof parser.constructor);
    });

    it('should attach a plugin', function () {
        var parser;

        parser = mdast.use(noop);

        assert(parser.ware.fns.length === 1);
    });

    it('should multiple plugins', function () {
        var parser;

        parser = mdast.use(noop).use(noop);

        assert(parser.ware.fns.length === 2);
    });

    it('should invoke a plugin when `parse()` is invoked', function () {
        var isInvoked,
            settings;

        settings = {
            'hello': 'world'
        };

        /**
         * Thrower.
         */
        function assertion(ast, options) {
            assert(ast.type === 'root');
            assert(options === settings);

            isInvoked = true;
        }

        mdast.use(assertion).parse('# Hello world', settings);

        assert(isInvoked === true);
    });

    it('should fail if an exception occurs in `plugin`', function () {
        var exception;

        exception = new Error('test');

        assert.throws(function () {
            mdast.use(function () {
                throw exception;
            }).parse('');
        }, /test/);
    });

    it('should work on an example plugin', function () {
        var parser,
            source;

        parser = mdast.use(plugin);

        source = parser.stringify(parser.parse('# mdast'));

        assert(
            source === '# mdast [' +
            '![Version](http://img.shields.io/npm/v/mdast.svg)' +
            '](https://www.npmjs.com/package/mdast)\n'
        );

        source = parser.stringify(parser.parse('# mdast', {
            'flat': true
        }));

        assert(
            source === '# mdast [' +
            '![Version](http://img.shields.io/npm/v/mdast.svg?style=flat)' +
            '](https://www.npmjs.com/package/mdast)\n'
        );
    });
});

var validateToken,
    validateTokens;

/**
 * Validate `children`.
 *
 * @param {Array.<Object>} children
 */
validateTokens = function (children) {
    children.forEach(validateToken);
};

/**
 * Validate `context`.
 *
 * @param {Object} context
 */
validateToken = function (context) {
    var keys = Object.keys(context),
        type = context.type,
        key;

    assert('type' in context);

    if ('children' in context) {
        assert(Array.isArray(context.children));
        validateTokens(context.children);
    }

    if ('value' in context) {
        assert(typeof context.value === 'string');
    }

    if (type === 'root') {
        assert('children' in context);

        if (context.footnotes) {
            for (key in context.footnotes) {
                validateToken(context.footnotes[key]);
            }
        }

        return;
    }

    if (
        type === 'paragraph' ||
        type === 'blockquote' ||
        type === 'tableHeader' ||
        type === 'tableRow' ||
        type === 'tableCell' ||
        type === 'strong' ||
        type === 'emphasis' ||
        type === 'delete'
    ) {
        assert(keys.length === 2);
        assert('children' in context);

        return;
    }

    if (type === 'listItem') {
        assert(keys.length === 3);
        assert('children' in context);
        assert('loose' in context);

        return;
    }

    if (type === 'footnote') {
        assert(keys.length === 2);
        assert('id' in context);

        return;
    }

    if (type === 'heading') {
        assert(keys.length === 3);
        assert(context.depth > 0);
        assert(context.depth <= 6);
        assert('children' in context);

        return;
    }

    if (type === 'inlineCode') {
        assert(keys.length === 2);
        assert('value' in context);

        return;
    }

    if (type === 'code') {
        assert(keys.length === 3);
        assert('value' in context);

        assert(
            context.lang === null ||
            typeof context.lang === 'string'
        );

        return;
    }

    if (type === 'horizontalRule' || type === 'break') {
        assert(keys.length === 1);

        return;
    }

    if (type === 'list') {
        assert('children' in context);
        assert(typeof context.ordered === 'boolean');
        assert(keys.length === 3);

        return;
    }

    if (type === 'text' || type === 'escape') {
        assert(keys.length === 2);
        assert('value' in context);

        return;
    }

    if (type === 'footnoteDefinition') {
        assert(keys.length === 3);
        assert('children' in context);
        assert('id' in context);

        return;
    }

    if (type === 'link') {
        assert('children' in context);
        assert(
            context.title === null ||
            typeof context.title === 'string'
        );
        assert(typeof context.href === 'string');
        assert(keys.length === 4);

        return;
    }

    if (type === 'image') {
        assert(
            context.title === null ||
            typeof context.title === 'string'
        );
        assert(
            context.alt === null ||
            typeof context.alt === 'string'
        );
        assert(typeof context.src === 'string');
        assert(keys.length === 4);

        return;
    }

    if (type === 'table') {
        assert(keys.length === 3);
        assert('children' in context);

        assert(Array.isArray(context.align));

        context.align.forEach(function (align) {
            assert(
                align === null ||
                align === 'left' ||
                align === 'right' ||
                align === 'center'
            );
        });

        return;
    }

    /* This is the last possible type. If more types are added, they
     * should be added before this block, or the type:html tests should
     * be wrapped in an if statement. */
    assert(type === 'html');
    assert(keys.length === 2);
    assert('value' in context);
};

var stringify;

stringify = JSON.stringify;

describe('fixtures', function () {
    fixtures.forEach(function (fixture) {
        var baseline = JSON.parse(fixture.tree),
            node,
            markdown;

        it('should parse `' + fixture.name + '` correctly', function () {
            node = mdast.parse(fixture.input, fixture.options);

            validateToken(node);

            try {
                assert(stringify(node) === stringify(baseline));
            } catch (error) {
                /* istanbul ignore next */
                logDifference(
                    stringify(baseline, null, INDENT),
                    stringify(node, null, INDENT)
                );

                /* istanbul ignore next */
                throw error;
            }
        });

        it('should stringify `' + fixture.name + '` correctly', function () {
            var generatedNode;

            markdown = mdast.stringify(node, fixture.options);
            generatedNode = mdast.parse(markdown, fixture.options);

            try {
                assert(stringify(node) === stringify(generatedNode));
            } catch (error) {
                /* istanbul ignore next */
                logDifference(
                    stringify(node, null, INDENT),
                    stringify(generatedNode, null, INDENT)
                );

                /* istanbul ignore next */
                throw error;
            }
        });

        if (fixture.output) {
            it('should stringify `' + fixture.name + '` to its input',
                function () {
                    try {
                        assert(fixture.input === markdown);
                    } catch (error) {
                        /* istanbul ignore next */
                        logDifference(fixture.input, markdown);

                        /* istanbul ignore next */
                        throw error;
                    }
                }
            );
        }
    });
});

/* istanbul ignore next */

/**
 * Log the difference between `value` and `alternative`.
 *
 * @param {string} value
 * @param {string} alternative
 */
function logDifference(value, alternative) {
    var difference;

    difference = diff.diffLines(value, alternative);

    if (difference && difference.length) {
        difference.forEach(function (change) {
            var colour;

            colour = change.added ? 'green' : change.removed ? 'red' : 'dim';

            process.stdout.write(chalk[colour](change.value));
        });
    }
}
