class OkResponse {
  success: boolean;
  message: string;
  data?: Object | string;

  constructor(message: string, data?: Object | string) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export { OkResponse };
