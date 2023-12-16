import React, { ChangeEvent, FocusEvent } from 'react';
import './Input.scss';

interface InputProps {
  name: string;
  type: string;
  id?: string;
  labelText?: string;
  value?: any;
  className?: string;
  placeholder?: string;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (props, ref) => (
  <div className="form-row">
    {props.labelText && (
      <label htmlFor={props.name} className="form-label">
        {props.labelText}
      </label>
    )}
    <input
      ref={ref}
      id={props.id}
      name={props.name}
      type={props.type}
      value={props.value}
      onChange={props.handleChange}
      placeholder={props.placeholder}
      onClick={props.onClick}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      className={`form-input ${props.className}`}
      style={props.style}
      autoComplete="false"
    />
  </div>
);

export default React.forwardRef(Input);
