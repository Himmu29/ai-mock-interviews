import React from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues>{
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'file'
}

const FromField = ({control , name , label , placeholder , type="text"}: FormFieldProps<T>) => (
  <Controller 
  control={control}
  name={name} 
  render={({ field }) => (
    <FormItem>
      <FormLabel className='label'>{label}</FormLabel>
      <FormControl>
        <Input 
        className='input' 
        placeholder={placeholder} 
        type={type}
        {...field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
  />
);

export default FromField
