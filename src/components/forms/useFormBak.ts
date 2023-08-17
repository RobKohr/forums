import type { Accessor } from "solid-js";
import { createStore } from "solid-js/store";

function checkValid(
    { element, validators = [] }: { element: HTMLInputElement; validators: ((element: HTMLInputElement) => Promise<string | undefined>)[] },
    setErrors: (errors: Record<string, string | undefined>) => void,
    errorClass: string | undefined
) {
    return async () => {
        element.setCustomValidity("");
        element.checkValidity();
        let message = element.validationMessage;
        if (!message) {
            for (const validator of validators) {
                const text = await validator(element);
                if (text) {
                    element.setCustomValidity(text);
                    break;
                }
            }
            message = element.validationMessage;
        }
        if (message) {
            errorClass && element.classList.toggle(errorClass, true);
            setErrors({ [element.name]: message });
        }
    };
}

interface Errors {
    [key: string]: string | undefined;
}

export function useForm({ errorClass }: { errorClass?: string }) {
    const [errors, setErrors] = createStore<Errors>({});
    interface Fields {
        [key: string]: {
            element: HTMLInputElement;
            validators: ((element: HTMLInputElement) => Promise<string | undefined>)[];
        };
    }

    const fields: Fields = {};



    const validate = (element: Element, accessor: Accessor<any>) => {
        const accessorValue = accessor();
        const validators = Array.isArray(accessorValue) ? accessorValue : [];
        let config;
        fields[element.name] = config = { element: element, validators };
        element.onblur = checkValid(config, setErrors, errorClass);
        element.oninput = () => {
            if (!errors[element.name]) return;
            setErrors({ [element.name]: undefined });
            errorClass && element.classList.toggle(errorClass, false);
        };
    };

    const formSubmit = (element: HTMLFormElement, accessor: Accessor<any>) => {
        const callback = accessor() || (() => { });
        element.setAttribute("novalidate", "");
        element.onsubmit = async (e) => {
            e.preventDefault();
            let errored = false;

            for (const fieldName of Object.keys(fields)) {
                const field = fields[fieldName];
                if (field) {
                    await checkValid(field.element, setErrors, errorClass)();
                    if (!errored && field.element.validationMessage) {
                        field.element.focus();
                        errored = true;
                    }
                }
            }
            !errored && callback(element);
        };

    };

    return { validate, formSubmit, errors };
}
