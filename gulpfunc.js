/**
 * collectLibraries collect and return a list of libraries from the config file
 * @param  {array} collection
 * @param  {string} destination
 * @param  {array} libraries
 * @return {array}
 */
function collectLibraries(collection, destination, libraries) {

	var libs = (typeof libraries === 'undefined') ? [] : libraries;

	if (destination != 'default') console.log( 'Creating \'' + console.colors.cyan(destination) + '\'' );
	else console.log( 'Adding to \'' + console.colors.cyan('default') + '\'' );

	for (var file_number = 0, len = collection[destination].length; file_number < len; ++file_number)
	{
		libs.push( config.vendor_dir + collection[destination][file_number] );
		console.log( console.colors.grey(' |--> ' + collection[destination][file_number]) );
	}

	return libs;
}


/**
 * uglycat concat and uglify javascript source files into a destination file
 * @param  {array} sources_files
 * @param  {string} dest_file
 * @return {array}
 */
function uglycat(sources_files, dest_file) {

	if ( dest_file.search('.js') == -1 )
	{
		return gulp.src(sources_files)
		    .pipe(concat(dest_file))
		    .pipe(gulp.dest(public_scripts));
	}
	else
	{
		var dest_file_min = dest_file.replace('.js', '.min.js');

		return gulp.src(sources_files)
		    .pipe(concat(dest_file))
		    .pipe(gulp.dest(public_scripts))
		    .pipe(rename(dest_file_min))
		    .pipe(uglify())
		    .pipe(gulp.dest(public_scripts));
	}
	
}


/**
 * minicat concat and minify css source files into a destination file
 * @param  {array} sources_files
 * @param  {string} dest_file
 * @return {array}
 */
function minicat(sources_files, dest_file) {

	var dest_file_min = dest_file.replace('.css', '.min.css');

	return gulp.src(sources_files)
	    .pipe(concat(dest_file))
	    .pipe(gulp.dest(public_styles))
	    .pipe(rename(dest_file_min))
	    .pipe(minifyCss({compatibility: 'ie8'}))
	    .pipe(gulp.dest(public_styles));
	
}