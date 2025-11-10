function wrapAsync(fn) {
    return function(req, res, next){
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}

module.exports = wrapAsync;


// write by arrow function
// module.exports = (fn) =>{
//     return (req, res, next) =>{
//         fn(req, res, next).catch(next);
//     };
// };

