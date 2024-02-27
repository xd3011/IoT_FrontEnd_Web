function isEmail(email: string) {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
        return { error: 'Email is required' };
    }
    const emailRegex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(trimmedEmail)) {
        return { error: 'Invalid email format' };
    }
    return { valid: true, email: trimmedEmail };
}

function isPhoneNumber(phone: string) {
    // Remove whitespace from the phone number
    const cleanedPhone = phone.replace(/\s/g, '');
    // Regular expression to check the phone number format
    const phoneRegex: RegExp = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    // Check if the cleaned phone number matches the regular expression
    if (!phoneRegex.test(cleanedPhone)) {
        return { error: 'Invalid phone number format' };
    }
    // If no errors, return an object with the 'valid' property set to 'true'
    return { valid: true, cleanedPhone };
}

function isUsername(username: string) {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
        return { error: 'Username is required' };
    }
    if (trimmedUsername.length < 8) {
        return { error: 'Username must have at least 8 characters' };
    }
    return { valid: true };
}

function isPassword(password: string) {
    // Check the length of the password
    if (password.length < 8) {
        return { error: 'Password must have at least 8 characters' };
    }
    // Check if the password contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return { error: 'Password must contain at least one uppercase letter' };
    }
    // Check if the password contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return { error: 'Password must contain at least one lowercase letter' };
    }
    // Check if the password contains at least one digit
    if (!/\d/.test(password)) {
        return { error: 'Password must contain at least one digit' };
    }
    // If no errors, return an object with an empty message
    return { valid: true };
}

function isConfirmPassword(password: string, confirmPassword: string) {
    // Check if both passwords are provided
    if (!password || !confirmPassword) {
        return { error: 'Confirm Password is required' };
    }
    // Check if passwords match
    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }
    // If passwords match, return an object with the 'valid' property set to 'true'
    return { valid: true };
}

function isOTP(otp: string) {
    // Check if OTP is a 6-digit number
    const otpRegex: RegExp = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
        return { error: 'OTP must be a 6-digit number' };
    }
    // If no errors, return an object with the 'valid' property set to 'true'
    return { valid: true };
}

// Export all functions
export { isUsername, isEmail, isPassword, isPhoneNumber, isConfirmPassword, isOTP };