function getCurrentTime() {
    let date_ob = new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'});
    return date_ob;
}

module.exports = {
    getCurrentTime,
}