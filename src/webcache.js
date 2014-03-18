define("webcache", function () {
	"use strict";

	var _store = {
		removeItem: function (k) {
			delete this[k];
		}
	};
	try {
		if ("localStorage" in window && window["localStorage"]) {
			var testStorage = window["localStorage"];
			testStorage.setItem("test_storage", "");
			testStorage.removeItem("test_storage");
			_store = window["localStorage"];
		}
	} catch (e) {
		throw e;
	}

	var isIE = "ActiveXObject" in window;

	return function (name, size, timeout) {
		var datas = {};
		var frees = [];
		var count = 0;

		timeout = timeout || 0;

		function load() {
			function _new() {
				datas = {};
				frees = [];
				count = size;
				for (var i = 0; i < size; i++)
					frees.push(i);
			}

			try {
				count = Number(_store[name + '_count']);
				if (count != size) {
					for (var i = 0; i < count; i++) {
						_store.removeItem(name + '_' + i);
						_store.removeItem(name + '_' + i + '_time');
					}
					_store.removeItem(name + '_datas');
					_store.removeItem(name + '_frees');
					_store.removeItem(name + '_count');

					_new();
				} else {
					datas = JSON.parse(_store[name + '_datas']);
					frees = JSON.parse(_store[name + '_frees']);
				}
			} catch (e) {
				_new();
			}
		}

		function save() {
			_store[name + '_datas'] = JSON.stringify(datas);
			_store[name + '_frees'] = JSON.stringify(frees);
			_store[name + '_count'] = count.toString();
		}

		function _del(k) {
			frees.push(datas[k]);
			delete datas[k];
			return false;
		}

		function _has(k) {
			if (datas.hasOwnProperty(k)) {
				if (timeout <= 0)
					return true;

				if (new Date().getTime() - Number(_store[name + '_' + datas[k] + '_time']) >= timeout)
					return _del(k);
				return true;
			} else
				return false;
		}

		function _clean() {
			if (timeout > 0) {
				for (var k in datas)
					if (datas.hasOwnProperty(k))
						_has(k);
			}
		}

		function _put_data(n, v) {
			_store[name + '_' + n] = JSON.stringify(v);
			_store[name + '_' + n + '_time'] = new Date().getTime();
			return v;
		}

		function _put(k, v) {
			var n = frees.pop();
			datas[k] = n;

			return _put_data(n, v);
		}

		function access(k) {
			var n = datas[k];

			delete datas[k];

			if (isIE) {
				var datas1 = {};

				for (var k1 in datas) {
					if (datas.hasOwnProperty(k1))
						datas1[k1] = datas[k1];
				}

				datas = datas1;
			}
			datas[k] = n;

			return n;
		}

		function _update(k, v) {
			return _put_data(access(k), v);
		}

		this.has = function (k) {
			load();

			return _has(k);
		};

		this.get = function (k) {
			load();

			if (_has(k)) {
				var v = JSON.parse(_store[name + '_' + access(k)]);
				save();
				return v;
			} else
				return undefined;
		};

		this.put = function (k, v) {
			load();

			if (_has(k))
				_update(k, v);
			else {
				if (frees.length == 0) {
					for (var k1 in datas) {
						if (datas.hasOwnProperty(k1) && _has(k1)) {
							if (frees.length == 0)
								_del(k1);
							break;
						}
					}
				}

				_put(k, v);
			}

			save();
		};

		this.set = function (k, v) {
			load();
			if (_has(k)) {
				_update(k, v);
				save();
			}
		};

		this.datas = function () {
			var ds = {};

			load();
			_clean();

			for (var k in datas) {
				if (datas.hasOwnProperty(k))
					ds[k] = JSON.parse(_store[name + '_' + datas[k]]);
			}
			return ds;
		}

	}
});