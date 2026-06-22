import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes
} from "react";

type BaseProps = {
  label: string;
  error?: string;
};

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

type SelectProps = BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: Array<{ label: string; value: string }>;
  };

export const Field = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <label className="field">
        <span>{label}</span>
        <input ref={ref} {...props} />
        {error ? <small>{error}</small> : null}
      </label>
    );
  }
);

Field.displayName = "Field";

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ label, error, ...props }, ref) => {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea ref={ref} rows={4} {...props} />
      {error ? <small>{error}</small> : null}
    </label>
  );
});

TextareaField.displayName = "TextareaField";

export const SelectField = forwardRef<
  HTMLSelectElement,
  SelectProps
>(({ label, error, options, ...props }, ref) => {
  return (
    <label className="field">
      <span>{label}</span>
      <select ref={ref} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <small>{error}</small> : null}
    </label>
  );
});

SelectField.displayName = "SelectField";