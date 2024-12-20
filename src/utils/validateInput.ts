import createHttpError from "http-errors";

export function validateInput(data: Record<string, any>, requiredFields: string[]) {
  for (const field of requiredFields) {
    if (!data[field]) {
      throw createHttpError(400, `${field} is required`);
    }
  }
}
