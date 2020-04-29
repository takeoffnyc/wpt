'use strict';

importScripts("/resources/testharness.js");
importScripts("/resources/WebIDLParser.js", "/resources/idlharness.js");

idl_test(
    ['../idle-detection/idle-detection'],
    ['dom', 'html'],
    async (idl_array, t) => {
      self.idle = new IdleDetector({threshold: 60});
      let watcher = new EventWatcher(t, self.idle, ["change"]);
      self.idle.start();
      await watcher.wait_for("change");

      idl_array.add_objects({
        IdleDetector: ['idle'],
        IdleState: ['idle.state']
      });
    }
);

done();
