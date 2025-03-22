import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ComponentProps<'button'> {}

export function Button({ className, ...props }:ButtonProps) {
  return (
    <button
      className={twMerge(
        'flex justify-between items-center px-5 h-12 bg-[#2B805A] text-white font-semibold rounded-lg w-full cursor-pointer transition-colors duration-300 hover:bg-[#216340] hover:text-[#11181C]',
         className
      )}
      {...props}
    />
  )
}
