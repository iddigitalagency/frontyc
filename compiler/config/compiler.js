
var compilerOpt = {

    /* Enable static preview compilation ? */
    enablePreview : true,

    /* Use Ruby Sass instead of libsass for Compilation ? */
    useRubySass : true,

    /* Input format used for views (resources/views/**) */
	tplFormat : '.twig',

    /* Using or not the hash for minified files (styles.min-14d51c.css) */
	useHashes : true,

	/* Template engine converter options */
	tplConverter : {

		// Output file format
		outputFormat : '.php',

		// Output for converted files relative to basePaths.dest
		outputPath : 'application/views/--ftyc/',

		// Generic converter to use. (myid / twig / blade)
		converter: 'myid',

		// Project specific converter
		converterAddon : [],

		// Project specific view injection (content -> master)
		injectView : {},

		// Rename files on the fly (must not include file extension)
		filesRenaming : {}

	}

};

exports.compilerOpt = compilerOpt;
