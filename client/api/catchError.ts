import { isAxiosError } from "axios";

const catchAsyncError = (error: any): string => {
  console.log(error);
  let errorMessage = error.message;

  if (isAxiosError(error)) {
    const errorResponse = error.response?.data;
    if (errorResponse) errorMessage = errorResponse.error;
  }

  return errorMessage;
};

export default catchAsyncError;
