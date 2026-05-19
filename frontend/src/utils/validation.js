// utils/validation.js

export const  validateRegister = (fullName, email, password, confirmPassword) => {
    if(!fullName.trim()){
        return "Full name is required";
    }

    if(!isValidEmail(email)){
        return "Please enter a valid email";
    }

    if(!password) {
        return "Password is required";
    }

    if(!isValidPassword(password)){
        return 'Password must be 8-72 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character'
    }

    if(password !== confirmPassword) {
        return "Passwords do not match";
    }

    return null;
}

export const validateLogin = (email, password) => { 
    if(!email.trim()) {
        return "Email is required";
    }

    if(!isValidEmail) {
        return "Please enter a valid email address";
    }

    if(!password) {
        return "Password is required"
    }

    return null;
}

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const isValidPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,72}$/.test(password)
}