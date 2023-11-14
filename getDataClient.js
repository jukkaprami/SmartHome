MetO = require('@fmidev/metoclient');

const metoclient = new MetO(options);
metoclient.render().then(function (map) {
    metoclient.play({
      delay: 1000,
      time: Date.now()
    });
  }).catch(err => {
    // statements to handle any exceptions
  });

// full build

/*var metoclient = new fmi.metoclient.MetOClient(options)
metoclient.render().then(function (map) {
map.addControl(new ol.control.FullScreen());
})*/