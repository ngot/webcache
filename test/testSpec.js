define([ "webcache" ], function(webcache) {
//	return function() {
		describe("webcache", function() {
			var cache;

			function cache_assert(test) {
				assert.deepEqual(cache.datas(), test);
			}

			before(function() {
				cache = new webcache('test', 3, 100);
			});

			after(function() {
				new webcache("test", 0).datas();
				new webcache("test1", 0).datas();
			});

			it("初始化为空", function() {
				cache_assert({});
			});

			it("put 方法", function() {
				cache.put('a', 100);
				cache_assert({
					a : 100
				});

				cache.put('b', 200);
				cache_assert({
					a : 100,
					b : 200
				});

				cache.put('c', 300);
				cache_assert({
					a : 100,
					b : 200,
					c : 300
				});
			});

			it("空间溢出，清除最早数据", function() {
				cache.put('d', 400);

				cache_assert({
					b : 200,
					c : 300,
					d : 400
				});
			});

			it("不存在的值返回 undefined", function() {
				assert.equal(cache.get('a'), undefined);
			});

			it("最近访问的键值提前", function() {
				assert.equal(cache.get('b'), 200);

				cache_assert({
					c : 300,
					d : 400,
					b : 200
				});
			});

			it("添加新键值，抛弃最早引用的值", function() {
				cache.put('e', 500);

				cache_assert({
					d : 400,
					b : 200,
					e : 500
				});
			});

			it("最近更新的键值提前", function() {
				cache.set('b', 200);

				cache_assert({
					d : 400,
					e : 500,
					b : 200
				});
			});

			it("更新的键值不存在，不做任何操作", function() {
				cache.set('f', 600);

				cache_assert({
					d : 400,
					e : 500,
					b : 200
				});
			});

			it("更新的键值存在则修改键值并提前", function() {
				cache.set('e', 500);

				// test set
				cache_assert({
					d : 400,
					b : 200,
					e : 500
				});
			});

			it("创建不同尺寸缓存时自动清空", function() {
				cache = new webcache('test', 4, 100);
				cache_assert({});
			});

			it("超时丢弃", function(done) {
				setTimeout(function() {
					cache.put('e', 500);

					cache_assert({
						e : 500
					});

					setTimeout(function() {
						cache.put('b', 200);

						setTimeout(function() {
							cache_assert({
								b : 200
							});
							done();
						}, 80);
					}, 50);
				}, 200);
			});

			it("性能测试", function() {
				function rand(n) {
					return Math.round(Math.random() * n) - 1;
				}

				function perf(sz, ds, tm) {
					var ch = new webcache("test1", sz, tm);
					var i, n, n1;

					for (i = 0; i < sz; i++) {
						n = rand(ds);
						ch.put('k' + n, n);
					}

					for (i = 0; i < 1000; i++) {
						n = rand(ds);
						n1 = rand(10);

						if (n1 == 0)
							ch.set('k' + n, n);
						else if (!ch.get('k' + n))
							ch.put('k' + n, n);
					}

				}
				perf(700, 1000);
			});
		});
//	};
});
