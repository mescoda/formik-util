
# formik-util

Utilities for formik

## Installation

`npm i -S formik-util`

## Usage

### `withFormikUtil`

Formik does not have a flexible method to validate all form fields as well as set all fields touched in order to present errors correctly.

The only way as far as I know is using [`submitForm`](https://jaredpalmer.com/formik/docs/api/formik#submitform-void), however except `submitForm`, you also need [`onSubmit`](https://jaredpalmer.com/formik/docs/api/formik#onsubmit-values-values-formikbag-formikbag-void) to trigger the real submit handler. This maybe acceptable in simple cases, but imagine a filter form with both submit button to query and download button to save results.

With the help of `withFormikUtil`, you can use the injected `validateFormAndTouchAll` method to accomplish that without tears.

```js

import React from 'react';

import {
    withFormik
} from 'formik';

import {
    withFormikUtil
} from 'formik-util';

const UI = class extends React.PureComponent {

    onClickSubmit = () => {
        this.props.validateFormAndTouchAll().then(values => {
            // submit(values);
        });
    }

    onClickDownload = () => {
        this.props.validateFormAndTouchAll().then(values => {
            // download(values);
        });
    }

    render() {
        return (
            <form>
                <button
                    onClick={this.onClickSubmit}
                >
                    Submit
                </button>
                <button
                    onClick={this.onClickDownload}
                >
                    Download
                </button>
            </form>
        );
    }
};

withFormik({
    mapPropsToValues: () => {
        return {};
    }
})(
    withFormikUtil(UI)
);

```

Full injected method list:
- setAllTouched
- triggerValidateForm
- validateFormAndTouchAll


### `withFormikItem`

Add `error` `value` `touch` `onChange` `onBlur` props depend on `name` prop setted on `Formik.Field` to simplify `Formik.Field` declaration.

```js

import React from 'react';

import {
    Field,
    withFormik
} from 'formik';

import {
    withFormikItem
} from 'formik-util';

import {
    Form,
    Select
} from 'antd';


const SelectItem = props => {
    return (
        const optionList = props.dataSource.map(item => {
            return (
                <Select.Option
                    key={item.key}
                    value={item.value}
                >
                    {item.text}
                </Select.Option>
            );
        });

        return (
            <Form.Item
                {...{
                    validateStatus: props.error && props.touch ? 'error' : '',
                    help: props.touch ? props.error : '',
                    ...props
                }}
            >
                <Select
                    {...{
                        ...props
                    }}
                >
                    {optionList}
                </Select>
            </Form.Item>
        );
    );
};

const SelectFormikItem = withFormikItem(SelectItem);

const UI = props => {
    return (
        <div>
            <Field
                {...{
                    component: SelectFormikItem,
                    dataSource: userIDDataSource,
                    name: 'userID',
                    validate: value => {
                        return value === '' ? 'Required' : '';
                    }
                }}
            />
        </div>
    );
};

withFormik({})(UI);

```
