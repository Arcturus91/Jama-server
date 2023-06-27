export function validatePhoneNumber(phoneNumber: string) {
  const regex = /^9\d{8}$/;
  return regex.test(phoneNumber);
}
