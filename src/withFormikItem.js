
import React from 'react';

import hoistNonReactStatics from 'hoist-non-react-statics';

import getDisplayName from './getDisplayName';

/**
 * add `error` `value` `onChange` props depend on `name` prop setted on `Formik.Field`
 *
 * @param {React.Component} Component wrappedComponent
 * @return {React.Component} result component
 */
export default Component => {

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
                    ...props
                }}
            />
        );
    };

    withFormikItemComponent.displayName = `WithFormikItem(${getDisplayName(Component)})`;
    withFormikItemComponent.WrappedComponent = Component;

    return hoistNonReactStatics(withFormikItemComponent, Component);
};
