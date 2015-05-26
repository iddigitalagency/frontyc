
var compilerOpt = {

    /* Enable static preview compilation ? */
    enablePreview : true,

    /* Use Ruby Sass instead of libsass for Compilation ? */
    useRubySass : true,

    /* Input format used for views (resources/views/**) */
	tplFormat : '.twig',

	/* MyID Converter options */
	myid : {

		// Output file format
		outputFormat : '.php',

		// Rename files on the fly (must not include file extension)
		filesRenaming : {
			'layouts/main.twig': 'template.php'
		},

		// Output for converted files relative to basePaths.dest
		outputPath : 'application/views/generated/'

	}

};

exports.compilerOpt = compilerOpt;
