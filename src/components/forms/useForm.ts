import type Joi from "joi";
import { Accessor, createSignal } from "solid-js";


interface UseFormProps {
    initialData?: { [key: string]: string };
    validation: Joi.ObjectSchema<any>;
}
export interface Form {
    data: any;
    set: (data: any) => void;
    validation: Joi.ObjectSchema<any>;
    touched: Accessor<{}>;
    setFieldValue: (field: string, value: string) => void;
    inputChangeHandler: (name: string) => (e: Event) => void;
}

interface UseFormOutput {
    formDecorator: (element: HTMLFormElement, dispose: () => any) => void;
    form: Form
}

export default function useForm({ initialData, validation }: UseFormProps) {
    const [formData, setFormData] = createSignal(initialData || {});
    const [touched, setTouched] = createSignal({});
    const [validationResult, setValidationResult] = createSignal<Joi.ValidationResult<any>>();

    function validate() {
        setValidationResult(validation.validate(formData(), { abortEarly: false }))
        console.log(JSON.stringify(validationResult(), null, 2))

        // if (validationResult()?.error) {
        //     console.error(validationResult()?.error);
        // } else if (validationResult()?.value) {
        //     console.log(validationResult()?.value);
        // } else {
        //     console.error("no error, no value", validationResult);
        // }
    }

    function formDecorator(element: HTMLFormElement, _: () => any): void {
        element.addEventListener("submit", async (e) => {
            e.preventDefault();
            const validationResult = validation.validate(formData, { abortEarly: false });
            if (validationResult.error) {
                console.error(validationResult.error);
            } else if (validationResult.value) {
                console.log(validationResult.value);
            } else {
                console.error("no error, no value", validationResult);
            }
        });
    }
    const form = {
        data: formData,
        set: setFormData,
        validation: validation,
        touched: touched,
        setFieldValue: (field: string, value: string) => {
            setFormData({ [field]: value });
        },
        inputChangeHandler: (name: string) => (e: Event) => {
            const target = e.target as HTMLInputElement;
            setFormData({ [name]: target.value });
            setTouched({ [name]: true });
            validate();
            console.log('formdata', formData())
        }
    };

    const useFormOutput: UseFormOutput = { formDecorator, form };
    return useFormOutput;
}
