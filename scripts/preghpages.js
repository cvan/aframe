#!/usr/bin/env node

const path = require('path');

const shell = require('shelljs');
const replace = require('replace-in-file');

// Inject `<meta>` tag for Chrome for Android's WebVR Origin Trial:
// https://webvr.rocks/chrome_for_android#what_is_the_webvr_origin_trial
const originTrialMetaTag = `
  <!-- Origin Trial Token, feature = WebVR (For Chrome M59+), origin = https://aframe.io, expires = 2017-09-20 -->
  <meta http-equiv="origin-trial" data-feature="WebVR (For Chrome M59+)" data-expires="2017-09-20" content="AsjmwE6brgd+3bnqK9AK1v5Hj/GEIvw1s7whcRIE3Ko8S1oBUHh8YUkUJKD7eyFQ3SElBzIFUF7/TOWVtCsrdgwAAABeeyJvcmlnaW4iOiJodHRwczovL2FmcmFtZS5pbzo0NDMiLCJmZWF0dXJlIjoiV2ViVlIxLjEiLCJleHBpcnkiOjE1MDU5NDczOTgsImlzU3ViZG9tYWluIjp0cnVlfQ==">
`.trim();
const rootDir = path.join(__dirname, '..');

shell.cd(rootDir);

shell.rm('-rf', 'gh-pages');
shell.mkdir('-p', 'gh-pages');
shell.cp('-r', [
  '.nojekyll',
  'dist',
  'examples',
  '*.html',
  '*.md'
], 'gh-pages');

function htmlReplace (before, after) {
  replace.sync({
    from: before,
    to: after,
    files: 'gh-pages/**/*.html'
  });
}

htmlReplace('dist/aframe-master.js', 'dist/aframe-master.min.js');
htmlReplace('<head>', `<head>\n    ${originTrialMetaTag}`);
