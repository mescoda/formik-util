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

    function WithFormikItemComponent(props) {

        const name = props.field.name;

        const {
            forwardedRef,
            ...restProps
        } = props;

        return (
            <Component
                {...{
                    name,
                    ref: forwardedRef,
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
                    ...restProps,
                    ...getPartialProps(props, name)
                }}
            />
        );
    };

    WithFormikItemComponent.displayName = `WithFormikItem(${getDisplayName(Component)})`;
    WithFormikItemComponent.WrappedComponent = Component;


    const forwarded = React.forwardRef(function (props, ref) {
        return (
            <WithFormikItemComponent
                {...{
                    ...props,
                    forwardedRef: ref
                }}
            />
        );
    });

    forwarded.displayName = `WithForwardRef(${getDisplayName(WithFormikItemComponent)})`;
    forwarded.WrappedComponent = Component;

    return hoistNonReactStatics(forwarded, Component);
};
