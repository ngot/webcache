describe('grunt-karma', function(){

	describe('one', function(){

		beforeEach(function(){
			console.log("webcache:",window);
		});

		it('should be awesome', function(){
			expect('foo').toBe('foo');
		});

		it('should be awesome', function(){
			expect('212').not.toBe('foo');
		});

		it('should be awesome', function(){
			expect('oo').not.toBe('foo');
		});

		it('should be awesome', function(){
			expect('foo').toBe('foo');
		});
	});

});