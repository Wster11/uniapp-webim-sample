import { Base64 } from './base64.js';

// 保存文字
let logTextData = '';

/**
 * js 日期格式化
 * 传时间戳参数进行时间戳转换，不传时返回当前时间（返回年月日时分秒格式）
 * @param {Object} timeStamp 时间戳参数 非必传
 * @param {Object} format 格式化样式 非必传
 */
function getTimeStampDatetime(format = 'yyyy-MM-dd HH:mm:ss', timeStamp) {
	let nowDatetime = new Date();
	timeStamp
		? (nowDatetime = new Date(timeStamp))
		: (nowDatetime = new Date());
	return nowDatetime.Format(format);
}
Date.prototype.Format = function (fmt) {
	var o = {
		'M+': this.getMonth() + 1, //月份
		'd+': this.getDate(), //日
		'H+': this.getHours(), //小时
		'm+': this.getMinutes(), //分
		's+': this.getSeconds(), //秒
		'q+': Math.floor((this.getMonth() + 3) / 3), //季度
		S: this.getMilliseconds(), //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(
			RegExp.$1,
			(this.getFullYear() + '').substr(4 - RegExp.$1.length)
		);
	for (var k in o)
		if (new RegExp('(' + k + ')').test(fmt))
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length == 1
					? o[k]
					: ('00' + o[k]).substr(('' + o[k]).length)
			);
	return fmt;
};

// 获取日志文件名称
function getLogFileName() {
	// 今日日期
	let nowDate = getTimeStampDatetime('yyyy-MM-dd');
	// 当前时间精确到秒
	let nowTime = getTimeStampDatetime('HH:mm:ss');
	// 文件名称
	let fileName = 'app-log.txt';
	// fileName = nowDate + 'log.txt'
	fileName = nowDate + '.txt';
	// 内容换行符(自定义)
	let newLine =
		'\r\n' +
		'======================================' +
		'\r\n' +
		nowTime +
		' =>>>' +
		'\r\n';

	return {
		nowDate: nowDate,
		newLine: newLine,
		fileName: fileName,
	};
}

/**
 * 日志内容写入
 * 文件写入手机地址，华为Android/data/应用包名/documents/app-log/2021-01-17log.text
 * @param {Object} params 写入内容
 * @param {Object} encryption 是否加密
 */
// 防抖
let writelogtime = null;

function writeLog(params, encryption) {
	let text = JSON.stringify(params);

	if (encryption) {
		logTextData += getLogFileName().newLine + ' ' + Base64.encode(text);
	} else {
		logTextData += getLogFileName().newLine + ' ' + text;
	}
	if (writelogtime) {
		clearTimeout(writelogtime);
	}
	//不然就创建新的定时器 3秒没有新日志再执行写入操作
	writelogtime = setTimeout(function () {
		writeLogTxt();
	}, 3000);
}

function writeLogTxt() {
	plus.io.requestFileSystem(
		plus.io.PUBLIC_DOCUMENTS,
		function (fs) {
			// 可通过fs操作PUBLIC_DOCUMENTS文件系统
			// 创建日志文件夹
			fs.root.getDirectory(
				'app-log',
				{
					create: true,
					exclusive: false,
				},
				function (dir) {
					dir.getDirectory(
						getLogFileName().nowDate,
						{
							create: true,
							exclusive: false,
						},
						function (dir) {
							// 创建或写入文件
							console.log(
								'Directory Entry Name: ' +
									dir.fullPath +
									getLogFileName().fileName
							);
							dir.getFile(
								getLogFileName().fileName,
								{
									create: true,
								},
								function (fileEntry) {
									// 找到文件准备写入操作
									fileEntry.file(function (file) {
										// create a FileWriter to write to the file
										fileEntry.createWriter(
											function (writer) {
												// Write data to file.
												writer.seek(file.size - 1);
												// 换行插入日志文件
												writer.write(logTextData);
												logTextData = '';
											},
											function (e) {
												console.error(
													'日志写入错误',
													error
												);
											}
										);
									});
								}
							);
						},
						function (err) {
							console.error('文件夹创建失败', err);
						}
					);
				},
				function (err) {
					console.error('文件夹创建失败', err);
				}
			);
		},
		function (error) {
			console.error('文件系统进入错误', error);
		}
	);
}

function delLogFile() {
	console.log('日志删除');
	plus.io.resolveLocalFileSystemURL(
		'_documents/app-log', //指定的目录
		function (entry) {
			var directoryReader = entry.createReader(); //获取读取目录对象
			directoryReader.readEntries(
				function (entries) {
					//历遍子目录即可
					for (var i = 0; i < entries.length; i++) {
						console.log('文件信息：' + entries[i].name);
						let twoDate =
							Date.parse(getLogFileName().nowDate) - 86400000 * 2;
						console.log('保留三天内日志', twoDate);
						if (Date.parse(entries[i].name) < twoDate) {
							entries[i].removeRecursively(
								function (entry) {
									writeLog(
										'日志删除成功' + entries[i].name,
										false
									);
								},
								function (e) {
									writeLog('日志删除成功' + e.message, false);
								}
							);
						}
					}
				},
				function (err) {
					console.log('没有异常日志');
				}
			);
		},
		function (err) {
			console.log('没有异常日志');
		}
	);
}
// 查询本地日志文件（直接当前页面调用，该接口未使用）
function selectLogUrl() {
	plus.io.resolveLocalFileSystemURL(
		'_documents/app-log', //指定的目录
		function (entry) {
			var directoryReader = entry.createReader(); //获取读取目录对象
			directoryReader.readEntries(
				function (entries) {
					//历遍子目录即可
					let isLog = false;
					for (var i = 0; i < entries.length; i++) {
						console.log('文件信息：' + entries[i].name);
						if (entries[i].name == getLogFileName().nowDate) {
							console.log('获取到当天文件为', entries[i].name);
							var url =
								'_documents/app-log/' +
								entries[i].name +
								'/' +
								getLogFileName().nowDate +
								'.txt';
							var path = plus.io.convertLocalFileSystemURL(url);
							var newurl =
								plus.io.convertAbsoluteFileSystem(path);
							isLog = true;
							return newurl;
						}
					}
					if (isLog) {
						return '';
					}
				},
				function (err) {
					console.log('访问目录失败');
				}
			);
		},
		function (err) {
			console.log('访问目录失败');
		}
	);
}

export default {
	writeLog,
	delLogFile,
	getLogFileName,
	selectLogUrl,
};
