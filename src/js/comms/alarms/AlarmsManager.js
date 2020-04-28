import util from '../util';

class AlarmsManager {
    constructor() {
        this.baseUrl = '/alarmmanager/api/alarms';
    }

    getCurrentAlarmsWithoutNamespace() {
        return util.GET(`${this.baseUrl}/current`);
    }

    getAllCurrentAlarmsWithNamespace(namespace) {
        return util.GET(`${this.baseUrl}/current/${namespace}`);
    }

    getAllCurrentAlarms() {
        return util.GET(`${this.baseUrl}/current/all`);
    }

    getHistoryWithoutNamespace() {
        return util.GET(`${this.baseUrl}/history/all`);
    }

    getHistoryWithNamespace(namespace) {
        return util.GET(`${this.baseUrl}/history/${namespace}`);
    }

    getNamespaces() {
        return util.GET(`${this.baseUrl}/namespaces`);
    }
}

const alarmsManager = new AlarmsManager();
export default alarmsManager;
