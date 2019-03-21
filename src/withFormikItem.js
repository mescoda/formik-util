/**
 * Add `error` `value` `touch` `onChange` `onBlur` props depend on `name` prop setted on `Formik.Field` to simplify `Formik.Field` declaration.
 */

import React from 'react';

import hoistNonReactStatics from 'hoist-non-react-statics';

import getDisplayName from './getDisplayName';

/**
 * Add `error` `value` `touch` `onChange` `onBlur` props depend on `name` prop setted on `Formik.Field`
 *
 * @param {React.Component} Component wrappedComponent
 * @param {?Function} getPartialProps partial props getter
 * @return {React.Component} result component
 */
export default (Component, getPartialProps = () => {}) => {

    const withFormikItemComponent = props => {
        const name = props.field.name;
        return (
            <Component
                {...{
                    name,
                    error: props.form.errors[name],
                    value: props.form.values[name],
                    touch: props.form.touched[name],
                    onChange: value => {
                        props.form.setFieldValue(name, value);
                        props.form.setFieldTouched(name);
                    },
                    onBlur: () => {
                        props.form.setFieldTouched(name);
                    },
                    ...getPartialProps(props, name),
                    ...props
                }}
            />
        );
    };

    withFormikItemComponent.displayName = `WithFormikItem(${getDisplayName(Component)})`;
    withFormikItemComponent.WrappedComponent = Component;

    return hoistNonReactStatics(withFormikItemComponent, Component);
};
