
import {useCallback} from 'react';
import {FormikTouched, FormikValues, setNestedObjectValues, useFormikContext} from 'formik';

export default function useValidate<Values extends FormikValues>() {

    const formik = useFormikContext<Values>();

    const getAllTouched = useCallback((): FormikTouched<Values> => {
        return setNestedObjectValues(formik.values, true);
    }, [formik.values]);

    const setAllTouched = useCallback(() => {
        return new Promise<FormikTouched<Values>>(resolve => {
            const allTouched = getAllTouched();
            formik.setTouched(allTouched);

            // setTouched will trigger setState and runValidations
            // make sure setTouched done or will be error
            setTimeout(() => {
                resolve(allTouched);
            }, 0);
        });
    }, [formik.setTouched]);

    const triggerValidateForm = useCallback((): Promise<Values> => {
        return formik.validateForm().then(validateResult => {
            if (Object.keys(validateResult).length === 0) {
                return Promise.resolve(formik.values);
            }
            return Promise.reject(validateResult);
        });
    }, [formik.validateForm, formik.values]);

    const validateFormAndTouchAll = useCallback(() => {
        return setAllTouched().then(() => {
            return triggerValidateForm();
        });
    }, [setAllTouched, triggerValidateForm]);

    return [validateFormAndTouchAll];
}
