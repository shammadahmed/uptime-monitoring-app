const fs = require('fs');
const path = require('path');

const lib = {};

lib.baseDir = path.join(__dirname, '/../.data');
lib.create = (dir, file, data, callback) => {
	fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			const stringData = JSON.stringify(data);

			fs.writeFile(fileDescriptor, stringData, err => {
				if (!err) {
					fs.close(fileDescriptor, err => {
						if (!err) {
							callback(false);
						} else {
							callback('Error closing the new file');
						}
					});
				} else {
					callback('Error writing to the new file');
				}
			});
		} else {
			callback('Could not create the new file, it may already exist')
		}
	});
};

lib.read = (dir, file, callback) => {
	fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf8', (err, data) => callback(err, data));
};

lib.update = (dir, file, data, callback) => {
	fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
		if (!err) {
			const stringData = JSON.stringify(data);

			fs.truncate(fileDescriptor, err => {
				if (!err) {
					fs.writeFile(fileDescriptor, stringData, err => {
						if (!err) {
							fs.close(fileDescriptor, err => {
								if (!err) {
									callback(false);
								} else {
									callback('Error closing the file');
								}
							});
						} else {
							callback('Error updating the file');
						}
					});
				} else {
					callback('Error truncating the file');
				}
			});
		} else {
			callback('The file may not exist yet');
		}
	});
}

lib.delete = (dir, file, callback) => {
	fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, err => {
		if (!err) {
			callback(false);
		} else {
			callback('Error deleting the file');
		}
	});
}

module.exports = lib;