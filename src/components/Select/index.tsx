import React, { SelectHTMLAttributes } from 'react';
import { BodySelect } from './styles';
// import { Link } from 'react-router-dom';

export interface OptionsTypes {
  value: string;
  label: string;
}
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  defaultOption: string;
  options: Array<OptionsTypes>;
}
const Select: React.FC<SelectProps> = ({ name, label, options, defaultOption,...rest }) => {
  return (
    <BodySelect>
      <label htmlFor={name}>{label}</label>

      <select id={name} name={name} {...rest} >
        <option value="" hidden >{defaultOption}</option>
        {options.map(option => {
          return <option key={option.value} value={option.value}>{option.label}</option>
        })}
      </select>
    </BodySelect>

  )

}

export default Select;