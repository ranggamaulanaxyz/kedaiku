export interface DeskHandle {
  rootPath?: string;
  breadcrumb?: string | ((match: any) => string);
}

export interface DeskFormField<TData> {
  accessorKey: keyof TData,
  label?: string,
  Component?: React.ComponentType<{ value: string, name: string; }>
}