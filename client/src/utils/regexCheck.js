function validateEmail(email) {
  const emailRegex =
    /^[A-Za-z0-9]+(?:[.%_+][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:[-][a-zA-B]+)*\.[A-Za-z]{2,}(?:\.[a-z]+)*/gm;
  return emailRegex.test(email);
}

function validatePhoneNumber(number) {
  const phoneRegex =
    /^\+?[0-9]{1,4}?[-.\s]?(\(?\d{1,3}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/gm;
  return phoneRegex.test(number);
}

export { validateEmail, validatePhoneNumber };
