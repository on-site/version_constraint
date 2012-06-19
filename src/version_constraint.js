/**
 * Documentation coming soon....
 */
(function($) {
    $.parseVersion = function(version) {
        if (version == "") {
            return [];
        }

        return $.map(version.split("."), function(x) { return parseInt(x, 10); });
    };

    $.compareVersion = function(a, b) {
        var parsedA = $.parseVersion(a);
        var parsedB = $.parseVersion(b);

        for (var i = 0; i < Math.min(parsedA.length, parsedB.length); i++) {
            if (parsedA[i] < parsedB[i]) {
                return -1;
            }

            if (parsedA[i] > parsedB[i]) {
                return 1;
            }
        }

        if (parsedA.length < parsedB.length) {
            return -1;
        }

        if (parsedA.length > parsedB.length) {
            return 1;
        }

        return 0;
    };

    $.versionComparisons = {
        "": function(constraint, version) {
            return $.version("= " + constraint, version);
        },

        "=": function(constraint, version) {
            return $.compareVersion(constraint, version) === 0;
        },

        "!=": function(constraint, version) {
            return $.compareVersion(constraint, version) !== 0;
        },

        "~=": function(constraint, version) {
            var lower = ">= " + constraint;
            var upper = $.parseVersion(constraint);

            if (upper.length < 1) {
                return true;
            }

            upper.push(upper.pop() + 1);
            upper = "< " + upper.join(".");
            return $.version([lower, upper], version);
        },

        "<=": function(constraint, version) {
            return $.compareVersion(constraint, version) >= 0;
        },

        ">=": function(constraint, version) {
            return $.compareVersion(constraint, version) <= 0;
        },

        "<": function(constraint, version) {
            return $.compareVersion(constraint, version) > 0;
        },

        ">": function(constraint, version) {
            return $.compareVersion(constraint, version) < 0;
        },

        "~<": function(constraint, version) {
            var upper = "<= " + constraint;
            var lower = $.parseVersion(constraint);

            if (lower.length < 1) {
                return true;
            }

            if (lower.length == 1) {
                return $.version("<= " + constraint, version);
            }

            lower.pop();
            lower = ">= " + lower.join(".");
            return $.version([lower, upper], version);
        },

        "~>": function(constraint, version) {
            var lower = ">= " + constraint;
            var upper = $.parseVersion(constraint);

            if (upper.length < 1) {
                return true;
            }

            if (upper.length == 1) {
                return $.version(">= " + constraint, version);
            }

            upper.pop();
            upper.push(upper.pop() + 1);
            upper = "< " + upper.join(".");
            return $.version([lower, upper], version);
        }
    };

    $.version = function(constraint, version) {
        if ($.isArray(constraint)) {
            for (var i = 0; i < constraint.length; i++) {
                if (!$.version(constraint[i], version)) {
                    return false;
                }
            }

            return true;
        }

        var result = /^(?:(\S+)?\s+)?(.*)$/.exec(constraint);
        var comparison = result[1] || "";

        if ($.versionComparisons[comparison]) {
            return $.versionComparisons[comparison](result[2], version);
        }

        throw new Error("Unknown comparison '" + comparison + "'");
    };
})(jQuery);
