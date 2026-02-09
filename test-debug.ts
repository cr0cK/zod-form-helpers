import {
  acceptsNumber,
  acceptsString,
  rejectsEmptyString,
  rejectsNegative,
  hasMaxConstraint
} from './src/index.js';

console.log('acceptsNumber(age):', acceptsNumber('age'));
console.log('acceptsString(firstName):', acceptsString('firstName'));
console.log('acceptsString(email):', acceptsString('email'));
console.log('rejectsEmptyString(lastName):', rejectsEmptyString('lastName'));
console.log('rejectsEmptyString(email):', rejectsEmptyString('email'));
console.log('rejectsEmptyString(age):', rejectsEmptyString('age'));
console.log('rejectsEmptyString(isActive):', rejectsEmptyString('isActive'));
console.log('rejectsNegative(firstName):', rejectsNegative('firstName'));
console.log('rejectsNegative(lastName):', rejectsNegative('lastName'));
console.log('rejectsNegative(email):', rejectsNegative('email'));
console.log('rejectsNegative(isActive):', rejectsNegative('isActive'));
console.log('hasMaxConstraint(firstName, 9999):', hasMaxConstraint('firstName', 9999));
console.log('hasMaxConstraint(lastName, 9999):', hasMaxConstraint('lastName', 9999));
