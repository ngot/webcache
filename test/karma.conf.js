basePath = '..';
autoWatch = true;
singleRun = false;
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'test/select.js',
];
browsers = ['PhantomJS'];
reporters = ['progress', 'dots'];
colors = true;