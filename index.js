const {exec} = require('./db');
const slog = require('single-line-log').stdout;
const {filesArr, findFile, removeUseImgPath} = require('./clearImg');

let progress = new ProgressBar('清理进度');

// 获取文件夹下所有图片
findFile('./path/demo1');
findFile('./path/demo2');

progress.render({completed: 0, total: filesArr.size});

let json = [];
const admin = exec(`select * from table`);

Promise.all([admin]).then(res => {
    json.push(res);
    return json;
}).then(res => {
    removeUseImgPath(res, progress);
    slog.clear();
}).catch(err => {
    slog.clear();
    console.error(err);
})

/**
 * ProgressBar-进度条
 * @param {string} description - 描述
 * @param {number} bar_length - 长度
 */
function ProgressBar (description, bar_length) {
    this.description = description || 'Progress';
    this.length = bar_length || 25;

    // 刷新进度条图案、文字的方法
    this.render = function (opts){
        var percent = (opts.completed / opts.total).toFixed(4);
        var cell_num = Math.floor(percent * this.length);

        if (opts.total === 0) {
            slog('--- no img clear ---');
            return;
        }

        // 拼接黑色条
        var cell = '';
        for (let i = 0; i < cell_num; i++) {
            cell += '█';
        }

        // 拼接灰色条
        var empty = '';
        for (let i = 0; i < this.length - cell_num; i++) {
            empty += '-';
        }

        // 拼接最终文本
        var cmdText = this.description + ': ' + (100 * percent).toFixed(2) + '% ' + cell + empty + ' ' + opts.completed + '/' + opts.total;
        
        // 在单行输出文本
        slog(cmdText);
    };
}
