/**
 * inject utility method to Formik component
 * - validateFormAndTouchAll
 */

import React from 'react';

import hoistNonReactStatics from 'hoist-non-react-statics';

import getDisplayName from './getDisplayName';

import {
    setNestedObjectValues
} from 'formik';


const handlers = {
    /**
     * get all field touched true `touched` value
     *
     * @return {Object} `touched` value
     */
    getAllTouched() {
        const props = this;
        return setNestedObjectValues(props.values, true);
    },

    /**
     * set all field touched
     *
     * @return {Promise} setting
     */
    setAllTouched() {
        const props = this;
        return new Promise(resolve => {
            props.setTouched(props.getAllTouched());

            // setTouched will trigger setState and runValidations
            // make sure setTouched done or will be error
            setTimeout(() => {
                resolve();
            }, 0);
        });
    },

    /**
     * promise wrapper of formik.validateForm
     *
     * @return {Promise} validating
     */
    triggerValidateForm() {
        const props = this;
        return props.validateForm().then(validateResult => {
            if (Object.keys(validateResult).length === 0) {
                return Promise.resolve(props.values);
            }
            return Promise.reject(validateResult);
        });
    },

    /**
     * promise wrapper of formik.validateForm, also set all field touched true, in order to show all errors correctly
     *
     * @return {Promise} validating
     */
    validateFormAndTouchAll() {
        const props = this;
        return props.setAllTouched().then(() => {
            return props.triggerValidateForm();
        });
    }
};

export default Component => {

    const WithFormikUtilComponent = props => {
        return (
            <Component
                {...{
                    ...handlers,
                    ...props
                }}
            />
        );
    };

    WithFormikUtilComponent.displayName = `WithFormikUtil(${getDisplayName(Component)})`;
    WithFormikUtilComponent.WrappedComponent = Component;

    return hoistNonReactStatics(WithFormikUtilComponent, Component);
};
