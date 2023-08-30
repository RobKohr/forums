import type Joi from "joi";
import { Accessor, createSignal } from "solid-js";


interface UseFormProps {
    initialData?: { [key: string]: string };
    validation: Joi.ObjectSchema<any>;
    validationMessageRewrite: (validationResult: Joi.ValidationResult<any>) => Joi.ValidationResult<any>;
}
export interface Form {
    data: any;
    set: (data: any) => void;
    validationResult: Accessor<Joi.ValidationResult<any> | undefined>;
    touched: Accessor<TouchedData>;
    setFieldValue: (field: string, value: string) => void;
    inputChangeHandler: (name: string) => (e: Event) => void;
}

interface FormData {
    [key: string]: string;
}
interface TouchedData {
    [key: string]: boolean;
}
interface UseFormOutput {
    formDecorator: (element: HTMLFormElement, dispose: () => any) => void;
    form: Form
}

function defaultSchemaMessageRewrite(validationResult: Joi.ValidationResult<any>) {
    return validationResult;
}

export default function useForm({ initialData, validation, validationMessageRewrite = defaultSchemaMessageRewrite }: UseFormProps) {
    const [formData, setFormData] = createSignal<FormData>(initialData || {});
    const initialTouchData: TouchedData = { test: true };
    const [touched, setTouched] = createSignal<TouchedData>(initialTouchData);
    const [validationResult, setValidationResult] = createSignal<Joi.ValidationResult<any> | undefined>();

    function validate(): boolean {
        setValidationResult(
            validationMessageRewrite(validation.validate(formData(), { abortEarly: false }))
        )
        if (validationResult()?.error) {
            return false
        } else {
            return true
        }
    }

    function formDecorator(element: HTMLFormElement, _: () => any): void {
        element.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (validate()) {
                console.log('validation passes')
            } else {
                console.log('validation fails')
            }
        });
    }
    const form = {
        data: formData,
        set: setFormData,
        validationResult,
        touched,
        setFieldValue: (field: string, value: string) => {
            setFormData({ [field]: value });
        },
        inputChangeHandler: (name: string) => (e: Event) => {
            const target = e.target as HTMLInputElement;
            setFormData({ ...formData(), [name]: target.value });
            setTouched({ ...touched(), [name]: true });
            validate();
        }
    };
    const useFormOutput: UseFormOutput = { formDecorator, form };
    validate()
    return useFormOutput;
}
