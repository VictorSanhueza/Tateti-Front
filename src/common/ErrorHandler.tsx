import { useForceUpdate } from "./Tools";
import { useState } from "react";

interface IError {
    response?: {
      data?: {
        error?: string
        messages?: {
          path: string
          message: string
        }[]
      }
    }
  }

export class ErrorHandler {
    constructor(forceUpdate: () => any) {
        this.forceUpdate = forceUpdate
    }

    private forceUpdate: () => any

    public errorMessage?: string = undefined

    public errors: Map<string, string> = new Map<string, string>()

    public addError(component: string, message: string) {
      this.errors.set(component, message)
      this.forceUpdate()
    }

    public getErrorClass(component: string, baseClass: string): string {
      return baseClass + (this.getErrorText(component) ? " is-invalid" : "")
    }

    public getErrorText(item: string): string | undefined {
      return this.errors.get(item)
    }

    public hasErrors(): boolean {
      return this.errors.size > 0 && !this.errorMessage
    }

    public processRestValidations(error: any) {

    }

    public cleanRestValidations() {
      this.errorMessage = undefined
      this.errors.clear()
      // this.forceUpdate()
    }
}

export function useErrorHandler(): ErrorHandler {
  const forceUpdate = useForceUpdate()
  return useState(new ErrorHandler(forceUpdate))[0]
}