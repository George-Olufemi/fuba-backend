class OkResponse {
  success: boolean;
  message: string;
  data?: Record<string, string[]> | unknown | string | null;

  constructor(
    message: string,
    data?: Record<string, string[]> | unknown | string | null,
  ) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export { OkResponse };
