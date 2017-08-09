module.exports = function() {
    return Promise.resolve({
        text: arguments.join(' '),
    });
}
