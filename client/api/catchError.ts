import { isAxiosError } from "axios";

const catchAsyncError = (error: any): string => {
  let errorMessage = error.response?.data?.detail;

  if (isAxiosError(error)) {
    const errorResponse = error.response?.data;
    if (errorResponse) errorMessage = errorResponse.error;
  }

  return errorMessage;
};

export default catchAsyncError;
