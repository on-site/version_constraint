#!/usr/bin/ruby
require "rubygems"
require "bundler/setup"
Bundler.require :default

ARGS = $*

if ARGS.length != 0
  puts "usage: package.rb"
  exit
end

version = File.read("VERSION").strip
date = %x{ date +"%a %b %_d %H:%M:%S %Y %z" }.strip
year = %x{ date +"%Y" }.strip
year = "2012-#{year}" if year.to_i > 2012

header = "/*!
 * Version Constraint JavaScript jQuery Plugin v#{version}
 * http://github.com/on-site/version_constraint
 *
 * Copyright #{year}, On-Site.com, http://www.on-site.com/
 * Licensed under the MIT license.
 *
 * Date: #{date}
 */
"

contents = File.read "src/version_constraint.js"

File.open "version_constraint.js", "w" do |f|
  f << header
  f << contents
end

system "cp version_constraint.js version_constraint-#{version}.js"
File.open "version_constraint-#{version}.min.js", "w" do |f|
  f << header
  f << Uglifier.compile(File.read("version_constraint-#{version}.js"), :copyright => false)
end
