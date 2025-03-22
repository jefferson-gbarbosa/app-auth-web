import type { ComponentProps } from 'react'

interface InputRootProps extends ComponentProps<'div'> {
  error?: boolean
}

export function InputRoot({ error = false, ...props }: InputRootProps) {
  return (
    <div
      data-error={error}
      className="group border border-solid border-[#687076] h-12 rounded-lg px-4 flex items-center gap-2 focus-within:border-[#6EE7B7] data-[error=true]:border-danger"
      {...props}
    />
  )
}

interface InputIconProps extends ComponentProps<'span'> {}

export function InputIcon({ ...props }: InputIconProps) {
  return (
    <span
      className="text-gray-400 group-focus-within:text-[#6EE7B7] group-[&:not(:has(input:placeholder-shown))]:text-[#6EE7B7] group-data-[error=true]:text-danger"
      {...props}
    />
  )
}

interface InputFieldProps extends ComponentProps<'input'> {}

export function InputField({ ...props }: InputFieldProps) {
  return <input className="flex-1 outline-0 placeholder-gray-400 caret-zinc-400" {...props} />
}
