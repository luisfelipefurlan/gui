import React, { Component } from 'react';
import AltContainer from 'alt-container';
import TextTruncate from 'react-text-truncate';
import { translate, Trans } from 'react-i18next';
import GroupStore from '../../stores/GroupStore';
import GroupActions from '../../actions/GroupActions';
import GroupPermissionActions from '../../actions/GroupPermissionActions';
import SideBarRight from '../../components/SideBar';
import { NewPageHeader } from '../../containers/full/PageHeader';
import { DojotBtnLink } from '../../components/DojotButton';
import toaster from '../../comms/util/materialize';
import { RemoveModal } from '../../components/Modal';

function GroupCard(obj) {
    return (
        <div
            className="card-size card-hover lst-entry-wrapper z-depth-2 fullHeight"
            id={obj.group.id}
            onClick={obj.onclick}
            group="button"
        >
            <div className="lst-entry-title col s12 ">
                <img className="title-icon" src="images/groups-icon.png" alt="Group"/>
                <div className="title-text truncate" title={obj.group.name}>
                    <span className="text">
                        {obj.group.name}
                    </span>
                </div>
            </div>
            <div className="attr-list">
                <div className="attr-area light-background">
                    <div className="attr-row">
                        <div className="icon">
                            <img src="images/info-icon.png" alt={obj.group.description}/>
                        </div>
                        <div className="user-card attr-content" title={obj.group.description}>
                            <TextTruncate
                                line={2}
                                truncateText="…"
                                text={obj.group.description}
                                containerClassName="description-text"
                            />
                            <div className="subtitle"><Trans i18nKey="groups.description"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

function GroupList(param) {
    if (param.groups) {
        return (
            <div className="fill">
                {param.groups.map(obj => (
                    <GroupCard
                        group={obj}
                        key={obj.id}
                        onclick={param.handleUpdate}
                    />
                ))}
            </div>);
    }
}

function OperationsHeader(param) {
    return (
        <div className="col s12 pull-right pt10">
            <DojotBtnLink
                responsive="true"
                onClick={param.newGroup}
                label={<Trans i18nKey="groups.btn.new.text"/>}
                alt="Create a new group"
                icon="fa fa-plus"
                className="w130px"
            />
        </div>

    );
}

function InputCheckbox(params) {
    const { handleChangeCheckbox } = params;
    return (
        <span>
            <input
                name={params.name}
                id={params.name}
                onChange={handleChangeCheckbox}
                value={params.name}
                checked={!!params.checked}
                type="checkbox"
            />
            <label htmlFor={params.name}>{params.label}</label>
        </span>
    );
}

function InputText(params) {
    return (
        <div className={`input-field ${params.class ? params.class : ''}`}>
            <label
                htmlFor={params.name}
                data-error={params.errorMessage ? params.errorMessage : ''}
                className="active"
            >
                {params.label}
            </label>
            <input
                value={params.value}
                name={params.name}
                onChange={params.onChange ? params.onChange : null}
                maxLength={params.maxLength ? params.maxLength : 40}
                placeholder={params.placeHolder ? params.placeHolder : ''}
                type="text"
            />
        </div>
    );
}

function TableGroupsPermissions(params) {
    const { handleChangeCheckbox, permissionsForm } = params;
    return (
        <table className="striped centered">
            <thead>
            <tr>
                <th>Feature</th>
                <th>Modifier</th>
                <th>Viewer</th>
            </tr>
            </thead>
            <tbody>
            {Object.keys(permissionsForm)
                .map(item => (
                    <tr>
                        <td>
                            {item}
                        </td>
                        <td>
                            <InputCheckbox
                                label=""
                                placeHolder=""
                                name={`${item}.viewer`}
                                checked={permissionsForm[item].viewer}
                                handleChangeCheckbox={handleChangeCheckbox}
                            />
                        </td>
                        <td>
                            <InputCheckbox
                                label=""
                                placeHolder=""
                                name={`${item}.modifier`}
                                checked={permissionsForm[item].modifier}
                                handleChangeCheckbox={handleChangeCheckbox}
                            />
                        </td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    );
}

function Form(params) {
    console.log(params, 'params');
    const {
        handleCharge,
        data,
        handleChangeCheckbox,
        permissionsForm,
    } = params;
    return (
        <form action="#">
            <InputText
                label={<Trans i18nKey="groups.form.input.groupname.label"/>}
                name="name"
                maxLength={30}
                onChange={handleCharge}
                value={data.name}
                errorMessage={<Trans i18nKey="groups.form.input.groupname.error"/>}
            />
            <InputText
                label={<Trans i18nKey="groups.form.input.groupdescription.label"/>}
                name="description"
                maxLength={254}
                onChange={handleCharge}
                value={data.description}
            />
            <TableGroupsPermissions
                permissionsForm={permissionsForm}
                handleChangeCheckbox={handleChangeCheckbox}
            />
        </form>
    );
}

class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSideBar: false,
            showDeleteModal: false,
            edit: false,
        };

        this.newGroup = this.newGroup.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.hideSideBar = this.hideSideBar.bind(this);
        this.showSideBar = this.showSideBar.bind(this);;
        this.handleModalDelete = this.handleModalDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }


    componentWillMount() {
        console.log('Component WILL MOUNT!');
    }

    componentDidMount() {
        console.log('Component DID MOUNT!');
        GroupActions.fetchGroups.defer();
        GroupPermissionActions._loadSystemPermissions.defer();
        //GroupPermissionActions.fetchSystemPermissions.defer();
    }

    componentWillReceiveProps(newProps) {
        console.log('Component WILL RECIEVE PROPS!');
    }

    shouldComponentUpdate(newProps, newState) {
        console.log('t shouldComponentUpdate!', this.state);
        console.log('t shouldComponentUpdate!', newState);

        console.log('t shouldComponentUpdate!', newState.groupsForm.id);
        console.log('t shouldComponentUpdate!', this.state.groupsForm.id);
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('t Component WILL UPDATE!', this.state);
        console.log('t Component WILL UPDATE!', nextState);
        console.log('t Component WILL UPDATE!', nextState.groupsForm.id);
        console.log('t Component WILL UPDATE!', this.state.groupsForm.id);
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.groupsForm.id !== this.state.groupsForm.id) {
            //this.setState(prevState);
        }
        console.log('t Component DID UPDATE!', prevState);
        console.log('t Component DID UPDATE!', this.state);
        console.log('t Component DID UPDATE!', prevState.groupsForm.id);
        console.log('t Component DID UPDATE!', this.state.groupsForm.id);
        if (this.state.edit) {
            // GroupPermissionActions.fetchPermissionsForGroups(this.state.groupsForm.id);
        }
    }

    componentWillUnmount() {
        console.log('Component WILL UNMOUNT!');
    }

    // TODO
    checkAlphaNumber(string) {
        const regex = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/;
        return !regex.test(string);
    }
    
    cleanGroupsPermissions() {
        this.setState(prevState => ({
            ...prevState,
            permissionsForm: {},
        }));
    }

    newGroup() {
        this.cleanGroupsForm();
        const groupPermission = GroupPermissionActions.fetchSystemPermissions();
        console.log('newGroup hd up groupPermission', groupPermission);
        this.setState(prevState => ({
            ...prevState,
            edit: false,
            permissionsForm: groupPermission,
        }));
        this.showSideBar();
    }

    componentDidCatch(error, info) {
        console.log('componentDidCatch 1', error);
        console.log('componentDidCatch 2', info);
    }

    toggleSideBar() {
        this.setState(prevState => ({
            showSideBar: !prevState.showSideBar,
        }));
    }

    hideSideBar() {
        this.setState({
            showSideBar: false,
        });
    }

    showSideBar() {
        this.setState({
            showSideBar: true,
        });
    }

    handleInput(e) {
        const { name, value } = e.target;
        this.setState(prevState => ({
            ...prevState,
            groupsForm: {
                ...prevState.groupsForm,
                [name]: value,
            },
        }));
    }

    handleCheckBox(e) {
        const { name } = e.target;
        const [action, typePermission] = name.split('.');
        this.setState(prevState => ({
            permissionsForm: {
                ...prevState.permissionsForm,
                [action]: {
                    ...prevState.permissionsForm[action],
                    [typePermission]: !prevState.permissionsForm[action][typePermission],
                },
            },
        }));
    }

    discard() {
        this.hideSideBar();
        this.cleanGroupsForm();
    }

    formDataValidate() {
        const { groupsForm } = this.state;

        if ((groupsForm.name).trim().length <= 0) {
            toaster.warning('empty Name');
            return false;
        }

        if (this.checkAlphaNumber(groupsForm.name)) {
            toaster.warning('Invalid name.');
            return false;
        }

        if ((groupsForm.description).trim().length <= 0) {
            toaster.warning('empty des');
            return false;
        }

        return true;
    }

    save() {
        if (this.formDataValidate()) {
            const { groupsForm, permissionsForm } = this.state;
            GroupActions.triggerSave(
                groupsForm,
                (response) => {
                    toaster.success('Group Save');
                    // groupIdNew = response.id;
                    // console.log('groupIdNew', groupIdNew);
                    GroupPermissionActions.triggerSaveGroupPermissions(
                        permissionsForm, response.id,
                        () => {
                            toaster.success('Permission Associate.');
                            // this.hideSideBar();
                        }, (group) => {
                            console.log(group);
                        }
                    );
                    this.hideSideBar();
                },
                (group) => {
                    console.log(group);
                },
            );

            this.cleanGroupsPermissions();
            this.cleanGroupsForm();
            GroupActions.fetchGroups.defer();
        }
    }


    handleModalDelete(status) {
        this.setState(prevState => ({
            ...prevState,
            showDeleteModal: status,
        }));
    }


    handleUpdate(e) {
        console.log('handleUpdate begin');

        e.preventDefault();
        this.showSideBar();
        this.cleanGroupsForm();

        const { id: groupId } = e.currentTarget;
        const group = GroupActions.getGroupById(groupId);
        GroupPermissionActions.fetchPermissionsForGroups(groupId);
        const groupPermission = GroupPermissionActions.getGroupPermissions();

        console.log('handleUpdate groupPermission', groupPermission);
        this.setState(prevState => ({
            ...prevState,
            groupsForm: {
                id: group.id,
                name: group.name,
                description: group.description,
            },
            edit: true,
            permissionsForm: groupPermission,
        }));

        console.log('handleUpdate end');
    }

    delete() {
        const { groupsForm } = this.state;
        GroupActions.triggerRemoval(
            groupsForm.id,
            () => {
                toaster.success('Group Del.');
                this.hideSideBar();
            },
            (group) => {
                console.log(group);
            },
        );

        this.cleanGroupsForm();
        this.handleModalDelete(false);
        GroupActions.fetchGroups.defer();
        this.hideSideBar();
    }

    render() {
        const {
            showSideBar, groupsForm, edit, showDeleteModal, permissionsForm,
        } = this.state;

        const buttonsFooter = [
            {
                label: <Trans i18nKey="groups.form.btn.discard.label"/>,
                click: this.discard,
                type: 'default',
            },
            {
                label: <Trans i18nKey="groups.form.btn.save.label"/>,
                click: this.save,
                type: 'primary',
            },
        ];

        if (edit) {
            buttonsFooter.push({
                label: <Trans i18nKey="groups.form.btn.remove.label"/>,
                click: this.handleModalDelete,
                type: 'secondary',
            });
        }
        console.log('render');
        return (
            <div id="groups-wrapper">
                <AltContainer store={GroupStore}>
                    <NewPageHeader title={<Trans i18nKey="groups.title"/>} icon="groups">
                        <OperationsHeader newGroup={this.newGroup}/>
                    </NewPageHeader>
                    <SideBarRight
                        title={edit ? <Trans i18nKey="groups.form.title.edit"/>
                            : <Trans i18nKey="groups.form.title.new"/>}
                        content={(
                            <AltContainer store={GroupStore}>
                                <Form
                                    data={groupsForm}
                                    permissionsForm={permissionsForm}
                                    handleCharge={this.handleInput}
                                    handleChangeCheckbox={this.handleCheckBox}
                                />
                            </AltContainer>
                        )}
                        visible={showSideBar}
                        buttonsFooter={buttonsFooter}
                    />
                    <GroupList handleUpdate={this.handleUpdate}/>
                    {showDeleteModal ? (
                        <RemoveModal
                            name="group"
                            remove={this.delete}
                            openModal={this.handleModalDelete}
                        />) : <div/>}
                </AltContainer>
            </div>
        );
    }
}

export default translate()(Groups);
