const fs = require('fs');
const join = require('path').join;
const isImgReg = new RegExp('\.(jpg|jpeg|png|bmp|gif)');
const imgNameReg = new RegExp('([^\\\\\/\"]*)(jpg|jpeg|png|bmp|gif)', 'g');

let filesArr = new Map();

/**
 * findFile 查找文件夹下所有图片
 * @path  {[String]} [路径]
 */
function findFile (path) {
    let files = fs.readdirSync(path);
    files.forEach((item, index) => {
        const fPath = join(path, item);
        const stat = fs.statSync(fPath);
        if (stat.isDirectory() === true) findFile(fPath);
        if (stat.isFile() === true && isImgReg.test(fPath)) filesArr.set(item, fPath);
    })
}

/**
 * removeUseImgPath 删除未引用图片
 * @json  {[Array]} [引用图片的数据]
 */
function removeUseImgPath (json, progress) {
    const content = JSON.stringify(json);
    const imgPathName = content.match(imgNameReg) || [];
    imgPathName.forEach(function (val) {
        if (filesArr.has(val)) filesArr.delete(val);
    });

    // 删除未引用图片
    delUnuseImg(progress);
    // 删除空文件夹
    delEmptyDir();
}

function delUnuseImg (progress) {
    let index = 0;
    filesArr.forEach(function (path) {
        fs.unlinkSync(path);
        progress.render({completed: index, total: filesArr.size});
        index++;
    });
    progress.render({completed: filesArr.size, total: filesArr.size});
}

function delEmptyDir (set = new Set()) {
    for (let val of filesArr.values()) {
        let path = val.match(/.*(?=(\/|\\).*(jpg|jpeg|png|bmp|gif))/g)[0];
        set.add(path, null);
    }
    for (let i of set.keys()) {
        isEmptyDir(i) && fs.rmdirSync(i)
    }
}

function isEmptyDir (path) {
    let res = fs.readdirSync(path);
    if (res.length > 0) return !1;
    else return !0;
}

module.exports = {
    filesArr,
    findFile,
    removeUseImgPath
}
