(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'tasa':                       'javascript/tasa', // 'dist',
    '@angular':                   'javascript/@angular', //'https://unpkg.com/@angular',
    'angular2-in-memory-web-api': 'https://unpkg.com/angular2-in-memory-web-api', // get latest
    'rxjs':                       'https://unpkg.com/rxjs@5.0.0-beta.6',
    'typescript':                 'https://unpkg.com/typescript@1.8.10/lib/typescript.js',
 };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'tasa':                       { main: '/',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { defaultExtension: 'js' },
  };

  var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/router-deprecated',
    '@angular/testing',
    '@angular/upgrade',
    '@angular/forms'
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
    map: map,
    packages: packages
  }

  // filterSystemConfig - index.html's chance to modify config before we register it.
  if (global.filterSystemConfig) { global.filterSystemConfig(config); }

  System.config(config);

})(this);