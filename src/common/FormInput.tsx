import React from "react"
import { ErrorHandler } from "./ErrorHandler"
import ErrorLabel from "./ErrorLabel"

export default function FormInput(props: {
  label: string
  name: string,
  leyenda: string,
  errorHandler: ErrorHandler
  value?: string | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any
}) {
  return (
    <div className="form-group justify-content-center col-md-6 offset-md-3">
      <label>{props.label}</label>
      <input
        id={props.name}
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder={props.leyenda}
        className={props.errorHandler.getErrorClass(props.name, "form-control")}
      ></input>
      <ErrorLabel message={props.errorHandler.getErrorText(props.name)} />
    </div>
  )
}
