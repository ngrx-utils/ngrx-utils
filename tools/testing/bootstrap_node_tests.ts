import 'core-js/es7/reflect';
import 'zone.js/dist/zone-node';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test.js';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

const jasmineCore: any = require('jasmine-core');
const patchedJasmine = jasmineCore.boot(jasmineCore);
(global as any)['jasmine'] = patchedJasmine;

jasmineCore.boot = function() {
  return patchedJasmine;
};

import 'zone.js/dist/jasmine-patch';

import { TestBed } from '@angular/core/testing';
import { ServerTestingModule, platformServerTesting } from '@angular/platform-server/testing';

jasmineCore.boot = function() {
  return patchedJasmine;
};

const originalConfigureTestingModule = TestBed.configureTestingModule;

TestBed.configureTestingModule = function() {
  TestBed.resetTestingModule();

  return originalConfigureTestingModule.apply(null, arguments);
};

TestBed.initTestEnvironment(ServerTestingModule, platformServerTesting());
