import axios from 'axios';

const discovery = (base) => {
  base = `${base}/discovery`
  return ({
    /**
    @summary Start a device discovery on all available protocols
    @name start
    @public
    @function
    @memberof agile.protocolManager.discovery
    #
    @fulfil {null}
    @returns {Promise}
    #
    @example
    agile.protocolManager.discovery.start().then(function() {
      console.log('protocolManager discover is on');
    });
    **/
    start: () => axios({
      method: 'POST',
      url: `${base}`,
    })
    .then(res => (res.data)),
    /**
    @summary Stop a device discovery on all available protocols
    @name stop
    @public
    @function
    @memberof agile.protocolManager.discovery
    #
    @fulfil {null}
    @returns {Promise}
    #
    @example
    agile.protocolManager.discovery.stop().then(function() {
      console.log('protocolManager discover is off');
    });
    **/
    stop: () => axios({
      method: 'DELETE',
      url: `${base}`,
    })
    .then(res => (res.data)),
    /**
    @summary Return the status of discovery on the available protocols
    @name status
    @public
    @function
    @memberof agile.protocolManager.discovery
    #
    @param {String} id - deviceId
    @fulfil {bool}
    @returns {Promise}
    #
    @example
    agile.protocolManager.discovery.status().then(function(status) {
      console.log(status);
    });
    **/
    status: () => axios({
      method: 'GET',
      url: `${base}`,
    })
    .then(res => (res.data)),
  })
}

export default discovery;
