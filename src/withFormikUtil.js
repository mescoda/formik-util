/**
 * inject utility method to Formik component
 * - validateFormAndTouchAll
 * - validateFieldAndTouch
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
    },

    /**
     * validate single field and set it as touched
     *
     * @param {string} fieldName field name
     * @return {Promise} validating
     */
    validateFieldAndTouch(fieldName) {
        const props = this;
        props.setTouched({
            [fieldName]: true
        }, false);
        return new Promise((resolve, reject) => {
            props.validateField(fieldName).then(
                // handle sync validation
                error => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(props.values[fieldName]);
                },
                // handle async validation
                error => {
                    return reject(error);
                }
            );
        });
    }
};

export default Component => {

    function WithFormikUtilComponent({
        forwardedRef,
        ...restProps
    }) {
        return (
            <Component
                {...{
                    ref: forwardedRef,
                    ...handlers,
                    ...restProps
                }}
            />
        );
    };

    WithFormikUtilComponent.displayName = `WithFormikUtil(${getDisplayName(Component)})`;
    WithFormikUtilComponent.WrappedComponent = Component;


    const forwarded = React.forwardRef(function (props, ref) {
        return (
            <WithFormikUtilComponent
                {...{
                    ...props,
                    forwardedRef: ref
                }}
            />
        );
    });

    forwarded.displayName = `WithForwardRef(${getDisplayName(WithFormikUtilComponent)})`;
    forwarded.WrappedComponent = Component;

    return hoistNonReactStatics(forwarded, Component);
};
