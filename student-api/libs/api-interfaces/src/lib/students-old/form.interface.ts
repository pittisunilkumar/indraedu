export interface FormInterface {
    element: FormElement;
    label: string;
    inputType: InputType;
    value: any;
    name: string;
    id: string;
    options?: { text: string; value: string | number }[];
}

export enum FormElement {
    input = 'input',
    textarea = 'textarea',
    select = 'select',
}

export enum InputType {
    text = 'text',
    email = 'email',
    search = 'search',
    checkbox = 'checkbox',
    radio = 'radio',
    number = 'number',
}