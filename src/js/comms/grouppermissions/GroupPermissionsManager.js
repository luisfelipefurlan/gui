import util from '../util/util';

const GQL_SAVE_PERMISSIONS = `
mutation ($permissions: [PermissionRequest]!, $group: String!) {
  permissions(group: $group, permissions: $permissions ) {
    message
    status  
    action subject
  }
}

`;

const GQL_GET_PERMISSIONS = groupName => `
 query {
  permissions ${groupName ? `(group: "${groupName}")` : ' '}{
  subject        
  actions   
  }
}
`;

class GroupPermissionsManager {
    constructor() {
        this.baseUrl = '/graphql/permissions';
    }

    /**
     * Search permissions associate with a group or the permissions of system
     * @returns {*}
     * @param groupName  (if this is null or empty return all  permissions of system)
     */
    getGroupPermissions(groupName) {
        const req = {
            query: GQL_GET_PERMISSIONS(groupName),
        };
        return util.POST(this.baseUrl, req);
    }

    /**
     *  Create/remove a group associate between group and permission
     * @param groupName
     * @param permissions
     * @returns {*}
     */
    saveGroupPermission(groupName, permissions1) {
        const variablesConver = {
            permissions: permissions1,
            group: `${groupName}`,
        };
        const req = {
            query: GQL_SAVE_PERMISSIONS,
            variables: JSON.stringify(variablesConver),
        };
        return util.POST(this.baseUrl, req);
    }
}

const groupPermissionsManager = new GroupPermissionsManager();
export default groupPermissionsManager;
