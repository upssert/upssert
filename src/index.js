import 'babel-polyfill';
import { EventEmitter } from 'events';
import TapReporter from './lib/reporter/tap';
import ConsoleReporter from './lib/reporter/console';
import Runner from './lib/runner';
import LogWriter from './lib/writer/log';
import events from './data/events.json';

class Upssert extends EventEmitter {
  constructor(suites, reporter) {
    super();
    if (typeof suites === 'string') {
      suites = Upssert.createSuiteForUrl(suites);
    }
    this.suites = !Array.isArray(suites) ? [suites] : suites;
    this.runner = new Runner();
    if (!reporter) {
      reporter = new ConsoleReporter();
    }
    this.reporter = reporter;
    this.runner.setSuites(this.suites);
    this.reporter.setEventEmitter(this.runner);
    this.runner.on(events.FAIL, (obj, err) => {
      this.emit(events.FAIL, obj, err);
    });
  }

  static createSuiteForUrl(url) {
    return {
      name: 'Ping',
      steps: [{
        name: url,
        request: {
          url,
          method: 'GET',
        },
      }],
    };
  }

  execute() {
    this.runner.run();
  }
}

export default Upssert;
export {
  TapReporter,
  ConsoleReporter,
  LogWriter,
};
