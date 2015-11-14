
var Person = {
	greet: function () {
		return "Hello world, my name is " + this.name;
	}
};


// extends
var frank = Object.create(Person);

// extends
frank.name = "Frank Dijon";
frank.greet();