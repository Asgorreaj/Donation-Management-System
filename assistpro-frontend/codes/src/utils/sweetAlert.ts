import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

export const showSuccessAlert = (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    timer: 5000,
    showConfirmButton: true,
  });
};

export const showDeleteConfirmation = () => {
  return Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });
};

// export const showSuccessAlert = (message: string) => {
//   return Swal.fire('Success!', message, 'success');
// };

// export const showErrorAlert = (message: string) => {
//   return Swal.fire('Error!', message, 'error');
// };

export const showErrorAlert = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error!',
    text: message,
    timer: 30000,
    showConfirmButton: true,
  });
};
const defaultToastOptions: SweetAlertOptions = {
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  toast: true,
  didOpen: (toast: HTMLElement) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
};




export const showInfoAlert = (message: string, options: SweetAlertOptions = {}): Promise<SweetAlertResult<any>> => {
  return Swal.fire({
    ...defaultToastOptions,
    icon: 'info',
    title: message,
    background: '#eff6ff',
    iconColor: '#2563eb',
    color: '#1e40af',
    ...options
  } as SweetAlertOptions);
};

export const showWarningAlert = (message: string, options: SweetAlertOptions = {}): Promise<SweetAlertResult<any>> => {
  return Swal.fire({
    ...defaultToastOptions,
    icon: 'warning',
    title: message,
    background: '#fffbeb',
    iconColor: '#d97706',
    color: '#92400e',
    ...options
  } as SweetAlertOptions);
};

export const showConfirmDialog = (
  title: string,
  text: string,
  confirmButtonText = 'Confirm',
  options: SweetAlertOptions = {}
): Promise<SweetAlertResult<any>> => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
    background: '#ffffff',
    color: '#1f2937',
    ...options
  } as SweetAlertOptions);
};

export const showInputDialog = (
  title: string,
  inputOptions: Record<string, any>,
  confirmButtonText = 'Submit',
  options: SweetAlertOptions = {}
): Promise<SweetAlertResult<any>> => {
  return Swal.fire({
    title,
    input: 'text',
    inputAttributes: inputOptions,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
    background: '#ffffff',
    color: '#1f2937',
    ...options
  } as SweetAlertOptions);
};

