export interface DeskHandle {
  rootPath?: string;
  breadcrumb?: string | ((match: any) => string);
}
