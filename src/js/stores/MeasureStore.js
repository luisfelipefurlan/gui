var alt = require('../alt');
var MeasureActions = require('../actions/MeasureActions');
var TrackingActions = require('../actions/TrackingActions');

import util from '../comms/util';

class MeasureStore {
  constructor() {
    //this.devices = {};
    this.data = {}
    this.tracking = {};
    this.error = null;

    this.bindListeners({
      handleAppendMeasures: MeasureActions.APPEND_MEASURES,
      handleUpdateMeasures: MeasureActions.UPDATE_MEASURES,
      handleFailure: MeasureActions.MEASURES_FAILED,
      handleUpdatePosition: MeasureActions.UPDATE_POSITION,

      handleTrackingFetch: TrackingActions.FETCH,
      handleTrackingSet: TrackingActions.SET,
      handleTrackingDismiss: TrackingActions.DISMISS
    });
    // handleFetchMeansures: MeasureActions.FETCH_MEASURES,
  }


  handleTrackingFetch(){}
  handleTrackingSet(history){
    this.tracking[history.device_id] = history.data;
  }

  handleTrackingDismiss(device_id){
    if (this.tracking.hasOwnProperty(device_id)){
      delete this.tracking[device_id];
    }
  }

  handleUpdatePosition(data){
    function parserPosition(position){
      if (position.toString().indexOf(",") > -1) {
        let parsedPosition = position.split(", ");
        if(parsedPosition.length > 1){
          return [parseFloat(parsedPosition[0]), parseFloat(parsedPosition[1])];
        } 
      } else {
        return undefined;
      }

    }
    if(data !== undefined){
      let label = Object.keys(data.attrs);
      if(this.data[data.metadata.deviceid] !== undefined){
          this.data[data.metadata.deviceid].position = parserPosition(data.attrs[label[0]]);
      }
    }
  }

  handleUpdateMeasures(measureData) {
    if(measureData !== null || measureData !== undefined){
      this.data[measureData.id] = measureData;
    }
  }

  handleAppendMeasures(measureData) {
    for(let k in this.data){
      if(k == measureData.metadata.deviceid){
        let label = Object.keys(measureData.attrs);
        let now = new Date();
        if(this.data[k][label[0]] !== undefined){
          let attrValue = {"device_id": this.data[k].id, "attr": label[0], "value":measureData.attrs[label[0]], "ts": now};
          this.data[k][label[0]] = this.data[k][label[0]].concat(attrValue);
        } else{
          this.data[k] = measureData.attrs[label[0]];
        }
      }
    }
  }

   handleFetchMeasures(measureData) {
     if (! ('device' in measureData)) { console.error("Missing device id"); }
     if (! ('attr' in measureData)) { console.error("Missing attr id"); }

     if (! (measureData.device in this.devices)) {measureData;
       this.devices[measureData.device] = {}
     }

     this.devices[measureData.device][measureData.attr.name] = JSON.parse(JSON.stringify(measureData.attr));
     this.devices[measureData.device][measureData.attr.name].loading = true;
   }

  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(MeasureStore, 'MeasureStore');
export default _store;
