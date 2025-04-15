import { useField } from 'formik';
import { TextField } from "@mui/material";

// React Developer

// export const DatePicker = ({ label, ...props }) => {
//   const [field, meta] = useField(props);
//   return (
//     <>
//       {/* <label htmlFor={props.id || props.name}>{label}</label> */}
//       <input className="date" {...field} {...props} />
//       {meta.touched && meta.error ? (
//         <div className="error" style={{color:"red"}}>{meta.error}</div>
//       ) : null}
//     </>
//   );
// };

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      {/* <label htmlFor={props.id || props.name}>{label}</label> */}
      {props?.type === "file" ?
        // input field for image
        <input className="text-input" autoComplete='new-password' {...field} {...props} /> :
        // input field for text and number
        <input className="text-input" autoComplete='new-password' {...field} {...props} />}
      {meta.touched && meta.error ? (
        <div className="error" style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </>
  );
};

export const MyTextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="form-group">
      <textarea
        className={`form-control ${meta.touched && meta.error && 'is-invalid'}`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="error" style={{ color: "red" }}>{meta.error}</div>
      ) : null}
      {/* <ErrorMessage component="div" name={field.name} className="invalid-feedback" /> */}
    </div>
  );
}

export const MyTextInput = (props) => {
  const { error, id, label, defaultValue, touched, errors, ...otherProps } = props;

  return (
    <div>
      <TextField
        error={error}
        id={id}
        label={label}
        defaultValue={defaultValue}
        {...otherProps}
      />
      {touched && errors ? (
        <div className="error" style={{ color: "red" }}>{errors}</div>
      ) : null}
    </div>
  );
}

export const MyCheckbox = ({ id, checked, label }) => (
  <div className="form-check">
    <input
      className="form-check-input"
      type="checkbox"
      value=""
      id={id}
      checked={checked}
    // onClick={() => onClick(!checked)}
    />
    <label className="form-check-label" htmlFor={id}>
      {label}
    </label>
  </div>
);

export const MySelect = ({ field, form, options, ...props }) => {
  const [meta] = useField(props);
  return (
    <div>
      <select {...field} {...props}>
        <option value="">Select one</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <div className="error" style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </div>
  )
};