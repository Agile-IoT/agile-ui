import axios from 'axios';
import discovery from './discovery';

const protocolManager = (base) => {
  base = `${base}/protocols`
  return ({
    /**
    @summary Get the list of registered protocols
    @name get
    @public
    @function
    @memberof agile.protocolManager.protocols
    @fulfil {Array} - protocols
    @returns {Promise}
    @example
    agile.protocolManager.protocols.get().then(function(protocols) {
      console.log(protocols);
    });
    **/
    get: () => axios({
      method: 'GET',
      url: `${base}`,
    })
    .then(res => (res.data)),
    /**
    @summary Unregister a Dbus Protocol object reference
    @name delete
    @public
    @function
    @memberof agile.protocolManager.protocols
    #
    @param {String} uuid - protocolId
    @fulfil {null}
    @returns {Promise}
    #
    @example
    agile.protocolManager.protocols.delete(protocolId).then(function() {
      console.log('protocol has been unregistered');
    });
    **/
    delete: () => axios({
      method: 'DELETE',
      url: `${base}`,
    })
    .then(res => (res.data)),
    /**
    @summary Register a new Dbus object implementing the protocol API
    @name create
    @public
    @function
    @memberof agile.protocolManager.protocols
    #
    @param {String} uuid - protocolId
    @fulfil {null}
    @returns {Promise}
    #
    @example
    agile.protocolManager.protocols.create(protocolId).then(function() {
      console.log('protocol has been registered');
    });
    **/
    status: () => axios({
      method: 'POST',
      url: `${base}`,
    })
    .then(res => (res.data)),
    /**
    @summary List all discovered devices on all available protocols
  	@name devices
  	@public
  	@function
  	@memberof agile.protocolManager.devices
  	#
  	@fulfil {Object[]} - devices
  	@returns {Promise}
  	#
  	@example
  	agile.protocolManager.devices().then(function(devices) {
  		console.log(devices);
  	});
    **/
    devices: () => axios({
      url: `${base}/devices`,
    })
    .then(res => (res.data)),
    discovery: discovery(base)
  })
}

export default protocolManager;
