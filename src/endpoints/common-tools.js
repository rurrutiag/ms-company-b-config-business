export function validateArrayWithObjectsStrings(array, requiredKeys){
    // Verify that 'array' is array
    if (!Array.isArray(array)) {
        return {
            valid: false,
            error: "The parameter must be an array"
        };
    }
    // Verify that it contains at least one element
    if (array.length === 0) {
        return {
            valid: false,
            error: "The array must not be empty"
        };
    }
    // Verify each array's elements
    for (const item of array) {
        if (typeof item !== "object" || item === null) {
            return {
                valid: false,
                error: `Each array's element must be an object`
            };
        }
        for (const key of requiredKeys) {
            if (!item.hasOwnProperty(key)) {
                return {
                    valid: false,
                    error: `Each object must contain the key '${key}'`
                };
            }
            // Verify that key value in string isn't empty
            if (typeof item[key] !== "string" || item[key].trim() === "") {
                return {
                    valid: false,
                    error: `The value of '${key}' must be a not empty string`
                };
            }
        }
    }
    // If all is right, return successful validation
    return {
        valid: true
    };
}