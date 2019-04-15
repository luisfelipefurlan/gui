import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DojotBtnClassic } from '../../components/DojotButton';

class SideBarRight extends Component {
    render() {
        const {
            visible, title, buttonsFooter, content, icon,
        } = this.props;
        let body = null;
        let header = null;
        let btnFooter = null;
        if (visible) {
            header = (
                <div className="header">
                    <div className="title">{title}</div>
                    <div className="icon">
                        <img className="sepia-opa" alt={icon} src={`images/icons/${icon}.png`} />
                    </div>
                    <div className="header-path">
                        {title}
                    </div>
                </div>
            );
            if (buttonsFooter !== null && buttonsFooter.length > 0) {
                btnFooter = buttonsFooter.map(btn => (
                    <DojotBtnClassic
                        label={btn.label}
                        onClick={btn.click}
                        color={btn.color}
                        type={btn.type}
                        key={btn.label + btn.type}
                    />
                ));
            }
            body = (
                <div className="sidebar-firmware sidebar-groups">
                    {header}
                    <div className="body">
                        <div className="body-form">{content}</div>
                    </div>
                    <div className="footer">{btnFooter}</div>
                </div>
            );
        }

        return body;
    }
}

SideBarRight.propTypes = {
    visible: PropTypes.bool,
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
    buttonsFooter: PropTypes.arrayOf(PropTypes.object),
    content: PropTypes.instanceOf(Object).isRequired,
};

SideBarRight.defaultProps = {
    icon: '',
    visible: true,
    buttonsFooter: [],
};
export default SideBarRight;
