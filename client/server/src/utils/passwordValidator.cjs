const validatePassword = (password) => {
    const minLength = 8;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[@$]/;

    if(!password) {
        return "password is required";
    }
    if(password.length < minLength){
        return "Password must be at least 8 character long";
    }
    if(!uppercase.test(password)){
        return "Password must contain at least one uppercase letter"
    }
    if(!lowercase.test(password)){
    return "Password must contain at least one lowercase letter"
    }
    if(!specialChar.test(password)){
        return "Password must contain at least one special character (@$)";
    }

    return null; // password is valid
};

module.exports = validatePassword;

