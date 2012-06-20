# Summary

Version Constraints is a jQuery plugin to inspect and compare version
numbers in much the same way rubygems compares version numbers.  It
can be used to test the jQuery version, or to compare a passed in
version.

# Example Usage

The following is a few simple examples showing how to use Version
Constraints.

## Asserting version of jQuery

If you want to throw an error if the jQuery version doesn't match
certain constraints, you can use assertVersion with the constraint you
want:

    $.assertVersion("= 1.7.1"); // Throws error if jQuery is not 1.7.1
    $.assertVersion("> 1.4");   // Throws error if jQuery is not greater than 1.4

## Asserting arbitrary version string

If you have a version string from some library, you can use the same
version assertions against it:

    $.assertVersion("!= 1.2", "1.3");   // Doesn't throw an error
    $.assertVersion("<= 2.3", "2.3.1"); // Throws an error

## Checking versions without throwing an error

If you just want to know if the version matches the constraint, you
can use the version function, which returns true or false:

    $.version("= 1.7.1");         // true if jQuery is 1.7.1
    $.version("> 1.4");           // true if jQuery is greater than 1.4
    $.version("!= 1.2", "1.3");   // true
    $.version("<= 2.3", "2.3.1"); // false

## Comparing versions

If you want to compare 2 version strings, you can use the
compareVersion function.  It returns a negative number if the first is
less then the second, a positive number if it is greater, or 0 if they
are equal:

    $.compareVersion("1.7.1", "1.7.1"); // 0
    $.compareVersion("1.3", "1.3.1");   // negative
    $.compareVersion("2.1", "1.2.3");   // positive

## Parsing versions

If you simply want to parse the version and deal with the result
yourself, you can use parseVersion:

    $.parseVersion("1.7.1"); // [1, 7, 1]
    $.parseVersion("1.3");   // [1, 3]
    $.parseVersion("");      // []

# Available Constraints

Below are the available constraints and an example usage of it:

* **default**: Equivalent to the = comparison below (this comparison
  function is in $.versionComparisons[""]).  Example: "1.2.3" will be
  true for "1.2.3".

* **=**: Check exact version number.  Example: "= 1.2.3" will be true
  for only "1.2.3".

* **!=**: Version is not a specific value.  Example: "!= 2.3" will
  only be false for "2.3".

* **~=**: This version and all sub-versions.  Example: "~= 3.1" is
  true for "3.1", "3.1.2", "3.1.1.5" etc, but false for "3.0", "3.2"
  etc.  This is equivalent to [">= 3.1", "< 3.2"].

* **<**: Strictly less than.  Example: "< 1.3" will be true for
  "1.2.9", "0.5", but false for values like "1.3", "1.3.1", or "1.4".

* **<=**: Less than or equal.  Example: "<= 4.3" will be true for
  "4.3", "4.2.9", or "1.1", but not for "4.3.1", "5.0", or "4.3.1.2".

* **~<**: This version and minor versions below, but no higher.
  Example: "~< 3.1.4" is true for "3.1.4", "3.1.2", "3.1", but not
  "3.1.4.1", "3.2", or "3.0.1".  This is equivalent to ["<= 3.1.4", ">= 3.1"].

* **>**: Strictly greater than.  Example: "> 1" is true for "1.1",
  "2.0", but not "1".

* **>=**: Greater than or equal to.  Example: ">= 1.1" will be true
  for "1.1", "1.2", but not "1.0" or "0.5.1".

* **>~**: The same as rubygems' pessimistic version constraint.
  Example: ">~ 3.1.2" is true for "3.1.2", "3.1.3", "3.1.5.3", but not
  "3.2", "3.1.1.9", or "4.0".  This is the same as [">= 3.1.2", "< 3.2"].

# Array constraints:

In addition to simple single constraints, an array may be passed in to
specify multiple constraints that must all be met.  For example:

    $.assertVersion(">= 3.1");
    $.assertVersion("!= 3.1.2");
    $.assertVersion("< 4.0");

May be converted to:

    $.assertVersion([">= 3.1", "!= 3.1.2", "< 4.0"]);

# Custom Constraints

You can even add your own custom constraint types that behave however
you want.  Simply add functions with 2 parameters to the
$.versionComparisons object.  The key must be a string of non-space
characters, and the value must be a function that can accept the
constraint value, the version being checked, and should return true or
false for whether or not to pass the constraint.

For example, a constraint could be added that checks the length of the
version and makes sure that it has at least 3 values:

    $.versionComparisons["length"] = function(constraint, version) {
        constraint = parseInt(constraint, 10);
        return $.parseVersion(version).length == constraint;
    };

    $.version("length 3", "1.2.3");   // true
    $.version("length 3", "2.4");     // false
    $.version("length 3", "3.1.3.2"); // false

The built in constraints can even be changed to behave however you
want!  For example:

    $.versionComparisons["!="] = function() { return false; };

Would cause the != comparison to always fail, no matter what version
is passed in.

# License

Version Constraint is licensed under the [MIT license](http://github.com/on-site/version_constraint/blob/master/MIT-LICENSE.txt)
