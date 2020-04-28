/* eslint-disable */
import deviceManager from '../comms/devices/DeviceManager';
import toaster from "../comms/util/materialize";

var alt = require('../alt');

class GeoDeviceActions {
     fetchDevices(params = null, cb) {
        return dispatch => {
            dispatch();
            deviceManager
              .getDevicesWithPosition(params)
              .then(result => {
                this.setDevices(result);
                if (cb) {
                  cb(result);
                }
              })
              .catch(error => {
                    console.error(error);
                    this.devicesFailed(error);
              });
        };
    }
     setDevices(result) {
        return result;
    }
     devicesFailed(error) {
        toaster.error(error.message);
        return error;
    }
 }
 alt.createActions(GeoDeviceActions, exports);
